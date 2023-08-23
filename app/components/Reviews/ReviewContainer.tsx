import {useState} from 'react';
import ReviewsCounter, {numberWithCommas} from './ReviewsCounter';
import {ReviewCard} from './ReviewsSection';
export default function ReviewContainer(judgeReviews: {
  judgeReviews: [
    {imageSrc: string; body: string; rating: string; reviewer: any},
  ];
}) {
  const [reviewCount, setReviewCount] = useState(5);
  const reviews = [12, 24, 45, 79, 1124];
  const reviewQuantity = reviews.reduce((partialSum, a) => partialSum + a, 0);
  return (
    <div className="block  px-3 md:mt-12 md:w-2/3 md:mx-auto ">
      <h2 className="text-center md:text-left w-full text-3xl uppercase mt-4 tracking-widest mb-[-12px]">
        Reviews
      </h2>
      <ReviewsCounter reviews={reviews} />
      <div className="border-b-2 border-neutral-200 text-sm text-neutral-500 tracking-widest">
        <span>{numberWithCommas(reviewQuantity)} reviews</span>
      </div>
      <div>
        {judgeReviews.judgeReviews.map((review, index) => (
          <ReviewCard
            className={`my-2 ${index < reviewCount ? 'block' : 'hidden'}`}
            key={'reviewCard' + index}
            imgSrc={review.imageSrc}
            author={review.reviewer.name}
            stars={review.rating}
            productImageData={review.productData}
            body={review.body}
            product={{
              url: '/products/' + review.product_handle,
              title: review.product_title,
            }}
          />
        ))}
      </div>
      <div className="flex justify-center mt-8 mb-4">
        <button
          className="bg-neutral-950 text-white rounded-md p-2 px-6"
          onClick={() => {
            setTimeout(() => {
              setReviewCount(reviewCount + 5);
            }, 350);
          }}
        >
          Show More
        </button>
      </div>
    </div>
  );
}
