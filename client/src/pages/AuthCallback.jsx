// client/pages/AuthCallback.jsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "https://repolens-xac5.onrender.com";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [status, setStatus] = useState("Completing authentication...");
  const [errorDetails, setErrorDetails] = useState(null);

useEffect(() => {
  const params = new URLSearchParams(location.search);
  const token = params.get("token");

  if (token) {
    fetch(`${API_URL}/auth/verify`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(`Server returned ${res.status}: ${text}`);
        }
        return res.json();
      })
      .then((data) => {
        if (data.user) {
          login(data.user, token);
          setStatus("Success! Redirecting...");
          navigate("/analyzepage", { replace: true });
        } else {
          setStatus("Authentication failed: No user found in response.");
          setErrorDetails(JSON.stringify(data));
        }
      })
      .catch((err) => {
        console.error("AuthCallback Error:", err);
        setStatus("Verification failed.");
        setErrorDetails(err.message);
      });
  } else {
    setStatus("No token found in URL.");
  }
}, [location, navigate, login]);

  return (
    <div className="min-h-screen bg-[#0B0E17] flex items-center justify-center flex-col p-4">
      <div className="text-center bg-[#1A1F2E] p-8 rounded-xl border border-[#334155] max-w-lg w-full">
        {!errorDetails && (
          <div className="w-16 h-16 border-4 border-[#60A5FA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        )}
        <p className="text-[#94A3B8] text-lg font-semibold mb-2">{status}</p>
        
        {errorDetails && (
          <div className="mt-4 text-left bg-red-900/20 p-4 rounded-lg border border-red-500/30">
            <p className="text-red-400 font-mono text-sm break-all">{errorDetails}</p>
            <button 
              onClick={() => navigate('/signin')}
              className="mt-6 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-500 w-full"
            >
              Back to Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
