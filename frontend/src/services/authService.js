import api from "../api/axios";

export const authService = {
  register: async (data) => {
    const response = await api.post("/auth/register", data);

    // Save token and user to localStorage
    const { access_token, user } = response.data.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data.data;
  },

  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);

    // Save token and user to localStorage
    const { access_token, user } = response.data.data;
    localStorage.setItem("token", access_token);
    localStorage.setItem("user", JSON.stringify(user));

    return response.data.data;
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  },

  // GET DATA USER YANG LOGIN
  me: async () => {
    const response = await api.get("/auth/me");
    const user = response.data.data;
    localStorage.setItem("user", JSON.stringify(user));
    return user;
  },

  // CHECK JIKA USER SUDAH LOGIN
  isAuthenticated: () => {
    return !!localStorage.getItem("token");
  },

  // GET DATA USER YANG LOGIN
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  },
};
