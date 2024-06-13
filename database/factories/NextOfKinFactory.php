<?php

/** @var \Illuminate\Database\Eloquent\Factory $factory */

use App\Models\NextOfKin;
use App\User;
use Faker\Generator as Faker;

$factory->define(NextOfKin::class, function (Faker $faker) {
    return [
        'name' => $faker->name,
        'relationship' => $faker->word,
        'phone' => $faker->phoneNumber,
        'email' => $faker->email,
        'address' => $faker->address,
        'user_id' => factory(User::class)->create()->id,
    ];
});
