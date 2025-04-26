// src/api.js
import axios from 'axios';

const instance = axios.create({
  baseURL: "http://localhost:5000", // Flask backend running on port 5000
});

export default instance;
