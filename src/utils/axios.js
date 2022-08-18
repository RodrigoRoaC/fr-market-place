import axios from 'axios';

const client = axios.create({
  baseURL: process.env.REACT_APP_MARKET_PLACE_URL
});

export default client;
