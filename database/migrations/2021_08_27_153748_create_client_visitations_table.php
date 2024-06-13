<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateClientVisitationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('client_visitations', function (Blueprint $table) {
            $table->id();
            $table->string('first_name')->nullable();
            $table->string('last_name')->nullable();
            $table->string('email')->unique();
            $table->string('phone_number')->nullable();
            
            $table->string('employment_type')->nullable();
            $table->string('business_name')->nullable();
            $table->string('business_address')->nullable();
            $table->string('business_image')->nullable();
            $table->string('business_description')->nullable();
            $table->string('business_directions')->nullable();
            $table->date('business_visitation_date')->nullable();
            
            $table->string('residence_state')->nullable();
            $table->string('residence_address')->nullable();
            $table->string('residence_outside_image')->nullable();
            $table->string('residence_utility_bill_image')->nullable();
            $table->string('residence_directions')->nullable();
            $table->string('residence_inside_image')->nullable();
            $table->date('residence_visitation_date')->nullable();
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
        Schema::dropIfExists('client_visitations');
    }
}
