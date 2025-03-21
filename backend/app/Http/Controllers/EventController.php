<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    // Fetch all events
    public function index()
    {
        $events = Event::all();
        return response()->json($events);
    }

    // Create a new event
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
        ]);

        $event = Event::create($request->all());
        return response()->json($event, 201);
    }

    // Update an event
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start' => 'sometimes|required|date',
            'end' => 'sometimes|required|date|after_or_equal:start',
        ]);

        $event->update($request->all());
        return response()->json($event);
    }

    // Delete an event
    public function destroy($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();
        return response()->json(null, 204);
    }
}