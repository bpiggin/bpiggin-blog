"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useTheme } from "./theme-provider";

const TRANSITION_SPEED = 3;
const fadeClass = "transition-opacity duration-700 ease-in-out motion-reduce:transition-none";
const instantClass = "bg-instant";

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
  const { theme, setThemeTransitionActive } = useTheme();
  const isDark = theme === "dark";

  const dayVideoRef = useRef<HTMLVideoElement>(null);
  const sunsetVideoRef = useRef<HTMLVideoElement>(null);
  const sunriseVideoRef = useRef<HTMLVideoElement>(null);
  const nightVideoRef = useRef<HTMLVideoElement>(null);
  const sunsetModeRef = useRef<"idle" | "forward">("idle");
  const sunriseModeRef = useRef<"idle" | "forward">("idle");
  const nightPrimedRef = useRef(false);
  const dayPrimedRef = useRef(false);
  const isFirstThemeEffect = useRef(true);

  const dayVideoReady = useVideoReady(dayVideoRef);
  const nightVideoReady = useVideoReady(nightVideoRef);

  const [sunsetPlaying, setSunsetPlaying] = useState(false);
  const [sunsetVisible, setSunsetVisible] = useState(false);
  const [sunsetInstantHide, setSunsetInstantHide] = useState(false);
  const [sunrisePlaying, setSunrisePlaying] = useState(false);
  const [sunriseVisible, setSunriseVisible] = useState(false);
  const [dayRevealed, setDayRevealed] = useState(false);
  const [nightActive, setNightActive] = useState(false);
  const [nightRevealed, setNightRevealed] = useState(false);

  const preloadVideos = useCallback(() => {
    for (const video of [
      dayVideoRef.current,
      sunsetVideoRef.current,
      sunriseVideoRef.current,
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

  useEffect(() => {
    setThemeTransitionActive(sunsetPlaying || sunrisePlaying);
    return () => setThemeTransitionActive(false);
  }, [sunsetPlaying, sunrisePlaying, setThemeTransitionActive]);

  const primeNightVideo = useCallback(() => {
    if (nightPrimedRef.current) return;
    nightPrimedRef.current = true;
    setNightActive(true);
    setNightRevealed(false);

    const nightVideo = nightVideoRef.current;
    if (nightVideo && nightVideoReady) {
      playLoop(nightVideo);
    }
  }, [nightVideoReady]);

  const primeDayVideo = useCallback(() => {
    if (dayPrimedRef.current) return;
    dayPrimedRef.current = true;
    setDayRevealed(false);

    const dayVideo = dayVideoRef.current;
    if (dayVideo && dayVideoReady) {
      playLoop(dayVideo);
    }
  }, [dayVideoReady]);

  useEffect(() => {
    const sunset = sunsetVideoRef.current;
    if (!sunset) return;

    const onTimeUpdate = () => {
      if (sunsetModeRef.current !== "forward") return;
      if (!Number.isFinite(sunset.duration)) return;
      if (sunset.currentTime < sunset.duration - 0.25) return;
      primeNightVideo();
    };

    const onEnded = () => {
      if (sunsetModeRef.current !== "forward") return;

      const nightVideo = nightVideoRef.current;

      sunsetModeRef.current = "idle";
      sunset.pause();
      sunset.playbackRate = 1;

      setSunsetInstantHide(true);
      setSunsetPlaying(false);
      setSunsetVisible(false);
      setNightActive(true);
      setNightRevealed(true);
      nightPrimedRef.current = false;

      if (nightVideo && nightVideoReady) {
        playLoop(nightVideo);
      }

      requestAnimationFrame(() => setSunsetInstantHide(false));
    };

    sunset.addEventListener("timeupdate", onTimeUpdate);
    sunset.addEventListener("ended", onEnded);
    return () => {
      sunset.removeEventListener("timeupdate", onTimeUpdate);
      sunset.removeEventListener("ended", onEnded);
    };
  }, [primeNightVideo, nightVideoReady]);

  useEffect(() => {
    const sunrise = sunriseVideoRef.current;
    if (!sunrise) return;

    const onTimeUpdate = () => {
      if (sunriseModeRef.current !== "forward") return;
      if (!Number.isFinite(sunrise.duration)) return;
      if (sunrise.currentTime < sunrise.duration - 0.25) return;
      primeDayVideo();
    };

    const onEnded = () => {
      if (sunriseModeRef.current !== "forward") return;

      const dayVideo = dayVideoRef.current;

      sunriseModeRef.current = "idle";
      sunrise.pause();
      sunrise.playbackRate = 1;

      setDayRevealed(true);
      dayPrimedRef.current = false;

      if (dayVideo && dayVideoReady) {
        playLoop(dayVideo);
      }

      setSunriseVisible(false);
      setSunrisePlaying(false);
      setNightActive(false);
      setNightRevealed(false);
    };

    sunrise.addEventListener("timeupdate", onTimeUpdate);
    sunrise.addEventListener("ended", onEnded);
    return () => {
      sunrise.removeEventListener("timeupdate", onTimeUpdate);
      sunrise.removeEventListener("ended", onEnded);
    };
  }, [primeDayVideo, dayVideoReady]);

  useEffect(() => {
    if (!nightActive || !nightVideoReady) return;
    const nightVideo = nightVideoRef.current;
    if (!nightVideo) return;

    if (nightRevealed || nightPrimedRef.current) {
      playLoop(nightVideo);
    }
  }, [nightActive, nightVideoReady, nightRevealed]);

  useEffect(() => {
    if (!dayVideoReady) return;
    const dayVideo = dayVideoRef.current;
    if (!dayVideo) return;

    if (dayPrimedRef.current || dayRevealed) {
      playLoop(dayVideo);
    }
  }, [dayVideoReady, sunrisePlaying, dayRevealed]);

  useLayoutEffect(() => {
    const dayVideo = dayVideoRef.current;
    const sunset = sunsetVideoRef.current;
    const sunrise = sunriseVideoRef.current;
    const nightVideo = nightVideoRef.current;

    if (isFirstThemeEffect.current) {
      isFirstThemeEffect.current = false;
      if (isDark) {
        setNightActive(true);
        setNightRevealed(true);
        setSunsetPlaying(false);
        setSunsetVisible(false);
        setSunrisePlaying(false);
        setSunriseVisible(false);
        dayVideo?.pause();
        if (nightVideo && nightVideoReady) playLoop(nightVideo);
      } else if (dayVideo && dayVideoReady) {
        setDayRevealed(true);
        playLoop(dayVideo);
      }
      return;
    }

    if (!isDark) {
      nightPrimedRef.current = false;
      setDayRevealed(false);
      dayPrimedRef.current = true;
      nightVideo?.pause();
      dayVideo?.pause();
      if (dayVideo && dayVideoReady) {
        playLoop(dayVideo);
      }
      sunset?.pause();
      sunsetModeRef.current = "idle";

      if (!sunrise) return;

      setSunrisePlaying(true);
      setSunriseVisible(false);

      const playSunriseForward = () => {
        sunriseModeRef.current = "forward";
        sunrise.currentTime = 0;
        sunrise.playbackRate = TRANSITION_SPEED;
        sunrise.loop = false;
        requestAnimationFrame(() => setSunriseVisible(true));
        void sunrise.play().catch(() => {});
      };

      if (sunrise.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        playSunriseForward();
      } else {
        sunrise.addEventListener("loadeddata", playSunriseForward, { once: true });
      }

      return;
    }

    setNightActive(false);
    setNightRevealed(false);
    nightPrimedRef.current = false;
    dayPrimedRef.current = false;
    nightVideo?.pause();
    sunrise?.pause();
    sunriseModeRef.current = "idle";
    setSunrisePlaying(false);
    setSunriseVisible(false);
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
  }, [isDark, dayVideoReady, nightVideoReady]);

  const sunsetForwardToDark = isDark && sunsetPlaying;
  const sunriseToLight = !isDark && nightActive;
  const showDayPoster =
    ((!isDark || sunsetForwardToDark) && !dayVideoReady && !sunriseToLight) ||
    (sunriseToLight && !dayRevealed);
  const showDayVideo =
    dayVideoReady &&
    (sunsetForwardToDark ||
      (dayRevealed && !sunrisePlaying) ||
      (!isDark && !sunsetPlaying && !sunrisePlaying && !nightActive));
  const showSunset = sunsetPlaying && sunsetVisible;
  const showSunrise = sunrisePlaying && sunriseVisible;
  const showNightPoster = nightActive && !nightVideoReady;
  const showNightVideo =
    nightVideoReady && nightRevealed && nightActive;

  const sunsetTransitionClass = sunsetInstantHide ? instantClass : fadeClass;
  const sunriseTransitionClass = instantClass;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-black"
    >
      <div
        className={`absolute inset-0 bg-cover bg-center ${
          showDayPoster && sunriseToLight ? instantClass : fadeClass
        } ${showDayPoster ? "opacity-100" : "opacity-0"}`}
        style={{ backgroundImage: "url(/day_final.png)" }}
      />
      <video
        ref={dayVideoRef}
        src="/daytime_vid.mp4"
        {...videoProps}
        className={`bg-video absolute inset-0 h-full w-full object-cover ${instantClass} ${
          showDayVideo ? "opacity-100" : "opacity-0"
        }`}
      />
      <video
        ref={sunsetVideoRef}
        src="/sunset_final.mp4"
        {...videoProps}
        className={`bg-video absolute inset-0 h-full w-full object-cover ${sunsetTransitionClass} ${
          showSunset ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`absolute inset-0 bg-cover bg-center ${
          showNightPoster ? "opacity-100" : "opacity-0"
        } ${showNightPoster ? instantClass : fadeClass}`}
        style={{ backgroundImage: "url(/night_final.png)" }}
      />
      <video
        ref={nightVideoRef}
        src="/nighttime_vid.mp4"
        {...videoProps}
        className={`bg-video absolute inset-0 h-full w-full object-cover ${instantClass} ${
          showNightVideo ? "opacity-100" : "opacity-0"
        }`}
      />
      <video
        ref={sunriseVideoRef}
        src="/sunrise_final.mp4"
        {...videoProps}
        className={`bg-video absolute inset-0 h-full w-full object-cover ${sunriseTransitionClass} ${
          showSunrise ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}
