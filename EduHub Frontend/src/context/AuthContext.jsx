import React, { createContext, useContext, useState, useEffect } from "react";
import apiClient from "../api/apiClient";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check saved session on mount
    try {
      const savedToken = localStorage.getItem("token");
      const savedProfile = localStorage.getItem("saved_user_profile");

      if (savedToken) {
        setToken(savedToken);
        if (savedProfile) {
          setUser(JSON.parse(savedProfile));
        } else {
          // Fallback user
          setUser({
            name: "Papu Das",
            email: "papu@eduhub.com",
            role: localStorage.getItem("userRole") || "student",
            xp: 320,
            streak: 7,
            level: 2,
          });
        }
      }
    } catch (err) {
      console.error("Auth hydration error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await apiClient.post("/login", { email, password });
      if (res.data && (res.data.success || res.status === 200)) {
        const authToken = res.data.token || `token-${Date.now()}`;
        const profile = res.data.user || {
          name: email.split("@")[0],
          email,
          role: res.data.role || "student",
          xp: 150,
          streak: 3,
          level: 1,
        };

        // Guarantee role is present
        if (!profile.role) profile.role = "student";

        setToken(authToken);
        setUser(profile);

        localStorage.setItem("token", authToken);
        localStorage.setItem("userRole", profile.role);
        localStorage.setItem("saved_user_profile", JSON.stringify(profile));

        toast.success(`Welcome back, ${profile.name}! 🚀`);
        return { success: true, user: profile };
      } else {
        throw new Error(res.data.message || "Invalid credentials");
      }
    } catch (error) {
      // Fallback in case of server/network issue during demo
      if (!error.response) {
        // Offline / demo fallback login
        const demoUser = {
          name: email.includes("@") ? email.split("@")[0] : "Student Member",
          email,
          role: email.includes("admin") ? "admin" : "student",
          xp: 240,
          streak: 5,
          level: 2,
          _id: "DEMO-USER-" + Date.now(),
        };
        const demoToken = "demo-session-token-" + Date.now();
        setToken(demoToken);
        setUser(demoUser);
        localStorage.setItem("token", demoToken);
        localStorage.setItem("userRole", demoUser.role);
        localStorage.setItem("saved_user_profile", JSON.stringify(demoUser));
        toast.success("Signed in with EduHub Demo Session!");
        return { success: true, user: demoUser };
      }
      const message = error.response?.data?.message || error.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      const res = await apiClient.post("/register", userData);
      if (res.data && res.data.success) {
        toast.success("Account created successfully! Please sign in.");
        return { success: true };
      } else {
        throw new Error(res.data?.message || "Registration failed");
      }
    } catch (error) {
      const message = error.response?.data?.message || error.message || "Registration error";
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("saved_user_profile");
    toast.success("Signed out successfully");
  };

  const switchSimulatorRole = (newRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    localStorage.setItem("userRole", newRole);
    localStorage.setItem("saved_user_profile", JSON.stringify(updated));
    toast.success(`Switched role to: ${newRole.toUpperCase()} mode`);
  };

  const awardXP = (amount) => {
    if (!user) return;
    const newXP = (user.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 200) + 1;
    const updated = { ...user, xp: newXP, level: newLevel };
    setUser(updated);
    localStorage.setItem("saved_user_profile", JSON.stringify(updated));
    toast.success(`+${amount} XP Earned! ⚡ (Total: ${newXP} XP)`);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        switchSimulatorRole,
        awardXP,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
