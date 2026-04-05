import apiClient from './apiClient';

export const locationApi = {
  // Fetches the flat alphabetical list of all localities
  getAllLocalities: async () => {
    try {
      const response = await apiClient.get('/wards/localities');
      return response.data;
    } catch (error) {
      console.error("Error fetching localities:", error);
      throw error;
    }
  },

  // Fetches the full directory (useful for the Admin side later)
  getAllWards: async () => {
    try {
      const response = await apiClient.get('/wards');
      return response.data;
    } catch (error) {
      console.error("Error fetching wards:", error);
      throw error;
    }
  }
};