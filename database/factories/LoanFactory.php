<?php

namespace Database\Factories;

use App\Enums\LoanStatus;
use App\Models\LoanInterest;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class LoanFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $interest = LoanInterest::factory()->create();

        return [
            'user_id' => User::factory(),
            'application_id' => fake()->randomNumber(8),
            'amount' => fake()->randomNumber(8),
            'approved_amount' => fake()->randomNumber(8),
            'request_date' => now()->format('Y-m-d'),
            'approval_date' => now()->format('Y-m-d'),
            'purpose' => $interest->purpose,
            'duration' =>  fake()->randomDigit(),
            'status' => fake()->randomElement(LoanStatus::getAll()),
            'subadmin_id' => User::factory(),
            'loan_interest_id' => $interest->id,
        ];
    }
}
