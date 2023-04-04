import {useLoaderData} from '@remix-run/react';
import {json} from 'react-router';
import ProductOptions from '~/components/products/ProductOptions';
import {Money, ShopPayButton} from '@shopify/hydrogen-react';
import {Disclosure} from '@headlessui/react';
import {LoaderArgs} from '@shopify/remix-oxygen';
import {Option, Product, Variant} from '~/components/products/products';
import {ChevronRightIcon} from '@heroicons/react/20/solid';
import {motion, AnimatePresence} from 'framer-motion';
import ProductRecommendations from '~/components/products/ProductRecommendations';
import {PRODUCT_QUERY, RECOMMENDATIONS_QUERY} from '~/queries/product';
import AddToCartForm from '~/components/products/AddToCartForm';
import ProductGallery from '~/components/products/ProductGallery';
import {getProductType} from '~/functions/titleFilter';

export const loader = async ({params, context, request}: LoaderArgs) => {
  const storeDomain = context.storefront.getShopifyDomain();
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: Option[] = [];

  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
  });

  const {product}: {product: Product} = await context.storefront.query(
    PRODUCT_QUERY,
    {
      variables: {
        handle,
        selectedOptions,
      },
    },
  );

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }
  const {productRecommendations}: {productRecommendations: Product[]} =
    await context.storefront.query(RECOMMENDATIONS_QUERY, {
      variables: {
        productId: product.id,
      },
    });
  // optionally set a default variant so you always have an "orderable" product selected
  const selectedVariant: Variant =
    product.selectedVariant ?? product?.variants?.nodes[0];
  return json({
    product,
    selectedVariant,
    storeDomain,
    productRecommendations,
  });
};

export default function ProductHandle() {
  const {product, selectedVariant, storeDomain, productRecommendations} =
    useLoaderData();

  const orderable = selectedVariant?.availableForSale || false;
  return (
    <section className="w-full gap-2 px-5 md:gap-8 grid  md:px-8 lg:px-12">
      <div className="grid items-start gap-2 lg:gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-hidden  md:w-full lg:col-span-3 h-fit mt-4">
          <ProductGallery media={product.media.nodes} />
        </div>
        <div className="md:sticky md:mx-auto max-w-xl md:max-w-[24rem] grid lg:gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem] md:col-span-1 lg:col-span-2">
          <div className="grid gap-2 first:mt-4">
            <h1 className="text-center text-2xl font-bold leading-8 whitespace-normal uppercase">
              {product.title}
            </h1>
            <div className="flex justify-center">
              <Money
                withoutTrailingZeros
                data={selectedVariant.compareAtPrice}
                className="text-lg font-semibold text-neutral-800 line-through	mr-3"
              />
              <Money
                withoutTrailingZeros
                data={selectedVariant.price}
                className="text-lg font-semibold text-red-600 "
              />
            </div>
          </div>
          <ProductOptions
            options={product.options}
            selectedVariant={selectedVariant}
            productType={getProductType(product.title)}
          />
          {orderable && (
            <div className="space-y-2 w-full">
              <AddToCartForm variantId={selectedVariant?.id} />
              <ShopPayButton
                storeDomain={storeDomain}
                variantIds={[selectedVariant?.id]}
                width="100%"
                className="w-full"
              />
              <div className=" text-xs text-center">
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore  */}
                <shopify-payment-terms
                  variant-id="31417693569158"
                  shopify-meta='{"type":"product","variants":[{"id":31417693569158,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693601926,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693634694,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693667462,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693700230,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693732998,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693765766,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693798534,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693831302,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693864070,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693896838,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693929606,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true}],"min_price":"$50.00","max_price":"$17,500.00","financing_plans":[{"min_price":"$50.00","max_price":"$149.99","terms":[{"apr":0,"loan_type":"split_pay","installments_count":4}]},{"min_price":"$150.00","max_price":"$999.99","terms":[{"apr":0,"loan_type":"split_pay","installments_count":4},{"apr":15,"loan_type":"interest","installments_count":6},{"apr":15,"loan_type":"interest","installments_count":12}]},{"min_price":"$1,000.00","max_price":"$17,500.00","terms":[{"apr":15,"loan_type":"interest","installments_count":3},{"apr":15,"loan_type":"interest","installments_count":6},{"apr":15,"loan_type":"interest","installments_count":12}]}],"installments_buyer_prequalification_enabled":false}'
                >
                  {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                  {/* @ts-ignore  */}
                </shopify-payment-terms>
              </div>
            </div>
          )}
          <Accordion title={'Description'}>
            <div
              className="prose border-t border-gray-200 pt-6 text-black text-md"
              dangerouslySetInnerHTML={{
                __html: product.descriptionHtml,
              }}
            />
          </Accordion>
          <Accordion title="Shipping">
            <div className="">
              <p>
                <strong>SHIPPING TIMES</strong>&nbsp;
              </p>
              <p>
                Orders take 1 - 4 days to be processed. Delivery typically take
                5-8 business days but can take 2 -&nbsp;4 weeks. Tracking
                numbers are always provided. We are not responsible for delays
                caused by individual carriers, but we will always do everything
                we can to make sure you receive your order as fast as
                possible.&nbsp;
              </p>
              <p>
                <strong>TRACKING NUMBERS</strong>
              </p>
              <p>
                Tracking numbers are always provided for every order. If your
                order is shipped in&nbsp;multiple packages, you will get a
                tracking number for each
              </p>
              <p>
                <strong>CANCELLATIONS</strong>
              </p>
              <p>
                Orders cannot be cancelled after being placed.&nbsp; If you wish
                to cancel your order, you will need to wait for your product to
                arrive so you can process a return.
              </p>
            </div>
          </Accordion>
        </div>
      </div>
      <ProductRecommendations recommendations={productRecommendations} />
    </section>
  );
}
type AccordionProps = {
  title: string | JSX.Element;
  children: JSX.Element;
  animations: boolean;
};
export function Accordion({title, animations, children}: AccordionProps) {
  return (
    <div className="px-5 border-b border-neutral-200 w-full">
      <Disclosure>
        {({open}) => (
          <>
            <Disclosure.Button className="py-4 flex justify-between text-sm w-full">
              {title}
              <ChevronRightIcon
                className={`w-5 h-5 stroke-1	  ${
                  open
                    ? 'rotate-270 transform transition-transform duration-200'
                    : 'rotate-90'
                }`}
              />
            </Disclosure.Button>

            {open && animations && (
              <motion.div
                className="overflow-hidden"
                layout
                initial={{height: 0, opacity: 0}}
                animate={{height: 'fit-content', opacity: 1}}
                exit={{height: 0, opacity: 0}}
                transition={{duration: 0.4}}
              >
                {children}
              </motion.div>
            )}

            {open && !animations && (
              <div className="overflow-hidden">{children}</div>
            )}
          </>
        )}
      </Disclosure>
    </div>
  );
}
