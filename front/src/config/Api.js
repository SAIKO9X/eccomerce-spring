import axios from "axios";

const API_BASE_URL = "/";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Interceptor de Requisição
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor de Resposta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log("Sessão inválida ou expirada. Deslogando...");

      localStorage.removeItem("jwt");
      localStorage.removeItem("role");

      const publicPaths = [
        "/login",
        "/register",
        "/become-seller",
        "/become-seller/login",
      ];
      if (!publicPaths.includes(window.location.pathname)) {
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);
