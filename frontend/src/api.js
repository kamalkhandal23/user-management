import axios from "axios";

const API = axios.create({
  baseURL: "https://user-management-backend.onrender.com"
});

export default API;
