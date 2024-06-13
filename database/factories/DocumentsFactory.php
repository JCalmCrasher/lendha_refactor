<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class DocumentsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'passport_photo' => fake()->image('public/storage/images',640,480, null, false),
            'valid_id' => fake()->image('public/storage/images',640,480, null, false),
            'work_id' => fake()->image('public/storage/images',640,480, null, false),
            'residence_proof' => fake()->image('public/storage/images',640,480, null, false),
        ];
    }
}
