<?php

namespace App\Http\Controllers;

use App\Models\Visitor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class VisitorController extends Controller
{
    // List all visitors
    public function index() {
        return response()->json(Visitor::all());
    }

    // Store new visitor
    public function store(Request $request) {
        $validator = Validator::make($request->all(), [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'gender' => 'required|in:Male,Female,Other',
            'email' => 'required|email|unique:visitors,email',
            'phone' => 'required|string|max:15',
            'dob' => 'required|date',
            'address' => 'required|string',
            'invited_by' => 'nullable|string',
            'occupation' => 'nullable|string',
            'visit_request' => 'boolean',
            'membership_interest' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $visitor = Visitor::create($request->all());
        return response()->json($visitor, 201);
    }

    // Show a specific visitor
    public function show($id) {
        $visitor = Visitor::find($id);
        return $visitor ? response()->json($visitor) : response()->json(['message' => 'Visitor not found'], 404);
    }

    // Update visitor details
    public function update(Request $request, $id) {
        $visitor = Visitor::find($id);
        if (!$visitor) {
            return response()->json(['message' => 'Visitor not found'], 404);
        }

        $visitor->update($request->all());
        return response()->json($visitor);
    }

    // Delete a visitor
    public function destroy($id) {
        $visitor = Visitor::find($id);
        if (!$visitor) {
            return response()->json(['message' => 'Visitor not found'], 404);
        }

        $visitor->delete();
        return response()->json(['message' => 'Visitor deleted successfully']);
    }
}
