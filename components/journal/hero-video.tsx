"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const videoSource = "/journal/vice-city.mp4";

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);

  function play(video: HTMLVideoElement) {
    video.muted = true;
    if (!video.getAttribute("src")) video.src = videoSource;
    void video.play().catch(() => {
      // Some in-app browsers require a tap. The photo remains visible.
    });
  }

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    function updateMotion() {
      if (!video) return;
      if (motion.matches) video.pause();
      else play(video);
    }

    updateMotion();
    motion.addEventListener("change", updateMotion);
    return () => motion.removeEventListener("change", updateMotion);
  }, []);

  return (
    <>
      {/* The video is decorative. All information and actions are in the surrounding markup. */}
      <video
        ref={videoRef}
        className="journal-hero-video"
        data-playing={playing}
        aria-hidden="true"
        disablePictureInPicture
        muted
        loop
        playsInline
        preload="none"
        onPlaying={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => {
          setPlaying(false);
          setFailed(true);
        }}
      />
      {!failed && (
        <button
          type="button"
          className="journal-video-control"
          aria-label={playing ? "Pausar video de fondo" : "Reproducir video de fondo"}
          onClick={() => {
            const video = videoRef.current;
            if (!video) return;
            if (video.paused) play(video);
            else video.pause();
          }}
        >
          {playing ? <Pause aria-hidden="true" className="size-5" /> : <Play aria-hidden="true" className="size-5" />}
        </button>
      )}
    </>
  );
}
