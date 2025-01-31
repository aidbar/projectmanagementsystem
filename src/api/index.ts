import axios from 'axios'
import { error } from 'console'

const PUBLIC_ROUTES: string[] = [
  '/',
  '*',
  '/Authenticate/login',
  '/Users',
]

const isDevelopment = import.meta.env.MODE === 'development'
let baseURL = 'http://localhost:5140/api/v1/'

if (!isDevelopment) {
  baseURL = 'https://integrifyfullstackproject.azurewebsites.net/api/v1/'
}

const api = axios.create({
  baseURL, 
  headers: {
    'Content-Type': 'application/json'//,
    //Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  withCredentials: true
})

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers['Authorization'] = 'Bearer ' + token;
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem('refreshToken');
      const accessToken = localStorage.getItem('accessToken');
      return new Promise(function (resolve, reject) {
        axios.post('/Authenticate/refresh', { refreshToken: refreshToken, accessToken: accessToken })
          .then(({ data }) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('refreshToken', data.refreshToken);
            api.defaults.headers.common['Authorization'] = 'Bearer ' + data.accessToken;
            originalRequest.headers['Authorization'] = 'Bearer ' + data.accessToken;
            processQueue(null, data.accessToken);
            resolve(axios(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ROUTES.includes(config.url || "")

  if (isPublic) {
    return config
  }

  const token = localStorage.getItem('accessToken')

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

export default api
