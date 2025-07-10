// src/services/AuthenticationService.js
import Api from "./Api";

const AuthenticationService = {
  async login(credentials) {
    try {
      console.log("Attempting to log in with credentials:", credentials);

      const response = await Api().post("/api/login", credentials);

      // Suppose que le backend renvoie { token: "...", user: {...} }
      const { token, user } = response.data;

      // Stocker le token + user
      localStorage.setItem("user", JSON.stringify({ ...user, token }));

      return { ...user, token };
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async registerAdmin(credentials) {
    try {
      const response = await Api().post("/api/register", credentials);
      return response.data;
    } catch (error) {
      console.error("Admin registration failed:", error);
      throw error;
    }
  },

  async registerScout(credentials) {
    try {
      const response = await Api().post("/api/register-member", credentials);
      return response.data;
    } catch (error) {
      console.error("Scout registration failed:", error);
      throw error;
    }
  },

  getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  logout() {
    localStorage.removeItem("user");
  }
};

export default AuthenticationService;
