"use client";

import { useState, useEffect } from "react";

interface CountdownTimerProps {
  endTime: string;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ endTime }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const calculateTimeLeft = (): TimeLeft => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const difference = end - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime]);

  const formatNumber = (num: number): string => {
    return num.toString().padStart(2, "0");
  };

  return (
    <div className="flex items-center gap-1 md:gap-2">
      <div className="flex flex-col items-center">
        <span className="bg-foreground text-background px-1.5 md:px-2 py-1 rounded text-xs md:text-sm font-bold min-w-[1.5rem] md:min-w-[2rem] text-center">
          {formatNumber(timeLeft.days)}
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5 hidden md:block">Days</span>
      </div>
      <span className="text-foreground font-bold">:</span>
      <div className="flex flex-col items-center">
        <span className="bg-foreground text-background px-1.5 md:px-2 py-1 rounded text-xs md:text-sm font-bold min-w-[1.5rem] md:min-w-[2rem] text-center">
          {formatNumber(timeLeft.hours)}
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5 hidden md:block">Hr</span>
      </div>
      <span className="text-foreground font-bold">:</span>
      <div className="flex flex-col items-center">
        <span className="bg-foreground text-background px-1.5 md:px-2 py-1 rounded text-xs md:text-sm font-bold min-w-[1.5rem] md:min-w-[2rem] text-center">
          {formatNumber(timeLeft.minutes)}
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5 hidden md:block">Min</span>
      </div>
      <span className="text-foreground font-bold">:</span>
      <div className="flex flex-col items-center">
        <span className="bg-foreground text-background px-1.5 md:px-2 py-1 rounded text-xs md:text-sm font-bold min-w-[1.5rem] md:min-w-[2rem] text-center">
          {formatNumber(timeLeft.seconds)}
        </span>
        <span className="text-[10px] text-muted-foreground mt-0.5 hidden md:block">Sec</span>
      </div>
    </div>
  );
}
