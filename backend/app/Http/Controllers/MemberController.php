<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Validation\Rule;
use Exception;
use Carbon\Carbon; // Import Carbon

class MemberController extends Controller
{
    // Fetch all members
    public function index()
    {
        return response()->json(Member::all(), 200);
    }

    // Import function
    public function importMembers(Request $request) {
        try {
            $request->validate([
                '*.name' => 'required|string|max:255',
                '*.email' => 'required|email|unique:members,email',
                '*.phone' => 'required|string|max:15',
            ]);

            foreach ($request->all() as $memberData) {
                Member::create([
                    'name' => $memberData['name'],
                    'email' => $memberData['email'],
                    'phone' => $memberData['phone'],
                ]);
            }

            return response()->json(['message' => 'Import successful'], 200);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    // Store a new member
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'first_name' => 'required|string|max:255',
                'last_name' => 'required|string|max:255',
                'email' => 'required|email|unique:members,email',
                'phone' => 'required|string|max:15',
                'gender' => 'required|string',
                'dob' => 'required|date',
                'address' => 'nullable|string|max:255',
                'marital_status' => 'nullable|string|max:255',
                'baptized' => ['required', Rule::in(['Yes', 'No'])],
                'membership_class' => ['required', Rule::in(['Yes', 'No'])],
                'house_fellowship' => ['required', Rule::in(['Rumibekwe', 'Woji', 'Rumudara', 'None'])],
                'organization_belonged_to' => ['nullable', Rule::in(['Men', 'Women', 'Youth', 'Teens', 'Children'])],
                'current_team' => 'nullable|array',
                'current_team.*' => Rule::in(['Drama', 'Media', 'Technical', 'Visitation', 'Leadership', 'Pastoral', 'Sunday school', 'None']),
            ]);

            // Convert array to JSON if `current_team` exists
            if (isset($validatedData['current_team'])) {
                $validatedData['current_team'] = json_encode($validatedData['current_team']);
            }

            // Create the member
            $member = Member::create($validatedData);

            return response()->json([
                'message' => 'Member added successfully',
                'member' => $member
            ], 201);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    // Show a specific member
    public function show($id)
    {
        try {
            $member = Member::findOrFail($id);
            return response()->json($member, 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Member not found'], 404);
        }
    }

    // Update an existing member
    public function update(Request $request, $id)
    {
        try {
            $member = Member::findOrFail($id);

            $validatedData = $request->validate([
                'first_name' => 'sometimes|required|string|max:255',
                'last_name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|unique:members,email,' . $id,
                'phone' => 'sometimes|required|string|max:15',
                'gender' => 'sometimes|required|string',
                'dob' => 'sometimes|required|date',
                'address' => 'nullable|string|max:255',
                'marital_status' => 'nullable|string|max:255',
                'baptized' => ['sometimes', Rule::in(['Yes', 'No'])],
                'membership_class' => ['sometimes', Rule::in(['Yes', 'No'])],
                'house_fellowship' => ['sometimes', Rule::in(['Rumibekwe', 'Woji', 'Rumudara', 'None'])],
                'organization_belonged_to' => ['nullable', Rule::in(['Men', 'Women', 'Youth', 'Teens', 'Children'])],
                'current_team' => 'nullable|array',
                'current_team.*' => Rule::in(['Drama', 'Media', 'Technical', 'Visitation', 'Leadership', 'Pastoral', 'Sunday school', 'None']),
            ]);

            // Convert array to JSON if `current_team` exists
            if (isset($validatedData['current_team'])) {
                $validatedData['current_team'] = json_encode($validatedData['current_team']);
            }

            // Update the member
            $member->update($validatedData);

            return response()->json([
                'message' => 'Member updated successfully',
                'member' => $member
            ], 200);

        } catch (Exception $e) {
            return response()->json(['error' => $e->getMessage()], 400);
        }
    }

    // Delete a member
    public function destroy($id)
    {
        try {
            $member = Member::findOrFail($id);
            $member->delete();

            return response()->json(['message' => 'Member deleted successfully'], 200);
        } catch (Exception $e) {
            return response()->json(['error' => 'Member not found'], 404);
        }
    }

    public function getBirthdays()
{
    $birthdays = DB::table('members')
        ->select('id', 'first_name', 'last_name', 'dob')
        ->whereNotNull('dob') // Only fetch members with a date of birth
        ->get()
        ->map(function ($member) {
            // Extract day and month from the dob
            $dob = Carbon::parse($member->dob);
            return [
                'id' => $member->id,
                'name' => $member->first_name . ' ' . $member->last_name, // Concatenate first and last name
                'day' => $dob->day,
                'month' => $dob->month,
            ];
        });

    return response()->json($birthdays);
}
}