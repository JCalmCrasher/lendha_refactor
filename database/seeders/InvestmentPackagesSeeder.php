<?php

namespace Database\Seeders;

use App\Models\InvestmentPlan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class InvestmentPackagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        InvestmentPlan::firstOrCreate([
            'name' => '6 months plan',
            'min_amount' => 150000.00,
            'max_amount' => 4000000.00,
            'duration' => 6, // in months
            'interest' => 20
        ]);
        InvestmentPlan::firstOrCreate([
            'name' => '12 months plan',
            'min_amount' => 50000.00,
            'max_amount' => 4000000.00,
            'duration' => 12, // in months
            'interest' => 42
        ]);
    }
}
