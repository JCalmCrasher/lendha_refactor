<?php

namespace App\Events;

use App\Models\LoanDetails;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LoanDisbursed
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $loan;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(LoanDetails $loan)
    {
        $this->loan = $loan;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return \Illuminate\Broadcasting\Channel|array
     */
    // public function broadcastOn()
    // {
    //     return new PrivateChannel('channel-name');
    // }
}
