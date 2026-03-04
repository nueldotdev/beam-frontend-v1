import React, { useState } from 'react'
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogin } from '../utils/apicalls';
import { Loader2 } from 'lucide-react';
import { Toast } from './Toast';
import "../styles/google/oauth-page.css";
import "../styles/auth.css";
import logo from "../assets/logo/Beam.png";


const OAuthPage = () => {
  const [code, setCode] = useState(null)
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCode(params.get("code"));
  }, []);

  useEffect(() => {
    if (code) {
      googleLogin(code)
      .then((data) => {
        if (data.token) {
          localStorage.setItem("authToken", data.token);
        }

        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }

        setToast("🎉 Account created successfully!");
        window.location.href = "/dashboard/home";
      })
      .catch((err) => {
        console.error("Google callback error:", err);
        setToast("❌ Google login failed. Please try again.");
      })
      .finally(() => {
        setLoading(false);
      });
    }
  })


  return (
    <div className="oauth-container">
      <div className="logo-container">
        <img src={logo} alt="Logo" className="logo" />
        <h1>Beam</h1>
      </div>
      <div className="loader-container">
        {loading ? (
          <Loader2 size={18} className="spin max-size" />
        ) : (
            toast && <Toast message={toast} onClose={() => setToast("")} />
        )}
      </div>
      <div className='footer-oauth'>
        <p>Made with ❤️ by Team Beam</p>
      </div>
    </div>
  )
}

export default OAuthPage;