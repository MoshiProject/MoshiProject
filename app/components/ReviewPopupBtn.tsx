// components/ReviewPopupBtn.tsx

import {useState} from 'react';
import ReviewContainer from './Reviews/ReviewContainer';
import {useFetcher, useSubmit} from '@remix-run/react';
import {getJudgeReviews} from '~/routes'; // Adjust the path based on your project structure
import LoadingSpinner from './animations/LoadingSpinner';
import {XMarkIcon} from '@heroicons/react/20/solid';

function ReviewPopupBtn() {
  const [modalOpen, setModalOpen] = useState(false);
  const submit = useSubmit();
  const fetcher = useFetcher();

  const handleClick = async () => {
    // Use useSubmit to trigger the action and get the result

    // Update the state with the retrieved judgeReviews
    setModalOpen(true);
  };

  return (
    <>
      {/* <button
        onClick={handleClick}
        className="poop fixed z-10 right-0 top-2/3 h-24 w-6 text-neutral-100 font-semibold bg-neutral-950 text-center"
      >
        <div style={{writingMode: 'vertical-rl'}}> ★ Reviews</div>
      </button> */}
      <fetcher.Form action="/judgeReviewAction" method="post">
        <input type="hidden" name="code" value={'empty'} />
        <button
          onClick={handleClick}
          type="submit"
          className="poop fixed z-20 right-0 top-2/3 h-28 w-8 text-neutral-100 font-semibold bg-neutral-950 text-center items-center flex justify-center leading-4"
        >
          <div style={{writingMode: 'vertical-rl'}}> ★ Reviews</div>
        </button>
      </fetcher.Form>
      {modalOpen && (
        <div className="fixed z-[10000] right-0 top-0 h-full w-full bg-neutral-800 bg-opacity-75 ">
          <div className="w-full h-full relative flex justify-center items-center">
            <button
              onClick={() => {
                setModalOpen(false);
              }}
              className="absolute top-4 right-4 h-10 w-10"
            >
              <XMarkIcon className="h-12 w-12 text-white" />
            </button>
            <div className=" w-11/12 h-5/6 bg-white overflow-scroll ">
              {fetcher.data ? (
                <ReviewContainer judgeReviews={fetcher.data.judgeReviews} />
              ) : (
                <div className="flex justify-center items-center w-full h-full">
                  <LoadingSpinner />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ReviewPopupBtn;
