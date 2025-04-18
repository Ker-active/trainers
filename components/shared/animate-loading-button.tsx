"use client";

import React from "react";

interface LoaderProps {
  size?: number;
  color?: string;
}

export default function Loader({ size = 50, color = "#fff" }: LoaderProps) {
  return (
    <div
      className="loader"
      style={{
        width: `${size}px`,
        aspectRatio: "4",
        background: `
          radial-gradient(circle closest-side, ${color} 90%, transparent) 0% 50%,
          radial-gradient(circle closest-side, ${color} 90%, transparent) 50% 50%,
          radial-gradient(circle closest-side, ${color} 90%, transparent) 100% 50%
        `,
        backgroundRepeat: "no-repeat",
        backgroundSize: "calc(100%/3) 100%",
        animation: "loaderAnimation 1s infinite cubic-bezier(0.45, 0, 0.55, 1)",
        borderRadius: "8px",
      }}
    >
      <style jsx>{`
        @keyframes loaderAnimation {
          33% {
            background-size: calc(100% / 3) 0%, calc(100% / 3) 100%, calc(100% / 3) 100%;
          }
          50% {
            background-size: calc(100% / 3) 100%, calc(100% / 3) 0%, calc(100% / 3) 100%;
          }
          66% {
            background-size: calc(100% / 3) 100%, calc(100% / 3) 100%, calc(100% / 3) 0%;
          }
        }
      `}</style>
    </div>
  );
}



