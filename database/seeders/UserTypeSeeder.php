<?php

namespace Database\Seeders;

use App\Models\UserType;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        UserType::query()->updateOrCreate(
            ['type' => 'default'],
            ['type' => 'default']
        );

        UserType::query()->updateOrCreate(
            ['type' => 'admin'],
            ['type' => 'admin']
        );

        UserType::query()->updateOrCreate(
            ['type' => 'subadmin'],
            ['type' => 'subadmin']
        );

        UserType::query()->updateOrCreate(
            ['type' => 'merchant'],
            ['type' => 'merchant']
        );

        UserType::query()->updateOrCreate(
            ['type' => 'onboarding_officer'],
            ['type' => 'onboarding_officer']
        );

        UserType::query()->updateOrCreate(
            ['type' => 'team_lead'],
            ['type' => 'team_lead']
        );

        UserType::query()->updateOrCreate(
            ['type' => 'finance'],
            ['type' => 'finance']
        );
    }
}
