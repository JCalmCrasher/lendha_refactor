<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class BankFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'account_name' => fake()->name,
            'account_number' => fake()->bankAccountNumber,
            'bank_name' => fake()->company,
            'bvn' => fake()->bankAccountNumber.$this->faker->randomDigit,
        ];
    }
}
