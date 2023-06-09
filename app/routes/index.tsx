import {defer, type LoaderArgs} from '@shopify/remix-oxygen';
import {Suspense, useState} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {FeaturedCollections} from '~/components/HomePage/FeaturedCollections';
import Hero from '~/components/HomePage/Hero';
import {MEDIA_FRAGMENT, PRODUCT_CARD_FRAGMENT} from '~/data/fragments';
import {getHeroPlaceholder} from '~/lib/placeholders';
import type {
  CollectionConnection,
  Metafield,
  ProductConnection,
} from '@shopify/hydrogen/storefront-api-types';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {FeaturedProductGrid} from '~/components/FeaturedProductGrid';
import ParallaxText from '~/components/HeaderMenu/ParallaxText';
import {motion} from 'framer-motion';
import {COLLECTION_QUERY, SMALL_COLLECTION_QUERY} from './collections/$handle';
import AnimeCarousel from '~/components/HomePage/AnimeCarousel';
import ItemTypeCollections from '~/components/HomePage/ItemTypeCollections';
import ReviewsCounter from '~/components/HomePage/ReviewsCounter';
import {ReviewCard} from '~/components/products/ReviewsSection';
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

  const {shop, hero} = await context.storefront.query<{
    hero: CollectionHero;
    shop: HomeSeoData;
  }>(HOMEPAGE_SEO_QUERY, {
    variables: {handle: 'freestyle'},
  });
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
    },
  );
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
    return review.curated !== 'spam';
  });
  return defer({
    shop,
    primaryHero: hero,
    judgeReviews,
    // These different queries are separated to illustrate how 3rd party content
    // fetching can be optimized for both above and below the fold.
    featuredProducts: collection,
    secondaryHero: context.storefront.query<{hero: CollectionHero}>(
      COLLECTION_HERO_QUERY,
      {
        variables: {
          handle: 'backcountry',
          country,
          language,
        },
      },
    ),
    featuredCollections: context.storefront.query<{
      collections: CollectionConnection;
    }>(FEATURED_COLLECTIONS_QUERY, {
      variables: {
        country,
        language,
      },
    }),
    tertiaryHero: context.storefront.query<{hero: CollectionHero}>(
      COLLECTION_HERO_QUERY,
      {
        variables: {
          handle: 'winter-2022',
          country,
          language,
        },
      },
    ),
    analytics: {
      pageType: AnalyticsPageType.home,
    },
  });
}

export default function Homepage() {
  const {
    primaryHero,
    secondaryHero,
    tertiaryHero,
    featuredCollections,
    featuredProducts,
    judgeReviews,
  } = useLoaderData<typeof loader>();

  // TODO: skeletons vs placeholders
  const skeletons = getHeroPlaceholder([{}, {}, {}]);

  // TODO: analytics
  // useServerAnalytics({
  //   shopify: {
  //     pageType: ShopifyAnalyticsConstants.pageType.home,
  //   },
  // });
  const titleStyling =
    'text-2xl mt-2 font-semibold  text-center px-0.5 lg:text-2xl lg:font-semibold lg:px-0 ';
  return (
    <>
      <div className="block md:hidden ">
        <Hero
          title="SPRING 2023"
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
            SPRING SALE IS LIVE | ALL ITEMS 50% OFF
          </ParallaxText>
        </motion.div>
      </div>
      <AnimeCarousel titleStyling={titleStyling} />
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
      <ReviewContainer judgeReviews={judgeReviews} />
    </>
  );
}

const COLLECTION_CONTENT_FRAGMENT = `#graphql
  ${MEDIA_FRAGMENT}
  fragment CollectionContent on Collection {
    id
    handle
    title
    descriptionHtml
    heading: metafield(namespace: "hero", key: "title") {
      value
    }
    byline: metafield(namespace: "hero", key: "byline") {
      value
    }
    cta: metafield(namespace: "hero", key: "cta") {
      value
    }
    spread: metafield(namespace: "hero", key: "spread") {
      reference {
        ...Media
      }
    }
    spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
      reference {
        ...Media
      }
    }
  }
`;

const HOMEPAGE_SEO_QUERY = `#graphql
  ${COLLECTION_CONTENT_FRAGMENT}
  query collectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
    }
    shop {
      name
      description
    }
  }
`;

const COLLECTION_HERO_QUERY = `#graphql
  ${COLLECTION_CONTENT_FRAGMENT}
  query collectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) {
      ...CollectionContent
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
export function ReviewContainer(judgeReviews: {
  judgeReviews: [
    {imageSrc: string; body: string; rating: string; reviewer: any},
  ];
}) {
  const [reviewCount, setReviewCount] = useState(5);
  const reviews = [12, 24, 45, 79, 1124];
  const reviewQuantity = reviews.reduce((partialSum, a) => partialSum + a, 0);
  return (
    <div className="block  px-3 md:mt-12 md:w-2/3 md:mx-auto">
      <h2 className="text-center md:text-left w-full text-3xl uppercase mt-4 tracking-widest mb-[-12px]">
        Reviews
      </h2>
      <ReviewsCounter reviews={reviews} />
      <div className="border-b-2 border-neutral-200 text-sm text-neutral-500 tracking-widest">
        <span>{reviewQuantity} reviews</span>
      </div>
      <div>
        {judgeReviews.judgeReviews.map((review, index) => (
          <ReviewCard
            className={`my-2 ${index < reviewCount ? 'block' : 'hidden'}`}
            key={'reviewCard' + index}
            imgSrc={review.imageSrc}
            author={review.reviewer.name}
            stars={review.rating}
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
