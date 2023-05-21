import React from 'react';
import {Product} from './products';
import ReviewsCounter from '../HomePage/ReviewsCounter';
import {reviews} from '~/data/reviews';
import WriteReview from './WriteReview';

type Props = {
  product: Product;
  judgeReviews: any[];
  isAdmin: boolean;
};

const ReviewsSection: React.FC<Props> = ({product, judgeReviews, isAdmin}) => {
  judgeReviews = judgeReviews.filter((review) => !review.hidden) || [];

  //console.log('judgeReviews', judgeReviews);
  const imageReviews = product.metafield
    ? product.metafields
        .find((metafield) => {
          return metafield.key === 'reviews';
        })
        .references.nodes.map((node) => ({
          author: node.fields.find((field) => field.key === 'author').value,
          body: node.fields.find((field) => field.key === 'body').value,
          imageSrc: node.fields.find((field) => field.key === 'image').reference
            .image.url,
          starCount: node.fields.find((field) => field.key === 'star_count')
            .value,
        }))
    : [];
  const counterArr = [0, 0, 0, 0, 0];
  imageReviews.forEach((review) => {
    const rating = review.starCount;
    counterArr[rating - 1] += 1;
    //console.log('rating: ' + rating);
  });
  judgeReviews.forEach((review) => {
    const rating = review.rating;
    //console.log('rating: ' + rating);

    counterArr[rating - 1] += 1;
  });
  //console.log('counter', counterArr);
  const noReviews =
    counterArr.reduce((partialSum, a) => partialSum + a, 0) === 0;
  //console.log('no reviews', noReviews);

  //console.log(`Reviews`, product);
  // console.log(`Reviews`, judgeReviews);
  return noReviews ? (
    <div>
      <WriteReview />
    </div>
  ) : (
    <div className="py-6 bg-white">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase text-center mb-2">
            Customer Reviews
          </h2>
        </div>
        <WriteReview isAdmin />
        <ReviewsCounter reviews={counterArr} />
        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-3">
          {imageReviews.map((review, index) => (
            <ReviewCard
              key={index}
              imgSrc={review.imageSrc}
              author={review.author}
              stars={Number(review.starCount)}
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
        </div>
      </div>
    </div>
  );
};

export default ReviewsSection;

type ReviewCardProps = {
  author: string;
  imgSrc: string;
  stars: number;
  body: string;
};

function ReviewCard({
  author,
  imgSrc,
  stars,
  body,
}: ReviewCardProps): JSX.Element {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      {imgSrc && (
        <div className="aspect-w-3 aspect-h-4">
          <img className="object-cover" src={imgSrc} alt="" />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-baseline mb-4">
          <span className="inline-block bg-primary text-gray-600 text-xs px-2 rounded-full uppercase font-semibold tracking-wide">
            {stars} Stars
          </span>
          <div className="ml-2 text-gray-600 text-xs uppercase font-semibold tracking-wide">
            {author}
          </div>
        </div>
        <p className="text-gray-700 text-sm">{body}</p>
      </div>
    </div>
  );
}
