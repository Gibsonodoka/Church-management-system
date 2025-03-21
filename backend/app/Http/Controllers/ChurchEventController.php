<?php

namespace App\Http\Controllers;

use App\Models\ChurchEvent;
use Illuminate\Http\Request;

class ChurchEventController extends Controller
{
    // Fetch all church events
    public function index()
    {
        $events = ChurchEvent::all();
        return response()->json($events);
    }

    // Create a new church event
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start' => 'required|date',
            'end' => 'required|date|after_or_equal:start',
            'location' => 'nullable|string',
            'organizer' => 'nullable|string',
            'type' => 'nullable|string',
        ]);

        $event = ChurchEvent::create($request->all());
        return response()->json($event, 201);
    }

    // Update a church event
    public function update(Request $request, $id)
    {
        $event = ChurchEvent::findOrFail($id);

        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'start' => 'sometimes|required|date',
            'end' => 'sometimes|required|date|after_or_equal:start',
            'location' => 'nullable|string',
            'organizer' => 'nullable|string',
            'type' => 'nullable|string',
        ]);

        $event->update($request->all());
        return response()->json($event);
    }

    // Delete a church event
    public function destroy($id)
    {
        $event = ChurchEvent::findOrFail($id);
        $event->delete();
        return response()->json(null, 204);
    }
}