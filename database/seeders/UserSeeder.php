<?php

namespace Database\Seeders;

use App\Models\BankDetails;
use App\Models\EmploymentDetails;
use App\Models\LoanDetails;
use App\Models\User;
use App\Models\UserDocuments;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::factory()->create([
            'name' => "Peter Okafor",
            'email' => 'pee@pee.com',
            'phone_number' => '08012345678',
            'state_of_residence' => 'Lagos',
            'password' => Hash::make('password'),
            'user_type_id' => 2
        ]);

        $admin->loans()->save(LoanDetails::factory()->create());
        $admin->bank()->save(BankDetails::factory()->create());
        // $admin->cards()->save(CardDetails::factory()->create());
        $admin->documents()->save(UserDocuments::factory()->create());
        $admin->employment()->save(EmploymentDetails::factory()->create());

        User::factory()->count(5)->create()->each(function ($user) {
            $user->loans()->save(LoanDetails::factory()->create());
            $user->bank()->save(BankDetails::factory()->create());
            // $user->cards()->save(CardDetails::factory()->create());
            $user->documents()->save(UserDocuments::factory()->create());
            $user->employment()->save(EmploymentDetails::factory()->create());
        });
    }
}
