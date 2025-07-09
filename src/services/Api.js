import axios from "axios";

const createApi = () => {
  return axios.create({
    baseURL: `http://localhost:5000`,
    withCredentials: true,
  });
};

export default createApi;