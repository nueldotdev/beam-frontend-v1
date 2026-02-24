import React from "react";

function Button({ variant = "primary", children, className = "", ...props }) {
  const baseClass = "btn";
  const variantClass = `btn-${variant}`;
  const fullClassName = `${baseClass} ${variantClass} ${className}`.trim();

  return (
    <button className={fullClassName} {...props}>
      {children}
    </button>
  );
}

export default Button;
