<?php

namespace Tests\Feature;

use App\Services\HyperVergeService;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Laravel\Passport\Passport;
use Tests\TestCase;
use User as GlobalUser;

class KYCIntegrationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void {
        parent::setUp();
        $this->seed(GlobalUser::class);
    }

    public function testPlaceHolder()
    {
        $this->assertTrue(true);
    }

    // public function testGetToken()
    // {
    //     // given
    //     $kycProvider = new HyperVergeService();

    //     // when
    //     $token = $kycProvider->generateToken();

    //     // then
    //     $this->assertNotEquals('', $token);
    // }

    // public function testAPIforKYCToken()
    // {
    //     // given
    //     $user = factory(User::class)->create();
    //     Passport::actingAs($user);

    //     // when
    //     $response = $this->getJson('api/kyc/token');

    //     // then
    //     $response->assertStatus(200)->assertJson([
    //         'message' => 'Token generated successfully'
    //     ]);
    // }

    // public function testVerifyResult()
    // {
    //     // given
    //     $kycProvider = new HyperVergeService();

    //     // when
    //     $result = $kycProvider->verifyResult([]);

    //     // then
    //     $this->assertTrue($result);
    // }
}
