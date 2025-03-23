"use client";

import { useEffect, useRef } from "react";

interface GoogleAdProps {
  adSlot: string;
  adFormat?: "auto" | "rectangle" | "horizontal" | "vertical";
  style?: React.CSSProperties;
  className?: string;
}

export default function GoogleAd({
  adSlot,
  adFormat = "auto",
  style,
  className = "",
}: GoogleAdProps) {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Skip if running on the server or if the component is not mounted
    if (typeof window === "undefined" || !adRef.current) return;

    try {
      // Add ad after component mounts
      const adsbygoogle = (window as any).adsbygoogle || [];
      adsbygoogle.push({});
    } catch (error) {
      console.error("Error loading Google Ad:", error);
    }
  }, [adSlot]);

  // Determine responsive ad size based on format
  const getAdSize = () => {
    switch (adFormat) {
      case "rectangle":
        return { width: "300px", height: "250px" };
      case "horizontal":
        return { width: "728px", height: "90px" };
      case "vertical":
        return { width: "160px", height: "600px" };
      case "auto":
      default:
        return { width: "100%", height: "auto" };
    }
  };

  const adSize = getAdSize();

  return (
    <div
      ref={adRef}
      className={`google-ad overflow-hidden ${className}`}
      style={{
        display: "block",
        textAlign: "center",
        ...adSize,
        ...style,
      }}
    >
      <ins
        className="adsbygoogle"
        style={{
          display: "block",
          ...adSize,
        }}
        data-ad-client="ca-pub-7816813354770495" // Replace with your Publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      ></ins>
    </div>
  );
}
