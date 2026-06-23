"use client";

import { useEffect, useRef, useState } from "react";

const VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260418_080021_d598092b-c4c2-4e53-8e46-94cf9064cd50.mp4";

const FADE_DURATION = 0.8; // seconds
const GAP_DURATION = 0.15; // 150ms gap between loops

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [opacity, setOpacity] = useState(0);
  const rafRef = useRef<number | null>(null);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const animate = () => {
      if (!video.duration || !isFinite(video.duration)) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      const currentTime = video.currentTime;
      const duration = video.duration;
      const fadeSec = FADE_DURATION;

      // Fade in: first 0.8s
      if (currentTime < fadeSec) {
        setOpacity(currentTime / fadeSec);
      }
      // Fade out: last 0.8s before end
      else if (currentTime > duration - fadeSec) {
        setOpacity((duration - currentTime) / fadeSec);
      }
      // Full opacity in the middle
      else {
        setOpacity(1);
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    const handleEnded = () => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;

      setOpacity(0);

      setTimeout(() => {
        if (video) {
          video.currentTime = 0;
          video.play().catch(() => {});
        }
        isTransitioningRef.current = false;
      }, GAP_DURATION * 1000);
    };

    const handleCanPlay = () => {
      video.play().catch(() => {});
      rafRef.current = requestAnimationFrame(animate);
    };

    video.addEventListener("ended", handleEnded);
    video.addEventListener("canplay", handleCanPlay);

    // Start if already loaded
    if (video.readyState >= 3) {
      video.play().catch(() => {});
      rafRef.current = requestAnimationFrame(animate);
    }

    return () => {
      video.removeEventListener("ended", handleEnded);
      video.removeEventListener("canplay", handleCanPlay);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity,
          willChange: "opacity",
        }}
        src={VIDEO_URL}
        muted
        loop={false}
        playsInline
        preload="auto"
      />
    </div>
  );
}
