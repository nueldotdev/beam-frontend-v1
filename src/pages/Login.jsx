import React from "react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LogIn,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import logo from "../assets/logo/Beam.png";
import Button from "../components/Button";
import Input from "../components/Input";
import { login } from "../utils/apicalls";
import "../styles/auth.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);

  // Check for saved email from "remember me"
  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail, rememberMe: true }));
    }
  }, []);

  // Handle "remember me"
  useEffect(() => {
    if (formData.rememberMe && formData.email) {
      localStorage.setItem("rememberedEmail", formData.email);
    } else if (!formData.rememberMe) {
      localStorage.removeItem("rememberedEmail");
    }
  }, [formData.rememberMe, formData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Basic validation
    if (!formData.email || !formData.password) {
      setError("Please fill in all fields");
      return;
    }

    // Basic rate limiting
    if (failedAttempts >= 5) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    setLoading(true);

    try {
      // Prepare login credentials
      const credentials = {
        email: formData.email.trim(),
        password: formData.password,
      };

      // Call the login API
      const response = await login(credentials);

      console.log("Login successful:", response);

      // Reset failed attempts on success
      setFailedAttempts(0);

      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      }

      // Store token if returned
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }

      // Store user data if returned
      if (response.user) {
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setFailedAttempts((prev) => prev + 1);
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Google sign-in handler - READY FOR API INTEGRATION
  const handleGoogleSignIn = () => {
    if (failedAttempts >= 5) {
      setError("Too many failed attempts. Please try again later.");
      return;
    }

    setError("");
    setLoading(true);

    // Temporary placeholder - REMOVE THIS WHEN API IS READY
    console.log("Google sign-in would be attempted");

    // This timeout is just to show loading state - REMOVE WHEN API IS READY
    setTimeout(() => {
      setLoading(false);
      setError(
        "Google sign-in not configured yet. Please integrate with backend.",
      );
    }, 1000);
  };

  const isAnyLoading = loading;

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-bg">
            <img src={logo} alt="Beam Logo" className="auth-logo-img" />
          </div>
        </div>

        <div className="auth-header">
          <h1>Sign In</h1>
          <p className="auth-subtitle">
            Welcome back! Please enter your details.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-form-label">
              <Mail size={16} />
              Email Address
            </label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
              disabled={isAnyLoading}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-form-label">
              <Lock size={16} />
              Password
            </label>
            <div className="auth-password-input">
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
                disabled={isAnyLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="auth-password-toggle"
                disabled={isAnyLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="auth-form-options">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.rememberMe}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rememberMe: e.target.checked,
                    })
                  }
                  disabled={isAnyLoading}
                />
                <span>Keep me logged in</span>
              </label>

              <Link to="/forgot-password" className="auth-forgot-link">
                Forgot password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            disabled={isAnyLoading || failedAttempts >= 5}
            style={{ width: "100%" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </Button>
        </form>

        <div className="auth-divider">
          <span>or continue with</span>
        </div>

        <Button
          variant="secondary"
          onClick={handleGoogleSignIn}
          disabled={isAnyLoading || failedAttempts >= 5}
          style={{ width: "100%" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            style={{ marginRight: "8px" }}
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </Button>

        <div className="auth-footer">
          <p>
            Don&apos;t have an account yet?{" "}
            <Link to="/signup" className="auth-link">
              Sign Up
            </Link>
          </p>
          {failedAttempts >= 5 && (
            <p className="rate-limit-warning">
              Account temporarily locked. Please try again in 15 minutes or{" "}
              <Link to="/forgot-password">reset your password</Link>.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
