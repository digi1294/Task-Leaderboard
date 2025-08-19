import { useState, useEffect } from 'react';

export type TimeMode = 'morning' | 'focus' | 'lunch' | 'endday' | 'normal';

export const useTimeControl = () => {
  const [timeMode, setTimeMode] = useState<TimeMode>('normal');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTimeAndMode = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const currentMinutes = hours * 60 + minutes;

      // --- THIS IS THE FIX ---
      // The schedule has been updated. Lunch now starts at 1:30 PM.
      const morningStart = 10 * 60;     // 10:00 AM
      const focusStart = 10 * 60 + 30;  // 10:30 AM
      const focusEnd = 13 * 60;         // 1:00 PM
      const lunchStart = 13 * 60 + 30;    // 1:30 PM
      const lunchEnd = 14 * 60;      // 2:00 PM
      const endDay = 18 * 60 + 30;      // 6:30 PM

      let newMode: TimeMode = 'normal';

      if (currentMinutes >= endDay) {
        newMode = 'endday';
      } else if (currentMinutes >= lunchStart && currentMinutes < lunchEnd) {
        newMode = 'lunch';
      } else if (currentMinutes >= focusStart && currentMinutes < focusEnd) {
        newMode = 'focus';
      } else if (currentMinutes >= morningStart && currentMinutes < focusStart) {
        newMode = 'morning';
      }

      setTimeMode(newMode);

      // Format current time
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      };
      setCurrentTime(now.toLocaleDateString('en-US', options));
    };

    updateTimeAndMode();
    const timer = setInterval(updateTimeAndMode, 1000);
    return () => clearInterval(timer);
  }, []);

  return { timeMode, currentTime };
};
