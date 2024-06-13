<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Notifications\IncompleteProfileNotification;
use Illuminate\Console\Command;

class IncompleteProfileReminder extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'remind:incomplete-profile';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remind users of incomplete profile';

    /**
     * Execute the console command.
     */
    public function handle(): void
    {
        User::query()->lazy()
            ->each(function ($user) {
                if ($user->onboarding_status !== 9) {
                    $missingSteps = $this->getMissingSteps($user->onboarding_status);
                    $user->notify(new IncompleteProfileNotification($user->name, $missingSteps));
                }
            });
    }

    private function getMissingSteps($status): array
    {
        $steps = [
            1 => 'Phone Number',
            2 => 'Phone Verification',
            3 => 'Home Address',
            4 => 'Business Details',
            5 => 'Bank Information',
            6 => 'Documents',
            7 => 'Next of Kin',
            8 => 'Social Media Handles',
        ];

        return array_filter($steps, function ($key) use ($status) {
            return $key >= $status;
        }, ARRAY_FILTER_USE_KEY);
    }
}
