import axios from "axios";
import { URL_PROD } from "../helpers/constants";

const apiClient = axios.create({
  baseURL: URL_PROD, // URL base para tu mock o futuro backend
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
