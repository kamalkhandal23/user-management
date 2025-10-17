import axios from "axios";

const API = axios.create({
  baseURL: "https://user-management-m70o.onrender.com",
});

export default API;