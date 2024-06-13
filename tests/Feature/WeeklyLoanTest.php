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

class WeeklyLoanTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
    }

    /**
     * Test loan application api endpoint for weekly repayment loan.
     *
     * @return void
     */
    public function testWeeklyLoanApplication()
    {
        $this->seed();
        factory(User::class)->create();

        $user = User::first();
        Passport::actingAs($user);
        $weeklyLoan = LoanInterest::where('repayment_duration', RepaymentDurations::WEEKLY)->first();
        $this->assertDatabaseMissing('loan_details', [
            'loan_interest_id' => $weeklyLoan->id,
        ]);

        $response = $this->postJson('/api/user/loan', [
            'loan_interest_id' => $weeklyLoan->id,
            'loan_amount' => $weeklyLoan->maximum_amount
        ]);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [],
            'message' => "success"
        ]);
        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'loan_interest_id' => $weeklyLoan->id,
            'duration' => 1,
            'amount' => $weeklyLoan->maximum_amount
        ]);
    }

    /**
     * Test loan approval of weekly repayment loan
     * 
     * @return void
     */
    public function testWeeklyLoanApproval()
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

        // create loan, with user, with weekly interest payment
        $weeklyLoan = LoanInterest::where('repayment_duration', RepaymentDurations::WEEKLY)->first();

        factory(LoanDetails::class)->create([
            'purpose' => $weeklyLoan->purpose,
            'loan_interest_id' => $weeklyLoan->id,
            'status' => LoanStatus::PENDING,
            'approved_amount' => 100000,
            'duration' => 1
        ]);
        $thisLoan = LoanDetails::first();
        $user = User::find($thisLoan["user_id"]);


        $weeklyRepaymentCount = (LoanInterest::WEEKLYLOANREPAYMENTDURATION - $weeklyLoan->moratorium)/7;
        $loanAmount = $thisLoan['approved_amount'];
        $interest = $weeklyLoan->interest * ($loanAmount/100) * $thisLoan['duration'];
        $weeklyRepaymentAmount = ($loanAmount + $interest) / $weeklyRepaymentCount;
        

        Passport::actingAs($admin);

        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'loan_interest_id' => $weeklyLoan->id,
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
            'loan_interest_id' => $weeklyLoan->id,
            'approved_amount' => $loanAmount,
            'status' => LoanStatus::APPROVED
        ]);
        
        for ($i=1; $i <= (LoanInterest::WEEKLYLOANREPAYMENTDURATION/7); $i++) { 
            $this->assertDatabaseHas('loan_payments', [
                'loan_details_id' => $thisLoan->id,
                'intended_payment' => round($weeklyRepaymentAmount, 2),
                'due_date' => Carbon::now()->addWeeks($i)->format('Y-m-d H:i:s'),
            ]);
        }
    }
}
