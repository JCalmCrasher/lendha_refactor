<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ReferralChannel>
 */
class ReferralChannelFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->randomElement([
                'Facebook',
                'Instagram',
                'Twitter',
                'Google',
                'LinkedIn',
                'Medium',
                'Other'
            ])
        ];
    }
}
