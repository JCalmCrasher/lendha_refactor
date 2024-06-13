<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserWithPrivilegesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(3)->create([
            'user_type_id' => 1,
        ]);

        User::factory()->count(3)->create([
            'user_type_id' => 2,
        ]);

        User::factory()->count(3)->create([
            'user_type_id' => 3,
        ]);

        User::factory()->count(3)->create([
            'user_type_id' => 4,
        ]);
    }
}
