import React from "react";
export function ControlButton({
  onClick,
  title,
  active = false,
  danger = false,
  disabled = false,
  children,
}) {
  const className = [
    "ctrl-btn",
    active ? "ctrl-btn--active" : "",
    danger ? "ctrl-btn--danger" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      className={className}
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      aria-pressed={active}
    >
      {children}
      <span className="ctrl-btn__tooltip" role="tooltip">
        {title}
      </span>
    </button>
  );
}
