import axios from 'axios'

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

export default api
