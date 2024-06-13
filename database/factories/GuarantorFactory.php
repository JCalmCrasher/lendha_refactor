<?php

namespace Database\Factories;

use App\Models\Guarantor;
use Faker\Generator as Faker;

$factory->define(Guarantor::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'phone' => $faker->phoneNumber,
        'address' => $faker->address,
        'relationship' => $faker->word,
        'user_id' => $faker->numberBetween(1, 10),
    ];
});
