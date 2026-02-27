import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Logo from "../assets/logo/Beam.png";
import Button from "../components/Button";
import Input from "../components/Input";
import { register } from "../utils/apicalls";
import "../styles/auth.css";

// Simple Toast Component
const Toast = ({ message, onClose }) => (
  <div className="toast">
    {message}
    <button onClick={onClose}>&times;</button>
  </div>
);

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [toast, setToast] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }

    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }

    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }

    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      return "Password must contain at least one special character";
    }

    return "";
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData({ ...formData, password: newPassword });
    setPasswordError(validatePassword(newPassword));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.agreeToTerms) {
      setError("You must agree to the Terms of Service");
      return;
    }

    const passwordValidation = validatePassword(formData.password);
    if (passwordValidation) {
      setError(passwordValidation);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare user data for API
      const userData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
      };

      // Call the register API
      const response = await register(userData);

      console.log("Signup successful:", response);

      // Show success message
      setToast("🎉 Account created successfully!");

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        agreeToTerms: false,
      });

      // Navigate to login page after delay
      setTimeout(() => {
        navigate("/login", {
          state: {
            message: "Account created successfully! Please log in.",
            email: formData.email,
          },
        });
      }, 3000);
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {toast && <Toast message={toast} onClose={() => setToast("")} />}
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-bg">
            <img src={Logo} alt="Beam Logo" className="auth-logo-img" />
          </div>
        </div>

        <div className="auth-header">
          <h1>Create Account</h1>
          <p className="auth-subtitle">
            Gain access to more features with a Beam account.
          </p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="auth-divider"></div>

        <form onSubmit={handleSubmit} className="auth-form" autoComplete="off">
          <div className="auth-form-row">
            <div className="auth-form-group">
              <label className="auth-form-label">
                <User size={16} /> First Name
              </label>
              <Input
                placeholder="Enter your first name"
                value={formData.firstName}
                required
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={loading}
              />
            </div>

            <div className="auth-form-group">
              <label className="auth-form-label">
                <User size={16} /> Last Name
              </label>
              <Input
                placeholder="Enter your last name"
                value={formData.lastName}
                required
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">
              <Mail size={16} /> Email
            </label>
            <Input
              type="email"
              value={formData.email}
              placeholder="Enter your email address"
              autoComplete="off"
              required
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="auth-form-group">
            <label className="auth-form-label">
              <Lock size={16} /> Password
            </label>
            <div className="auth-password-input">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                placeholder="Min 8 chars, uppercase, number & symbol"
                autoComplete="new-password"
                required
                onChange={handlePasswordChange}
                disabled={loading}
              />
              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError ? (
              <div className="auth-password-hint" style={{ color: "#ef4444" }}>
                {passwordError}
              </div>
            ) : formData.password ? (
              <div className="auth-password-hint" style={{ color: "#10b981" }}>
                ✓ Strong password
              </div>
            ) : (
              <div className="auth-password-hint">
                Use at least 8 characters, uppercase, number & symbol
              </div>
            )}
          </div>

          <label className="auth-checkbox-label">
            <input
              type="checkbox"
              checked={formData.agreeToTerms}
              onChange={(e) =>
                setFormData({ ...formData, agreeToTerms: e.target.checked })
              }
              disabled={loading}
            />
            <span>I agree to the Terms & Privacy Policy</span>
          </label>

          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.agreeToTerms || !!passwordError}
            style={{ width: "100%" }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </Button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="auth-link">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
