import {useLoaderData} from '@remix-run/react';
import {LoaderArgs, defer} from '@shopify/remix-oxygen';
import {ReviewContainer} from '~/routes';

export async function loader({params, context, request}: LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;

  let judgeReviews = [];
  try {
    const response = await fetch(
      `https://judge.me/api/v1/reviews?api_token=${context.env.JUDGE_ME_PRIVATE_TOKEN}&shop_domain=${context.env.PUBLIC_STORE_DOMAIN}&per_page=100`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const response2 = await fetch(
      `https://judge.me/api/v1/reviews?api_token=${context.env.JUDGE_ME_PRIVATE_TOKEN}&shop_domain=${context.env.PUBLIC_STORE_DOMAIN}&page=2&per_page=100`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const data: {reviews: []} = await response.json();
    const data2: {reviews: []} = await response2.json();
    judgeReviews = data.reviews.concat(data2.reviews);
  } catch (error) {
    console.error(error);
  }
  judgeReviews = judgeReviews.filter((review) => {
    console.log(review.curated);
    return review.curated !== 'spam';
  });
  return defer({
    judgeReviews,
    analytics: {
      pageType: 'reviews',
    },
  });
}
export default function ReviewPage() {
  const {judgeReviews} = useLoaderData<typeof loader>();
  return <ReviewContainer judgeReviews={judgeReviews} />;
}
