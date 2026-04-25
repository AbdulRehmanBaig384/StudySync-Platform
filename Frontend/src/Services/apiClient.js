const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

const getToken = () => sessionStorage.getItem("token");

export const postAiChat = async (message) => {
  const token = getToken();

  const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "AI request failed");
  }

  return data;
};

export const postUserLogin = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Login failed");
  }

  return data;
};

export const postUserSignup = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Signup failed");
  }

  return data;
};

export const completeUserProfile = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/api/users/complete-profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Profile completion failed");
  }

  return data;
};

export const getBackendBaseUrl = () => API_BASE_URL;
