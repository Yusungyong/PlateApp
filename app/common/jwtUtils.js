import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
  if (!token) return true;
  try {
    const decoded = jwtDecode(token);
    if (!decoded.exp) return true;
    return Date.now() / 1000 > decoded.exp;
  } catch (e) {
    return true;
  }
};
