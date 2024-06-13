<?php

namespace App\Listeners;

use App\Events\LoanDenied;
use App\Mail\LoanDeniedEmail;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Support\Facades\Mail;

class NotifyUserOfLoanDenial implements ShouldQueue
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
    public function handle(LoanDenied $event): void
    {
        $user = $event->loan->user;
        $reason = $event->reason;

        // Send an email to the user
        Mail::to($user->email)->send(new LoanDeniedEmail($user->name, $reason));
    }
}
