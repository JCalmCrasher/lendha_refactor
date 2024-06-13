<?php

namespace App\Notifications;

use App\CustomFirebaseChannel\FirebaseChannel;
use App\CustomFirebaseChannel\FirebaseMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use NotificationChannels\ExpoPushNotifications\ExpoChannel;
use NotificationChannels\ExpoPushNotifications\ExpoMessage;

class WebNotification extends Notification
{
    use Queueable;
    private $messageData;
    private $messageType;

    /**
     * Create a new notification instance.
     * @param object $messageData
     * @param string $messageType (web or mobile or all)
     *
     * @return void
     */
    public function __construct($messageData, $messageType)
    {
        $this->messageData = $messageData;
        $this->messageType = $messageType;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        if ($this->messageType === 'web') {
            return ['firebase', 'database'];
        } 
        
        if ($this->messageType === 'mobile') {
            return [ExpoChannel::class, 'database'];
        }
        
        return ['firebase', ExpoChannel::class, 'database'];
    }

    /**
     * Get the message representation of the web notification.
     *
     * @param  mixed  $notifiable
     * @return App\CustomFirebaseChannel\FirebaseMessage
     */
    public function toFirebaseNotification($notifiable)
    {
        return (new FirebaseMessage)
        ->title($this->messageData->title?? '')
        ->body($this->messageData->body?? '');
    }

    /**
     * Get the message representation of the web notification.
     *
     * @param  mixed  $notifiable
     * @return App\CustomFirebaseChannel\FirebaseMessage
     */
    public function toExpoPush($notifiable)
    {
        return ExpoMessage::create()
        ->badge(1)
        ->enableSound()
        ->title($this->messageData->title?? '')
        ->body($this->messageData->body?? '');
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
            'title' => $this->messageData->title?? '',
            'body' => $this->messageData->body?? ''
        ];
    }
}
