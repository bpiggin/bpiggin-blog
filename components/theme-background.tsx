"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "./theme-provider";

const TRANSITION_SPEED = 3;
const fadeClass = "transition-opacity duration-700 ease-in-out motion-reduce:transition-none";

const videoProps = {
  muted: true,
  playsInline: true,
  preload: "auto" as const,
  tabIndex: -1,
  disablePictureInPicture: true,
  controls: false,
  controlsList: "nodownload noplaybackrate noremoteplayback",
  onContextMenu: (event: React.MouseEvent) => event.preventDefault(),
};

function playLoop(video: HTMLVideoElement) {
  video.loop = true;
  video.playbackRate = 1;
  void video.play().catch(() => {});
}

function playManualReverse(
  video: HTMLVideoElement,
  speed: number,
  onComplete: () => void,
): () => void {
  let rafId = 0;
  let cancelled = false;

  const cleanup = () => {
    cancelled = true;
    if (rafId) cancelAnimationFrame(rafId);
  };

  const finish = () => {
    if (cancelled) return;
    cleanup();
    video.pause();
    video.playbackRate = 1;
    video.currentTime = 0;
    onComplete();
  };

  const startReverse = () => {
    video.loop = false;
    video.pause();
    video.playbackRate = 1;
    video.currentTime = Math.max(0, video.duration - 0.05);

    let last = performance.now();

    const step = (now: number) => {
      if (cancelled) return;

      const delta = (now - last) / 1000;
      last = now;
      video.currentTime = Math.max(0, video.currentTime - delta * speed);

      if (video.currentTime <= 0.05) {
        finish();
        return;
      }

      rafId = requestAnimationFrame(step);
    };

    rafId = requestAnimationFrame(step);
  };

  if (video.readyState >= HTMLMediaElement.HAVE_METADATA && Number.isFinite(video.duration)) {
    startReverse();
  } else {
    video.addEventListener("loadedmetadata", startReverse, { once: true });
  }

  return cleanup;
}

function useVideoReady(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const markReady = () => setReady(true);

    if (video.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA) {
      markReady();
    }

    video.addEventListener("canplaythrough", markReady);
    return () => video.removeEventListener("canplaythrough", markReady);
  }, [videoRef]);

  return ready;
}

export function ThemeBackground() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const dayVideoRef = useRef<HTMLVideoElement>(null);
  const sunsetVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const sunsetModeRef = useRef<"idle" | "forward" | "reverse">("idle");
  const reverseCleanupRef = useRef<(() => void) | null>(null);
  const isFirstThemeEffect = useRef(true);

  const dayVideoReady = useVideoReady(dayVideoRef);
  const nightVideoReady = useVideoReady(nightVideoRef);

  const [sunsetPlaying, setSunsetPlaying] = useState(false);
  const [sunsetVisible, setSunsetVisible] = useState(false);
  const [nightActive, setNightActive] = useState(false);

  const preloadVideos = useCallback(() => {
    for (const video of [
      dayVideoRef.current,
      sunsetVideoRef.current,
      nightVideoRef.current,
    ]) {
      if (video) {
        video.load();
      }
    }
  }, []);

  useEffect(() => {
    preloadVideos();
  }, [preloadVideos]);

  const showNightStable = nightActive && !sunsetPlaying;

  const startNightStable = useCallback(() => {
    setNightActive(true);
    const nightVideo = nightVideoRef.current;
    if (nightVideo && nightVideoReady) {
      playLoop(nightVideo);
    }
  }, [nightVideoReady]);

  useEffect(() => {
    const sunset = sunsetVideoRef.current;
    if (!sunset) return;

    const onEnded = () => {
      if (sunsetModeRef.current !== "forward") return;

      sunsetModeRef.current = "idle";
      setSunsetVisible(false);
      setSunsetPlaying(false);
      sunset.pause();
      sunset.playbackRate = 1;
      startNightStable();
    };

    sunset.addEventListener("ended", onEnded);
    return () => sunset.removeEventListener("ended", onEnded);
  }, [startNightStable]);

  useEffect(() => {
    if (!showNightStable || !nightVideoReady) return;
    const nightVideo = nightVideoRef.current;
    if (nightVideo) playLoop(nightVideo);
  }, [showNightStable, nightVideoReady]);

  useEffect(() => {
    const dayVideo = dayVideoRef.current;
    const sunset = sunsetVideoRef.current;
    const nightVideo = nightVideoRef.current;

    if (isFirstThemeEffect.current) {
      isFirstThemeEffect.current = false;
      if (isDark) {
        setNightActive(true);
        setSunsetPlaying(false);
        setSunsetVisible(false);
        dayVideo?.pause();
        if (nightVideo && nightVideoReady) playLoop(nightVideo);
      } else if (dayVideo && dayVideoReady) {
        playLoop(dayVideo);
      }
      return;
    }

    reverseCleanupRef.current?.();
    reverseCleanupRef.current = null;

    if (!isDark) {
      setNightActive(false);
      nightVideo?.pause();
      dayVideo?.pause();

      if (!sunset) return;

      sunsetModeRef.current = "reverse";
      setSunsetPlaying(true);
      setSunsetVisible(false);

      const startSunsetReverse = () => {
        requestAnimationFrame(() => setSunsetVisible(true));
        reverseCleanupRef.current = playManualReverse(sunset, TRANSITION_SPEED, () => {
          reverseCleanupRef.current = null;
          sunsetModeRef.current = "idle";
          setSunsetVisible(false);
          setSunsetPlaying(false);

          if (dayVideo && dayVideoReady) {
            playLoop(dayVideo);
          }
        });
      };

      if (sunset.readyState >= HTMLMediaElement.HAVE_METADATA) {
        startSunsetReverse();
      } else {
        sunset.addEventListener("loadedmetadata", startSunsetReverse, { once: true });
      }

      return;
    }

    setNightActive(false);
    nightVideo?.pause();
    setSunsetPlaying(true);
    setSunsetVisible(false);
    dayVideo?.pause();

    if (!sunset) return;

    const playSunsetForward = () => {
      sunsetModeRef.current = "forward";
      sunset.currentTime = 0;
      sunset.playbackRate = TRANSITION_SPEED;
      sunset.loop = false;
      requestAnimationFrame(() => setSunsetVisible(true));
      void sunset.play().catch(() => {});
    };

    if (sunset.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      playSunsetForward();
    } else {
      sunset.addEventListener("loadeddata", playSunsetForward, { once: true });
    }
  }, [isDark, dayVideoReady, nightVideoReady, startNightStable]);

  useEffect(() => {
    return () => {
      reverseCleanupRef.current?.();
    };
  }, []);

  const sunsetForwardToDark = sunsetPlaying && isDark && !nightActive;
  const sunsetReverseToLight = sunsetPlaying && !isDark;
  const showDayPoster =
    (!isDark || sunsetForwardToDark) && !dayVideoReady && !sunsetReverseToLight;
  const showDayVideo =
    dayVideoReady && ((!isDark && !sunsetPlaying) || sunsetForwardToDark);
  const showSunset = sunsetPlaying && sunsetVisible;
  const showNightPoster = showNightStable && !nightVideoReady;
  const showNightVideo = showNightStable && nightVideoReady;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      <div
        className={`absolute inset-0 bg-cover bg-center ${fadeClass} ${
          showDayPoster ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: "url(/day_final.png)" }}
      />
      <video
        ref={dayVideoRef}
        src="/daytime_vid.mp4"
        {...videoProps}
        className={`bg-video absolute inset-0 h-full w-full object-cover ${fadeClass} ${
          showDayVideo ? "opacity-100" : "opacity-0"
        }`}
      />
      <video
        ref={sunsetVideoRef}
        src="/sunset_final.mp4"
        {...videoProps}
        className={`bg-video absolute inset-0 h-full w-full object-cover ${fadeClass} ${
          showSunset ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-0 bg-cover bg-center ${fadeClass} ${
          showNightPoster ? "opacity-100" : "opacity-0"
        }`}
        style={{ backgroundImage: "url(/night_final.png)" }}
      />
      <video
        ref={nightVideoRef}
        src="/nighttime_vid.mp4"
        {...videoProps}
        className={`bg-video absolute inset-0 h-full w-full object-cover ${fadeClass} ${
          showNightVideo ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
