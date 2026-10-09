
import {
  createContext,
  useContext,
  useState,
} from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(
    () => localStorage.getItem("taskflow_token")
  );

  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("taskflow_user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  function login(token, user) {
    localStorage.setItem("taskflow_token", token);
    localStorage.setItem("taskflow_user", JSON.stringify(user));

    setToken(token);
    setUser(user);
  }

  function logout() {
    localStorage.removeItem("taskflow_token");
    localStorage.removeItem("taskflow_user");

    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: Boolean(token && user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
