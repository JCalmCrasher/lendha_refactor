<?php

namespace Tests\Feature;

use App\Models\User as AppUser;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;
use User;
use UserTypesSeeder;

class ModifyCustomerProfileTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(User::class);
        $this->seed(UserTypesSeeder::class);
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testCustomerProfileModification()
    {
        // given 
        $admin_user = AppUser::find(1);
        Passport::actingAs($admin_user);

        $user = AppUser::find(2);
        $users_name = $user->name;
        $users_new_name = 'Obed Omar';

        // when
        $response = $this->actingAs($admin_user)->post('api/admin/edit_customer_profile', [
            'user_id' => 2,
            'user_name' => $users_new_name
        ]);

        // then
        $response->assertStatus(200);
        $this->assertDatabaseHas('users', [
            'name' => $users_new_name
        ]);
        $this->assertNotEquals($users_name, $users_new_name);
    }
}
