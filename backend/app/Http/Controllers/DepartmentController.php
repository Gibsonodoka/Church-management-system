<?php

namespace App\Http\Controllers;

use App\Models\Department;
use Illuminate\Http\Request;

class DepartmentController extends Controller
{
    // Get all departments
    public function index()
    {
        return response()->json(Department::all());
    }

    // Create a new department
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|unique:departments|string|max:255',
        ]);

        $department = Department::create([
            'name' => $request->name,
        ]);

        return response()->json($department, 201);
    }

    // Update a department
    public function update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        $request->validate([
            'name' => 'required|string|max:255|unique:departments,name,' . $id,
        ]);

        $department->update(['name' => $request->name]);

        return response()->json($department);
    }

    // Delete a department
    public function destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();

        return response()->json(['message' => 'Department deleted successfully']);
    }
}
