import React, {useState, useEffect} from 'react';

const CountdownTimer = () => {
  let targetDate = new Date('2023-11-25T02:00:00');
  let counter = 1;
  while (calculateTimeLeft(targetDate).total <= 0) {
    targetDate = new Date('2023-12-' + (1 + counter).toString() + 'T02:00:00');
    counter++;
  }

  targetDate.setHours(2, 0, 0); // Set the time to 12:00 AM
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
        <div className=" flex items-center tracking-tighter text-[15px] md:mr-4">
          EXTENDED BLACK FRIDAY{' '}
          <span className="text-red-600  ml-2 text-[17px]"> 70% OFF</span>!
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
