import axios from "axios";

const API_BASE_URL = "http://localhost:3001";

export interface UsernameCheckResponse {
  username: string;
  available: boolean;
  cached: boolean;
}

export interface RegisterResponse {
  success: boolean;
  username: string;
  message: string;
}

export interface SuggestionResponse {
  baseUsername: string;
  suggestions: string[];
}

export interface HealthResponse {
  status: string;
  service: string;
}

export const checkUsernameAvailability = async (
  username: string
): Promise<UsernameCheckResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/check/${username}`);
    return response.data;
  } catch (error) {
    throw new Error("Error checking username availability");
  }
};

export const registerUsername = async (
  username: string,
  userId: string
): Promise<RegisterResponse> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      username,
      userId,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || "Error registering username"
    );
  }
};

export const getUsernameSuggestions = async (
  username: string,
  count: number = 5
): Promise<SuggestionResponse> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/suggest/${username}?count=${count}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Error getting username suggestions");
  }
};

export const fetchHealthStatus = async (): Promise<HealthResponse> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/health`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching health status");
  }
};
