<?php

namespace App\Jobs;

use App\Notifications\AdminPaymentReminder;
use App\Notifications\PaymentReminder;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Notification;

class SendPaymentReminder implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     *
     * @return void
     */
    private $data;

    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Execute the job.
     *
     * @return void
     */
    public function handle()
    {
        $user = User::find($this->data['user_id']);
        $user->notify(new PaymentReminder($this->data));
        $loan_officer = User::find($this->data['loan_officer_id']);
        $loan_officer->notify(new AdminPaymentReminder($this->data));
    }
}
