<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('visitors', function (Blueprint $table) {
            $table->id();
            $table->string('firstname');
            $table->string('lastname');
            $table->enum('gender', ['Male', 'Female', 'Other']);
            $table->string('email')->unique();
            $table->string('phone');
            $table->date('dob');
            $table->text('address');
            $table->string('invited_by')->nullable();
            $table->string('occupation')->nullable();
            $table->boolean('visit_request')->default(false);
            $table->boolean('membership_interest')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('visitors');
    }
};
