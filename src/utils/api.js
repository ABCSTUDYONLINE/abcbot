import axios from "axios";
import interceptors from './interceptors';

const API = axios.create({
  baseURL: 'https://abcstudyonline.herokuapp.com',
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

interceptors.setup(API);
interceptors.checkToken(API);
interceptors.checkError(API);

export default API;