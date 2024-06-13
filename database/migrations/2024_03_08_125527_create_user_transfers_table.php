<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('user_transfers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('team_lead_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('old_officer_id')->constrained('branches')->onDelete('cascade');
            $table->foreignId('new_officer_id')->constrained('branches')->onDelete('cascade');
            $table->string('transfer_reason')->nullable();
            $table->boolean('status')->default(false);
            $table->string('denial_reason')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('user_transfers');
    }
};
