// Base API URL
const API_BASE_URL = import.meta.env.VITE_API_URL;

// Helper function to handle responses
/**
 * Converts api response to json and checks if response is valid.
 * If it is not valid it throws an error with message from the response, otherwise it returns the data.
 * @param {*} response 
 * @returns data if response is ok, otherwise throws an error with message from response
 */
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
/**
 * Registers a new user with the provided data.
 * @param {*} userData 
 * @returns result from `handleResponse` function
 */
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
    `${API_BASE_URL}/auth/google/callback`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    }
  );

  return handleResponse(response);
};

// send uploaded file link to meeting endpoint
export const uploadMeetingFile = async (meetingId, fileUrl) => {
  const token = localStorage.getItem('authToken');
  // Back-end stores document metadata in `/documents`.
  const response = await fetch(`${API_BASE_URL}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      meetingCode: meetingId, // meetingId in UI is a meeting code
      filename: fileUrl.split('/').pop() || 'document',
      fileType: 'pdf',
      fileUrl,
      size: null,
      pageCount: null,
      slides: [],
    }),
  });

  return handleResponse(response);
};

export const listMeetingDocuments = async (meetingId) => {
  const token = localStorage.getItem('authToken');
  const url = new URL(`${API_BASE_URL}/documents`);
  url.searchParams.set('meetingCode', meetingId);
  const response = await fetch(url.toString(), {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return handleResponse(response);
};

export const askMeetingAi = async (meetingKey, question) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/meetings/${encodeURIComponent(meetingKey)}/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ question }),
  });
  return handleResponse(response);
};

export const addMeetingTranscript = async (meetingKey, { speakerName, content, isFinal }) => {
  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_BASE_URL}/meetings/${encodeURIComponent(meetingKey)}/transcripts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ speakerName, content, isFinal }),
  });
  return handleResponse(response);
};

export default {
  register,
  login,
  getGoogleAuthUrl,
  googleLogin,
  uploadMeetingFile,
  listMeetingDocuments,
  askMeetingAi,
  addMeetingTranscript,
};
