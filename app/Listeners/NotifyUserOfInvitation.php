<?php

namespace App\Listeners;

use App\Events\UserAdded;
use App\Models\User;
use App\Notifications\MerchantInvitationNotification;
use App\Notifications\TeamMemberInvitationNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyUserOfInvitation implements ShouldQueue
{

    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
    }

    /**
     * Handle the event.
     */
    public function handle(UserAdded $event): void
    {
        $user = $event->user;
        $url = $event->url;

        if ($user->type === User::MERCHANT_TYPE) {
            $user->notify(new MerchantInvitationNotification($user->name, $url));
        } else {
            $user->notify(new TeamMemberInvitationNotification($user->name, $url));
        }
    }
}
