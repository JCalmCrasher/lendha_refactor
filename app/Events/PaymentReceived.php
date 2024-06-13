<?php

namespace App\Events;

use App\Models\UserAccount;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PaymentReceived
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $userAccount;
    public $amount;
    public $trxDate;

    /**
     * Create a new event instance.
     *
     * @return void
     */
    public function __construct(UserAccount $userAccount, $amount, $trxDate)
    {
        $this->userAccount = $userAccount;
        $this->amount = $amount;
        $this->trxDate = $trxDate;
    }

}
