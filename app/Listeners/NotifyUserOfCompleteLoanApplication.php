<?php

namespace App\Listeners;

use App\Events\LoanApplicationCompleted;
use App\Notifications\Loan\LoanApplicationCompletedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyUserOfCompleteLoanApplication implements ShouldQueue
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
    public function handle(LoanApplicationCompleted $event): void
    {
        $user = $event->loan->user;

        $user->notify(new LoanApplicationCompletedNotification($user->name));
    }
}
