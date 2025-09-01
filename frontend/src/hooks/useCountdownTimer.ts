import { useEffect, useState } from 'react';

interface UseCountdownTimerProps {
  targetDate: string;
  onTimerEnd?: () => void;
}

export function useCountdownTimer({ targetDate, onTimerEnd }: UseCountdownTimerProps) {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const endTime = new Date(targetDate).getTime();
      const remaining = endTime - now;
      const newTimeRemaining = Math.max(0, remaining);
      setTimeRemaining(newTimeRemaining);
      
      if (newTimeRemaining === 0 && onTimerEnd) {
        onTimerEnd();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [targetDate, onTimerEnd]);

  return timeRemaining;
}
