import axios from "axios";

const HTTP = axios.create({
  baseURL: "http://localhost:3333",
});

HTTP.interceptors.request.use(
  (config) => config,
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export { HTTP };