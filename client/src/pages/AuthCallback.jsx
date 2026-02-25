// client/pages/AuthCallback.jsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userData = params.get('user');
    
    if (userData) {
      try {
        const user = JSON.parse(decodeURIComponent(userData));
        // Store user data in localStorage or context
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('token', user.token);
        
        // Redirect to home page
        navigate('/analyze', { replace: true });
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/signin?error=invalid_data');
      }
    } else {
      navigate('/signin?error=no_data');
    }
  }, [location, navigate]);
console.log("userdata");
  return (
    <div className="min-h-screen bg-[#0B0E17] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#60A5FA] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[#94A3B8]">Completing authentication...</p>
      </div>
    </div>
  );
}