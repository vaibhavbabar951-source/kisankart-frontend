import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("kk_token")) {
      setLoading(false);
      return;
    }
    api
      .get("/auth/me")
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem("kk_token"))
      .finally(() => setLoading(false));
  }, []);

  const saveAuth = (data) => {
    localStorage.setItem("kk_token", data.token);
    setUser(data.user);
    return data.user;
  };

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    return saveAuth(data);
  };

  // formData: FormData (supports optional "image" file)
  const signup = async (formData) => {
    const { data } = await api.post("/auth/signup", formData);
    return saveAuth(data);
  };

  const logout = () => {
    localStorage.removeItem("kk_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
