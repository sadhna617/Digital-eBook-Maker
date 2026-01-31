import axios from "axios";

const authApi = axios.create({
  baseURL: "http://localhost:5261/api/auth",
});

export default authApi;
