<?php
namespace App\Services\Loan;

use App\Enums\RepaymentDurations;
use App\Models\LoanDetails;
use App\Models\LoanInterest;
use App\Models\Merchant;
use App\Models\User;
use Exception;
use Illuminate\Http\Request;

class LoanApplicationService
{
    private $request;
    private $user;

    public function __construct(Request $request) {
        $this->request = $request;
        $this->user = $request->user(); // by default, user should be request user. Can be changed by setUser function
    }

    public function setUser(User $user)
    {
        $this->user = $user;
    }

    public function apply()
    {
        if ($this->isEligible()) {
            $user = $this->user;
            $request = $this->request;

            $thisLoan = LoanInterest::find($request->loan_interest_id);

            if (
                (!$request->loan_term) && 
                $thisLoan->repayment_duration == RepaymentDurations::MONTHLY
            ) {
                return response()->json([
                    'data' => [],
                    'message' => 'loan term cannot be empty for monthly loans'
                ], 400);
            }

            $loanTerm = 0;

            switch ($thisLoan->repayment_duration) {
                case RepaymentDurations::DAILY:
                    $loanTerm = 1;
                    break;
                case RepaymentDurations::WEEKLY:
                    $loanTerm = 1;
                    break;
                case RepaymentDurations::MONTHLY:
                    $loanTerm = $request->loan_term;
                    break;
                default:
                    $loanTerm = $request->loan_term;
                    break;
            }

            $loan = new LoanDetails();
            $loan->application_id = md5(now().$user->email);
            $loan->amount = $request->loan_amount;
            $loan->purpose = $thisLoan->purpose;
            $loan->loan_interest_id = $thisLoan->id;
            $loan->duration = $loanTerm;
            $loan->request_date = now();
            $user->loans()->save($loan);

            return response()->json([
                'data' => [],
                'message' => 'Loan application successful'
            ]);
        }
    }

    private function isEligible()
    {
        $hasExistingLoan = !!$this->user->loans->whereIn('status', ['approved', 'pending'])->toArray();

        if ($hasExistingLoan) {
            throw new Exception('user already has an active or pending loan');
        }

        $isSuspended = $this->user->suspended;

        if ($isSuspended) {
            throw new Exception('user account suspended. contact admin');
        }

        return !(
            $hasExistingLoan || 
            $isSuspended
        );
    }
}