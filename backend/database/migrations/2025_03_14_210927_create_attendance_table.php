<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->string('month');
            $table->string('service_description');
            $table->integer('men')->default(0);
            $table->integer('women')->default(0);
            $table->integer('youth')->default(0);
            $table->integer('teens')->default(0);
            $table->integer('children')->default(0);
            $table->integer('total')->default(0);
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('attendances');
    }
};
