import React from "react";

export default function Banner() {
  return (
    <div className="relative w-full bg-[#0e0e0e] py-10 px-4">
      <div className="max-w-md mx-auto relative rounded-2xl overflow-hidden shadow-[0_10px_40px_rgba(255,255,255,0.1)] transition-transform duration-500">
        <img
          src="https://i.pinimg.com/736x/33/7f/c3/337fc32dcb7e4526e3d5108de5c96d10.jpg"
          alt="Projectly Banner"
          className="w-full h-[150px] object-cover rounded-2xl"
        />
        <div className="absolute inset-0 bg-black/30 rounded-2xl" />
      </div>
    </div>
  );
}
