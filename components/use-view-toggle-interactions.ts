"use client";

import {
  useCallback,
  useRef,
  type MouseEvent,
  type TouchEvent,
  type WheelEvent,
} from "react";

const DOUBLE_TAP_MS = 300;
const SWIPE_THRESHOLD = 50;
const WHEEL_THRESHOLD = 80;
const WHEEL_COOLDOWN_MS = 800;
const WHEEL_IDLE_MS = 200;

function isLinkTarget(target: EventTarget | null) {
  return target instanceof Element && target.closest("a") !== null;
}

type UseViewToggleInteractionsOptions = {
  onToggle: () => void;
};

export function useViewToggleInteractions({
  onToggle,
}: UseViewToggleInteractionsOptions) {
  const lastTapTimeRef = useRef(0);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const touchLastRef = useRef<{ x: number; y: number } | null>(null);
  const touchDeltaRef = useRef(0);
  const gestureHandledRef = useRef(false);
  const wheelAccumRef = useRef(0);
  const lastWheelToggleRef = useRef(0);
  const wheelIdleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = useCallback(() => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < DOUBLE_TAP_MS) {
      lastTapTimeRef.current = 0;
      return;
    }
    lastTapTimeRef.current = now;
    onToggle();
  }, [onToggle]);

  const onClick = useCallback(
    (e: MouseEvent) => {
      if (e.defaultPrevented || isLinkTarget(e.target)) return;
      if (gestureHandledRef.current) {
        gestureHandledRef.current = false;
        return;
      }
      handleTap();
    },
    [handleTap],
  );

  const onTouchStart = useCallback((e: TouchEvent) => {
    if (isLinkTarget(e.target)) return;
    const touch = e.touches[0];
    if (!touch) return;

    const point = { x: touch.clientX, y: touch.clientY };
    touchStartRef.current = point;
    touchLastRef.current = point;
    touchDeltaRef.current = 0;
    gestureHandledRef.current = false;
  }, []);

  const onTouchMove = useCallback((e: TouchEvent) => {
    if (!touchLastRef.current || isLinkTarget(e.target)) return;
    const touch = e.touches[0];
    if (!touch) return;

    touchDeltaRef.current +=
      Math.abs(touch.clientX - touchLastRef.current.x) +
      Math.abs(touch.clientY - touchLastRef.current.y);
    touchLastRef.current = { x: touch.clientX, y: touch.clientY };
  }, []);

  const onTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (isLinkTarget(e.target)) return;

      const start = touchStartRef.current;
      const touch = e.changedTouches[0];
      if (!start || !touch) return;

      const displacement =
        Math.abs(touch.clientX - start.x) + Math.abs(touch.clientY - start.y);

      if (
        displacement >= SWIPE_THRESHOLD ||
        touchDeltaRef.current >= SWIPE_THRESHOLD
      ) {
        gestureHandledRef.current = true;
        onToggle();
        e.preventDefault();
      } else {
        handleTap();
        gestureHandledRef.current = true;
      }

      touchStartRef.current = null;
      touchLastRef.current = null;
      touchDeltaRef.current = 0;
    },
    [handleTap, onToggle],
  );

  const onWheel = useCallback(
    (e: WheelEvent) => {
      if (isLinkTarget(e.target)) return;
      if (Date.now() - lastWheelToggleRef.current < WHEEL_COOLDOWN_MS) return;

      if (wheelIdleTimerRef.current) {
        clearTimeout(wheelIdleTimerRef.current);
      }
      wheelIdleTimerRef.current = setTimeout(() => {
        wheelAccumRef.current = 0;
        wheelIdleTimerRef.current = null;
      }, WHEEL_IDLE_MS);

      wheelAccumRef.current += Math.abs(e.deltaX) + Math.abs(e.deltaY);

      if (wheelAccumRef.current >= WHEEL_THRESHOLD) {
        wheelAccumRef.current = 0;
        lastWheelToggleRef.current = Date.now();
        onToggle();
      }
    },
    [onToggle],
  );

  return {
    onClick,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onWheel,
  };
}
