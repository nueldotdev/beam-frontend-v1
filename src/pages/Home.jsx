import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Zap,
  Wifi,
  Brain,
  BarChart3,
  Globe,
  Play,
  ChevronRight,
  Star,
} from "lucide-react";
import Button from "../components/Button";
import "../styles/home.css";
import logo from "../assets/Logo.png";
import gridImage1 from "../assets/grid1.jpg";
import gridImage2 from "../assets/grid2.jpg";
import gridImage3 from "../assets/grid3.jpg";
import gridImage4 from "../assets/grid4.jpg";
import gridImage5 from "../assets/grid5.jpg";
import gridImage6 from "../assets/grid6.jpg";
import gridImage7 from "../assets/grid7.jpg";
import gridImage8 from "../assets/grid8.jpg";
import gridImage9 from "../assets/grid9.jpg";

const Home = () => {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const featuresRef = useRef(null);

  // navbar transparency on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // animation on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.1 },
    );

    if (heroRef.current) observer.observe(heroRef.current);
    if (featuresRef.current) observer.observe(featuresRef.current);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-container">
          <div className="nav-logo">
            <img src={logo} alt="Beam" className="nav-logo-img" />
            <span className="logo-badge">AI</span>
          </div>

          <div className="nav-auth-buttons">
            <Link to="/login">
              <Button variant="ghost" size="small" className="nav-login-btn">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button variant="primary" size="small" className="nav-signup-btn">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero-section" ref={heroRef}>
        <div className="container">
          <div className="hero-badge">
            <Zap size={16} />
            <span>BANDWIDTH EFFICIENT • AI-POWERED</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-title-main">AI-Powered Meetings</span>
            <span className="hero-title-gradient">for Better Learning</span>
          </h1>

          <p className="hero-subtitle">
            Enhancing understanding through intelligent conversations that
            matter.
          </p>

          <div className="hero-cta">
            <Link to="/signup">
              <Button variant="primary" size="large" className="hero-cta-btn">
                Get Started Free
                <ChevronRight size={18} />
              </Button>
            </Link>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-number">9/10</div>
              <div className="stat-label">Educators Recommend</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50K+</div>
              <div className="stat-label">Active Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">99.9%</div>
              <div className="stat-label">Uptime</div>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="visual-grid">
            <div className="grid-item">
              <img src={gridImage1} alt="Meeting visual" />
            </div>
            <div className="grid-item">
              <img src={gridImage2} alt="Meeting visual" />
            </div>
            <div className="grid-item">
              <img src={gridImage3} alt="Meeting visual" />
            </div>
            <div className="grid-item">
              <img src={gridImage4} alt="Meeting visual" />
            </div>
            <div className="grid-item large">
              <img src={gridImage5} alt="Meeting visual" />
            </div>
            <div className="grid-item">
              <img src={gridImage6} alt="Meeting visual" />
            </div>
            <div className="grid-item">
              <img src={gridImage7} alt="Meeting visual" />
            </div>
            <div className="grid-item">
              <img src={gridImage8} alt="Meeting visual" />
            </div>
            <div className="grid-item">
              <img src={gridImage9} alt="Meeting visual" />
            </div>
          </div>
          <div className="visual-overlay">
            <div className="visual-badge">
              <Wifi size={20} />
              <span>Low Bandwidth Optimized</span>
            </div>
          </div>
        </div>
      </section>

      {/* Value */}
      <section className="values-section" ref={featuresRef}>
        <div className="container">
          <div className="section-header">
            <h2>Learn better with AI-powered tools anytime, anywhere</h2>
            <p className="section-subtitle">
              We bring smarter, more accessible online learning to communities
              with limited internet connectivity.
            </p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div
                className="value-icon"
                style={{ background: "rgba(37, 99, 235, 0.1)" }}
              >
                <Wifi size={24} color="#2563eb" />
              </div>
              <h3>Bandwidth Efficient</h3>
              <p>
                Optimized to perform smoothly on low bandwidth networks,
                ensuring reliable audio, video, and slide sharing without
                interruptions.
              </p>
            </div>

            <div className="value-card">
              <div
                className="value-icon"
                style={{ background: "rgba(37, 99, 235, 0.1)" }}
              >
                <Brain size={24} color="#2563eb" />
              </div>
              <h3>AI Context Awareness</h3>
              <p>
                Understands meeting content automatically, providing summaries,
                insights, and helpful follow ups after every session.
              </p>
            </div>

            <div className="value-card">
              <div
                className="value-icon"
                style={{ background: "rgba(37, 99, 235, 0.1)" }}
              >
                <BarChart3 size={24} color="#2563eb" />
              </div>
              <h3>Post-Meeting Intelligence</h3>
              <p>
                Automatically generates summaries, key points, and insights to
                help you review and learn after every meeting.
              </p>
            </div>

            <div className="value-card">
              <div
                className="value-icon"
                style={{ background: "rgba(37, 99, 235, 0.1)" }}
              >
                <Globe size={24} color="#2563eb" />
              </div>
              <h3>Local Optimization</h3>
              <p>
                Designed specifically for Nigeria and emerging markets, ensuring
                reliable performance across local networks and devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature */}
      <section className="feature-highlight">
        <div className="container">
          <div className="feature-grid">
            <div className="feature-content">
              <h2>
                AI-Powered with{" "}
                <span className="gradient-text">better video quality</span>
              </h2>
              <p className="feature-description">
                Designed for performance, our AI technology optimizes video
                quality to stay clear across varying network conditions.
              </p>

              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-check">
                    <div className="check-circle"></div>
                  </div>
                  <div>
                    <h4>Independent Browsing</h4>
                    <p>
                      Browse slides independently while staying in the meeting
                    </p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-check">
                    <div className="check-circle"></div>
                  </div>
                  <div>
                    <h4>AI-Powered Summaries</h4>
                    <p>Get automatic meeting notes and action items</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-check">
                    <div className="check-circle"></div>
                  </div>
                  <div>
                    <h4>Low Bandwidth Mode</h4>
                    <p>Continue learning even with 2G/3G connections</p>
                  </div>
                </div>
              </div>

              <div className="feature-rating">
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} size={16} fill="#2563eb" color="#2563eb" />
                  ))}
                </div>
                <span className="rating-text">
                  9/10 educators recommend Beam
                </span>
              </div>
            </div>

            <div className="feature-visual">
              <div className="visual-card">
                <div className="visual-header">
                  <div className="visual-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <span className="visual-title">AI Meeting Assistant</span>
                </div>
                <div className="visual-body">
                  <div className="visual-row">
                    <div className="visual-avatar"></div>
                    <div className="visual-line"></div>
                  </div>
                  <div className="visual-row">
                    <div className="visual-avatar"></div>
                    <div className="visual-line"></div>
                  </div>
                  <div className="visual-badge">
                    <Brain size={14} />
                    <span>Summarizing meeting...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <div className="footer-logo-wrapper">
                <img src={logo} alt="Beam" className="footer-logo-img" />
                <span className="footer-logo-badge">AI</span>
              </div>
              <p className="footer-tagline">
                AI-powered video conferencing for better learning
              </p>
              <div className="social-links">
                <a href="#" aria-label="Twitter">
                  𝕏
                </a>
                <a href="#" aria-label="LinkedIn">
                  in
                </a>
                <a href="#" aria-label="Gmail">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© 2026 Beam. All rights reserved. Made for emerging markets.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
