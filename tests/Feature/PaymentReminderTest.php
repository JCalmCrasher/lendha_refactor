<?php

namespace Tests\Feature;

use App\Jobs\SendPaymentReminder;
use App\Models\LoanDetails;
use App\Notifications\AdminPaymentReminder;
use App\Notifications\PaymentReminder;
use App\Models\User as AppUser;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Bus;
use Illuminate\Support\Facades\Notification;
use LoanDetailSeeder;
use Tests\TestCase;

class PaymentReminderTest extends TestCase
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
     * Test that the repayment notification is being sent 
     * a week before payment is due.
     *
     * @return void
     */
    public function testRepaymentAWeekDue()
    {
        // given that day is one week from next month
        $dayOfInterest = now()->addMonth()->subWeek();
        Carbon::setTestNow($dayOfInterest);
        
        Bus::fake();

        // when we run this command
        $this->artisan('remind:payment');

        // then  assert date is equal to 7 days from payment date
        $this->assertEquals(
            Carbon::parse(LoanDetails::find(1)->payments->first()->due_date)->subWeek()->format('Y-m-d'), 
            now()->format('Y-m-d')
        );

        Bus::assertDispatched(SendPaymentReminder::class);
    }

    /**
     * Test that the repayment notification is being sent 
     * a day before payment is due.
     *
     * @return void
     */
    public function testRepaymentADayDue()
    {
        // given that day is one week from next month
        $dayOfInterest = now()->addMonth()->subDay();
        Carbon::setTestNow($dayOfInterest);
        
        Bus::fake();

        // when we run this command
        $this->artisan('remind:payment');

        // then  assert date is equal to 7 days from payment date
        $this->assertEquals(
            Carbon::parse(LoanDetails::find(1)->payments->first()->due_date)->subDay()->format('Y-m-d'), 
            now()->format('Y-m-d')
        );

        Bus::assertDispatched(SendPaymentReminder::class);
    }

    /**
     * Test that email is getting sent.
     *
     * @return void
     */
    public function testMailSent()
    {
        $dayOfInterest = now()->addMonth()->subWeek();
        Carbon::setTestNow($dayOfInterest);
        
        Notification::fake();

        Notification::assertNothingSent();

        $this->artisan('remind:payment');

        Notification::assertSentTo(AppUser::find(1), PaymentReminder::class, function ($notification, $channels) {
            return in_array('mail', $channels);
        });
    }

    /**
     * Test that email is getting sent to admin.
     *
     * @return void
     */
    public function testAdminMailSent()
    {
        $dayOfInterest = now()->addMonth()->subWeek();
        Carbon::setTestNow($dayOfInterest);
        $loanOfficer = AppUser::find(AppUser::find(1)->loans->first()->subadmin_id);
        
        Notification::fake();

        Notification::assertNothingSent();

        $this->artisan('remind:payment');

        Notification::assertSentTo($loanOfficer, AdminPaymentReminder::class, function ($notification, $channels) {
            return in_array('mail', $channels);
        });
    }
}
