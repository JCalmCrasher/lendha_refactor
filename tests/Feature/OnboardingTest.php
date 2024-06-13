<?php

namespace Tests\Feature;

use App\Models\BusinessRegistration;
use App\Models\User;
use BusinessSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Passport\Passport;
use Tests\TestCase;

class OnboardingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(BusinessSeeder::class);
    }

    /**
     * Test that file gets saved to DB
     */
    public function testFileGetsSavedToDB()
    {
        $businessNumber = 'BN1234432';
        $user = User::first();
        Passport::actingAs($user);
        $filePath = "uploads/$user->id/cac_document.png";

        $response = $this->post('/api/user/onboarding/documents/business_registration', [
            'user_file' => UploadedFile::fake()->image('cac_document.png'),
            'business_registration_number' => $businessNumber
        ]);

        $this->assertDatabaseHas('business_registrations', [
            'cac_document' => $filePath,//->hashName(),
            'business_registration_number' => $businessNumber,
        ]);
    }
    // test json response correct

    /**
     * Test that json response is correct
     */
    public function testJsonResponseIsCorrect()
    {
        $businessNumber = 'BN1234432';
        $user = User::first();
        Passport::actingAs($user);
        $filePath = "uploads/$user->id/cac_document.png";

        $response = $this->post('/api/user/onboarding/documents/business_registration', [
            'user_file' => UploadedFile::fake()->image('cac_document.png'),
            'business_registration_number' => $businessNumber
        ]);

        $response->assertStatus(200)->assertJson([
            "data"=> $filePath,
            "message" => "success"
        ]);
    }
}
