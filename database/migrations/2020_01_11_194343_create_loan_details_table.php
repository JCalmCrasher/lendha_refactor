<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLoanDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('loan_details', function (Blueprint $table) {
            $table->id();
            $table->string('application_id');
            $table->double('amount', 9, 2);
            $table->double('approved_amount', 9, 2)->nullable();
            $table->dateTime('request_date');
            $table->dateTime('approval_date')->nullable();
            $table->string('purpose');
            $table->string('duration');
            $table->enum('status', ['pending', 'approved', 'denied', 'completed'])->default('pending');
            $table->bigInteger('user_id');
            $table->bigInteger('subadmin_id')->nullable();
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
        Schema::dropIfExists('loan_details');
    }
}
