// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../../components/collections/ProductGrid';
import {type MetaFunction, type LoaderArgs} from '@shopify/remix-oxygen';
import {type SeoHandleFunction} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';
import {Product} from '~/components/products/products';
import {animeNames, productTypes} from '~/functions/titleFilter';
const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.collection?.title,
  description: data?.collection?.description,
});

export const handle = {
  seo,
};

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
    },
  });
  // console.log(collection.products.nodes);
  //filtering tags setup
  collection.products.nodes = collection.products.nodes.map(
    (product: Product) => {
      //prep
      product.filters = {anime: '', productType: '', character: ''};
      let tempTitle = product.title
        .replace('T-Shirt', 'Tee')
        .replace('Shirt', 'Tee')
        .replace('3d', '3D')
        .replace('T-shirt', 'Tee')
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

export default function Collection() {
  const {collection, sort, sortParam} = useLoaderData();
  const [url, setURL] = useState(
    `/collections/${collection.handle}?sort=${sort}`,
  );
  useEffect(() => {
    setURL(`/collections/${collection.handle}?sort=${sort}`);
  }, [collection, sort]);
  return (
    <div key={sortParam}>
      <header className="grid w-full gap-2 py-6 pl-2 justify-items-start">
        <h1 className="text-2xl whitespace-pre-wrap font-semibold inline-block">
          {collection.title}
        </h1>

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
      <ProductGrid productsList={collection.products} url={url} />
    </div>
  );
}

const COLLECTION_QUERY = `#graphql
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
