import axios from "axios";

const USERNAME_SERVICE_URL =
  process.env.USERNAME_SERVICE_URL || "http://localhost:3001";

export const checkUsername = async (username: string): Promise<boolean> => {
  try {
    const response = await axios.get(
      `${USERNAME_SERVICE_URL}/check/${username}`
    );
    return response.data.exists;
  } catch (error) {
    console.error("Error checking username:", error);
    throw new Error("Failed to check username availability");
  }
};

export const registerUsername = async (
  username: string,
  userId: number
): Promise<boolean> => {
  try {
    const response = await axios.post(`${USERNAME_SERVICE_URL}/register`, {
      username,
      userId,
    });
    return response.data.success;
  } catch (error) {
    console.error("Error registering username:", error);
    throw new Error("Failed to register username");
  }
};

export const suggestUsernames = async (
  baseUsername: string
): Promise<string[]> => {
  try {
    const response = await axios.get(
      `${USERNAME_SERVICE_URL}/suggest/${baseUsername}`
    );
    return response.data.suggestions;
  } catch (error) {
    console.error("Error getting username suggestions:", error);
    throw new Error("Failed to get username suggestions");
  }
};
