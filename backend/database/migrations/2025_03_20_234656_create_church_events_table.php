<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateChurchEventsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('church_events', function (Blueprint $table) {
            $table->id(); // Auto-incrementing primary key
            $table->string('title'); // Event title
            $table->text('description')->nullable(); // Event description (optional)
            $table->dateTime('start'); // Event start date and time
            $table->dateTime('end'); // Event end date and time
            $table->string('location')->nullable(); // Event location
            $table->string('organizer')->nullable(); // Event organizer
            $table->string('type')->default('church'); // Event type (e.g., church, community)
            $table->timestamps(); // Created at and updated at timestamps
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('church_events'); // Drop the table if the migration is rolled back
    }
}
