import apiClient from './apiClient';

export const grievanceApi = {
  // Submits a new ticket
  submitGrievance: async (grievanceData) => {
    try {
      const response = await apiClient.post('/grievances', grievanceData);
      return response.data;
    } catch (error) {
      console.error("Error submitting grievance:", error);
      throw error;
    }
  },

  // Fetches a citizen's history using their phone number
  // Replaces trackByPhone
  trackByCredentials: async (email, password) => {
    try {
      const response = await apiClient.post('/grievances/track', { email, password });
      return response.data;
    } catch (error) {
      console.error("Error tracking grievance:", error);
      throw error;
    }
  },

  // New Admin Login Method
  adminLogin: async (wardNumber, email, password) => {
    try {
      const response = await apiClient.post('/wards/login', { wardNumber, email, password });
      return response.data; // Will return success if valid
    } catch (error) {
      throw new Error("Invalid credentials");
    }
  },

  // Fetches tickets for a specific Ward Councillor's dashboard
  getByWard: async (wardNumber) => {
    try {
      const response = await apiClient.get(`/grievances/ward/${wardNumber}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching grievances for ward ${wardNumber}:`, error);
      throw error;
    }
  },

  // Updates the status of a specific ticket (Admin only)
  updateStatus: async (id, newStatus) => {
    try {
      const response = await apiClient.patch(`/grievances/${id}/status`, { status: newStatus });
      return response.data;
    } catch (error) {
      console.error(`Error updating status for ${id}:`, error);
      throw error;
    }
  }
};