<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddMinAndMaxAmountToLoanInterestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('loan_interests', function (Blueprint $table) {
            $table->double('minimum_amount', 11, 2)->nullable();
            $table->double('maximum_amount', 11, 2)->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('loan_interests', function (Blueprint $table) {
            $table->dropColumn('minimum_amount');
            $table->dropColumn('maximum_amount');
        });
    }
}
