import { createContext } from "react";
import { useState } from "react";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  const [sessionData, setSessionData] = useState(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (token && user) {
      return {
        user: JSON.parse(user),
        token: JSON.parse(token),
      };
    }
  });

  function setUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
    setSessionData((currSessionData) => ({ ...currSessionData, user }));
  }

  function setToken(token) {
    localStorage.setItem("token", JSON.stringify(token));
    setSessionData((currSessionData) => ({ ...currSessionData, token }));
  }

  function createSessionData({ user, token }) {
    if (!(sessionData && sessionData.token && sessionData.user)) {
      return;
    }
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", JSON.stringify(token));
    setSessionData(sessionData);
  }

  function logoff() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setSessionData({});
  }

  return (
    <AuthContext.Provider
      value={{ sessionData, createSessionData, setUser, setToken, logoff }}
    >
      {children}
    </AuthContext.Provider>
  );
};
