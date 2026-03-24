// client/components/UserProfile.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserProfile() {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 focus:outline-none group"
      >
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-[#60A5FA] group-hover:border-[#60A5FA]/80 transition"
          />
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-[#3B82F6] to-[#818CF8] rounded-full flex items-center justify-center border-2 border-[#60A5FA] group-hover:border-[#60A5FA]/80 transition">
            <span className="text-xs font-bold text-white">
              {user.name?.charAt(0).toUpperCase() ||
                user.email?.charAt(0).toUpperCase() ||
                "U"}
            </span>
          </div>
        )}
      </button>

      {showDropdown && (
        <>
          <div
            className="fixed inset-0 z-40 bg-transparent"
            onClick={() => setShowDropdown(false)}
          />
          <div className="absolute right-0 mt-4 w-64 bg-[#1A1F2E] border border-[#334155] rounded-xl shadow-xl z-[999] overflow-hidden">
            <div className="p-4 border-b border-[#334155]">
              <p className="text-white font-medium truncate">
                {user?.name || user?.username || user?.email || "User"}
              </p>{" "}
              <p className="text-xs text-[#94A3B8] mt-1 truncate">
                {user.email}
              </p>
              <p className="text-xs text-[#60A5FA] mt-2 capitalize">
                Signed in with {user.provider || "email"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 text-[#94A3B8] hover:text-white hover:bg-[#2D3A4F] transition text-sm"
            >
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
}
