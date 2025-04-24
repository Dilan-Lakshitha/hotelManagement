import { jwtDecode } from 'jwt-decode';

export const getDecodedToken = () => {
  const token = localStorage.getItem('authToken');
  console.error('token:', token);
  if (!token) return null;

  try {
    return jwtDecode(token);
  } catch (error) {
    console.error('Invalid token:', error);
    return null;
  }
};
