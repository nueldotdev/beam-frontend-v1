import React from "react";
function Input({ type = "text", ...props }) {
  return <input className="input" type={type} {...props} />;
}

export default Input;
