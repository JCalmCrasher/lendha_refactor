<?php

use App\Enums\RepaymentDurations;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddRepaymentDurationAndMoratariumToLoanInterestsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('loan_interests', function (Blueprint $table) {
            $table->string('repayment_duration')->default(RepaymentDurations::MONTHLY);
            $table->integer('moratorium')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('loan_interests', function (Blueprint $table) {
            $table->dropColumn('repayment_duration');
            $table->dropColumn('moratorium');
        });
    }
}
