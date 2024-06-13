<?php

namespace App\Listeners;

use App\Events\LoanApproved;
use App\Notifications\Loan\LoanApprovedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyUserOfLoanApproval implements ShouldQueue
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
    public function handle(LoanApproved $event): void
    {
        $user = $event->loan->user;

        $user->notify(new LoanApprovedNotification($user->name));
    }
}
