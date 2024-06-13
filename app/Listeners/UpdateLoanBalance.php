<?php

namespace App\Listeners;

use App\Events\PaymentReceived;
use App\Services\LoanPaymentService\ILoanPaymentService;
use Exception;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Support\Facades\Log;

class UpdateLoanBalance implements ShouldQueue
{
    private $loanPaymentService;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(ILoanPaymentService $loanPaymentService)
    {
        $this->loanPaymentService = $loanPaymentService;
    }

    /**
     * Handle the event.
     *
     * @param  PaymentReceived  $event
     * @return void
     */
    public function handle(PaymentReceived $event)
    {
        $userAccount = $event->userAccount;
        $amount = $event->amount;

        $user = $userAccount->user;
        try {
            $loan = ($user) ? $user->loans()->where('status', 'approved')->first() : null;
        } catch (Exception $e) {
            Log::error('Error fetching loan for user', [
                'user' => $user,
                'error' => $e->getMessage()
            ]);
            $loan = null;
        }

        if ($loan && $amount > 0) {
            $this->loanPaymentService->makePayment($loan, $amount);

            activity()->causedBy($user)->performedOn($loan->payments)->log('Loan payment made');
        }

    }
}
