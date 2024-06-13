<?php

namespace Database\Seeders;

use App\Models\LoanDetails;
use App\Models\LoanPayments;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class LoanDetailSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        LoanDetails::factory()->count(5)->create()->each(function ($loan) {
            for ($i=1; $i <= $loan->duration; $i++) { 
                $loan->payments()->save(LoanPayments::factory()->make([
                    'due_date' => $loan->request_date->addMonths($i),
                    'intended_payment' => $loan->approved_amount / $loan->duration,
                ]));
            }
        });
    }
}
