<?php

namespace App\Listeners;

use App\Events\LoanApproved;
use App\Interfaces\Bank\IBank;
use App\Models\UserAccount;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Log;

class CreateRepaymentAccount implements ShouldQueue
{
    private $bank;

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct(IBank $bank)
    {
        $this->bank = $bank;
    }

    /**
     * Handle the event.
     *
     * @param  LoanApproved  $event
     * @return void
     */
    public function handle(LoanApproved $event)
    {
        $loan = $event->loan;

        if (!$loan->user->account) {
            $account = $this->bank->createReservedAccount($loan->user);
    
            if ($account && isset($account['account_number'])) {
                $account = new UserAccount($account);
                $loan->user->account()->save($account);
            }
        }

    }
}
