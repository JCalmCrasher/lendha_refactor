<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class BusinessManagementWaitingListTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void {
        parent::setUp();
    }
    /**
     * A basic feature test example.
     *
     * @return void
     */
    public function testEmailAddedToList()
    {
        $email = 'pee@pee.com';
        
        $response = $this->postJson('api/business_management_waiting_list', [
            'email' => $email,
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('business_management_waiting_lists', [
            'email' => $email,
        ]);
    }
}
