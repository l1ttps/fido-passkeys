import axios from "axios";
const BASE_URL = "http://localhost:3000";
/**
 * Create axios instance and interceptor
 * Ref: https://axios-http.com/docs/instance
 */

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  }
);

export default api;
