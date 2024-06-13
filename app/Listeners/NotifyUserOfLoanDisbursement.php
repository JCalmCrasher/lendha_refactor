<?php

namespace App\Listeners;

use App\Events\LoanDisbursed;
use App\Notifications\Loan\LoanDisbursedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyUserOfLoanDisbursement implements ShouldQueue
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(LoanDisbursed $event): void
    {
        $loan = $event->loan;
        $user = $loan->user;

        $user->notify(new LoanDisbursedNotification($user->name, $loan->amount));
    }
}
