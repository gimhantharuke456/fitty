import axios from "axios";

const API_URL = "http://localhost:8080/workout-plans";

class WorkoutPlanService {
  // Get all workout plans
  async getAllWorkoutPlans() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching workout plans:", error);
      throw error;
    }
  }

  // Get workout plan by ID
  async getWorkoutPlanById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching workout plan with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new workout plan
  async createWorkoutPlan(workoutPlan) {
    try {
      const response = await axios.post(API_URL, workoutPlan);
      return response.data;
    } catch (error) {
      console.error("Error creating workout plan:", error);
      throw error;
    }
  }

  // Update an existing workout plan
  async updateWorkoutPlan(id, workoutPlan) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, workoutPlan);
      return response.data;
    } catch (error) {
      console.error(`Error updating workout plan with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a workout plan
  async deleteWorkoutPlan(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting workout plan with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new WorkoutPlanService();
