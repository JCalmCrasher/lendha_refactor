<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTeamLeadApprovalColumnToLoans extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('loan_details', function (Blueprint $table) {
            $table->boolean('team_lead_approval')->default(false)->after('status');
            $table->text('team_lead_denial_reason')->nullable()->after('team_lead_approval');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('loan_details', function (Blueprint $table) {
            $table->dropColumn('team_lead_approval');
            $table->dropColumn('team_lead_denial_reason');
        });
    }
}
