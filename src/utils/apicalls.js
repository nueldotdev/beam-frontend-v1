// Base API URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://beam-backend-v1-so4m.onrender.com/api";

// Helper function to handle responses
const handleResponse = async (response) => {
  const data = await response.json();

  if (!response.ok) {
    const errorMessage =
      data.message || data.error || data.details || "Something went wrong";
    throw new Error(errorMessage);
  }

  return data;
};

// Auth API calls
export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleResponse(response);
};

export const login = async (credentials) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleResponse(response);
};

// Export all functions together
const authAPI = {
  register,
  login,
};

export default authAPI;
