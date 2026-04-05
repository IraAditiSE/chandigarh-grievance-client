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
  trackByPhone: async (phone) => {
    try {
      const response = await apiClient.get(`/grievances/citizen/${phone}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching grievance history:", error);
      throw error;
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