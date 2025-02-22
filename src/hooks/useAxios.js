import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-app-server-bay.vercel.app",
});

export default function useAxios() {
  return api;
}
