<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Business>
 */
class BusinessFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->company,
            'email' => fake()->unique()->safeEmail,
            'category' => fake()->word,
            'description' => fake()->paragraph,
            'address_number' => fake()->buildingNumber,
            'street' => fake()->streetName,
            'city' => fake()->city,
            'state' => fake()->city,
            'landmark' => fake()->streetAddress,
            'user_id' => User::factory(),
        ];
    }
}
