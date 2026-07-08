import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const data = localStorage.getItem("usuario");
    return data ? JSON.parse(data) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  const login = (usuarioData, tokenData) => {
    localStorage.setItem("token", tokenData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
    setToken(tokenData);
    setUsuario(usuarioData);
  };

  const logout = () => {
    setUsuario(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        login,
        logout,
        isLoggedIn: !!token, // 👈 ahora sí existe
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
