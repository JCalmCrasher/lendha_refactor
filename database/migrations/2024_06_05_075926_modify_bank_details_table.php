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
        Schema::table('bank_details', function (Blueprint $table) {
            $table->string('account_number')->nullable(true)->change();
            $table->string('account_name')->nullable(true)->change();
            $table->string('bank_name')->nullable(true)->change();
            $table->string('bvn')->nullable(true)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bank_details', function (Blueprint $table) {
            $table->string('account_number')->nullable(false)->change();
            $table->string('account_name')->nullable(false)->change();
            $table->string('bank_name')->nullable(false)->change();
            $table->string('bvn')->nullable(false)->change();
        });
    }
};
