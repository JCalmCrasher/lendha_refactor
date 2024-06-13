<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

class CrcCheckNotification extends Notification
{
    use Queueable;

    private $user;

    private $accountName;

    private $appName;

    /**
     * Create a new notification instance.
     */
    public function __construct($user, string $accountName)
    {
        $this->user = $user;
        $this->accountName = $accountName;
        $this->appName = env('APP_NAME', 'Lendha');
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'slack'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject('Account name mismatch in CRC check')
            ->greeting('Hello,')
            ->line("A user's account name does not match the name on our records.")
            ->line("User: {$this->user->name}")
            ->line("Email: {$this->user?->email}")
            ->line("Phone: {$this->user?->phone_number}")
            ->line("BVN name on CRC Check: $this->accountName");
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

    public function toSlack($notifiable)
    {
        $name = $this->user->name;

        return (new SlackMessage)
            ->to('#random')
            ->headerBlock(
                $this->appName . ' CRC check',
            )
            ->contextBlock(function (ContextBlock $block) {
                $block->text('User: ' . $this->user->name);
            })
            ->sectionBlock(function (SectionBlock $block) {
                $block->text('Account name mismatch in CRC check');
            })
            ->dividerBlock()
            ->sectionBlock(function (SectionBlock $block) {
                $block->text('User Details');
                $block->field('Name: ' . $this->user->name);
                $block->field('Phone: ' . $this->user->phone_number);
                $block->field('BVN name on CRC check: ' . $this->accountName);
                if ($this->user->email) {
                    $block->field('Email: ' . $this->user->email);
                }
            });
    }
}
