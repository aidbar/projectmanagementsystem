import axios from 'axios'
import { error } from 'console'

const PUBLIC_ROUTES: string[] = [
  '/',
  '*',
  '/v1/Authenticate/login',
  '/v1/Users',
]

const isDevelopment = import.meta.env.MODE === 'development'
let baseURL = 'http://localhost:5140/api/'

if (!isDevelopment) {
  baseURL = 'https://integrifyfullstackproject.azurewebsites.net/api/'
}

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'//,
    //Authorization: `Bearer ${localStorage.getItem('token')}`
  },
  withCredentials: true
})

// use this to handle errors gracefully
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response.status === 500) {
//       throw new Error(error.response.data)
//     }
//   }
// )

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
