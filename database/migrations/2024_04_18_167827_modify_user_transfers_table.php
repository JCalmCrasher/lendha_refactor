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
        Schema::table('user_transfers', function (Blueprint $table) {
            $table->dropForeign('user_transfers_old_officer_id_foreign');
            $table->dropForeign('user_transfers_new_officer_id_foreign');

            $table->foreign('old_officer_id')->references('id')->on('users');
            $table->foreign('new_officer_id')->references('id')->on('users');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('user_transfers', function (Blueprint $table) {
            $table->dropForeign('user_transfers_old_officer_id_foreign');
            $table->dropForeign('user_transfers_new_officer_id_foreign');

            $table->foreign('old_officer_id')->references('id')->on('branches');
            $table->foreign('new_officer_id')->references('id')->on('branches');
        });
    }
};
