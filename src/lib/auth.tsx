import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface AuthPlayer {
  username: string;
  name: string;
  pfp?: string;
  level: number;
}

interface AuthCtx {
  player: AuthPlayer | null;
  token: string | null;
  login: (token: string, player: AuthPlayer) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthCtx>({
  player: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("astral_token"));
  const [player, setPlayer] = useState<AuthPlayer | null>(() => {
    try {
      const s = localStorage.getItem("astral_player");
      return s ? JSON.parse(s) : null;
    } catch { return null; }
  });

  const login = (t: string, p: AuthPlayer) => {
    setToken(t);
    setPlayer(p);
    localStorage.setItem("astral_token", t);
    localStorage.setItem("astral_player", JSON.stringify(p));
  };

  const logout = () => {
    setToken(null);
    setPlayer(null);
    localStorage.removeItem("astral_token");
    localStorage.removeItem("astral_player");
  };

  return (
    <AuthContext.Provider value={{ player, token, login, logout, isLoggedIn: !!token && !!player }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
