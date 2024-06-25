import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5050',
});

// Интерсептор запроса для добавления токена к заголовкам
instance.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

export default instance;