<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the attendance records.
     */
    public function index()
    {
        return response()->json(Attendance::all());
    }

    /**
     * Store a newly created attendance record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'month' => 'required|string',
            'service_description' => 'required|string',
            'men' => 'required|integer|min:0',
            'women' => 'required|integer|min:0',
            'youth' => 'required|integer|min:0',
            'teens' => 'required|integer|min:0',
            'children' => 'required|integer|min:0',
            'total' => 'required|integer|min:0',
        ]);

        $attendance = Attendance::create($validated);
        return response()->json($attendance, 201);
    }

    /**
     * Show the specified attendance record.
     */
    public function show($id)
    {
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        return response()->json($attendance);
    }

    /**
     * Update the specified attendance record.
     */
    public function update(Request $request, $id)
    {
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $validated = $request->validate([
            'date' => 'sometimes|date',
            'month' => 'sometimes|string',
            'service_description' => 'sometimes|string',
            'men' => 'sometimes|integer|min:0',
            'women' => 'sometimes|integer|min:0',
            'youth' => 'sometimes|integer|min:0',
            'teens' => 'sometimes|integer|min:0',
            'children' => 'sometimes|integer|min:0',
            'total' => 'sometimes|integer|min:0',
        ]);

        $attendance->update($validated);
        return response()->json($attendance);
    }

    /**
     * Remove the specified attendance record.
     */
    public function destroy($id)
    {
        $attendance = Attendance::find($id);

        if (!$attendance) {
            return response()->json(['message' => 'Record not found'], 404);
        }

        $attendance->delete();
        return response()->json(['message' => 'Record deleted successfully']);
    }

    /**
 * Fetch member growth data (new members added per month).
 */
public function getMemberGrowth()
{
    $memberGrowth = DB::table('attendances')
        ->selectRaw('DATE_FORMAT(date, "%Y-%m") as month, SUM(men + women + youth + teens + children) as total_attendance')
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    return response()->json($memberGrowth);
}

/**
 * Fetch demographics data (men, women, youths, teens, children per month).
 */
public function getDemographics()
{
    $demographics = DB::table('attendances')
        ->selectRaw('DATE_FORMAT(date, "%Y-%m") as month, 
                     SUM(men) as men, 
                     SUM(women) as women, 
                     SUM(youth) as youths, 
                     SUM(teens) as teens, 
                     SUM(children) as children')
        ->groupBy('month')
        ->orderBy('month')
        ->get();

    return response()->json($demographics);
}
}
