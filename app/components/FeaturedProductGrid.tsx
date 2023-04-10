import type {SerializeFrom} from '@shopify/remix-oxygen';
import type {Product} from '@shopify/hydrogen/storefront-api-types';
import ProductCard from './products/ProductCard';

const mockProducts = new Array(12).fill('');

export function FeaturedProductGrid({
  title = 'Featured Products',
  products = mockProducts,
  count = 12,
  ...props
}: {
  title?: string;
  products?: SerializeFrom<Product[]>;
  count?: number;
}) {
  return (
    <div className="flex  flex-col mt-2 lg:mt-4">
      <h3 className=" text-lg font-medium px-0.5 lg:text-2xl lg:font-semibold lg:px-4">
        Featured Products
      </h3>
      <div className="grid grid-cols-2 px-0.5 mt-2 md:grid-cols-2 lg:grid-cols-4 hiddenScroll md:pb-8 md:scroll-px-8 lg:scroll-px-4 md:px-8 lg:px-4 lg:mt-4">
        {products.map((product) => (
          <ProductCard
            product={product}
            key={product.id}
            className="snap-start w-fit mx-0.5"
          />
        ))}
      </div>
    </div>
  );
}
