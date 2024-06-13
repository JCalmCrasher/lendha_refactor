<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateBusinessAssessmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('business_assessments', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->foreign('user_id')->references('id')->on('users');
            $table->double('sales', 11, 2)->nullable();
            $table->double('cost_of_sales', 11, 2)->nullable();
            $table->double('gross_profit', 11, 2)->nullable();
            $table->double('operational_expenses', 11, 2)->nullable();
            $table->double('net_profit', 11, 2)->nullable();
            $table->double('family_and_other_expenses', 11, 2)->nullable();
            $table->double('repayment_capacity', 11, 2)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('business_assessments');
    }
}
