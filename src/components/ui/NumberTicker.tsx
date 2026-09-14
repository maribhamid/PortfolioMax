import React, { useEffect, useRef, useState } from 'react';

interface NumberTickerProps {
  value: string;
  className?: string;
}

export const NumberTicker: React.FC<NumberTickerProps> = ({ value, className = '' }) => {
  const [displayValue, setDisplayValue] = useState(value);
  const numericMatch = value.match(/\d+(\.\d+)?/);
  const prefix = value.slice(0, numericMatch?.index ?? 0);
  const targetNumber = numericMatch ? parseFloat(numericMatch[0]) : null;
  const suffix = numericMatch
    ? value.slice((numericMatch.index ?? 0) + numericMatch[0].length)
    : '';

  useEffect(() => {
    if (targetNumber === null) {
      setDisplayValue(value);
      return;
    }

    let start = 0;
    const duration = 1200;
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(start + (targetNumber - start) * easeProgress);

      setDisplayValue(`${prefix}${currentVal}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    requestAnimationFrame(animate);
  }, [value, targetNumber]);

  return <span className={className}>{displayValue}</span>;
};
