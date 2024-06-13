<?php

namespace App\Listeners;

use App\Events\PaymentReceived;
use App\Notifications\Loan\LoanPaymentReceivedNotification;
use Illuminate\Contracts\Queue\ShouldQueue;

class NotifyUserOfLoanRepayment implements ShouldQueue
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
    public function handle(PaymentReceived $event): void
    {
        $user = $event->userAccount->user;
        $amount = $event->amount;
        $trxDate = $event->trxDate;

        $user->notify(new LoanPaymentReceivedNotification($user->name, $amount, $trxDate));
    }
}
