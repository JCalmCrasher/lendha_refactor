<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\LoanDetails;
use App\Models\LoanPayments;
use App\Models\User;
use App\Models\UserType;
use Exception;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class BranchCollectionsControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function setUp(): void
    {
        parent::setUp();

        // Set up your test environment here
    }

    public function testIndex()
    {
        $branch = factory(Branch::class)->create();

        // setup user
        $officer = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => factory(UserType::class)->create([
                'type' => User::TEAM_LEAD_TYPE,
            ])->id,
        ]);

        // setup loan payment
        $loanPayment = factory(LoanPayments::class, 2)->create([
            'loan_details_id' => factory(LoanDetails::class)->create([
                'user_id' => factory(User::class)->create([
                    'branch_id' => $branch->id,
                    'officer_id' => $officer->id,
                ])
            ]),
        ]);

        Passport::actingAs($officer);
        
        $response = $this->getJson('branch/' . $branch->id . '/collections');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    // Add your expected fields here
                    'name',
                    'email',
                    'phone_number',
                    'loan_id',
                    'loan_name',
                    'approved_amount',
                    'application_amount',
                    'approval_date',
                    'due_date',
                    'intended_payment',
                    'penalty',
                    'payment_status',
                    'branch_name',
                    'branch_id',
                    'officer_name',
                    'officer_id',
                    'subadmin_name',
                    'subadmin_id',
                ]
            ]
        ]);
        $response->assertJsonCount(2, 'data');
    }

    public function testFilter()
    {
        $branch = factory(Branch::class)->create();

        // setup user
        $officer = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => factory(UserType::class)->create([
                'type' => User::TEAM_LEAD_TYPE,
            ])->id,
        ]);

        // setup loan payment
        $loanPayment = factory(LoanPayments::class, 2)->create([
            'loan_details_id' => factory(LoanDetails::class)->create([
                'user_id' => factory(User::class)->create([
                    'branch_id' => $branch->id,
                    'officer_id' => $officer->id,
                ])
            ]),
        ]);

        $startDate = now()->format('Y-m-d');
        $endDate = now()->addDays(30)->format('Y-m-d');

        Passport::actingAs($officer);

        $response = $this->getJson('branch/' . $branch->id . '/collections/filter?start_date=' . $startDate . '&end_date=' . $endDate . '&officer_id=' . $officer->id);

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    // Add your expected fields here
                    'name',
                    'email',
                    'phone_number',
                    'loan_id',
                    'loan_name',
                    'approved_amount',
                    'application_amount',
                    'approval_date',
                    'due_date',
                    'intended_payment',
                    'penalty',
                    'payment_status',
                    'branch_name',
                    'branch_id',
                    'officer_name',
                    'officer_id',
                    'subadmin_name',
                    'subadmin_id',
                ]
            ]
        ]);
        $response->assertJsonCount(2, 'data');
    }
}