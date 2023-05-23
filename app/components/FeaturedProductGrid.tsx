import {motion} from 'framer-motion';
import {useInView} from 'framer-motion';
import type {SerializeFrom} from '@shopify/remix-oxygen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import ProductCard from './products/ProductCard';
import {Link} from './Link';
import {useRef} from 'react';
const mockProducts = new Array(12).fill('');

export function FeaturedProductGrid({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  titleStyling = 'text-2xl mt-2 font-semibold  text-center px-0.5 lg:text-2xl lg:font-semibold lg:px-4',
  ...props
}: {
  title?: string;
  products?: SerializeFrom<Product[]>;
  count?: number;
  titleStyling?: string;
}) {
  const ref = useRef(null);

  const isInView = useInView(ref);
  return (
    <div className="flex  flex-col mt-2 lg:mt-4">
      <h3 className={titleStyling}>BEST SELLERS</h3>
      <Link
        to="/collections/featured-products"
        className={'flex justify-center  mb-4'}
      >
        <div className="text-white text-center mt-3 w-1/2 md:w-1/4 md:mb-4 text-md font-medium bg-red-600 px-4 py-3 rounded-sm">
          Shop Best Sellers →
        </div>
      </Link>
      <motion.div className="grid grid-cols-2 px-0.5 mt-2 md:grid-cols-4 lg:grid-cols-4 hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-4 md:px-8 lg:px-4 lg:mt-4">
        {products.map((product) => {
          return (
            <motion.div
              key={product.id}
              variants={{
                inView: {opacity: 1},
                outOfView: {opacity: 0},
              }}
              className="snap-start w-fit mx-0.5 h-fit"
            >
              <ProductCard product={product} />
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
