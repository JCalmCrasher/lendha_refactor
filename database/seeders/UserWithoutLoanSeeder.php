<?php

namespace Database\Seeders;

use App\Models\BankDetails;
use App\Models\EmploymentDetails;
use App\Models\User;
use App\Models\UserDocuments;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserWithoutLoanSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::factory()->count(5)->create()->each(function ($user) {
            $user->bank()->save(BankDetails::factory()->make());
            $user->documents()->save(UserDocuments::factory()->make());
            $user->employment()->save(EmploymentDetails::factory()->make());
        });
    }
}
