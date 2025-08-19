import { useState, useEffect, useCallback } from 'react';

export const useAutoRefresh = (intervalSeconds: number = 300) => { // 5 minutes default
  const [countdown, setCountdown] = useState(intervalSeconds);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refresh = useCallback(() => {
    setIsRefreshing(true);
    // Simulate data refresh
    setTimeout(() => {
      setIsRefreshing(false);
      setCountdown(intervalSeconds);
    }, 2000);
  }, [intervalSeconds]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          refresh();
          return intervalSeconds;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [intervalSeconds, refresh]);

  return { countdown, isRefreshing, refresh };
};