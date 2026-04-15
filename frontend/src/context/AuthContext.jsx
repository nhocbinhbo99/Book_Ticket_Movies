import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);   // { id, email, fullName, avatar, role }
  const [token, setToken] = useState(null); // JWT string
  const [loading, setLoading] = useState(true); // khởi tạo từ localStorage

  // Khi app load: đọc lại từ localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem("tf_token");
    const savedUser  = localStorage.getItem("tf_user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  // Đăng nhập — gọi sau khi nhận response từ API
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem("tf_token", jwtToken);
    localStorage.setItem("tf_user", JSON.stringify(userData));
  };

  // Đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("tf_token");
    localStorage.removeItem("tf_user");
  };

  // Cập nhật thông tin user (sau edit profile)
  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem("tf_user", JSON.stringify(newUserData));
  };


  const isLoggedIn = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, isLoggedIn, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook tiện lợi để dùng trong các component
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong <AuthProvider>");
  return ctx;
}
