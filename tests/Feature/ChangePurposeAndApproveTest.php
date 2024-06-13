<?php

namespace Tests\Feature;

use App\Enums\LoanStatus;
use App\Enums\RepaymentDurations;
use App\Models\LoanDetails;
use App\Models\LoanInterest;
use App\Models\User;
use App\Models\UserType;
use Carbon\Carbon;
use UserTypesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ChangePurposeAndApproveTest extends TestCase
{
    use RefreshDatabase;
    /**
     * Test loan purpose change reflects in db.
     *
     * @return void
     */
    public function testLoanPurposeChangeInDB()
    {
        // given
        $this->seed([
            UserTypesSeeder::class
        ]);

        // create admin
        $adminType = UserType::where('type', 'admin')->first();

        factory(User::class)->create([
            "user_type_id" => $adminType->id,
        ]);

        $admin = User::where('user_type_id', $adminType->id)->first();

        // create loan with monthly interest
        $thisLoan = factory(LoanDetails::class)->create([
            'status' => LoanStatus::PENDING,
            "approved_amount" => 100000,
            "duration" => 3,
            "purpose" => "test purpose",
            "loan_interest_id" => factory(LoanInterest::class)->create([
                "repayment_duration" => RepaymentDurations::MONTHLY,
                "maximum_amount" => 100000,
                "interest" => 5,
                "purpose" => "test purpose",
            ])->id,
        ]);
        // create new interest with different purpose and different interest rate
        $secondLoanInterest = factory(LoanInterest::class)->create([
            "repayment_duration" => RepaymentDurations::MONTHLY,
            "maximum_amount" => 100000,
            "interest" => 10,
            "purpose" => "test purpose 2",
        ]);
        
        // get user
        $user = User::find($thisLoan["user_id"]);

        $loanAmount = $thisLoan['approved_amount'];
        $interest = $secondLoanInterest->interest * ($loanAmount/100) * $thisLoan['duration']; 
        $monthlyRepaymentAmount = ($loanAmount + $interest)/$thisLoan['duration'];

        Passport::actingAs($admin);

        // when
        $response = $this->postJson('/api/admin/modify_user_loan_purpose', [
            'loan_details_id' => $thisLoan->id,
            'new_loan_purpose_id' => $secondLoanInterest->id,
        ]);

        // then
        $response->assertStatus(200);
        $response->assertJson([
            'data' => [],
            'message' => "success"
        ]);
        
        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'loan_interest_id' => strval($secondLoanInterest->id),
            'purpose' => $secondLoanInterest->purpose,
            'approved_amount' => $loanAmount,
            'status' => LoanStatus::PENDING
        ]);
    }

    /**
     * Test loan purpose change and approval gives right values.
     *
     * @return void
     */
    public function testLoanPurposeChangeAndApproval()
    {
        // given
        $this->seed([
            UserTypesSeeder::class
        ]);

        // create admin
        $adminType = UserType::where('type', 'admin')->first();

        factory(User::class)->create([
            "user_type_id" => $adminType->id,
        ]);

        $admin = User::where('user_type_id', $adminType->id)->first();

        // create loan with monthly interest
        $thisLoan = factory(LoanDetails::class)->create([
            'status' => LoanStatus::PENDING,
            "approved_amount" => 100000,
            "duration" => 3,
            "purpose" => "test purpose",
            "loan_interest_id" => factory(LoanInterest::class)->create([
                "repayment_duration" => RepaymentDurations::MONTHLY,
                "maximum_amount" => 100000,
                "interest" => 5,
                "purpose" => "test purpose",
            ])->id,
        ]);
        // create new interest with different purpose and different interest rate
        $secondLoanInterest = factory(LoanInterest::class)->create([
            "repayment_duration" => RepaymentDurations::MONTHLY,
            "maximum_amount" => 100000,
            "interest" => 10,
            "purpose" => "test purpose 2",
        ]);
        
        // get user
        $user = User::find($thisLoan["user_id"]);

        $loanAmount = $thisLoan['approved_amount'];
        $interest = $secondLoanInterest->interest * ($loanAmount/100) * $thisLoan['duration']; 
        $monthlyRepaymentAmount = ($loanAmount + $interest)/$thisLoan['duration'];

        Passport::actingAs($admin);

        // when
        $response = $this->postJson('/api/admin/modify_user_loan_purpose', [
            'loan_details_id' => $thisLoan->id,
            'new_loan_purpose_id' => $secondLoanInterest->id,
        ])->assertStatus(200)->assertJson([
            'data' => [],
            'message' => "success"
        ]);

        $response = $this->postJson('/api/admin/loan_status', [
            'id' => $thisLoan->id,
            'loan_status' => LoanStatus::APPROVED,
            'subadmin_id' => factory(User::class)->create()->id
        ])->assertStatus(200)->assertJson([
            'data' => [],
            'message' => "updated"
        ]);
        

        // then
        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'loan_interest_id' => strval($secondLoanInterest->id),
            'purpose' => $secondLoanInterest->purpose,
            'approved_amount' => $loanAmount,
            'status' => LoanStatus::APPROVED
        ]);
        
        // dd($loanAmount, $monthlyLoan['interest'], $thisLoan['duration'], $monthlyRepaymentAmount);
        for ($i=1; $i <= ($thisLoan['duration']); $i++) { 
            $this->assertDatabaseHas('loan_payments', [
                'loan_details_id' => $thisLoan->id,
                'intended_payment' => round($monthlyRepaymentAmount, 2),
                'due_date' => Carbon::now()->addMonth($i)->format('Y-m-d H:i:s'),
            ]);
        }
    }
}
