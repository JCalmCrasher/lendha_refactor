<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\LoanInterest>
 */
class LoanInterestFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'purpose' => fake()->unique()->word,
            'interest' => fake()->randomDigit(),
            'minimum_amount' => fake()->randomNumber(7),
            'maximum_amount' => fake()->randomNumber(8),
        ];
    }
}
