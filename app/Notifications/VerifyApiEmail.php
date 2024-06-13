<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\URL;
use Illuminate\Auth\Notifications\VerifyEmail as VerifyEmailBase;

class VerifyApiEmail extends VerifyEmailBase
{

    /**
    * Get the verification URL for the given notifiable.
    *
    * @param mixed $notifiable
    * @return string
    */
    protected function verificationUrl($notifiable)
    {
        return URL::temporarySignedRoute(
        'verification.verify', Carbon::now()->addMinutes(60), ['id' => $notifiable->getKey()]
        ); // this will basically mimic the email endpoint with get request
    }
}
