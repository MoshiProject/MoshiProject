import {Product} from './products';

type Props = {
  product: Product;
  judgeReviews: any[];
  isAdmin: boolean;
};

const ReviewsSectionHome: React.FC<Props> = ({judgeReviews}) => {
  judgeReviews = judgeReviews.filter((review) => !review.hidden) || [];

  //console.log('judgeReviews', judgeReviews);
  const reviewString = product?.metafield
    ? '[' +
      product.metafields.find((metafield) => {
        return metafield.key === 'reviews';
      }).value +
      ']'
    : [];
  const customReviews =
    reviewString && reviewString.length > 0 ? JSON.parse(reviewString) : [];

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
  const noReviews =
    counterArr.reduce((partialSum, a) => partialSum + a, 0) === 0;
  //console.log('no reviews', noReviews);
  //console.log(`Reviews`, product);
  // console.log(`Reviews`, judgeReviews);
  return noReviews ? (
    <div>
      <WriteReview isAdmin={isAdmin} id={product.id} />
    </div>
  ) : (
    <div className="py-6 bg-white">
      <div className="max-w-screen-xl mx-auto sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase text-center mb-2">
            Customer Reviews
          </h2>
        </div>
        <WriteReview isAdmin={isAdmin} />
        <ReviewsCounter reviews={counterArr} />
        <div className="mt-2 border-t border-neutral-300 grid grid-cols-1 gap-1 md:gap-2 lg:grid-cols-1">
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
        </div>
      </div>
    </div>
  );
};

export default ReviewsSectionHome;
