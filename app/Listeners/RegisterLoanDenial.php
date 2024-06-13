<?php

namespace App\Listeners;

use App\Events\LoanDenied;
use App\Models\LoanDenial;

class RegisterLoanDenial
{
    private $loanDenial;

    /**
     * Create the event listener.
     */
    public function __construct()
    {
        $this->loanDenial = new LoanDenial();
    }

    /**
     * Handle the event.
     */
    public function handle(LoanDenied $event): void
    {
        $this->loanDenial->loan_detail_id = $event->loan->id;
        $this->loanDenial->reason = $event->reason;
        $this->loanDenial->save();
    }
}
