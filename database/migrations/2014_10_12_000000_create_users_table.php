<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('phone_number')->nullable();
            $table->boolean('phone_verified')->default(false);
            $table->date('date_of_birth')->nullable();
            $table->string('state_of_residence')->nullable();
            $table->enum('gender', ['male', 'female'])->nullable();
            $table->string('address')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');

            $table->bigInteger('user_type_id')->default(1);

            $table->string('firebase_web_device_key')->nullable();

            $table->timestamp('password_changed_at')->nullable();
            $table->boolean('terms_accepted')->default(true);

            $table->boolean('suspended')->default(false);
            $table->boolean('locked')->nullable()->default(false);

            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
