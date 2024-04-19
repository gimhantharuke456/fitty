import axios from "axios";

const API_URL = "http://localhost:8080/meal-plans";

class MealPlanService {
  // Get all meal plans
  async getAllMealPlans() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Error fetching meal plans:", error);
      throw error;
    }
  }

  // Get meal plan by ID
  async getMealPlanById(id) {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching meal plan with ID ${id}:`, error);
      throw error;
    }
  }

  // Create a new meal plan
  async createMealPlan(mealPlan) {
    try {
      const response = await axios.post(API_URL, mealPlan);
      return response.data;
    } catch (error) {
      console.error("Error creating meal plan:", error);
      throw error;
    }
  }

  // Update an existing meal plan
  async updateMealPlan(id, mealPlan) {
    try {
      const response = await axios.put(`${API_URL}/${id}`, mealPlan);
      return response.data;
    } catch (error) {
      console.error(`Error updating meal plan with ID ${id}:`, error);
      throw error;
    }
  }

  // Delete a meal plan
  async deleteMealPlan(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting meal plan with ID ${id}:`, error);
      throw error;
    }
  }
}

export default new MealPlanService();
