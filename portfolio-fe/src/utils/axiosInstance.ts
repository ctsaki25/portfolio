import axios, { AxiosInstance } from "axios";

export const useAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL:
      (/^\d+$/.test(window.location.host.split(".")[0])
        ? import.meta.env.BACKEND_URL.replace(
            "://",
            `://${window.location.host.split(".")[0]}.`
          )
        : import.meta.env.BACKEND_URL) + "/api/v1",
    headers: {
      "Content-Type": "application/json",
    },
  });
  instance.interceptors.response.use((response) => response);

  return instance;
};
