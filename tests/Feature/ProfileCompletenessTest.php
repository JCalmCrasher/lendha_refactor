<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;

class ProfileCompletenessTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void {
        parent::setUp();
    }

    /**
     * Test profile incomplete.
     *
     * @return void
     */

    public function testProfileIncomplete()
    {
        $user = factory(\App\Models\User::class)->create();

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'incomplete'
                ]
            ]
        ]);
    }

    /**
     * Test profile completeness.
     *
     * @return void
     */

    public function testProfileComplete()
    {
        $user = factory(\App\Models\User::class)->create();

        factory(\App\Models\BankDetails::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\HomeAddress::class)->create([
            'user_id' => $user->id
        ]);

        $business = factory(\App\Models\Business::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\BusinessRegistration::class)->create([
            'business_id' => $business->id
        ]);

        factory(\App\Models\Guarantor::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\UserDocuments::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\SocialMediaHandles::class)->create([
            'user_id' => $user->id
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'complete'
                ]
            ]
        ]);
    }

    /**
     * Test profile completeness.
     *
     * @return void
     */

    public function testProfileStatusWithoutSocialMediaHandles()
    {
        $user = factory(\App\Models\User::class)->create();

        factory(\App\Models\BankDetails::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\HomeAddress::class)->create([
            'user_id' => $user->id
        ]);

        $business = factory(\App\Models\Business::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\BusinessRegistration::class)->create([
            'business_id' => $business->id
        ]);

        factory(\App\Models\Guarantor::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\UserDocuments::class)->create([
            'user_id' => $user->id
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'incomplete'
                ]
            ]
        ]);
    }

    /**
     * Test profile completeness without user documents.
     *
     * @return void
     */

    public function testProfileStatusWithoutUserDocuments()
    {
        $user = factory(\App\Models\User::class)->create();

        factory(\App\Models\BankDetails::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\HomeAddress::class)->create([
            'user_id' => $user->id
        ]);

        $business = factory(\App\Models\Business::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\BusinessRegistration::class)->create([
            'business_id' => $business->id
        ]);

        factory(\App\Models\Guarantor::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\SocialMediaHandles::class)->create([
            'user_id' => $user->id
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'incomplete'
                ]
            ]
        ]);
    }

    /**
     * Test profile completeness without guarantor.
     *
     * @return void
     */

    public function testProfileStatusWithoutGuarantor()
    {
        $user = factory(\App\Models\User::class)->create();

        factory(\App\Models\BankDetails::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\HomeAddress::class)->create([
            'user_id' => $user->id
        ]);

        $business = factory(\App\Models\Business::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\BusinessRegistration::class)->create([
            'business_id' => $business->id
        ]);

        factory(\App\Models\UserDocuments::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\SocialMediaHandles::class)->create([
            'user_id' => $user->id
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'incomplete'
                ]
            ]
        ]);
    }

    /**
     * Test profile completeness without business registration.
     *
     * @return void
     */

    public function testProfileStatusWithoutBusinessRegistration()
    {
        $user = factory(\App\Models\User::class)->create();

        factory(\App\Models\BankDetails::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\HomeAddress::class)->create([
            'user_id' => $user->id
        ]);

        $business = factory(\App\Models\Business::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\Guarantor::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\UserDocuments::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\SocialMediaHandles::class)->create([
            'user_id' => $user->id
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'complete'
                ]
            ]
        ]);
    }

    /**
     * Test profile completeness without business details.
     *
     * @return void
     */

    public function testProfileStatusWithoutBusinessDetails()
    {
        $user = factory(\App\Models\User::class)->create();

        factory(\App\Models\BankDetails::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\HomeAddress::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\BusinessRegistration::class)->create();

        factory(\App\Models\Guarantor::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\UserDocuments::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\SocialMediaHandles::class)->create([
            'user_id' => $user->id
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'incomplete'
                ]
            ]
        ]);
    }

    /**
     * Test profile completeness without home address.
     *
     * @return void
     */

    public function testProfileStatusWithoutHomeAddress()
    {
        $user = factory(\App\Models\User::class)->create();

        factory(\App\Models\BankDetails::class)->create([
            'user_id' => $user->id
        ]);

        $business = factory(\App\Models\Business::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\BusinessRegistration::class)->create([
            'business_id' => $business->id
        ]);

        factory(\App\Models\Guarantor::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\UserDocuments::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\SocialMediaHandles::class)->create([
            'user_id' => $user->id
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'incomplete'
                ]
            ]
        ]);
    }

    /**
     * Test profile completeness without bank details.
     *
     * @return void
     */

    public function testProfileStatusWithoutBankDetails()
    {
        $user = factory(\App\Models\User::class)->create();

        factory(\App\Models\HomeAddress::class)->create([
            'user_id' => $user->id
        ]);

        $business = factory(\App\Models\Business::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\BusinessRegistration::class)->create([
            'business_id' => $business->id
        ]);

        factory(\App\Models\Guarantor::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\UserDocuments::class)->create([
            'user_id' => $user->id
        ]);

        factory(\App\Models\SocialMediaHandles::class)->create([
            'user_id' => $user->id
        ]);

        Passport::actingAs($user);

        $response = $this->getJson('/api/user/dashboard');

        $response->assertStatus(200);
        $response->assertJson([
            'data' => [
                'user' => [
                    'profile_status' => 'incomplete'
                ]
            ]
        ]);
    }
}
