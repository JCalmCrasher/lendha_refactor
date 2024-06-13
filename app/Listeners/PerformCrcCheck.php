<?php

namespace App\Listeners;

use App\Events\LoanApplicationCompleted;
use App\Jobs\PerformCrcCheckJob;
use Illuminate\Contracts\Queue\ShouldQueue;

class PerformCrcCheck implements ShouldQueue
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
        $loan = $event->loan;
        $user = $event->loan->user;

        PerformCrcCheckJob::dispatch($user, $user->bank->bvn, $loan->application_id);
    }
}
