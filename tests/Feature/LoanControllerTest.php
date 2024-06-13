<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\User;
use App\Models\Branch;
use App\Models\LoanDetails;
use App\Models\UserType;
use Laravel\Passport\Passport;

class LoanControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testListByLoanBranch()
    {
        $branch = factory(Branch::class)->create([
            'name' => 'test'
        ]);
        $userType = factory(UserType::class)->create([
            'type' => 'team_lead'
        ]);
        $user = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => $userType->id
        ]);
        
        
        $loans = factory(LoanDetails::class, 5)->create([
            'status' => 'pending',
            'user_id' => factory(User::class)->create([
                'user_type_id' => factory(UserType::class)->create([
                    'type' => 'default'
                ])->id,
                'branch_id' => $branch->id
            ])->id,
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/' . $branch->id . '/loan');


        $response->assertStatus(200);
        $response->assertJson([
            'data' => $loans->toArray(),
            'message' => 'success',
        ]);
    }

    public function testUnauthorizedUserCannotListByLoanBranch()
    {
        $branch = factory(Branch::class, 2)->create();
        $userType = factory(UserType::class)->create([
            'type' => 'team_lead'
        ]);
        $user = factory(User::class)->create([
            'branch_id' => $branch[0]->id,
            'user_type_id' => $userType->id
        ]);
        
        
        $loans = factory(LoanDetails::class, 5)->create([
            'status' => 'pending',
            'user_id' => factory(User::class)->create([
                'user_type_id' => factory(UserType::class)->create([
                    'type' => 'default'
                ])->id,
                'branch_id' => $branch[1]->id
            ])->id,
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/' . $branch[1]->id . '/loan');

        $response->assertStatus(403);
    }

    public function testSearchLoanByBranch()
    {
        $branch = factory(Branch::class)->create([
            'name' => 'test'
        ]);
        $userType = factory(UserType::class)->create([
            'type' => 'team_lead'
        ]);
        $user = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => $userType->id
        ]);
        
        
        $loans = factory(LoanDetails::class, 5)->create([
            'status' => 'pending',
            'user_id' => factory(User::class)->create([
                'user_type_id' => factory(UserType::class)->create([
                    'type' => 'default'
                ])->id,
                'branch_id' => $branch->id
            ])->id,
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/' . $branch->id . '/loan/search?search=' . $loans[0]->user->name);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                $loans[0]->only(['id', 'user_id', 'status', 'approved_amount', 'duration', 'loan_interest_id'])
            ],
            'message' => 'success',
        ]);
    }

    public function testUnauthorizedUserCannotSearchLoanByBranch()
    {
        $branch = factory(Branch::class, 2)->create();
        $userType = factory(UserType::class)->create([
            'type' => 'team_lead'
        ]);
        $user = factory(User::class)->create([
            'branch_id' => $branch[0]->id,
            'user_type_id' => $userType->id
        ]);
        
        
        $loans = factory(LoanDetails::class, 5)->create([
            'status' => 'pending',
            'user_id' => factory(User::class)->create([
                'user_type_id' => factory(UserType::class)->create([
                    'type' => 'default'
                ])->id,
                'branch_id' => $branch[1]->id
            ])->id,
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/' . $branch[1]->id . '/loan/search?search=' . $loans[0]->user->name);

        $response->assertStatus(403);
    }

    public function testGetLoanDetailByBranch()
    {
        $branch = factory(Branch::class)->create([
            'name' => 'test'
        ]);
        $userType = factory(UserType::class)->create([
            'type' => 'team_lead'
        ]);
        $user = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => $userType->id
        ]);
        
        
        $loan = factory(LoanDetails::class)->create([
            'status' => 'pending',
            'user_id' => factory(User::class)->create([
                'user_type_id' => factory(UserType::class)->create([
                    'type' => 'default'
                ])->id,
                'branch_id' => $branch->id
            ])->id,
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/loan/' . $loan->id);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => $loan->toArray(),
            'message' => 'success',
        ]);
    }

    public function testUnauthorizedUserCannotGetLoanDetailByBranch()
    {
        $branch = factory(Branch::class, 2)->create();
        $userType = factory(UserType::class)->create([
            'type' => 'team_lead'
        ]);
        $user = factory(User::class)->create([
            'branch_id' => $branch[0]->id,
            'user_type_id' => $userType->id
        ]);
        
        
        $loan = factory(LoanDetails::class)->create([
            'status' => 'pending',
            'user_id' => factory(User::class)->create([
                'user_type_id' => factory(UserType::class)->create([
                    'type' => 'default'
                ])->id,
                'branch_id' => $branch[1]->id
            ])->id,
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/loan/' . $loan->id);

        $response->assertStatus(403);
    }
}
