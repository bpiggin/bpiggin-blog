"use client";

import { useCallback } from "react";
import { useWebHaptics } from "web-haptics/react";

export function useHapticFeedback() {
  const { trigger } = useWebHaptics();

  const hapticLight = useCallback(() => {
    void trigger("light");
  }, [trigger]);

  const hapticNudge = useCallback(() => {
    void trigger("nudge");
  }, [trigger]);

  return { hapticLight, hapticNudge };
}
