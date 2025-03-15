import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/departments"; // Adjust if needed

// Fetch all departments
export const getDepartments = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error);
    return [];
  }
};

// Create a new department
export const createDepartment = async (name) => {
  try {
    const response = await axios.post(API_URL, { name });
    return response.data;
  } catch (error) {
    console.error("Error creating department:", error);
    return null;
  }
};

// Delete a department
export const deleteDepartment = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  } catch (error) {
    console.error("Error deleting department:", error);
    return false;
  }
};

// Update a department
export const updateDepartment = async (id, name) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, { name });
    return response.data;
  } catch (error) {
    console.error("Error updating department:", error);
    return null;
  }
};
