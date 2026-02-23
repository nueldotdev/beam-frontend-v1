import React from "react";
function Avatar({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: 40,
        height: 40,
        borderRadius: "50%",
        objectFit: "cover",
      }}
    />
  );
}

export default Avatar;
