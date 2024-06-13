<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;

use App\Models\Guarantor;
use App\Models\LoanDetails;
use App\Models\User;
use App\Models\UserTransfer;
use App\Policies\GuarantorPolicy;
use App\Policies\LoanPolicy;
use App\Policies\UserPolicy;
use App\Policies\UserTransferPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Laravel\Passport\Passport;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        User::class => UserPolicy::class,
        Guarantor::class => GuarantorPolicy::class,
        UserTransfer::class => UserTransferPolicy::class,
        LoanDetails::class => LoanPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        Passport::tokensExpireIn(now()->addMinutes(30));
        Passport::refreshTokensExpireIn(now()->addHour());

        ResetPassword::createUrlUsing(function (User $user, string $token) {
            return config('passwordreset.url').'?token='.$token.'&email='.$user->getEmailForPasswordReset();
        });
    }
}
