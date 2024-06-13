<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BankStatementNotification extends Notification
{
    use Queueable;

    private $user;

    private $accountName;

    /**
     * Create a new notification instance.
     */
    public function __construct($user, string $accountName)
    {
        $this->user = $user;
        $this->accountName = $accountName;
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
            ->subject('Account name mismatch in bank statement')
            ->greeting('Hello,')
            ->line("A user's account name does not match the name on our records.")
            ->line("User: {$this->user->name} ({$this->user->id})")
            ->line("Bank Statement Account Name: $this->accountName");
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
