import React from 'react';

// Simple Toast Component
export const Toast = ({ message, onClose }) => (
  <div className="toast">
    {message}
    <button onClick={onClose}>&times;</button>
  </div>
);