<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ChangeEmailToNullableInUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        try {
            DB::statement('ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NULL');
        } catch (Exception $e) {
            Log::error($e->getMessage());
        }
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        try {
            DB::statement('ALTER TABLE users MODIFY COLUMN email VARCHAR(255) NOT NULL');
        } catch (Exception $e) {
            Log::error($e->getMessage());
        }
    }
}
