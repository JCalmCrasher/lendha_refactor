<?php

namespace App\Events;

use App\Models\LoanDetails;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LoanDenied
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $loan;
    public $reason;

    /**
     * Create a new event instance.
     */
    public function __construct(LoanDetails $loan, string|null $reason)
    {
        $this->loan = $loan;
        $this->reason = $reason;
    }
}
