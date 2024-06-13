<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\LoanDetails;
use App\Models\User;
use App\Models\UserType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Mockery\Generator\StringManipulation\Pass\Pass;
use Tests\TestCase;

class BranchReconcilliationControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testIndex()
    {
        $branch = factory(Branch::class)->create();
        $user = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => factory(UserType::class)->create([
                'type' => User::TEAM_LEAD_TYPE,
            ]),
        ]);
        
        // Setup Loans
        factory(LoanDetails::class, 10)->create([
            'user_id' => factory(User::class)->create([
                'branch_id' => $branch->id,
            ]),
            'request_date' => '2020-01-01',
            'approval_date' => '2020-01-01',
        ]);

        Passport::actingAs($user);
        $response = $this->get("branch/$branch->id/reconcilliation");
        
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'user_id',
                    'name',
                    'loan_name',
                    'loan_start_date',
                    'loan_end_date',
                    'principal',
                    'outstanding_principal',
                    'loan_balance',
                    'late_days',
                    'late_interest',
                    'penalty',
                    'officer_name',
                    'officer_id',
                    'subadmin_name',
                    'subadmin_id',
                ],
            ],
        ]);
    }

    public function testFilter()
    {
        $branch = factory(Branch::class)->create();
        $officer = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => factory(UserType::class)->create([
                'type' => User::TEAM_LEAD_TYPE,
            ]),
        ]);
        $subadmin = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => factory(UserType::class)->create([
                'type' => User::SUB_ADMIN_TYPE,
            ]),
        ]);
        $loans = factory(LoanDetails::class, 3)->create([
            'user_id' => factory(User::class)->create([
                'branch_id' => $branch->id,
                'officer_id' => $officer->id,
            ]),
            'request_date' => '2020-01-01',
            'approval_date' => '2020-01-01',
            'subadmin_id' => $subadmin->id,
        ]);

        Passport::actingAs($officer);
        $response = $this->get("branch/$branch->id/reconcilliation/filter?start_date=2020-01-01&end_date=2020-01-31&officer_id=$officer->id&subadmin_id=$subadmin->id");

        $response->assertStatus(200);
        $response->assertJsonStructure([
            'data' => [
                '*' => [
                    'user_id',
                    'name',
                    'loan_name',
                    'loan_start_date',
                    'loan_end_date',
                    'principal',
                    'outstanding_principal',
                    'loan_balance',
                    'late_days',
                    'late_interest',
                    'penalty',
                    'officer_name',
                    'officer_id',
                    'subadmin_name',
                    'subadmin_id',
                ],
            ],
        ]);
    }
}