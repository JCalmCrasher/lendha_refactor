<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddNewColumnsToNextOfKinTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('next_of_kin', function (Blueprint $table) {
            $table->string('business_type')->nullable();
            $table->string('business_address')->nullable();
            $table->string('guarantors_face_photo')->nullable();
            $table->string('id_card')->nullable();
            $table->string('proof_of_residence')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('next_of_kin', function (Blueprint $table) {
            $table->dropColumn('business_type');
            $table->dropColumn('business_address');
            $table->dropColumn('guarantors_face_photo');
            $table->dropColumn('id_card');
            $table->dropColumn('proof_of_residence');
        });
    }
}
