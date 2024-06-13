<?php

use App\Models\NextOfKin;
use Illuminate\Database\Seeder;

class NextOfKinSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        NextOfKin::factory()->count(5)->create();
    }
}
