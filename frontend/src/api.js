import axios from "axios";

const API = axios.create({
  baseURL: "https://worthy-tranquility-production-0c1d.up.railway.app/api",
});

export default API;