import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://rent-api.br-soft.online',
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