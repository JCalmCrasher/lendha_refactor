<?php

namespace Tests\Feature;

use App\Models\ReferralChannel;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use ReferralChannelSeeder;
use Tests\TestCase;

class ReferralChannelTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void {
        parent::setUp();
        $this->seed(ReferralChannelSeeder::class);
    }

    /**
     * Test that the referral channels are being retrieved.
     *
     * @return void
     */
    public function testReferralChannelList()
    {
        $channels = ReferralChannel::all(['id', 'name']);

        $response = $this->get('api/referral_channel');

        $this->assertDatabaseHas('referral_channels', ['name' => $channels[0]->name]);

        $response->assertStatus(200)->assertJson([
            'data' => [
                [
                    'id' => $channels[0]->id,
                    'name' => $channels[0]->name,
                ],
            ]
        ]);
    }
}
