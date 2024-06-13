<?php

namespace Database\Seeders;

use App\Models\ReferralChannel;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ReferralChannelSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ReferralChannel::factory()->create([
            'name' => 'Facebook',
        ]);
        
        ReferralChannel::factory()->create([
            'name' => 'Instagram',
        ]);

        ReferralChannel::factory()->create([
            'name' => 'Twitter',
        ]);

        ReferralChannel::factory()->create([
            'name' => 'Google',
        ]);

        ReferralChannel::factory()->create([
            'name' => 'LinkedIn',
        ]);

        ReferralChannel::factory()->create([
            'name' => 'Medium',
        ]);

        ReferralChannel::factory()->create([
            'name' => 'Other',
        ]);
    }
}
