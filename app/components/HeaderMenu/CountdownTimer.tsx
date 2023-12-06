import React, {useState, useEffect} from 'react';

const CountdownTimer = () => {
  const targetDate = new Date();
  const currentHour = targetDate.getHours();

  // Check if the current time is past 2 AM
  if (currentHour >= 2) {
    targetDate.setDate(targetDate.getDate() + 1); // Add one day
  }

  // Set the time to 2 AM
  targetDate.setHours(2, 0, 0, 0);
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(targetDate));
  const [timerObjects, setTimerObjects] = useState(
    <>
      <TimerComponent subText="DAYS" timeLeft={'00'} />
      <TimerComponent
        subText="HRS"
        timeLeft={timeLeft.hours.toString().padStart(2, '0')}
      />
      <TimerComponent
        subText="MINS"
        timeLeft={timeLeft.minutes.toString().padStart(2, '0')}
      />
      <TimerComponent subText="SECS" timeLeft={'00'} colon={false} />
    </>,
  );
  useEffect(() => {
    const intervalId = setInterval(() => {
      const timeLeftInner = calculateTimeLeft(targetDate);
      setTimeLeft(timeLeftInner);

      if (timeLeftInner.total <= 0) {
        clearInterval(intervalId);
      }
      setTimerObjects(
        <>
          <TimerComponent
            subText="DAYS"
            timeLeft={timeLeftInner.days.toString().padStart(2, '0')}
          />
          <TimerComponent
            subText="HRS"
            timeLeft={timeLeftInner.hours.toString().padStart(2, '0')}
          />
          <TimerComponent
            subText="MINS"
            timeLeft={timeLeftInner.minutes.toString().padStart(2, '0')}
          />
          <TimerComponent
            subText="SECS"
            timeLeft={timeLeftInner.seconds.toString().padStart(2, '0')}
            colon={false}
          />
        </>,
      );
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      {timeLeft.total > 0 && (
        <div className="bg-neutral-950 text-white flex justify-between md:justify-center py-1 px-2">
          <div className=" flex items-center tracking-tighter text-[15px] md:mr-4">
            EXTENDED BLACK FRIDAY{' '}
            <span className="text-red-600  ml-2 text-[17px]"> 70% OFF</span>!
          </div>
          <div className="flex">{timerObjects}</div>
        </div>
      )}
    </>
  );
};

/**
 * Renders a Timer Component with the given time, subtext, and colon option.
 *
 * @param {number} timeLeft - The time to be displayed in the Timer Component.
 * @param {string} subText - The text to be displayed below the time in the Timer Component.
 * @param {boolean} colon - Optional. Determines whether a colon should be displayed after the time.
 * @return {JSX.Element} The Timer Component.
 */
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

/**
 * Calculates the time left until a target date.
 *
 * @param {Date} targetDate - The target date to calculate the time left for.
 * @return {Object} An object containing the total time left and the breakdown in days, hours, minutes, and seconds.
 */
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
