import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {Product} from './products';
import titleFilter from '~/functions/titleFilter';

type PrdouctCardType = {
  product: Product;
  row?: boolean;
};

export default function ProductCard({product, row = false}: PrdouctCardType) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;

  return (
    <Link to={`/products/${product.handle}`} className="relative">
      <div
        className={`flex ${
          row ? 'justify-start' : 'flex-col justify-end'
        }   overflow-hidden h-full`}
      >
        {isDiscounted && (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label className="subpixel-antialiased absolute top-0 right-0 text-right text-notice text-white bg-neutral-900 p-1 font-semibold text-[10px]">
            Sale
          </label>
        )}
        <div
          className={`rounded relative ${
            product.handle.toLowerCase().includes('hoodie')
              ? row
                ? 'w-[40%] mb-4'
                : 'w-[115%] ml-[-7.5%] mb-4'
              : product.handle.toLowerCase().includes('sweatshirt')
              ? row
                ? 'w-[40%] mb-4'
                : 'w-[130%] ml-[-15%] mb-4'
              : row
              ? 'w-[40%] mb-4'
              : 'w-[120%] ml-[-10%] mb-4'
          } overflow-hidden`}
        >
          <Image
            data={product.variants.nodes[0].image}
            alt={titleFilter(product.title)}
            className="overflow-hidden"
          />
        </div>
        <div
          className={`${
            row
              ? 'flex flex-col flex-grow justify-center items-center h-full'
              : 'grid gap-1'
          }`}
        >
          <h3
            className={`max-w-prose text-copy w-full overflow-hidden whitespace-wrap text-center text-ellipsis ${
              row ? 'text-lg font-semibold' : 'text-sm font-medium '
            }`}
          >
            {titleFilter(product.title)}
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
