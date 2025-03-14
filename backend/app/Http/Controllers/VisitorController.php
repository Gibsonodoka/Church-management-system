<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use Illuminate\Http\Request;

class VisitorController extends Controller
{
        public function recent()
    {
        // Fetch the 5 most recent visitors, ordered by creation date
        $recentVisitors = Visitor::orderBy('created_at', 'desc')->take(5)->get();

        // Return the data as JSON
        return response()->json($recentVisitors);
    }
    // Fetch all visitors
    public function index()
    {
        return response()->json(Visitor::all());
    }

    // Store a new visitor
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'required|string|max:20',
            'dob' => 'nullable|date',
           'gender' => 'required|string|in:M,F',
            'address' => 'nullable|string',
            'want_to_be_member' => 'required|boolean',
            'would_like_visit' => 'required|boolean',
        ]);

        $visitor = Visitor::create($validatedData);
        return response()->json($visitor, 201);
    }

    // Update an existing visitor
    public function update(Request $request, $id)
    {
        $visitor = Visitor::findOrFail($id);

        $validatedData = $request->validate([
            'firstname' => 'sometimes|string|max:255',
            'lastname' => 'sometimes|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'sometimes|string|max:20',
            'dob' => 'nullable|date',
            'gender' => 'sometimes|string|in:M,F',
            'address' => 'nullable|string',
            'want_to_be_member' => 'sometimes|boolean',
            'would_like_visit' => 'sometimes|boolean',
        ]);

        $visitor->update($validatedData);
        return response()->json($visitor);
    }

    // Delete a visitor
    public function destroy($id)
    {
        $visitor = Visitor::findOrFail($id);
        $visitor->delete();

        return response()->json(['message' => 'Visitor deleted successfully']);
    }
}
