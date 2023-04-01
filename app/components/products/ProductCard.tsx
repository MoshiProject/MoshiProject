import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {Product} from './products';

type PrdouctCardType = {
  product: Product;
};

export default function ProductCard({product}: PrdouctCardType) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;

  return (
    <Link to={`/products/${product.handle}`} className="relative">
      <div className="grid gap-1 overflow-hidden">
        {isDiscounted && (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label className="subpixel-antialiased absolute top-0 right-0  text-right text-notice text-white bg-neutral-900 p-1 font-semibold text-[10px]">
            Sale
          </label>
        )}
        <div className="shadow-sm rounded relative w-[120%] ml-[-10%] overflow-hidden">
          <Image
            data={product.variants.nodes[0].image}
            alt={product.title}
            className="overflow-hidden"
          />
        </div>
        <div className="grid gap-1">
          <h3 className="max-w-prose text-sm font-medium text-copy w-full overflow-hidden whitespace-wrap text-center text-ellipsis ">
            {product.title}
          </h3>
          <div className="flex gap-2 justify-center">
            <span className="max-w-prose whitespace-pre-wrap inherit text-copy flex gap-4 text-sm text-center ">
              <Money withoutTrailingZeros data={price} />
              {isDiscounted && (
                <Money
                  className="line-through opacity-50"
                  withoutTrailingZeros
                  data={compareAtPrice}
                />
              )}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
