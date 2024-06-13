<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\User;
use App\Models\UserType;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function testListByUserBranch()
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
        
        
        factory(User::class, 5)->create([
            'user_type_id' => factory(UserType::class)->create([
                'type' => 'default'
            ])->id,
            'branch_id' => $branch->id
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/' . $branch->id . '/user');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => $branch->users->toArray(),
            'message' => 'success',
        ]);
    }

    public function testUnauthorizedUserCannotListByUserBranch()
    {
        $branch = factory(Branch::class, 2)->create();
        $userType = factory(UserType::class)->create([
            'type' => 'team_lead'
        ]);
        $user = factory(User::class)->create([
            'branch_id' => $branch[0]->id,
            'user_type_id' => $userType->id
        ]);
        
        factory(User::class, 5)->create([
            'user_type_id' => factory(UserType::class)->create([
                'type' => 'default'
            ])->id,
            'branch_id' => $branch[1]->id
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/' . $branch[1]->id . '/user');

        $response->assertStatus(403);
    }

    public function testGetUserDetailByBranch()
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
        
        $userDetail = factory(User::class)->create([
            'user_type_id' => factory(UserType::class)->create([
                'type' => 'default'
            ])->id,
            'branch_id' => $branch->id
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/user/' . $userDetail->id);

        $response->assertStatus(200);
        $response->assertJson([
            'data' => $userDetail->toArray(),
            'message' => 'success',
        ]);
    }

    public function testUnauthorizedUserCannotGetUserDetailByBranch()
    {
        $branch = factory(Branch::class, 2)->create();
        $userType = factory(UserType::class)->create([
            'type' => 'team_lead'
        ]);
        $user = factory(User::class)->create([
            'branch_id' => $branch[0]->id,
            'user_type_id' => $userType->id
        ]);
        
        $userDetail = factory(User::class)->create([
            'user_type_id' => factory(UserType::class)->create([
                'type' => 'default'
            ])->id,
            'branch_id' => $branch[1]->id
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/user/' . $userDetail->id);

        $response->assertStatus(403);
    }

    public function testSearchUserByBranch()
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
        
        $userDetail = factory(User::class, 5)->create([
            'user_type_id' => factory(UserType::class)->create([
                'type' => 'default'
            ])->id,
            'branch_id' => $branch->id
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/' . $branch->id . '/user/search?search=' . $userDetail[0]->name);
        
        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                $userDetail[0]->toArray()
            ],
            'message' => 'success',
        ]);
    }

    public function testUnauthorizedUserCannotSearchByBranch()
    {
        $branch = factory(Branch::class)->create([
            'name' => 'test'
        ]);
        
        $user = factory(User::class)->create([
            'branch_id' => $branch->id,
            'user_type_id' => factory(UserType::class)->create([
                'type' => 'default'
            ])->id
        ]);
        
        $userDetail = factory(User::class, 5)->create([
            'user_type_id' => factory(UserType::class)->create([
                'type' => 'default'
            ])->id,
            'branch_id' => $branch->id
        ]);
        
        Passport::actingAs($user);

        $response = $this->getJson('branch/' . $branch->id . '/user/search?search=' . $userDetail[0]->name);
        
        $response->assertStatus(403);
    }
}
