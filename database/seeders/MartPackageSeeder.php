<?php

namespace Database\Seeders;

use App\Models\MartPackages;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class MartPackageSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        MartPackages::firstOrCreate([
            'name' => '5k Mart',
            'price' => 5000.00,
            'duration' => 1
        ]);

        MartPackages::firstOrCreate([
            'name' => '10k Mart',
            'price' => 10000.00,
            'duration' => 1
        ]);

        MartPackages::firstOrCreate([
            'name' => '15k Mart',
            'price' => 15000.00,
            'duration' => 2
        ]);

        MartPackages::firstOrCreate([
            'name' => '20k Mart',
            'price' => 20000.00,
            'duration' => 2
        ]);
    }
}
