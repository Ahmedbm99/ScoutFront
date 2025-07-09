import axios from "axios";

const createApi = () => {
  return axios.create({
    baseURL: `https://scoutback.onrender.com`,
    withCredentials: true,
  });
};

export default createApi;