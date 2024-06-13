<?php
namespace App\Services\LoanPaymentService;

use App\Enums\PaymentStatus;
use App\Models\LoanDetails;
use Illuminate\Support\Facades\Log;

class LoanPaymentService implements ILoanPaymentService
{
    public function makePayment(LoanDetails $loan, $amount)
    {
        $userPayment = $amount;

        if ($loan && isset($amount) && $amount > 0) {
            $incompletePayments = $loan->payments->where('status', '!=', PaymentStatus::COMPLETE);

            if ($incompletePayments->isEmpty()) {
                Log::error('Loan has no incomplete payments', [
                    'loan' => $loan,
                    'amount' => $amount
                ]);
                return;
            }

            foreach ($incompletePayments as $payment) {
                if ($userPayment - $payment->loan_balance < 0) {
                    $payment->user_payment += $userPayment;
                    $payment->save();
                    break;
                }

                if ($userPayment - $payment->loan_balance == 0) {
                    $payment->user_payment += $userPayment;
                    $payment->status = PaymentStatus::COMPLETE;
                    $payment->save();
                    break;
                }

                if ($userPayment - $payment->loan_balance > 0) {
                    $payment->user_payment += $payment->loan_balance;
                    $payment->status = PaymentStatus::COMPLETE;
                    $payment->save();
                }
            }
            return;
        }

        Log::error('Loan not found', [
            'loan' => $loan,
            'amount' => $amount
        ]);
    }
}