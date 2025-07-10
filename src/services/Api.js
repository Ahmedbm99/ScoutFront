import axios from "axios";

const createApi = () => {

   const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  return axios.create({
   
    baseURL: `https://scoutback.onrender.com`,
       headers: token
      ? {
          Authorization: `Bearer ${token}`,
        }
      : {},
  });
}; 

export default createApi;