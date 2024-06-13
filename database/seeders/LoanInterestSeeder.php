<?php

namespace Database\Seeders;

use App\Enums\RepaymentDurations;
use App\Models\LoanInterest;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LoanInterestSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LoanInterest::firstOrCreate([
            'purpose' => "Retail Merchants",
            'interest' => 7,
            'minimum_amount' => 50000,
            'maximum_amount' =>  2000000
        ]);
        LoanInterest::firstOrCreate([
            'purpose' => "Wholesalers",
            'interest' => 6,
            'minimum_amount' => 300000,
            'maximum_amount' => 10000000
        ]);
        LoanInterest::firstOrCreate([
            'purpose' => "SMEs",
            'interest' => 6,
            'minimum_amount' => 300000,
            'maximum_amount' => 20000000
        ]);
        LoanInterest::firstOrCreate([
            'purpose' => "Weekly Float",
            'interest' => 6,
            'minimum_amount' => 50000,
            'maximum_amount' => 5000000,
            'moratorium' => 0,
            'repayment_duration' => RepaymentDurations::WEEKLY
        ]);
        LoanInterest::firstOrCreate([
            'purpose' => "Daily Float",
            'interest' => 6,
            'minimum_amount' => 50000,
            'maximum_amount' => 5000000,
            'moratorium' => 7,
            'repayment_duration' => RepaymentDurations::DAILY
        ]);
    }
}
