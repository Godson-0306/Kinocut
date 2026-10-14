"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { onIntroDone } from "@/lib/intro";
import { cn } from "@/lib/utils";

type NetworkInformation = { saveData?: boolean; effectiveType?: string };

export function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const pausedByUser = useRef(false);
  const [posterOnly, setPosterOnly] = useState(false);
  const [ready, setReady] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => onIntroDone(() => setRevealed(true)), []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection;
    const saveData = Boolean(connection?.saveData || connection?.effectiveType === "2g" || connection?.effectiveType === "slow-2g");
    if (reduce || saveData) setPosterOnly(true);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || posterOnly) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          if (!pausedByUser.current) video.play().catch(() => setPosterOnly(true));
        } else {
          video.pause();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [posterOnly]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      pausedByUser.current = false;
      video.play().catch(() => setPosterOnly(true));
      setPaused(false);
    } else {
      pausedByUser.current = true;
      video.pause();
      setPaused(true);
    }
  };

  return (
    <div className="absolute inset-0">
      {posterOnly ? (
        <Image src="/videos/hero-poster.jpg" alt="" fill priority className="object-cover" sizes="100vw" />
      ) : (
        <video
          ref={videoRef}
          className={cn(
            "h-full w-full object-cover opacity-0 transition-opacity duration-slow",
            ready && revealed && "opacity-100",
          )}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/videos/hero-poster.jpg"
          aria-hidden="true"
          onCanPlay={() => setReady(true)}
          onError={() => setPosterOnly(true)}
        >
          <source src="/videos/hero-mobile.mp4" type="video/mp4" media="(max-width: 768px)" />
          <source src="/videos/hero.webm" type="video/webm" media="(min-width: 769px)" />
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      )}
      {posterOnly ? null : (
        <button
          type="button"
          onClick={toggle}
          aria-pressed={paused}
          className="absolute bottom-4 right-4 z-20 inline-flex items-center gap-2 rounded-pill border border-white/25 bg-ink/55 px-3 py-2 text-white backdrop-blur-md md:bottom-5 md:left-5 md:right-auto"
        >
          {paused ? <Play className="h-4 w-4" aria-hidden="true" /> : <Pause className="h-4 w-4" aria-hidden="true" />}
          <span className="type-micro">{paused ? "Play video" : "Pause video"}</span>
        </button>
      )}
    </div>
  );
}
