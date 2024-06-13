<?php
namespace App\Notifications\Channels;

use App\Interfaces\SMS\ISMSProvider;
use Illuminate\Support\Facades\Log;

class SMSChannel
{
    protected $smsProvider;

    public function __construct(ISMSProvider $smsProvider) {
        $this->smsProvider = $smsProvider;
    }

    public function send(object $notifiable, $notification)
    {
        $message = $notification->toSMS($notifiable);

        // send notification to the $notifiable instance...
        Log::info('Sending SMS to '.$notifiable->phone_number.' with message: '.$message);
        $this->smsProvider->sendSMS($notifiable->phone_number, $message);
    }
}