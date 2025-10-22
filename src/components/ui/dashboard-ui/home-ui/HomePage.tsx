import React from "react";
import Orb from "./orb";

function HomePage() {
  return (
    // Outer container: sets the full screen height (h-screen) and positioning context
    <div style={{ width: "100%", position: "relative" }} className="h-screen">
      {/* Inner container: uses Flexbox to center content horizontally and vertically */}
      <div className="flex flex-col justify-center items-center w-full h-full">
        
        {/* New Text Content */}
        <h1 className="text-4xl font-bold text-white mb-4 z-10">
          مرحبًا بك في نظامنا!
        </h1>

        {/* Orb Component (Assumed to be an interactive background element) */}
        <Orb
          hoverIntensity={0.5}
          rotateOnHover={true}
          hue={0}
          forceHoverState={false}
        />
        
      </div>
    </div>
  );
}

export default HomePage;