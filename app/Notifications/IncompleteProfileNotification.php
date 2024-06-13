<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\HtmlString;

class IncompleteProfileNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private string $name;

    private array $incompleteSteps;

    /**
     * Create a new notification instance.
     */
    public function __construct(string $name, array $incompleteSteps)
    {
        $this->name = $name;
        $this->incompleteSteps = $incompleteSteps;
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
        $incompleteSteps = array_map(function ($step) {
            return "<li>$step</li>";
        }, $this->incompleteSteps);

        return (new MailMessage)
            ->subject("Please complete your Lendha profile")
            ->greeting("Dear " . $this->name . ",")
            ->line("We noticed that your profile is incomplete. To proceed, please fill in the following sections:")
            ->line(new HtmlString('<ul>'))
            ->line(new HtmlString(implode(" ", $incompleteSteps)))
            ->line(new HtmlString('</ul>'))
            ->line("Please update your profile at your earliest convenience to take full advantage of our services.");
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
