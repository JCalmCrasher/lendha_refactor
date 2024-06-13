<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialMediaHandles>
 */
class SocialMediaHandlesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'facebook' => fake()->url,
            'instagram' => fake()->url,
            'linkedin' => fake()->url,
            'user_id' => User::factory(),
        ];
    }
}
