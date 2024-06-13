<?php

namespace App\Notifications\Loan;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LoanDisbursedNotification extends Notification
{
    use Queueable;

    private $name;

    private $amount;

    /**
     * Create a new notification instance.
     */
    public function __construct($name, $amount)
    {
        $this->name = $name;
        $this->amount = $amount;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Your loan Has been disbursed')
            ->greeting('Hello ' . $this->name . '!')
            ->line('We are pleased to inform you that your loan of ' . number_format($this->amount) . ' NGN has been disbursed.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
