<?php

namespace Tests\Feature;

use App\Models\LoanDetails;
use App\Models\User as AppUser;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Notification;
use LoanDetailSeeder;
use Tests\TestCase;

class PaymentNotificationTest extends TestCase
{
    use RefreshDatabase;

    // payment seed
    // loan detail seed

    protected function setUp(): void {
        parent::setUp();
        // $this->seed(User::class);
        $this->seed(LoanDetailSeeder::class);
        // $this->salaryLoanService = new SalaryLoanService();
    }

    /**
     * Test that email is getting sent to subadmin.
     *
     * @return void
     */
    public function testSubAdminMailSent()
    {
        $dayOfInterest = now()->addMonth()->subWeek();
        Carbon::setTestNow($dayOfInterest);
        $loanOfficer = AppUser::find(AppUser::find(1)->loans->first()->subadmin_id);
        
        Notification::fake();

        Notification::assertNothingSent();

        Notification::assertSentTo($loanOfficer, SubAdminPaymentReminder::class, function ($notification, $channels) {
            return in_array('mail', $channels);
        });
    }

    /**
     * Test that email is getting sent to subadmin.
     *
     * @return void
     */
    public function testPaymentNotification()
    {
        $dayOfInterest = now()->addMonth()->subWeek();
        Carbon::setTestNow($dayOfInterest);
        $loanUser = AppUser::find(AppUser::find(1)->loans->first()->user);
        
        Notification::fake();

        Notification::assertNothingSent();

        Notification::assertSentTo($loanUser, PaymentNotification::class, function ($notification, $channels) {
            return in_array('mail', $channels);
        });
    }

}