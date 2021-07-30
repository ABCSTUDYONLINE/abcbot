import camelcaseKeys from "camelcase-keys";
import TOKEN from './token'

const setup = (instance) => {
  instance.interceptors.request.use(
    function (config) {
      // const token = localStorage.getItem("token");
      const token = TOKEN;
      if (token) {
        config.headers.authorization = `Bearer ${token}`;
      }
      return config;
    },
    function (err) {
      return Promise.reject(err);
    }
  );
};
  
const checkToken = (instance) => {
  instance.interceptors.response.use(
    (response) => {
      if (response.headers["content-type"].startsWith("application/json")) {
        response.data = camelcaseKeys(response.data, { deep: true });
      }
      return response;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
}
  
// checkError
const checkError = instance => {
  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      const responseStatus = error.response.status
      if ([404, 500].includes(responseStatus)) {
        // window.location.replace('/admin/error')
      }
      return Promise.reject(error);
    }
  );
}

export default {
    setup,
    checkToken,
    checkError,
}



