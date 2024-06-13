<?php

use App\Enums\UserTransferStatus;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('user_transfers', function (Blueprint $table) {
            $table->tinyInteger('status')->default(UserTransferStatus::PENDING)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_transfers', function (Blueprint $table) {
            $table->boolean('status')->default(false)->change();
        });
    }
};
