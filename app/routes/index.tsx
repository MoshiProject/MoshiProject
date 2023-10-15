import {Await, useLoaderData} from '@remix-run/react';
import type {Metafield} from '@shopify/hydrogen/storefront-api-types';
import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {motion} from 'framer-motion';
import {lazy, Suspense} from 'react';
import {FeaturedProductGrid} from '~/components/FeaturedProductGrid';
import ParallaxText from '~/components/HeaderMenu/ParallaxText';
import Hero from '~/components/HomePage/Hero';
import ItemTypeCollections from '~/components/HomePage/ItemTypeCollections';
import {PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {SMALL_COLLECTION_QUERY} from './collections/$handle';

const LazyAnimeCarousel = lazy(
  () => import('~/components/HomePage/AnimeCarousel'),
);

const LazyReviewContainer = lazy(
  () => import('~/components/Reviews/ReviewContainer'),
);
interface HomeSeoData {
  shop: {
    name: string;
    description: string;
  };
}

export interface CollectionHero {
  byline: Metafield;
  cta: Metafield;
  handle: string;
  heading: Metafield;
  height?: 'full';
  loading?: 'eager' | 'lazy';
  spread: Metafield;
  spreadSecondary: Metafield;
  top?: boolean;
}

export async function loader({params, context, request}: LoaderArgs) {
  const {language, country} = context.storefront.i18n;

  if (
    params.lang &&
    params.lang.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    // If the lang URL param is defined, yet we still are on `EN-US`
    // the the lang param must be invalid, send to the 404 page
    throw new Response(null, {status: 404});
  }

  const handle = 'featured-products';
  const searchParams = new URL(request.url).searchParams;
  const sortParam = searchParams.get('sort');
  const sortDict = {
    title_asc: {sort: 'TITLE', rev: true},
    title_desc: {sort: 'TITLE', rev: false},
    price_asc: {sort: 'PRICE', rev: false},
    price_desc: {sort: 'PRICE', rev: true},
    best: {sort: 'BEST_SELLING', rev: false},
    newest: {sort: 'CREATED', rev: true},
    oldest: {sort: 'CREATED', rev: false},
    featured: {sort: null, rev: false},
  };
  const sort = sortDict[
    (sortParam !== null && sortParam
      ? sortParam
      : 'featured') as keyof typeof sortDict
  ]
    ? sortDict[sortParam !== null && sortParam ? sortParam : 'featured'].sort
    : null;

  const cursor = searchParams.get('cursor');
  const rev = sortDict[
    searchParams.get('sort') !== null && searchParams.get('sort')
      ? searchParams.get('sort')
      : 'featured'
  ]
    ? sortDict[
        searchParams.get('sort') !== null && searchParams.get('sort')
          ? searchParams.get('sort')
          : 'featured'
      ].rev
    : null;

  const {collection}: any = await context.storefront.query(
    SMALL_COLLECTION_QUERY,
    {
      variables: {
        handle,
        cursor,
        rev,
        sort,
      },
      cache: context.storefront.CacheLong(),
    },
  );

  return defer({
    judgeReviews: await getJudgeReviews(context),
    featuredProducts: collection,
  });
}

export const getJudgeReviews = async (context) => {
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
    const judgeGIDs = judgeReviews.map((review) => {
      const gid = 'gid://shopify/Product/' + review.product_external_id;
      return gid;
    });
    console.log('judgeGIDs', judgeGIDs);
    console.time('get image Data');

    const moreData: any = await context.storefront.query(
      PRODUCT_LIST_IMAGES_QUERY,
      {
        variables: {
          ids: judgeGIDs,
        },
      },
    );
    console.timeEnd('get image Data');
    judgeReviews = judgeReviews.map((review, index) => {
      review.productData = moreData.nodes[index];
      return review;
    });

    judgeReviews = judgeReviews.filter((review) => {
      return review.curated !== 'spam';
    });

    return judgeReviews;
  } catch (error) {
    console.error(error);
  }
};

export default function Homepage() {
  const {featuredProducts, judgeReviews} = useLoaderData<typeof loader>();

  const titleStyling =
    'text-2xl mt-2 font-semibold  text-center px-0.5 lg:text-2xl lg:font-semibold lg:px-0 ';
  return (
    <>
      <div className="block md:hidden ">
        <Hero
          title="FALL 2023"
          subtitle="ANIME MEETS STREETWEAR"
          buttonText="Shop Now →"
          imageUrl="https://cdn.shopify.com/s/files/1/0552/4121/2109/files/3.5sec.gif?v=1681722723"
          isGif
        />
      </div>
      <div className="hidden md:block md:mx-[-48px]">
        <Hero
          title="SPRING 2023"
          subtitle="ANIME MEETS STREETWEAR"
          buttonText="Shop Now →"
          imageUrl="https://cdn.shopify.com/s/files/1/0552/4121/2109/files/t-shirt-mockup-of-a-cool-man-posing-in-a-dark-alley-2357-el1.png
          "
          isGif
        />
      </div>
      <div className="h-12 block md:hidden">
        <motion.div
          initial={{height: 0, opacity: 0}}
          animate={{height: 48, opacity: 1}}
          transition={{delay: 0.2, type: 'tween', duration: 0.5}}
          className="relative h-12 w-full bg-white border-y border-neutral-200 text-neutral-950 flex justify-center items-center pb-3"
        >
          {' '}
          <ParallaxText baseVelocity={5}>
            FALL SALE IS LIVE | ALL ITEMS 50% OFF
          </ParallaxText>
        </motion.div>
      </div>
      <LazyAnimeCarousel titleStyling={titleStyling} />
      {featuredProducts && (
        <Suspense>
          <Await resolve={featuredProducts}>
            {({products}) => {
              if (!products?.nodes) return <></>;
              return (
                <FeaturedProductGrid
                  titleStyling={titleStyling}
                  products={products.nodes}
                  title="Featured Products"
                  count={12}
                />
              );
            }}
          </Await>
        </Suspense>
      )}
      <ItemTypeCollections />
      <Suspense>
        <LazyReviewContainer judgeReviews={judgeReviews} />;
      </Suspense>
    </>
  );
}
const PRODUCT_LIST_IMAGES_QUERY = `#graphql
query getProductImagesViaID($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on Product {
      id
      title
      handle
    media(first: 1) {
      edges {
        node {
          
          mediaContentType
          alt
          ...mediaFieldsByType
        }
      }
    }
    }
  }
}

fragment mediaFieldsByType on Media {
  ... on ExternalVideo {
    id
    embeddedUrl
  }
  ... on MediaImage {
    image {
      url
    }
  }
  ... on Model3d {
    sources {
      url
      mimeType
      format
      filesize
    }
  }
  ... on Video {
    sources {
      url
      mimeType
      format
      height
      width
    }
  }
}
`;

// @see: https://shopify.dev/api/storefront/latest/queries/products
export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  ${PRODUCT_CARD_FRAGMENT}
  query homepageFeaturedProducts($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 12) {
      nodes {
        ...ProductCard
      }
    }
  }
`;

// @see: https://shopify.dev/api/storefront/latest/queries/collections
export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query homepageFeaturedCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(
      first: 8,
      sortKey: UPDATED_AT
    ) {
      nodes {
        id
        title
        handle
        image {
          altText
          width
          height
          url
        }
      }
    }
  }
`;
