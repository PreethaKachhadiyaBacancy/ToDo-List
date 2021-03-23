import axios from 'axios';

export const Service = axios.create({
  baseURL: `https://to-do-list-72aeb-default-rtdb.firebaseio.com/todo`
})