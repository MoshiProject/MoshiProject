import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useInView} from 'framer-motion';
import {useEffect, useRef, useState} from 'react';
import titleFilter from '~/functions/titleFilter';
import {Product} from './products';
type PrdouctCardType = {
  product: Product;
  row?: boolean;
  optimization?: 'sm' | 'md' | 'lg' | 'xl';
};

const productImgMap = {
  // 'denji-shirt-chainsaw-man-12':
  //   'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Homie-1-SQ2.png?v=1699603816',
  // 'eva-neon-genesis-evangelion-unisex-softstyle-t-shirt':
  //   'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/mockup-of-a-man-wearing-a-customizable-t-shirt-and-looking-through-a-window-32835_1.jpg?v=1699604250',
};
export default function ProductCard({
  product,
  row = false,
  optimization,
}: PrdouctCardType) {
  const {price, compareAtPrice} = product.variants?.nodes[0] || {};
  const isDiscounted = compareAtPrice?.amount > price?.amount;
  const ref = useRef(null);
  const [viewed, setViewed] = useState(false);
  const isInView = useInView(ref);

  useEffect(() => {
    if (isInView) {
      setViewed(true);
    }
  }, [isInView]);
  return (
    <Link to={`/products/${product.handle}`} className="relative ">
      <div
        ref={ref}
        variants={{
          inView: {opacity: 1, y: 0, transition: {duration: 0.4}},
          outOfView: {opacity: 0.42, y: 15},
        }}
        animate={viewed ? 'inView' : 'outOfView'}
        className={`flex rounded-md ${
          row ? 'justify-start' : 'flex-col justify-between'
        }   overflow-hidden h-full`}
      >
        {/* {isDiscounted && (
          // eslint-disable-next-line jsx-a11y/label-has-associated-control
          <label className="subpixel-antialiased absolute top-0 right-0 text-right tracking-widest text-notice text-white bg-neutral-900 p-1 font-semibold text-[10px] z-10">
            Sale
          </label>
        )} */}
        <div
          className={`rounded relative overflow-hidden ${
            product.handle.toLowerCase().includes('hoodie')
              ? row
                ? 'w-[40%] mb-0'
                : 'w-[120%] ml-[-10%] md:mb-8 mb-4'
              : product.handle.toLowerCase().includes('sweatshirt')
              ? row
                ? 'w-[40%] mb-0'
                : 'w-[130%] ml-[-15%] mb-0'
              : row
              ? 'w-[40%] mb-0'
              : 'w-[120%] ml-[-10%] md:mb-8 mb-4 '
          } overflow-hidden`}
        >
          {productImgMap[product.handle.toLowerCase()] ? (
            <Image
              width={'full'}
              sizes="50vw"
              src={productImgMap[product.handle.toLowerCase()]}
              alt={titleFilter(product.title)}
              className={`overflow-hidden ${
                product.handle.toLowerCase().includes('hoodie')
                  ? row
                    ? 'w-[40%] mb-0'
                    : 'w-[115%]  mb-0'
                  : product.handle.toLowerCase().includes('sweatshirt')
                  ? row
                    ? 'w-[40%] mb-0'
                    : 'w-[135%] mb-0'
                  : row
                  ? 'w-[40%] mb-0'
                  : 'w-[120%] mb-0'
              }`}
            />
          ) : (
            <Image
              width={'full'}
              height={'full'}
              sizes="50vw"
              data={product.variants.nodes[0].image}
              alt={titleFilter(product.title)}
              className={`overflow-hidden ${
                product.handle.toLowerCase().includes('hoodie')
                  ? row
                    ? 'w-[40%] mb-0'
                    : 'w-[115%]  mb-0'
                  : product.handle.toLowerCase().includes('sweatshirt')
                  ? row
                    ? 'w-[40%] mb-0'
                    : 'w-[135%] mb-0'
                  : row
                  ? 'w-[40%] mb-0'
                  : 'w-[120%] mb-0'
              }`}
            />
          )}
        </div>
        <div
          className={`${
            row
              ? 'flex flex-col flex-grow justify-center items-center h-full'
              : 'flex flex-col flex-1'
          }`}
        >
          <h3
            className={`max-w-prose text-copy w-full overflow-hidden whitespace-wrap tracking-widest text-center text-ellipsis flex-1 mb-1 ${
              row
                ? 'text-lg font-semibold'
                : 'text-sm md:text-base font-semibold '
            }`}
          >
            {titleFilter(product.title)}
            {/* {console.log(product)} */}
          </h3>
          <div className="flex gap-2 justify-center mb-3 h-fit">
            <span className="max-w-prose whitespace-pre-wrap inherit text-copy tracking-widest flex gap-1 text-center font-semibold text-xs md:text-base h-fit">
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
