<?php

namespace App\Providers;

use App\Events\LoanApplicationCompleted;
use App\Events\LoanApproved;
use App\Events\LoanDenied;
use App\Events\LoanDisbursed;
use App\Events\PaymentReceived;
use App\Events\UserAdded;
use App\Listeners\CreateRepaymentAccount;
use App\Listeners\NotifyUserOfCompleteLoanApplication;
use App\Listeners\NotifyUserOfInvitation;
use App\Listeners\NotifyUserOfLoanApproval;
use App\Listeners\NotifyUserOfLoanDenial;
use App\Listeners\NotifyUserOfLoanDisbursement;
use App\Listeners\NotifyUserOfLoanRepayment;
use App\Listeners\PerformCrcCheck;
use App\Listeners\RegisterLoanDenial;
use App\Listeners\UpdateLoanBalance;
use Illuminate\Auth\Events\Registered;
use Illuminate\Auth\Listeners\SendEmailVerificationNotification;
use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Event;

class EventServiceProvider extends ServiceProvider
{
    /**
     * The event to listener mappings for the application.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        Registered::class => [
            SendEmailVerificationNotification::class,
        ],

        LoanApproved::class => [
            CreateRepaymentAccount::class,
            NotifyUserOfLoanApproval::class,
        ],

        PaymentReceived::class => [
            UpdateLoanBalance::class,
            NotifyUserOfLoanRepayment::class,
        ],

        LoanDenied::class => [
            RegisterLoanDenial::class,
            NotifyUserOfLoanDenial::class,
        ],

        LoanDisbursed::class => [
            NotifyUserOfLoanDisbursement::class,
        ],

        LoanApplicationCompleted::class => [
            NotifyUserOfCompleteLoanApplication::class,
            PerformCrcCheck::class,
        ],

        UserAdded::class => [
            NotifyUserOfInvitation::class
        ]
    ];

    /**
     * Register any events for your application.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Determine if events and listeners should be automatically discovered.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
