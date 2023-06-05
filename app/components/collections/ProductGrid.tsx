import {useFetcher} from '@remix-run/react';
import {useEffect, useState} from 'react';
import ProductCard from '../products/ProductCard';
import InfiniteScroll from 'react-infinite-scroll-component';
import FilterSidebar from './FilterSidebar';
import CollectionSort from './CollectionSort';
import {
  Bars3Icon,
  Squares2X2Icon,
  StopIcon,
  ArrowsUpDownIcon,
} from '@heroicons/react/24/outline';
import {Product} from '../products/products';
export default function ProductGrid({productsList, url}) {
  const [nextPage, setNextPage] = useState(productsList.pageInfo.hasNextPage);

  const [endCursor, setEndCursor] = useState(productsList.pageInfo.endCursor);
  const [gridType, setGridType] = useState('normal');
  const [products, setProducts] = useState(productsList.nodes || []);

  const [filteredProducts, setFilteredProducts] = useState(
    products.nodes || [],
  );

  // For making client-side requests
  // https://remix.run/docs/en/v1/hooks/use-fetcher
  const fetcher = useFetcher();

  function fetchMoreProducts() {
    // ?index differentiates index routes from their parent layout routes
    // https://remix.run/docs/en/v1/guides/routing#what-is-the-index-query-param
    if (url.includes('?')) {
      fetcher.load(`${url}&index&cursor=${endCursor}`);
    } else {
      fetcher.load(`${url}?index&cursor=${endCursor}`);
    }
  }
  useEffect(() => {
    if (!fetcher.data) return;
    const {collection} = fetcher.data;

    setProducts((prev) => [...prev, ...collection.products.nodes]);
    setNextPage(collection.products.pageInfo.hasNextPage);
    setEndCursor(collection.products.pageInfo.endCursor);
  }, [fetcher.data]);

  return (
    <div className="mx-1">
      <div className="flex h-10 mx-2 border-b border-neutral-200 items-center justify-between pb-2">
        {' '}
        <FilterSidebar
          products={products}
          setProducts={setFilteredProducts}
          filteredProducts={filteredProducts}
        />
        <div className="flex">
          <CollectionSort />
          <div className="flex  h-fit">
            <button
              onClick={() => {
                setGridType('single');
              }}
            >
              <StopIcon className="text-black stroke-1 h-8 w-8" />
            </button>
            <button
              onClick={() => {
                setGridType('normal');
              }}
            >
              <Squares2X2Icon className=" stroke-1 h-7 w-7" />
            </button>
            {/* <button
              onClick={() => {
                setGridType('row');
              }}
            >
              <Bars3Icon className="stroke-1 h-8 w-8" />
            </button> */}
          </div>
        </div>
      </div>
      <InfiniteScroll
        className={`grid-flow-row grid gap-0 gap-y-6 md:gap-4 lg:gap-6 ${
          gridType === 'normal'
            ? 'grid-cols-2'
            : gridType === 'row'
            ? ' mr-4 grid-cols-1'
            : ' grid-cols-1'
        } md:grid-cols-3 lg:grid-cols-4 my-4 py-4 h-fit`}
        dataLength={products.length} //This is important field to render the next data
        next={fetchMoreProducts}
        hasMore={nextPage}
        loader={
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        }
        endMessage={
          <div className="my-4 flex justify-center items-center">
            No more products
          </div>
        }
        // below props only if you need pull down functionality\
      >
        {filteredProducts.map((product: Product) => (
          <ProductCard
            key={product.id}
            product={product}
            row={gridType === 'row'}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
}
