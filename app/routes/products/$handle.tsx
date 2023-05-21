import {useActionData, useLoaderData} from '@remix-run/react';
import {json} from 'react-router';
import ProductOptions from '~/components/products/ProductOptions';
import {Money, ShopPayButton} from '@shopify/hydrogen-react';
import {Disclosure} from '@headlessui/react';
import {ActionArgs, LoaderArgs} from '@shopify/remix-oxygen';
import {Option, Product, Variant} from '~/components/products/products';
import {ChevronRightIcon} from '@heroicons/react/20/solid';
import {motion, AnimatePresence} from 'framer-motion';
import ProductRecommendations from '~/components/products/ProductRecommendations';
import {PRODUCT_QUERY, RECOMMENDATIONS_QUERY} from '~/queries/product';
import AddToCartForm from '~/components/products/AddToCartForm';
import ProductGallery from '~/components/products/ProductGallery';
import {getProductType} from '~/functions/titleFilter';
import ReviewsSection from '~/components/products/ReviewsSection';
import Rand, {PRNG} from 'rand-seed';
import {authors, shirtReviews} from '~/data/reviews';
import ShippingEstimation from '~/components/products/ShippingEstimation';
import {recentlyViewedCookie} from '~/cookie.server';
import Hero from '~/components/HomePage/Hero';

export const loader = async ({params, context, request}: LoaderArgs) => {
  const storeDomain = context.storefront.getShopifyDomain();
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: Option[] = [];
  let isAdmin = false;
  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
    isAdmin = name === 'mode' && value === 'admin';
  });
  console.log('selected', selectedOptions, 'isAdmin', isAdmin);
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

  //handle recently viewed section
  //get cookie data for recently Viewed
  const cookieHeader = request.headers.get('Cookie');
  const cookie = await recentlyViewedCookie.parse(cookieHeader);
  console.log('cookie', cookie.recentlyViewed);
  console.log(product.id);
  const recentlyViewed: any[] = cookie.recentlyViewed;
  let recentlyChanged = false;
  if (!recentlyViewed.includes(product.id)) {
    recentlyChanged = true;
    recentlyViewed.unshift(product.id);
    if (recentlyViewed.length > 6) {
      recentlyViewed.pop();
    }
  } else if (recentlyViewed[0] !== product.id) {
    recentlyChanged = true;
    const index = recentlyViewed.indexOf(product.id);
    if (index > -1) {
      // only splice array when item is found
      recentlyViewed.splice(index, 1); // 2nd parameter means remove one item only
    }
    recentlyViewed.unshift(product.id);
  }
  //handle product recommendations
  const {productRecommendations}: {productRecommendations: Product[]} =
    await context.storefront.query(RECOMMENDATIONS_QUERY, {
      variables: {
        productId: product.id,
      },
    });
  // optionally set a default variant so you always have an "orderable" product selected
  const selectedVariant: Variant =
    product.selectedVariant ?? product?.variants?.nodes[0];
  const id = product.id.substr(product.id.lastIndexOf('/') + 1);
  //get Product ID
  let judgeID: number;
  try {
    const response = await fetch(
      `https://judge.me/api/v1/products/-1?api_token=${context.env.JUDGE_ME_PRIVATE_TOKEN}&shop_domain=${context.env.PUBLIC_STORE_DOMAIN}&external_id=${id}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    const data = await response.json();
    judgeID = data.product.id;
  } catch (error) {
    console.error(error);
  }

  //get Product Reviews
  let judgeReviews;
  try {
    const response = await fetch(
      `https://judge.me/api/v1/reviews?api_token=${context.env.JUDGE_ME_PRIVATE_TOKEN}&shop_domain=${context.env.PUBLIC_STORE_DOMAIN}&product_id=${judgeID}&per_page=24`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    judgeReviews = await response.json();
    judgeReviews = judgeReviews.reviews;
    //console.log('data', judgeReviews);
  } catch (error) {
    console.error(error);
  }
  let reviewCount: number;
  if (product.metafields[0] !== null && product.metafields[1] !== null) {
    reviewCount = product.metafields.find((metafield) => {
      return metafield && metafield.key === 'reviewCount';
    }).value;
  } else {
    reviewCount = 0;
  }

  const rand = new Rand(id);

  let generatedReviews = [];
  for (let i = 0; generatedReviews.length < reviewCount; i++) {
    const randNum = Math.floor(rand.next() * shirtReviews.length);
    let review = shirtReviews[randNum];
    review.author = authors[randNum];
    generatedReviews.push(review);
    generatedReviews = [...new Set(generatedReviews)];
  }
  // console.log('generatedReviews', generatedReviews.length);
  // console.log('generatedReviews', generatedReviews);
  if (!recentlyChanged) {
    return json({
      judgeReviews,
      product,
      selectedVariant,
      storeDomain,
      productRecommendations,
    });
  } else {
    return json(
      {
        judgeReviews,
        product,
        selectedVariant,
        storeDomain,
        productRecommendations,
        isAdmin,
      },
      {
        headers: {
          'Set-Cookie': await recentlyViewedCookie.serialize({
            recentlyViewed: recentlyViewed,
          }),
        },
      },
    );
  }
};

export async function action({request, context, params}: ActionArgs) {
  const body = await request.formData();
  const userEmail = body.get('user_email');
  const name = body.get('name');
  const rating = body.get('rating');
  const reviewBody = body.get('review_body');
  const reviewQuanity = body.get('review_quanity');
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: Option[] = [];
  let isAdmin = false;
  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
    isAdmin = name === 'mode' && value === 'admin';
  });

  if (isAdmin) {
    return 'admin';
  }
  console.log('body', userEmail, name, rating, reviewBody);
  if (userEmail === '') {
    return 'noEmail';
  } else if (name === '') {
    return 'noName';
  }
  const {handle} = params;

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
  const id = product.id.substr(product.id.lastIndexOf('/') + 1);

  //write review
  try {
    const response = await fetch(
      `https://judge.me/api/v1/reviews?api_token=${context.env.JUDGE_ME_PRIVATE_TOKEN}&shop_domain=${context.env.PUBLIC_STORE_DOMAIN}` +
        `&id=${id}&platform=shopify&name=${name}&email=${userEmail}&rating=${rating}&body=${reviewBody
          ?.toString()
          .replace(' ', '%20')}`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
      },
    );
    console.log('response', response);
  } catch (error) {
    console.error(error);
  }

  return '';
}

export default function ProductHandle() {
  const {
    judgeReviews,
    product,
    selectedVariant,
    storeDomain,
    productRecommendations,
    isAdmin,
  } = useLoaderData();
  //console.log('description', product.descriptionHtml);
  const desc = product.descriptionHtml;
  //console.log('index', desc.indexOf('<ul>'));
  const data = useActionData();
  console.log('actiondata', data);
  const composition =
    desc.indexOf('<ul>') !== -1
      ? desc.substring(desc.indexOf('<ul>'), desc.lastIndexOf('</ul>') + 5)
      : desc.indexOf('<p>.:') !== -1
      ? desc.substring(desc.indexOf('<p>.:'), desc.lastIndexOf('</p>') + 4)
      : '';
  let description = product.descriptionHtml;
  if (composition.length > 0) {
    description = description.replace(composition, '');
  }
  //console.log(composition);
  const orderable = selectedVariant?.availableForSale || false;
  return (
    <section className="w-full gap-2 px-5 md:gap-8 grid  md:px-8 lg:px-12">
      <div className="grid items-start gap-2 lg:gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-hidden  md:w-full lg:col-span-3 h-fit mt-4">
          <ProductGallery media={product.media.nodes} />
        </div>
        <div className="md:sticky md:mx-auto max-w-xl md:max-w-[36rem] grid lg:gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem] md:col-span-1 lg:col-span-2">
          <div className="grid gap-2 first:mt-4">
            <h1 className="text-center text-2xl font-bold leading-8 whitespace-normal uppercase">
              {product.title}
            </h1>
            <div className="flex-col justify-center items-center">
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
              <div className="flex justify-center mt-1">
                <span className="text-xs text-neutral-500 uppercase">
                  {' '}
                  Free Shipping + Tax Included
                </span>
              </div>
            </div>
          </div>
          <ProductOptions
            options={product.options}
            selectedVariant={selectedVariant}
            productType={getProductType(product.title)}
          />
          {orderable && (
            <div className="space-y-2 w-full">
              <div>
                <ShippingEstimation />
              </div>
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
                __html: description,
              }}
            />
          </Accordion>
          <Accordion title={'Care Instructions'}>
            <div className="bg-white rounded-lg shadow-lg">
              <p className="text-sm mb-4">
                To ensure that your DTG-printed garments remain in good
                condition for as long as possible, it's important to follow the
                care instructions carefully. The following steps are
                recommended:
              </p>
              <ul className="list-disc mb-4 text-sm">
                <li>
                  Machine-wash your DTG-printed garments cold and inside-out on
                  a gentle cycle using a mild detergent and similar colors.
                </li>
                <li>
                  Use non-chlorine bleach only when necessary. Bleach can damage
                  the fibers of the garment and cause the print to deteriorate
                  faster.
                </li>
                <li>
                  Avoid using fabric softeners or dry cleaning the items. Fabric
                  softeners can cause the print to crack, and dry cleaning can
                  cause the colors to fade or bleed.
                </li>
                <li>
                  While DTG-printed apparel can be tumble-dried on a low cycle,
                  it's recommended to hang-dry them instead. This helps prevent
                  the garment from shrinking or losing its shape, and it also
                  helps the print to last longer.
                </li>
                <li>
                  If you need to iron your apparel, make sure to use a cool iron
                  inside-out and avoid ironing the print directly. Ironing the
                  print can cause it to melt or stick to the iron, ruining the
                  design.
                </li>
                <li>
                  Do not dry clean your DTG-printed garments. Dry cleaning can
                  damage the fibers of the garment and cause the print to fade
                  or bleed.
                </li>
              </ul>
              <p className="text-sm">
                By following these instructions carefully, you can help ensure
                that your printed apparel remains in good condition for as long
                as possible. This will help you get the most out of your
                investment and enjoy your favorite designs for years to come.
              </p>
            </div>
          </Accordion>

          {composition && (
            <Accordion title={'Composition'}>
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-md list-disc	"
                dangerouslySetInnerHTML={{
                  __html: composition.replaceAll('.:', '•'),
                }}
              />
            </Accordion>
          )}
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
      <div className="hidden">
        <Hero
          // title="SPRING 2023"
          subtitle="PLACEHOLDER IMAGE TO MAKE THE WEBSITE FEEL MORE ALIVE"
          buttonText="Shop Now →"
          imageUrl="https://cdn.shopify.com/s/files/1/0552/4121/2109/files/3.5sec.gif?v=1681722723"
          isGif
        />
      </div>
      <div className="hidden">
        <ReviewsSection
          product={product}
          judgeReviews={judgeReviews}
          isAdmin
        ></ReviewsSection>
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
            <Disclosure.Button
              className={`py-4 flex justify-between w-full ${
                open ? 'text-md font-lg' : ' text-sm '
              } `}
            >
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
