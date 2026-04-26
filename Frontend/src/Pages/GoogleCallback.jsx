import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLoader } from 'react-icons/fi';
import { getBackendBaseUrl } from '../Services/apiClient';
import { useSocket } from '../context/SocketContext';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const { connectUser } = useSocket();
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Google sends the credential in the URL fragment (#) or query string (?)
        const params = new URLSearchParams(window.location.hash.substring(1) || window.location.search);
        const credential = params.get('id_token') || params.get('credential');

        // If we don't find it in the URL directly, it might be handled by the library
        // but for a manual callback route, we usually expect it here.
        
        // Note: @react-oauth/google's redirect mode sometimes sends it via a POST request
        // which the frontend can't catch directly if it's just a static route.
        // However, most modern setups use the fragment flow.

        if (!credential) {
          // If no credential found, maybe it's being processed by the library in the background
          // or there was an error.
          console.error("No Google credential found in URL");
          setError("Authentication failed: No credential received.");
          return;
        }

        const response = await fetch(`${getBackendBaseUrl()}/api/users/google-login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credential }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem('token', result.token);
          localStorage.setItem('userName', result.name);
          localStorage.setItem('userId', result._id);
          localStorage.setItem('userEmail', result.email);
          localStorage.setItem('showWelcomeModal', 'true');
          window.dispatchEvent(new Event('authChange'));
          connectUser(result.email);
          
          if (!result.profileCompleted) {
            navigate('/complete-profile');
          } else {
            navigate('/dashboard');
          }
        } else {
          setError(result.message || "Google Login failed");
        }
      } catch (err) {
        console.error("Callback Error:", err);
        setError("An error occurred during authentication.");
      }
    };

    handleCallback();
  }, [navigate, connectUser]);

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-glass rounded-3xl p-8 border border-white/5 text-center shadow-2xl">
        {!error ? (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center">
              <FiLoader className="w-8 h-8 text-indigo-400 animate-spin" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Authenticating...</h2>
              <p className="text-slate-400">Please wait while we secure your session.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-6">
            <div className="w-16 h-16 bg-rose-500/20 rounded-2xl flex items-center justify-center text-rose-400">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Authentication Error</h2>
              <p className="text-rose-400/80 mb-6">{error}</p>
              <button 
                onClick={() => navigate('/login')}
                className="btn-primary px-8 py-3 rounded-xl text-sm"
              >
                Back to Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GoogleCallback;
