<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up() {
        Schema::table('members', function (Blueprint $table) {
            $table->string('gender')->nullable();
            $table->string('address')->nullable();
            $table->string('marital_status')->nullable();
            $table->enum('baptized', ['Yes', 'No'])->default('No');
            $table->enum('membership_class', ['Yes', 'No'])->default('No');
            $table->enum('house_fellowship', ['Rumibekwe', 'Woji', 'Rumudara', 'None'])->default('None');
            $table->enum('organization_belonged_to', ['Men', 'Women', 'Youth', 'Teens', 'Children'])->nullable();
            $table->json('current_team')->nullable(); // Stores multiple checkbox values as JSON
        });
    }

    public function down() {
        Schema::table('members', function (Blueprint $table) {
            $table->dropColumn([
                'gender',
                'address',
                'marital_status',
                'baptized',
                'membership_class',
                'house_fellowship',
                'organization_belonged_to',
                'current_team',
            ]);
        });
    }
};
