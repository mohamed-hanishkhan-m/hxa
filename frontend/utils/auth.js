// utils/auth.js
import { jwtDecode } from "jwt-decode";

export const getToken = () => {
    if (typeof window === 'undefined') return null;
  
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      const decoded = jwtDecode(token); // 👈 use jwtDecode, not jwt_decode
      const now = Date.now() / 1000;
  
      console.log("Decoded Token Exp:", decoded.exp, "Current Time:", now);
  
      if (decoded.exp && decoded.exp < now) {
        localStorage.removeItem("token");
        return null;
      }
  
      return token;
    } catch (err) {
      localStorage.removeItem("token");
      return null;
    }
  };
  

// export const logout = () => {
//     localStorage.removeItem("token");
//     window.location.href = "/login";
// };