import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

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

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log("Sessão inválida ou erro de permissão.");

      // Limpa os dados de login, pois o token é inválido
      localStorage.removeItem("jwt");
      localStorage.removeItem("role");

      const currentPath = window.location.pathname;

      const isProtectedRoute =
        currentPath.startsWith("/account") ||
        currentPath.startsWith("/seller") ||
        currentPath.startsWith("/admin");

      if (isProtectedRoute) {
        console.log(
          `Redirecionando de rota protegida '${currentPath}' para /login.`
        );
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);
