import axios from "axios";
import { logout } from "../state/authSlice";
import { store } from "../state/store";

const API_BASE_URL = "http://localhost:8080";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Adiciona um interceptor para todas as requisições
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

// Adiciona um interceptor para todas as RESPOSTAS
api.interceptors.response.use(
  (response) => {
    // Se a resposta for bem-sucedida, apenas a retorna
    return response;
  },
  (error) => {
    // Verifica se o erro é de autenticação (token inválido, expirado ou usuário não encontrado)
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      console.log(
        "Token inválido ou usuário não encontrado. Fazendo logout automático."
      );

      // Remove o token inválido do localStorage
      localStorage.removeItem("jwt");

      // Despacha a ação de logout do Redux para limpar o estado
      store.dispatch(logout());
    }

    return Promise.reject(error);
  }
);

export default api;
