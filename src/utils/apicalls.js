// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

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

// Register
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

// Login
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

// Google OAuth URL
export const getGoogleAuthUrl = async () => {
  const response = await fetch(`${API_BASE_URL}/auth/google/url`);
  return handleResponse(response);
};

// Google callback
export const googleLogin = async (code) => {
  const response = await fetch(
    `${API_BASE_URL}/auth/google/callback?code=${code}`,
  );

  return handleResponse(response);
};

// send uploaded file link to meeting endpoint
export const uploadMeetingFile = async (meetingId, fileUrl) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/meetings/${meetingId}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ url: fileUrl }),
  });

  return handleResponse(response);
};

export default {
  register,
  login,
  getGoogleAuthUrl,
  googleLogin,
  uploadMeetingFile,
};
