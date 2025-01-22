import axios from "axios";

const BASE_URL = "http://localhost:8080/api/v1/iptables";

export const fetchServerFarms = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching server farms:", error);
    throw error;
  }
};

export const fetchFarmDetails = async (farm) => {
  try {
    const response = await axios.get(`${BASE_URL}/list/${farm}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching farm details:", error);
    throw error;
  }
};

export const addFarm = async (farmData) => {
  try {
    const response = await axios.post(`${BASE_URL}/add`, farmData);
    return response.data;
  } catch (error) {
    console.error("Error adding farm:", error);
    throw error;
  }
};

export const updateFarm = async (farmData) => {
  try {
    const response = await axios.post(`${BASE_URL}/update`, farmData);
    return response.data;
  } catch (error) {
    console.error("Error updating farm:", error);
    throw error;
  }
};

export const deleteFarm = async (farm) => {
  try {
    const response = await axios.post(`${BASE_URL}/delete/${farm}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting farm:", error);
    throw error;
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/health`);
    return response;
  } catch (error) {
    console.error("Error checking health:", error);
    throw error;
  }
};
