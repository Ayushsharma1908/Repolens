// client/pages/AuthCallback.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://repolens-xac5.onrender.com";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  if (token) {
    fetch(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          // ✅ use login instead of setUser
          login(data.user, token);

          navigate("/analyzepage", { replace: true });
        } else {
          navigate("/signin");
        }
      })
      .catch(() => navigate("/signin"));
  } else {
    navigate("/signin");
  }
}, [location, navigate, login]);

  return (
    <div className="min-h-screen bg-[#0B0E17] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#60A5FA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#94A3B8]">Completing authentication...</p>
      </div>
    </div>
  );
}
