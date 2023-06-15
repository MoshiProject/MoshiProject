// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '../../components/collections/ProductGrid';
import {type MetaFunction, type LoaderArgs} from '@shopify/remix-oxygen';
import {type SeoHandleFunction} from '@shopify/hydrogen';
import {useEffect} from 'react';
import {Product} from '~/components/products/products';
import {animeNames, productTypes} from '~/functions/titleFilter';
import {FormEventHandler, useState} from 'react';
import {useNavigate} from '@remix-run/react';
import {MagnifyingGlassIcon} from '@heroicons/react/20/solid';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.products?.title,
  description: data?.products?.description,
});

export const handle = {
  seo,
};

export async function loader({params, context, request}: LoaderArgs) {
  const searchParams = new URL(request.url).searchParams;
  const sortParam = searchParams.get('sort');
  const query = `title:${searchParams.get('query')}`;
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
  const sort =
    sortDict[
      sortParam !== null && sortParam !== 'null' ? sortParam : 'featured'
    ].sort;

  const cursor = searchParams.get('cursor');
  const rev =
    sortDict[
      searchParams.get('sort') !== null ? searchParams.get('sort') : 'featured'
    ].rev;

  const {products}: any = await context.storefront.query(SEARCH_QUERY, {
    variables: {
      query,
      cursor,
      rev,
      sort,
    },
  });
  // console.log(collection.products.nodes);
  //filtering tags setup
  products.nodes = products.nodes.map((product: Product) => {
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
  });

  // Handle 404s
  if (!products) {
    throw new Response(null, {status: 404});
  }

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    products,
    sortParam,
    sort,
    query,
    analytics: {
      pageType: 'search',
    },
  });
}

export const meta: MetaFunction = ({data}) => {
  return {
    title: data?.collection?.title ?? 'Collection',
    description: data?.collection?.description,
  };
};

export default function Collection() {
  const {products, sort, sortParam, query} = useLoaderData();
  const [searchQuery, setSearchQuery] = useState(query.slice(6));

  const navigation = useNavigate();

  const handleSearchFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    navigation(
      `/search?query=${searchQuery}${sortParam ? '?sort=${sortParam}' : ''}`,
    );
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };

  return (
    <>
      <h1 className="mt-2 font-semibold text-xl ml-3">Search</h1>
      <form onSubmit={handleSearchFormSubmit} className="relative mt-2 mx-2">
        <label htmlFor="mobile-search" className="sr-only">
          Search
        </label>
        <input
          id="mobile-search"
          name="query"
          type="text"
          value={searchQuery}
          onChange={handleSearchInputChange}
          className="text-black block w-full border-gray-300 rounded-md sm:text-sm focus:ring-red-500 focus:border-red-500"
          placeholder="Search"
          autoComplete="off"
        />
        <button
          type="submit"
          className="text-black absolute top-0 right-0 px-3 py-2"
        >
          <span className="sr-only text-black">Search</span>
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
        </button>
      </form>
      <div>
        <header className="grid w-full gap-2 py-6 pl-2 justify-items-start">
          <h1 className="text-2xl whitespace-pre-wrap font-semibold inline-block">
            {products.title}
          </h1>

          {products.description && (
            <div className="flex items-baseline justify-between w-full">
              <div>
                <p className="max-w-md whitespace-pre-wrap inherit text-copy inline-block">
                  {products.description}
                </p>
              </div>
            </div>
          )}
        </header>
        <ProductGrid
          productsList={products}
          url={`/search?query=${searchQuery}?sort=${sortParam}`}
        />
      </div>
    </>
  );
}

const SEARCH_QUERY = `#graphql
  query products( $query: String, $cursor: String, $rev: Boolean, $sort: ProductSortKeys) {
    products(query: $query, first: 100, after: $cursor, reverse: $rev, sortKey: $sort ) {
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
  
`;
