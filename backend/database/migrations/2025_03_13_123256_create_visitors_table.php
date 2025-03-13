<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
{
    Schema::create('visitors', function (Blueprint $table) {
        $table->id();
        $table->string('firstname');
        $table->string('lastname');
        $table->string('email')->nullable();
        $table->string('phone')->nullable();
        $table->date('dob')->nullable();
        $table->enum('gender', ['male', 'female', 'other'])->nullable();
        $table->string('address')->nullable();
        $table->boolean('want_to_be_member')->default(false);
        $table->boolean('would_like_visit')->default(false);
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('visitors');
    }
};
