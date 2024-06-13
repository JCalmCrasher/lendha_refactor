<?php

namespace App\Notifications;

use App\Notifications\Channels\SMSChannel;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Slack\BlockKit\Blocks\ContextBlock;
use Illuminate\Notifications\Slack\BlockKit\Blocks\SectionBlock;
use Illuminate\Notifications\Slack\SlackMessage;

class PaymentReminder extends Notification implements ShouldQueue
{
    use Queueable;

    private $data;
    private $appName;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct($data)
    {
        $this->data = $data;
        $this->appName = env('APP_NAME', 'Lendha');
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['mail', 'slack', SMSChannel::class];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage)
                    ->subject('Lendha Payment Reminder for '.$this->data['name'])
                    ->greeting('Hello '.$this->data['name'].'!')
                    ->line("Please be aware that your payment is due ".Carbon::parse($this->data['due_date'])->diffForHumans().' on '.Carbon::parse($this->data['due_date'])->toFormattedDateString().'.')
                    ->line('In order to avoid daily penalties, please endeavor to make payment on or before the due date.')
                    ->action('Login and make payment', url('/dashboard'));
    }

    public function toSMS($notifiable)
    {
        return "Hello ".$this->data['name'].", your payment to ".$this->appName." is due ".Carbon::parse($this->data['due_date'])->diffForHumans().' on '.Carbon::parse($this->data['due_date'])->toFormattedDateString().'. To avoid daily penalties, make payment on or before the due date.';
    }

    public function toSlack($notifiable)
    {
        return (new SlackMessage)
                    ->to('#random')
                    ->headerBlock(
                        $this->appName.' Payment Reminder',
                    )
                    ->contextBlock(function (ContextBlock $block) {
                        $block->text('User: '. $this->data['name']);
                    })
                    ->sectionBlock(function (SectionBlock $block) {
                        $block->text('Payment due '.Carbon::parse($this->data['due_date'])->diffForHumans().' on '.Carbon::parse($this->data['due_date'])->toFormattedDateString().'.');
                    })
                    ->dividerBlock()
                    ->sectionBlock(function (SectionBlock $block) use ($notifiable) {
                        $block->text('User Details');
                        $block->field('Name: ' . $notifiable->name);
                        $block->field('Phone: ' . $notifiable->phone_number);
                        if ($notifiable->email) {
                            $block->field('Email: ' . $notifiable->email);
                        }
                        if ($notifiable->address) {
                            $block->field('Address: ' . $notifiable->address);
                        }
                    })
                    ->text('Payment reminder for '.$this->data['name']);
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        return [
            //
        ];
    }
}
