// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useLoaderData} from '@remix-run/react';
import {Image, type SeoHandleFunction} from '@shopify/hydrogen';
import {json, type LoaderArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {lazy, useEffect, useState} from 'react';
import {Product} from '~/components/products/products';
import {animeNames, productTypes} from '~/functions/titleFilter';
import ProductGrid from '../../components/collections/ProductGrid';
import AnimeCarousel from '~/components/HomePage/AnimeCarousel';
const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.collection?.title,
  description: data?.collection?.description,
});

export const handle = {
  seo,
};
const LazyAnimeCarousel = lazy(
  () => import('~/components/HomePage/AnimeCarousel'),
);
export async function loader({params, context, request}: LoaderArgs) {
  const {handle} = params;
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

  // try {
  //   const response = await fetch(
  //     'https://moshiproject.myshopify.com/admin/api/2023-04/graphql.json',
  //     {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'X-Shopify-Access-Token': context.env.ADMIN_API_ACCESS_TOKEN,
  //       },
  //       body: JSON.stringify({
  //         query: `mutation {
  //           metafieldStorefrontVisibilityCreate(
  //             input: {
  //               namespace: "collectionPage"
  //               key: "img"
  //               ownerType: PRODUCT
  //             }
  //           ) {
  //             metafieldStorefrontVisibility {
  //               id
  //             }
  //             userErrors {
  //               field
  //               message
  //             }
  //           }
  //         }
  //         `,
  //       }),
  //     },
  //   );

  //   const data = await response.json();
  // } catch (error) {
  //   console.error(error);
  // }

  const sort = sortDict[
    sortParam !== null && sortParam ? sortParam : 'featured'
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

  const {collection}: any = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      cursor,
      rev,
      sort,
      analytics: {
        pageType: 'collection',
      },
    },
  });
  //filtering tags setup
  collection.products.nodes = collection.products.nodes.map(
    (product: Product) => {
      //prep
      product.filters = {anime: '', productType: '', character: ''};
      let tempTitle = product.title
        .replace('T-Shirt', 'T-Shirt')
        .replace('Shirt', 'T-Shirt')
        .replace('3d', '3D')
        .replace('T-shirt', 'T-Shirt')
        .replace('Unisex Heavy Blend™ Crewneck ', '')
        .replace('Heavy Blend™ Crewneck ', '')
        .replace('Heavy Blend™', '')
        .replace('Unisex Softstyle ', '')
        .replace('Pullover ', '')
        .replace('Crewneck ', '')
        .replace('Zenitzu', 'Zenitsu')
        .replace(' Phone Case', ' Phone Case')
        .replace('  Case', ' Case')
        .replace('Softstyle', ' ')
        .replace('HUNTER x HUNTER', 'Hunter X Hunter')
        .replace('Boku No Hero Acedemia', 'My Hero Academia')
        .replace('Figurine', 'Figure');
      //extracting anime / show from title
      const animeName = animeNames.filter((anime: string) => {
        return tempTitle.includes(anime);
      })[0];
      if (animeName) {
        product.filters.anime = animeName;
        tempTitle = tempTitle.replace(animeName, '');
      }

      const productType = productTypes.filter((type: string) => {
        return tempTitle.includes(type);
      })[0];

      if (productType) {
        product.filters.productType = productType;
        tempTitle = tempTitle.replace(productType, '');
      }
      if (tempTitle.trim() !== '') {
        product.filters.character = tempTitle.trim();
      }
      return product;
    },
  );

  // Handle 404s
  if (!collection) {
    throw new Response(null, {status: 404});
  }

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    collection,
    sortParam,
    sort,
  });
}

export const meta: MetaFunction = ({data}) => {
  return {
    title: data?.collection?.title ?? 'Collection',
    description: data?.collection?.description,
  };
};
const titleStyling =
  'hidden text-2xl mt-2 font-semibold  px-0.5 lg:text-2xl lg:font-semibold lg:px-0 ';
export default function Collection() {
  const genericCollections = [
    'featured-products',
    'hoodie',
    't-shirt',
    'sweatshirts',
    'best-selling-collection',
  ];
  const animeCollections = [
    'jujutsu-kaisen',
    'kimetsu-no-yaiba',
    'chainsaw-man',
    'neon-genesis-evangelion',
    'naruto',
    'attack-on-titan',
    'my-hero-academia',
    'violet-evergarden',
    'hunter-x-hunter',
    'kaguya-sama',
    'death-note',
    'spy-x-family',
  ];
  const {collection, sort, sortParam} = useLoaderData();
  let pageHeaderType = 'empty';
  if (genericCollections.includes(collection.handle))
    pageHeaderType = 'generic';
  else if (animeCollections.includes(collection.handle))
    pageHeaderType = 'anime';
  const [filteredProductTypeDefault, setFilteredProductTypeDefault] = useState(
    [],
  );
  const [url, setURL] = useState(
    `/collections/${collection.handle}?sort=${sort}`,
  );
  const ProductTypeSelector = () => {
    return (
      <div className="flex items-center justify-center mb-2">
        {[
          {
            type: 'T-Shirt',
            // src: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/t-shirt.png?v=1700687431',
            src: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/t-shirt_f4d7dc84-f43b-45f3-a773-f38513fd761f.png?v=1700689998',
          },
          {
            type: 'Sweatshirt',
            // src: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/black.png?v=1700687431',
            src: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/pullover.png?v=1700691592',
          },
          {
            type: 'Hoodie',
            // src: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/unisex-heavy-blend-hoodie-black-front-63717bfc8168d.png?v=1700687431',
            src: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/hoodie_1.png?v=1700689963',
          },
        ].map((obj) => {
          return (
            <div className="flex flex-col" key={obj.type}>
              <button
                className={`h-[72px] w-[72px] mx-1 bg-neutral-100 relative p-2 rounded-md ${
                  filteredProductTypeDefault[0] === obj.type
                    ? 'border-2 border-red-500'
                    : ''
                }`}
                onClick={() => {
                  if (filteredProductTypeDefault[0] === obj.type) {
                    setFilteredProductTypeDefault([]);
                  } else setFilteredProductTypeDefault([obj.type]);
                }}
              >
                <Image className="w-full h-full " src={obj.src} />
                {/* <div className="flex absolute items-center w-full h-full z-10 justify-center top-0 right-0 bottom-0 left-0">
              <span className=" w-fit h-fit  text-center text-white bg-neutral-800 bg-opacity-40 rounded-md">
                {obj.type}
              </span>
            </div> */}
              </button>
              <div className=" flex justify-center items-center w-full h-fit  text-center text-black text-sm">
                {obj.type === 'Sweatshirt' ? 'Sweater' : obj.type}s
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  useEffect(() => {
    setURL(`/collections/${collection.handle}?sort=${sort}`);
  }, [collection, sort]);
  return (
    <div key={sortParam} className="md:mx-[-48px]">
      <header className="grid w-full gap-2 py-6 pb-0 pl-2 justify-items-start">
        <div
          className={`border-b border-neutral-200 w-[97%] mr-2 ${
            pageHeaderType === 'anime' && 'mb-2'
          }`}
        >
          <h1 className=" text-lg md:text-4xl whitespace-pre-wrap font-semibold inline-block uppercase tracking-widest">
            {collection.title}
          </h1>
        </div>

        {collection.description && (
          <div className="flex items-baseline justify-between w-full">
            <div>
              <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">
                {collection.description}
              </p>
            </div>
          </div>
        )}
      </header>
      <div>
        {pageHeaderType === 'anime' ? (
          <ProductTypeSelector></ProductTypeSelector>
        ) : pageHeaderType === 'generic' ? (
          <LazyAnimeCarousel titleStyling={titleStyling} spaceBetween={4.5} />
        ) : (
          <></>
        )}
      </div>
      <ProductGrid
        key={`filtered-${filteredProductTypeDefault}`}
        productsList={collection.products}
        url={url}
        filteredProductTypeDefault={filteredProductTypeDefault}
      />
    </div>
  );
}

export const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $cursor: String, $rev: Boolean, $sort: ProductCollectionSortKeys) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 100, after: $cursor, reverse: $rev, sortKey: $sort) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          publishedAt
          handle
          metafield(key: "collectionPage", namespace: "img") {
            namespace
            key
            value
          }
          metafields(identifiers:[{key: "custom", namespace: "collectionPageImg"},{key: "collectionPage", namespace: "img"},{key: "reviews", namespace: "hydrogen"}]) {
        namespace
        key
        value

     
      }

          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;

export const SMALL_COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $cursor: String, $rev: Boolean, $sort: ProductCollectionSortKeys) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 12, after: $cursor, reverse: $rev, sortKey: $sort) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
