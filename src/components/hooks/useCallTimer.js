import { useState, useEffect, useRef } from "react";
import { formatDuration } from "../../utils/meetingHelpers";

/**
 * useCallTimer
 *
 * Starts a timer when the component mounts and ticks every second.
 *
 * @returns {{ elapsed: number, formatted: string }}
 *   - elapsed   Raw seconds since mount
 *   - formatted Human-readable string e.g. "04:37" or "1:02:15"
 */
export function useCallTimer() {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
  }, []);

  return {
    elapsed,
    formatted: formatDuration(elapsed),
  };
}
