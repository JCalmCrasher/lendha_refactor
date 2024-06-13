<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Schema;

class ModifyAmountLengthForLoanDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        try {
            DB::statement('ALTER TABLE loan_details MODIFY COLUMN amount DOUBLE(11, 2)');
            DB::statement('ALTER TABLE loan_details MODIFY COLUMN approved_amount DOUBLE(11, 2)');
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
            DB::statement('ALTER TABLE loan_details MODIFY COLUMN amount DOUBLE(9, 2)');
            DB::statement('ALTER TABLE loan_details MODIFY COLUMN approved_amount DOUBLE(9, 2)');
        } catch (Exception $e) {
            Log::error($e->getMessage());
        }
    }
}
