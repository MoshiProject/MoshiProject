import {StarIcon} from '@heroicons/react/24/solid';
import {useState, useEffect} from 'react';

interface ReviewsCounterProps {
  reviews: number[];
}

export default function ReviewsCounter({reviews}: ReviewsCounterProps) {
  const totalReviews = reviews.reduce((acc, cur) => acc + cur, 0);
  const totalStars = reviews.reduce(
    (acc, cur, idx) => acc + cur * (idx + 1),
    0,
  );
  const averageRating = totalStars / totalReviews;
  const percentages = reviews.map((count) => count / totalReviews);
  const [filledStars, setFilledStars] = useState(0);
  const [partialStarWidth, setPartialStarWidth] = useState(
    Math.floor((averageRating - Math.floor(averageRating)) * 100),
  );

  useEffect(() => {
    setFilledStars(Math.floor(averageRating));
    setPartialStarWidth(
      Math.floor((averageRating - Math.floor(averageRating)) * 100),
    );
  }, [averageRating]);
  return (
    <div className="p-4 md:pl-0 w-full m-auto md:mx-0  md:w-5/12 mt-4">
      <div className="flex justify-center md:justify-start mb-4">
        <h2 className="text-xl tracking-widest font-semibold ml-2">
          {averageRating.toFixed(1)}
        </h2>
        <div className="flex items-center justify-center md:justify-start ml-1 mr-4">
          {[0, 1, 2, 3, 4].map((star) => {
            if (!(averageRating - star < 1 && averageRating - star > 0)) {
              return (
                <StarIcon
                  key={star}
                  className={`h-5 w-5 mb-1 tracking-widest ${
                    star <= filledStars ? 'text-black' : 'text-neutral-400'
                  }`}
                />
              );
            } else {
              return (
                <div
                  key={star}
                  className="relative"
                  style={{width: '24px', height: '24px'}}
                >
                  <StarIcon className="h-5 w-5 text-neutral-500 absolute top-0 left-0" />
                  <div
                    className="absolute top-0 left-0 overflow-hidden"
                    style={{width: `${(19 * partialStarWidth) / 100}px`}}
                  >
                    <StarIcon className="h-5 w-5 text-black" />
                  </div>
                </div>
              );
            }
          })}
        </div>
        <div className="flex items-center">
          <h3 className="text-xs  font-semibold text-neutral-500 tracking-widest">
            Based on {totalReviews} reviews
          </h3>
        </div>
      </div>

      {[5, 4, 3, 2, 1].map((star) => (
        <div key={star} className="flex items-center mb-2">
          <div className="text-xs font-medium mr-1 w-2 text-center">{star}</div>
          <div className="w-4">
            <StarIcon className="h-4 w-4 text-black" />
          </div>
          <div className="flex-1 mx-1 bg-neutral-100 rounded-full">
            <div
              style={{
                width: `${percentages[star - 1] * 100}%`,
                backgroundColor: '#b1b1b1',
                height: '6px',
                borderRadius: '999px',
              }}
            />
          </div>
          <div className="text-sm text-neutral-500">{reviews[star - 1]}</div>
        </div>
      ))}
    </div>
  );
}
