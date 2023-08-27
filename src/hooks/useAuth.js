import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      setIsLoggedIn(true);
    }
    const timer = setInterval(() => {
      console.log('timer running');
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken && isLoggedIn) {
        setIsLoggedIn(false);
      }
    }, 500);

    return () => clearInterval(timer);

  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
