<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoanPaymentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loan_payments', function (Blueprint $table) {
            $table->id();
            $table->float('intended_payment', 10, 3)->nullable()->default(0.00);
            $table->float('user_payment', 10, 3)->nullable()->default(0.00);
            $table->bigInteger('loan_details_id');
            $table->double('penalty', 10, 2)->default(0);
            $table->dateTime('due_date')->nullable()->default(null);
            $table->string('status')->default('incomplete');
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
        Schema::dropIfExists('loan_payments');
    }
}
