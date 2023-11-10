import React, {useState, useEffect} from 'react';

const CountdownTimer = () => {
  const targetDate = new Date('2023-11-15T00:00:00');
  targetDate.setHours(0, 0, 0); // Set the time to 12:00 AM
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));

  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeft = calculateTimeLeft(targetDate);
      setTimeLeft(timeLeft);

      if (timeLeft.total <= 0) {
        clearInterval(intervalId);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetDate]);

  function calculateTimeLeft(targetDate) {
    const now = new Date();
    const difference = targetDate - now;

    if (difference <= 0) {
      return {total: 0, days: 0, hours: 0, minutes: 0, seconds: 0};
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return {total: difference, days, hours, minutes, seconds};
  }

  return (
    timeLeft.total > 0 && (
      <div className="bg-neutral-950 text-white flex justify-between md:justify-center py-1 px-2">
        <div className=" flex items-end tracking-tighter text-lg md:mr-4">
          Black Friday up to{' '}
          <span className="text-red-600  ml-2"> 50% OFF</span>!
        </div>
        <div className="flex">
          <TimerComponent
            subText="DAYS"
            timeLeft={timeLeft.days.toString().padStart(2, '0')}
          />
          <TimerComponent
            subText="HRS"
            timeLeft={timeLeft.hours.toString().padStart(2, '0')}
          />
          <TimerComponent
            subText="MINS"
            timeLeft={timeLeft.minutes.toString().padStart(2, '0')}
          />
          <TimerComponent
            subText="SECS"
            timeLeft={timeLeft.seconds.toString().padStart(2, '0')}
            colon={false}
          />
        </div>
      </div>
    )
  );
};

const TimerComponent = ({timeLeft, subText, colon = true}) => {
  return (
    <div className="mr-1 flex">
      <div>
        <div className=" text-center text-[8px] text-neutral-300">
          {subText}
        </div>
        <div className="flex text-xl font-semibold">
          <div className="text-center ">{timeLeft}</div>
          {colon ? ':' : ''}
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
