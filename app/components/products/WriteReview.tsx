import {Form, useActionData} from '@remix-run/react';
import {ActionArgs} from '@shopify/remix-oxygen';
import {useState} from 'react';
import {Option, Product} from './products';
import {PRODUCT_QUERY} from '~/queries/product';
import {StarIcon} from '@heroicons/react/24/solid';

function WriteReview({isAdmin}: {isAdmin: boolean}) {
  const order = useActionData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState(1);
  const [open, setOpen] = useState(false);
  const [review, setReview] = useState('');
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(5);
  return (
    <>
      {open ? (
        isAdmin ? (
          <></>
        ) : (
          <div className="flex flex-col items-center justify-center ">
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
          </div>
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
