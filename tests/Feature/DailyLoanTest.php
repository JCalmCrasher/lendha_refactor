<?php

namespace Tests\Feature;

use App\Enums\LoanStatus;
use App\Enums\RepaymentDurations;
use App\Models\LoanDetails;
use App\Models\LoanInterest;
use App\Models\User;
use App\Models\UserType;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use LoanInterestSeeder;
use Tests\TestCase;
use UserTypesSeeder;


class DailyLoanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Test loan application api endpoint for daily repayment loan.
     *
     * @return void
     */
    public function testDailyLoanApplication()
    {
        $this->seed();
        factory(User::class)->create();

        $user = User::first();
        Passport::actingAs($user);
        $dailyLoan = LoanInterest::where('repayment_duration', RepaymentDurations::DAILY)->first();
        $this->assertDatabaseMissing('loan_details', [
            'loan_interest_id' => $dailyLoan->id,
        ]);

        $response = $this->postJson('/api/user/loan', [
            'loan_interest_id' => $dailyLoan->id,
            'loan_amount' => $dailyLoan->maximum_amount
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [],
            'message' => "success"
        ]);
        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'loan_interest_id' => $dailyLoan->id,
            'duration' => 1,
            'amount' => $dailyLoan->maximum_amount
        ]);
    }

    /**
     * Test loan approval of daily repayment loan
     * 
     * @return void
     */
    public function testDailyLoanApproval()
    {
        // given
        $this->seed([
            UserTypesSeeder::class,
            LoanInterestSeeder::class
        ]);

        // create admin
        $adminType = UserType::where('type', 'admin')->first();

        factory(User::class)->create([
            "user_type_id" => $adminType->id,
        ]);

        $admin = User::where('user_type_id', $adminType->id)->first();

        // create loan, with user, with daily interest payment
        $dailyLoan = LoanInterest::where('repayment_duration', RepaymentDurations::DAILY)->first();

        factory(LoanDetails::class)->create([
            'purpose' => $dailyLoan->purpose,
            'loan_interest_id' => $dailyLoan->id,
            'status' => LoanStatus::PENDING,
            'approved_amount' => 100000,
            'duration' => 1
        ]);
        $thisLoan = LoanDetails::first();
        $user = User::find($thisLoan["user_id"]);

        $dailyRepaymentCount = LoanInterest::DAILYLOANREPAYMENTDURATION - $dailyLoan->moratorium;
        $loanAmount = $thisLoan['approved_amount'];
        $interest = $dailyLoan->interest * ($loanAmount/100) * $thisLoan['duration'];
        $dailyRepaymentAmount = ($loanAmount + $interest)/ $dailyRepaymentCount;
        
        
        Passport::actingAs($admin);

        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'loan_interest_id' => $dailyLoan->id,
            'approved_amount' => $loanAmount,
            'status' => LoanStatus::PENDING
        ]);

        // when
        $response = $this->postJson('/api/admin/loan_status', [
            "id" => $thisLoan->id,
            'loan_status' => LoanStatus::APPROVED,
            "subadmin_id" => factory(User::class)->create()->id
        ]);

        // then
        $response->assertStatus(200);
        $response->assertJson([
            'data' => [],
            'message' => "updated"
        ]);
        
        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'loan_interest_id' => $dailyLoan->id,
            'approved_amount' => $loanAmount,
            'status' => LoanStatus::APPROVED
        ]);
        
        for ($i=$dailyLoan->moratorium + 1; $i <= LoanInterest::DAILYLOANREPAYMENTDURATION; $i++) { 
            $this->assertDatabaseHas('loan_payments', [
                'loan_details_id' => $thisLoan->id,
                'intended_payment' => round($dailyRepaymentAmount, 2),
                'due_date' => Carbon::now()->addDays($i)->format('Y-m-d H:i:s'),
            ]);
        }
    }
}
