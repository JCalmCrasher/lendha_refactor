<?php

namespace App\Notifications\Loan;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class LoanPaymentReceivedNotification extends Notification
{
    use Queueable;

    private $name;

    private $amount;

    private $trxDate;

    /**
     * Create a new notification instance.
     */
    public function __construct($name, $amount, $trxDate)
    {
        $this->name = $name;
        $this->amount = $amount;
        $this->trxDate = $trxDate;
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
            ->subject('Loan payment received')
            ->greeting('Dear ' . $this->name . '!')
            ->line('We have received a payment of ' . number_format($this->amount) . ' NGN towards your loan on ' . $this->trxDate)
            ->line('Thank you for your prompt payment. Your loan balance has been updated accordingly.');

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
