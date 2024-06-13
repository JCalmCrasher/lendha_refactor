<?php

namespace Database\Factories;

use App\Enums\PaymentStatus;
use App\Models\LoanDetails;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class LoanPaymentFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'intended_payment' => fake()->randomNumber(5),
            'user_payment' => fake()->randomNumber(5),
            'due_date' => fake()->date(),
            'penalty' => fake()->randomNumber(5),
            'status' => fake()->randomElement(PaymentStatus::getAll()),
            'loan_details_id' => LoanDetails::factory(),
        ];
    }
}
