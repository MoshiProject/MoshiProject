import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../../components/collections/ProductGrid';
import {type MetaFunction, type LoaderArgs} from '@shopify/remix-oxygen';
import {type SeoHandleFunction} from '@shopify/hydrogen';
import {useState} from 'react';
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
  const cursor = searchParams.get('cursor');

  const {collection}: any = await context.storefront.query(COLLECTION_QUERY, {
    variables: {
      handle,
      cursor,
    },
  });
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
  });
}

export const meta: MetaFunction = ({data}) => {
  return {
    title: data?.collection?.title ?? 'Collection',
    description: data?.collection?.description,
  };
};

export default function Collection() {
  const {collection} = useLoaderData();
  return (
    <>
      <header className="grid w-full gap-2 py-8 justify-items-start">
        <h1 className="text-4xl whitespace-pre-wrap font-bold inline-block">
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
      <ProductGrid
        collection={collection}
        url={`/collections/${collection.handle}`}
      />
    </>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $cursor: String) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 100, after: $cursor) {
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
