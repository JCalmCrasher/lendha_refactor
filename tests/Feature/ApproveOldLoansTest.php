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
use Tests\TestCase;
use UserTypesSeeder;

class ApproveOldLoansTest extends TestCase
{
    use RefreshDatabase;

    private $loanTerm;

    protected function setUp(): void
    {
        parent::setUp();
        $this->loanTerm = 3; // in months
    }

    /**
     * Test loan approval api endpoint
     * for loans without loan_interest_id and numeric purpose.
     *
     * @return void
     */
    public function testLoanApproval()
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

        // create loan, with user, with monthly interest
        factory(LoanInterest::class, 1)->create([
            "repayment_duration" => RepaymentDurations::MONTHLY,
        ]);
        $loanType = LoanInterest::find(1);
        
        factory(LoanDetails::class)->create([
            'status' => LoanStatus::PENDING,
            "approved_amount" => 100000,
            "duration" => 3,
            "purpose" => $loanType->id,
            "loan_interest_id" => NULL,
        ]);
        $thisLoan = LoanDetails::first();
        $user = User::find($thisLoan["user_id"]);

        $loanAmount = $thisLoan['approved_amount'];
        $interest = $loanType->interest * ($loanAmount/100) * $thisLoan['duration']; 
        $monthlyRepaymentAmount = ($loanAmount + $interest)/$thisLoan['duration'];

        Passport::actingAs($admin);

        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'purpose' => $loanType->id,
            'approved_amount' => $loanAmount,
            'status' => LoanStatus::PENDING
        ]);

        // when
        $response = $this->postJson('/api/admin/loan_status', [
            'id' => $thisLoan->id,
            'loan_status' => LoanStatus::APPROVED,
            'subadmin_id' => factory(User::class)->create()->id
        ]);

        // then
        $response->assertStatus(200);
        $response->assertJson([
            'data' => [],
            'message' => "updated"
        ]);
        
        $this->assertDatabaseHas('loan_details', [
            'user_id' => $user->id,
            'purpose' => $loanType->id,
            'approved_amount' => $loanAmount,
            'status' => LoanStatus::APPROVED
        ]);
        
        for ($i=1; $i <= ($thisLoan['duration']); $i++) { 
            $this->assertDatabaseHas('loan_payments', [
                'loan_details_id' => $thisLoan->id,
                'intended_payment' => round($monthlyRepaymentAmount, 2),
                'due_date' => Carbon::now()->addMonth($i)->format('Y-m-d H:i:s'),
            ]);
        }
    }
}
