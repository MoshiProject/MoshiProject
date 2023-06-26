import {Form, useActionData} from '@remix-run/react';
import {useState} from 'react';
import {StarIcon, XMarkIcon} from '@heroicons/react/24/solid';
import {
  authors,
  reviews as reviewData,
  midreviews as midReviewData,
} from '~/data/reviews';
import {motion} from 'framer-motion';

function useForceUpdate() {
  const [value, setValue] = useState(0); // integer state
  return () => setValue((value) => value + 1); // update state to force render
  // A function that increment 👆🏻 the previous state like here
  // is better than directly setting `setValue(value + 1)`
}

function WriteReview({
  isAdmin,
  id,
  productType,
}: {
  isAdmin: boolean;
  id: string;
  productType: string;
}) {
  const order = useActionData();
  const [quantity, setQuantity] = useState(0);
  const [emptyQuantity, setEmptyQuantity] = useState(0);
  const [fiveQuantity, setFiveQuantity] = useState(0);
  const [fourQuantity, setFourQuantity] = useState(0);
  const [threeQuantity, setThreeQuantity] = useState(0);
  const [twoQuantity, setTwoQuantity] = useState(0);
  const [oneQuantity, setOneQuantity] = useState(0);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [orderNumber, setOrderNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState('');
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(5);
  const [reviews, setReviews] = useState([]);

  const forceUpdate = useForceUpdate();

  const hoodieReviews = [
    reviewData,
    reviewData,
    midReviewData,
    midReviewData,
    midReviewData,
  ];
  const handleAdminForm = () => {
    const reviewQuantitiyArr = [0, 0, 0, 0, 0];
    const reviewQuantity = parseInt(quantity);
    reviewQuantitiyArr[0] = fiveQuantity ? parseInt(fiveQuantity) : 0;
    reviewQuantitiyArr[1] = fourQuantity ? parseInt(fourQuantity) : 0;
    reviewQuantitiyArr[2] = threeQuantity ? parseInt(threeQuantity) : 0;
    reviewQuantitiyArr[3] = twoQuantity ? parseInt(twoQuantity) : 0;
    reviewQuantitiyArr[4] = oneQuantity ? parseInt(oneQuantity) : 0;
    console.log(
      'aaaaa',
      fiveQuantity,
      fourQuantity,
      threeQuantity,
      twoQuantity,
      oneQuantity,
    );
    console.log('reviewQuantitiyArr', reviewQuantitiyArr);
    console.log(
      'nul',
      quantity !== null ? quantity : 0,
      reviewQuantitiyArr.reduce((partialSum, a) => {
        console.log('sum', a, partialSum);
        return a ? partialSum + a : 0;
      }, 0),
    );
    const additionalReviewsToGenerate =
      (reviewQuantity !== null ? reviewQuantity : 0) -
      reviewQuantitiyArr.reduce(
        (partialSum, a) => (a ? partialSum + a : partialSum),
        0,
      );
    for (let i = 0; i < additionalReviewsToGenerate; i++) {
      const rand = Math.random();
      if (rand < 0.8) {
        reviewQuantitiyArr[0] += 1;
      } else if (rand < 0.92) {
        reviewQuantitiyArr[1] += 1;
      } else if (rand < 0.97) {
        reviewQuantitiyArr[2] += 1;
      } else {
        reviewQuantitiyArr[4] += 1;
      }
      console.log(reviewQuantitiyArr);
    }

    const revs = [];
    reviewQuantitiyArr.forEach((quantity, index) => {
      const reviewsArray = hoodieReviews[index];
      for (let i = 0; i < quantity; i++) {
        revs.push({
          author: authors[Math.floor(Math.random() * authors.length)],
          body: reviewsArray[
            Math.floor(Math.random() * reviewsArray.length)
          ].replace('{productType}', productType),
          rating: 5 - index,
        });
      }
    });
    if (emptyQuantity) {
      for (let i = 0; i < emptyQuantity; i++) {
        let rand = Math.floor(Math.random() * revs.length);
        while (revs[rand] === '') {
          rand = Math.floor(Math.random() * revs.length);
        }
        revs[rand].body = '';
      }
    }
    setReviews(revs);
  };
  return (
    <>
      {open ? (
        isAdmin ? (
          reviews.length === 0 ? (
            <>
              <div className="flex flex-col items-center justify-center relative">
                <Form
                  className="rounded px-4 pt-6 pb-2 mb-4 w-full md:w-1/3 h-2/3 flex flex-col items-center justify-center"
                  method="post"
                >
                  <h1 className="font-semibold text-3xl mb-2 text-center">
                    Admin Panel
                  </h1>

                  <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="Name"
                    >
                      Total Number of Reviews
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="quantity"
                      type="number"
                      name="quantity"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  {/* empty review quantity */}
                  <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="emptyQuantity"
                    >
                      Number of Empty Reviews
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="emptyQuantity"
                      type="number"
                      name="emptyQuantity"
                      value={emptyQuantity}
                      onChange={(e) => setEmptyQuantity(e.target.value)}
                    />
                  </div>
                  {/* 5 Star Reviews */}
                  <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="fiveQuantity"
                    >
                      Number of 5 Star Reviews
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="fiveQuantity"
                      type="number"
                      name="fiveQuantity"
                      value={fiveQuantity}
                      onChange={(e) => setFiveQuantity(e.target.value)}
                    />
                  </div>
                  {/* 4 Star Reviews */}
                  <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="fourQuantity"
                    >
                      Number of 4 Star Reviews
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="fourQuantity"
                      type="number"
                      name="fourQuantity"
                      value={fourQuantity}
                      onChange={(e) => setFourQuantity(e.target.value)}
                    />
                  </div>
                  {/* 3 Star Reviews */}
                  <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="threeQuantity"
                    >
                      Number of 3 Star Reviews
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="threeQuantity"
                      type="number"
                      name="threeQuantity"
                      value={threeQuantity}
                      onChange={(e) => setThreeQuantity(e.target.value)}
                    />
                  </div>
                  {/* 2 Star Reviews */}
                  <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="twoQuantity"
                    >
                      Number of 2 Star Reviews
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="twoQuantity"
                      type="number"
                      name="twoQuantity"
                      value={twoQuantity}
                      onChange={(e) => setTwoQuantity(e.target.value)}
                    />
                  </div>
                  {/* 1 Star Reviews */}
                  <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="oneQuantity"
                    >
                      Number of 1 Star Reviews
                    </label>
                    <input
                      className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="oneQuantity"
                      type="number"
                      name="oneQuantity"
                      value={oneQuantity}
                      onChange={(e) => setOneQuantity(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-center">
                    {/* <button
                    className="bg-neutral-950 hover:bg-neutral-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                    type="submit"
                  >
                    Submit
                  </button> */}
                    <div className="text-xl mx-2">
                      A:{' '}
                      {(parseInt(fiveQuantity) * 5 +
                        parseInt(fourQuantity) * 4 +
                        parseInt(threeQuantity) * 3 +
                        parseInt(twoQuantity) * 2 +
                        parseInt(oneQuantity) * 1) /
                        parseInt(quantity)}
                    </div>

                    <div>
                      <button
                        className="bg-neutral-950 hover:bg-neutral-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                        onClick={() => {
                          handleAdminForm();
                        }}
                      >
                        Generate Reviews
                      </button>
                    </div>
                    <div className="text-xl mx-2">
                      R:{' '}
                      {parseInt(quantity) -
                        (parseInt(fiveQuantity) +
                          parseInt(fourQuantity) +
                          parseInt(threeQuantity) +
                          parseInt(twoQuantity) +
                          parseInt(oneQuantity))}
                    </div>
                  </div>
                </Form>
              </div>
              )
            </>
          ) : (
            <Form method="post">
              <button
                className="bg-neutral-950 hover:bg-neutral-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                type="submit"
              >
                Submit
              </button>
              <div className="flex flex-col items-center justify-center ">
                {reviews.map((review, index) => {
                  console.log(review);
                  return (
                    <div
                      key={review.body + index + review.rating}
                      className="shadow-sm rounded-lg border border-neutral-200 w-1/3 h-42 p-4 mb-4"
                    >
                      <div>Author: {review.author}</div>
                      <div className="mt-2" key={review.body}>
                        Body: {review.body}
                        <button
                          className="bg-neutral-950 text-white rounded-md p-1 mx-2 h-8 w-8"
                          onClick={() => {
                            const originalReview = reviews[index];
                            originalReview.body =
                              hoodieReviews[5 - review.rating][
                                Math.floor(
                                  Math.random() *
                                    hoodieReviews[5 - review.rating].length,
                                )
                              ];
                            const newReviews = reviews;
                            newReviews[index] = originalReview;
                            setReviews(newReviews);
                            forceUpdate();
                          }}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
                            />
                          </svg>
                        </button>
                        <button
                          className="bg-neutral-950 text-white rounded-md p-1 mx-2 h-8 w-8"
                          onClick={() => {
                            const originalReview = reviews[index];
                            originalReview.body = '';
                            const newReviews = reviews;
                            newReviews[index] = originalReview;
                            setReviews(newReviews);
                            forceUpdate();
                          }}
                        >
                          x
                        </button>
                      </div>
                      <div className="mt-2">
                        Rating: {review.rating}
                        <button
                          className="bg-neutral-950 text-white rounded-md p-1 mx-2 h-8 w-8"
                          onClick={() => {
                            const originalReview = reviews[index];
                            originalReview.rating = Math.min(
                              5,
                              originalReview.rating + 1,
                            );
                            console.log(originalReview.rating);
                            const newReviews = reviews;
                            newReviews[index] = originalReview;
                            setReviews(newReviews);
                            forceUpdate();
                          }}
                        >
                          +
                        </button>
                        <button
                          className="bg-neutral-950 text-white rounded-md p-1 mx-2 h-8 w-8"
                          onClick={() => {
                            const originalReview = reviews[index];
                            originalReview.rating = Math.max(
                              1,
                              originalReview.rating - 1,
                            );
                            console.log(originalReview.rating);
                            const newReviews = reviews;
                            newReviews[index] = originalReview;
                            setReviews(newReviews);
                            forceUpdate();
                          }}
                        >
                          -
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* reviewsString */}
              <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                <input
                  className="hidden shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="reviewsString"
                  type="text"
                  name="reviewsString"
                  value={reviews
                    .map((review) => JSON.stringify(review))
                    .toString()}
                />
              </div>
              {/* productID */}
              <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                <input
                  className="hidden shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="idString"
                  type="text"
                  name="idString"
                  value={id}
                />
              </div>
            </Form>
          )
        ) : (
          <motion.div
            initial={{height: 0, opacity: 0}}
            animate={{height: 'fit-content', opacity: 1}}
            exit={{height: 0, opacity: 0}}
            className="flex flex-col items-center justify-center relative overflow-hidden"
          >
            <div className="absolute top-2 right-2">
              <button
                onClick={() => {
                  setOpen(false);
                }}
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <Form
              className="rounded px-4 pt-6 pb-2 mb-4 w-full md:w-1/3 h-2/3 flex flex-col items-center justify-center"
              method="post"
            >
              <h1 className="font-semibold text-3xl mb-2 text-center">
                Write a Review
              </h1>

              <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="Name"
                >
                  Name
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="name"
                  type="text"
                  name="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              {/* email */}
              <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  type="email"
                  name="user_email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              {/* review */}
              <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="review"
                >
                  Review
                </label>
                <textarea
                  className="shadow appearance-none border rounded w-full h-32 py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="review"
                  name="review_body"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
              </div>
              {/* star rating */}
              <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="email"
                >
                  Rating
                </label>
                <input
                  className="shadow hidden appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="rating"
                  type="text"
                  name="rating"
                  value={rating}
                />
                <div className="flex w-full justify-center">
                  {[...Array(5)].map((_, index) => {
                    const starIndex = index + 1;

                    return (
                      <button
                        key={starIndex}
                        type="button"
                        className={
                          starIndex <= (hover || rating)
                            ? 'text-black fill-black'
                            : 'text-neutral-300'
                        }
                        onClick={() => setRating(starIndex)}
                        onMouseEnter={() => setHover(starIndex)}
                        onMouseLeave={() => setHover(rating)}
                      >
                        <StarIcon key={index} className={`h-8 w-8 mb-1`} />
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="flex items-center justify-center">
                <button
                  className="bg-neutral-950 hover:bg-neutral-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                  type="submit"
                >
                  Submit
                </button>
              </div>
            </Form>
          </motion.div>
        )
      ) : (
        <div className="flex justify-center ">
          <button
            className="bg-neutral-950 rounded text-white py-2 px-4 font-semibold"
            onClick={() => setOpen(!open)}
          >
            Write a Review
          </button>
        </div>
      )}
    </>
  );
}

export default WriteReview;
