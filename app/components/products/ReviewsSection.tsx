import React from 'react';
import {Product} from './products';
import ReviewsCounter from '../HomePage/ReviewsCounter';
import {reviews} from '~/data/reviews';
import WriteReview from './WriteReview';
import {StarIcon} from '@heroicons/react/24/solid';
import titleFilter, {getProductType} from '~/functions/titleFilter';
import {useEffect} from 'react';
type Props = {
  product: Product;
  judgeReviews: any[];
  isAdmin: boolean;
  forwardRef: any;
  setReviewCount: (value: number) => void;
};

const ReviewsSection: React.FC<Props> = ({
  product,
  judgeReviews,
  isAdmin,
  forwardRef,
  setReviewCount,
}) => {
  judgeReviews = judgeReviews.filter((review) => !review.hidden) || [];

  const reviewString = product?.metafield
    ? '[' +
      product.metafields.find((metafield) => {
        return metafield.key === 'reviews';
      }).value +
      ']'
    : [];
  const customReviews =
    reviewString && reviewString.length > 0 ? JSON.parse(reviewString) : [];
  // const imageReviews = product.metafield
  //   ? product.metafields
  //       .find((metafield) => {
  //         return metafield.key === 'reviews';
  //       })
  //       .references.nodes.map((node) => ({
  //         author: node.fields.find((field) => field.key === 'author').value,
  //         body: node.fields.find((field) => field.key === 'body').value,
  //         imageSrc: node.fields.find((field) => field.key === 'image').reference
  //           .image.url,
  //         starCount: node.fields.find((field) => field.key === 'star_count')
  //           .value,
  //       }))
  //   : [];
  const counterArr = [0, 0, 0, 0, 0];
  customReviews.forEach((review) => {
    const rating = review.rating;
    counterArr[rating - 1] += 1;
  });
  judgeReviews.forEach((review) => {
    const rating = review.rating;
    //console.log('rating: ' + rating);

    counterArr[rating - 1] += 1;
  });
  //console.log('counter', counterArr);
  const reviewCount = counterArr.reduce((partialSum, a) => partialSum + a, 0);
  const noReviews = reviewCount === 0;
  useEffect(() => {
    setReviewCount(reviewCount);
  }, [reviewCount]);
  //console.log('no reviews', noReviews);
  //console.log(`Reviews`, product);
  // console.log(`Reviews`, judgeReviews);
  return noReviews ? (
    <div ref={forwardRef}>
      <WriteReview
        isAdmin={isAdmin}
        id={product.id}
        productType={getProductType(product.title)?.toLowerCase()}
      />
    </div>
  ) : (
    <div ref={forwardRef} className="py-6 bg-white">
      <div className="max-w-screen-xl mx-auto sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-xl text-primary font-semibold tracking-wide uppercase text-center mb-4">
            CUSTOMER REVIEWS
          </h2>
        </div>
        <WriteReview
          isAdmin={isAdmin}
          id={product.id}
          productType={getProductType(product.title)?.toLowerCase()}
        />
        <ReviewsCounter reviews={counterArr} />
        <ul className="mt-2 border-t border-neutral-300 grid grid-cols-1 gap-1 md:gap-2 lg:grid-cols-1 last:border-b-0">
          {customReviews
            .sort((a, b) => b.rating - a.rating)
            .map((review, index) => (
              <ReviewCard
                key={index}
                imgSrc={review.imageSrc}
                author={review.author}
                stars={Number(review.rating)}
                body={review.body}
              />
            ))}
          {/* Judge Reviews */}
          {judgeReviews.map((review, index) => (
            <ReviewCard
              key={index}
              imgSrc={review.imageSrc}
              author={review.reviewer.name}
              stars={review.rating}
              body={review.body}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ReviewsSection;

export type ReviewCardProps = {
  author: string;
  imgSrc: string;
  stars: number;
  body: string;
  product?: {url: string; title: string};
  className?: string;
};

export function ReviewCard({
  author,
  imgSrc,
  stars,
  body,
  product,
  className = '',
}: ReviewCardProps): JSX.Element {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu');

  let initials = [...author.matchAll(rgx)] || [];

  initials = (
    (initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')
  ).toUpperCase();

  return (
    <li
      className={
        'overflow-hidden list-none border-b border-neutral-300 py-4 md:py-6 last:border-b-0 ' +
        className
      }
    >
      {imgSrc && (
        <div className="aspect-w-3 aspect-h-4">
          <img className="object-cover" src={imgSrc} alt="" />
        </div>
      )}
      <div className="">
        <div className="flex justify-between">
          <div className="flex">
            <div className="flex justify-center items-center w-12 h-12 mr-2 bg-neutral-200 rounded-full">
              <span className="font-bold text-xs">{initials}</span>
            </div>
            <div className="flex flex-col justify-center">
              <div className="font-semibold text-xs mb-1">{author}</div>
              <div className="font-semibold text-xs flex">
                Verified Buyer {verifiedBadge}
              </div>
            </div>
          </div>
          {/* <div> 2 weeks ago</div> */}
        </div>

        <div className="flex items-baseline mb-3">
          <div className="flex bg-primary text-gray-600 text-xs rounded-full uppercase font-semibold tracking-wide mt-3">
            {Array.from(Array(stars).keys()).map((star) => (
              <StarIcon
                key={star}
                className={`h-[22px] w-[22px] mb-1 text-black`}
              />
            ))}
            {Array.from(Array(5 - stars).keys()).map((star) => (
              <StarIcon
                key={star}
                className={`h-[22px] w-[22px] mb-1 text-neutral-300`}
              />
            ))}
          </div>

          <div className="ml-2 text-gray-600 text-xs uppercase font-semibold tracking-wide"></div>
        </div>

        <p className="text-neutral-950 text-sm font-semibold">{body}</p>
        {product && (
          <div className="mt-2">
            <a
              className=" flex justify-end text-xs font-semibold text-red-600"
              href={product.url}
            >
              <div className="flex">
                {titleFilter(product.title)}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-4 h-4 ml-1"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </div>
            </a>
          </div>
        )}
      </div>
    </li>
  );
}

const verifiedBadge = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-[18px] h-[18px] ml-1"
  >
    <path
      fillRule="evenodd"
      d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
      clipRule="evenodd"
    />
  </svg>
);
