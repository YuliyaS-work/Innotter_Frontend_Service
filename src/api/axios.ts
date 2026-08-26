import axios from 'axios';

export const apiUMS = axios.create({
//   baseURL: 'http://ums-service:8000/api',
  baseURL: 'http://localhost:8000',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});

export const apiInnotter = axios.create({
//   baseURL: 'http://innotter-service:8002/api',
  baseURL: 'http://localhost:8002',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' }
});