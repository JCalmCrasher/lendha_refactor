<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\HomeAddress>
 */
class HomeAddressFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'number' => fake()->buildingNumber,
            'street_name' => fake()->streetName,
            'landmark' => fake()->streetAddress,
            'city' => fake()->city,
            'local_government' => fake()->city,
            'state' => fake()->city,
            'user_id' => User::factory(),
        ];
    }
}
