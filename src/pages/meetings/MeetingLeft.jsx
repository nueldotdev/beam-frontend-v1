import React from "react";
import { useNavigate } from "react-router-dom";

export function MeetingLeft() {
  const navigate = useNavigate();

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      color: 'white',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <div style={{
        padding: '40px',
        borderRadius: '24px',
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        textAlign: 'center',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
      }}>
        <div style={{ 
          fontSize: '64px', 
          marginBottom: '20px',
          animation: 'float 3s ease-in-out infinite'
        }}>👋</div>
        <h1 style={{ marginBottom: '10px', fontSize: '32px', fontWeight: '700' }}>You've left the call</h1>
        <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Thank you for using Beam. We hope you had a productive session.</p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button 
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
            style={{ padding: '12px 24px', fontWeight: '600' }}
          >
            Go to Dashboard
          </button>
          <button 
            onClick={() => window.history.back()}
            className="btn"
            style={{ 
              padding: '12px 24px', 
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              fontWeight: '600'
            }}
          >
            Rejoin
          </button>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </div>
  );
}
