// src/context/AuthContext.js
import { createContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Configure axios defaults
  axios.defaults.baseURL = "https://info6150-finalproject.onrender.com/api";

  // Set up axios interceptor to ensure JWT is included in all requests
  useEffect(() => {
    const interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Cleanup function to eject the interceptor when the component unmounts
    return () => {
      axios.interceptors.request.eject(interceptor);
    };
  }, [token]);

  // Set token in axios headers if it exists
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user from token on mount or token change
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true); // Ensure loading is true at the start

      if (token) {
        try {
          // Verify token isn't expired
          const decoded = jwtDecode(token);
          const currentTime = Date.now() / 1000;

          if (decoded.exp < currentTime) {
            // Token expired
            localStorage.removeItem("token");
            setToken(null);
            setCurrentUser(null);
            setError("Session expired, please login again");
          } else {
            // Token valid, fetch user profile
            const res = await axios.get("/users/profile");
            setCurrentUser(res.data);
          }
        } catch (err) {
          // Invalid token or request failed
          console.error("Auth error:", err);
          localStorage.removeItem("token");
          setToken(null);
          setCurrentUser(null);
          setError("Authentication error, please login again");
        }
      }

      // Use a small delay to prevent UI flashing
      setTimeout(() => {
        setLoading(false);
      }, 300);
    };

    loadUser();
  }, [token]);

  // Login function
  const login = async (loginData) => {
    setError(null);
    setLoading(true); // Set loading while logging in
    try {
      const res = await axios.post("/users/login", loginData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      // Let the loading state continue until the token effect loads the user
      return true;
    } catch (err) {
      // Set the error message
      setError(err.response?.data?.message || "Login failed");
      // Immediately set loading to false on error
      setLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (userData) => {
    setError(null);
    setLoading(true); // Set loading while registering
    try {
      const res = await axios.post("/users/register", userData);
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setLoading(false); // Stop loading if registration fails
      return false;
    }
  };

  // Logout function
  const logout = (callback) => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      setToken(null);
      setCurrentUser(null);
      setLoading(false);

      // Execute callback if provided
      if (typeof callback === "function") {
        callback();
      }
    }, 100);
  };

  const isTokenValid = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
      const decoded = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      return decoded.exp > currentTime;
    } catch (error) {
      return false;
    }
  };

  // Update user profile
  const updateProfile = async (field, value) => {
    setLoading(true); // Set loading while updating profile
    try {
      await axios.put(`/users/profile/${field}`, { [field]: value });
      // Refresh user data
      const res = await axios.get("/users/profile");
      setCurrentUser(res.data);
      setLoading(false);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || `Failed to update ${field}`);
      setLoading(false);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        error,
        login,
        register,
        logout,
        isTokenValid,
        updateProfile,
        setError,
        isAuthenticated: !!currentUser,
        isAdmin: currentUser?.role === "admin",
        isOrganizer: currentUser?.role === "organizer",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
