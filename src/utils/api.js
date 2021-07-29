import axios from "axios";

const API = axios.create({
  baseURL: 'https://abcstudyonline.herokuapp.com',
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export default API;