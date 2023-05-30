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
import titleFilter, {
  getProductAnime,
  getProductType,
  productAnimeHandles,
  productTypeHandles,
} from '~/functions/titleFilter';
import ReviewsSection from '~/components/products/ReviewsSection';
import Rand, {PRNG} from 'rand-seed';
import {authors, highHoodieReviews, lowHoodieReviews} from '~/data/reviews';
import ShippingEstimation from '~/components/products/ShippingEstimation';
import Hero from '~/components/HomePage/Hero';
import SizingChart from '~/components/products/SizingChart';
import {SMALL_COLLECTION_QUERY} from '../collections/$handle';
import {useEffect, useState} from 'react';

export const loader = async ({params, context, request}: LoaderArgs) => {
  //###load necessary parameters
  const storeDomain = context.storefront.getShopifyDomain();
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  console.log('handle', handle);
  //###load admin mode if required
  const selectedOptions: Option[] = [];
  let isAdmin = false;
  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
    isAdmin = name === 'mode' && value === 'admin';
  });
  console.log('selected', selectedOptions, 'isAdmin', isAdmin);

  //###load product
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

  //###handle product recommendations
  const cursor = searchParams.get('cursor');
  const rev = false;
  const sort = null;

  const productType = getProductType(product.title);
  const typeHandle = productTypeHandles[productType];

  const productAnime = getProductAnime(product.title);
  const animeHandle = productAnimeHandles[productAnime];

  const {collection: productTypeRecommendations}: any =
    await context.storefront.query(SMALL_COLLECTION_QUERY, {
      variables: {
        handle: typeHandle,
        cursor,
        rev,
        sort,
      },
    });
  const animeCollectionExists = animeHandle !== undefined;
  const {collection: productAnimeRecommendations}: any =
    await context.storefront.query(SMALL_COLLECTION_QUERY, {
      variables: {
        handle: animeCollectionExists ? animeHandle : 'featured-products',
        cursor,
        rev,
        sort,
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

  return json({
    judgeReviews,
    product,
    selectedVariant,
    storeDomain,
    productAnimeRecommendations: productAnimeRecommendations?.products?.nodes,
    productTypeRecommendations: productTypeRecommendations?.products?.nodes,
    isAdmin,
  });
};
// };

export async function action({request, context, params}: ActionArgs) {
  const body = await request.formData();
  const userEmail = body.get('user_email');
  const name = body.get('name');
  const rating = body.get('rating');
  const reviewBody = body.get('review_body');
  const reviews = body.get('reviewsString');

  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const selectedOptions: Option[] = [];
  let isAdmin = false;
  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
    isAdmin = name === 'mode' && value === 'admin';
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
  const id = product.id.substr(product.id.lastIndexOf('/') + 1);

  // const query = `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2023-04/products/${id}/metafields.json`;
  // console.log('query', query);
  // // Make a GET request to the Shopify Admin API to fetch a product
  // const response = await fetch(query, {
  //   method: 'POST',
  //   headers: {
  //     'X-Shopify-Access-Token': context.env.ADMIN_API_ACCESS_TOKEN,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     metafield: {
  //       namespace: 'my_fields',
  //       key: 'type',
  //       value: 'phone case',
  //       type: 'string',
  //     },
  //   }),
  // });
  // console.log('response', response.json());

  const url = `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2023-04/products/${id}/metafields.json`;

  const accessToken = context.env.ADMIN_API_ACCESS_TOKEN;

  const headers = {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
  };
  let oldReviews = '';
  fetch(url, {
    method: 'GET',
    headers,
  })
    .then((response) => response.json())
    .then((result: any) => {
      //console.log('result', result);
      oldReviews = result.metafields.find((metafield) => {
        return (
          metafield.namespace === 'hydrogen' && metafield.key === 'reviews'
        );
      });
      if (!oldReviews) {
        oldReviews = '';
      }
      console.log('oldReviews.value', oldReviews.value);
      console.log('oldReviews', oldReviews);
      let newReviews = '';
      newReviews += reviews?.toString();
      newReviews += oldReviews.value ? ',' + oldReviews.value : '';
      newReviews = newReviews.replace(',,', ',');
      const data = {
        metafield: {
          namespace: 'hydrogen',
          key: 'reviews',
          value: newReviews,
          type: 'multi_line_text_field',
        },
      };

      console.log('newReviews', JSON.stringify(data));
      fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    })
    .catch((error) => {
      console.error('Error:', error);
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
    productTypeRecommendations,
    productAnimeRecommendations,
    isAdmin,
  } = useLoaderData();
  const desc = product.descriptionHtml;
  const [selectedImage, setSelectedImage] = useState(selectedVariant.image.url);
  const data = useActionData();
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
  // console.log('media', product.media.nodes);
  // console.log('product image', product.selectedVariant.image.url);
  // console.log('selectedVariant ', selectedVariant);
  // console.log('options ', product.options);
  useEffect(() => {
    setSelectedImage(selectedVariant.image.url);
  }, [selectedVariant]);
  const orderable = selectedVariant?.availableForSale || false;
  return (
    <section className="w-full gap-2 px-5  md:gap-8 grid  md:px-24 md:mt-16">
      <div className="grid items-start gap-1 lg:gap-12 md:grid-cols-2 lg:grid-cols-11">
        <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-hidden  md:w-full lg:col-span-6 h-fit mt-4">
          <ProductGallery
            media={product.media.nodes}
            selectedImage={selectedImage}
          />
        </div>
        <div className="md:sticky md:mx-auto max-w-xl md:max-w-[502px] grid lg:gap-2 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem] md:col-span-1 lg:col-span-5">
          <div className="grid gap-2 first:mt-4">
            <h1 className="text-center tracking-widest md:text-start text-2xl md:text-3xl md:font-semibold font-bold leading-8 whitespace-normal uppercase">
              {titleFilter(product.title)}
            </h1>
            <div className="grid gap-2 justify-center items-center md:justify-start md:items-start">
              <div className="flex justify-center md:justify-start md:items-start">
                {selectedVariant.compareAtPrice && (
                  <Money
                    withoutTrailingZeros
                    data={selectedVariant.compareAtPrice}
                    className="text-lg font-semibold text-neutral-800 line-through	mr-3"
                  />
                )}
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.price}
                  className="text-lg font-semibold text-red-600 "
                />
              </div>
              <div className="flex justify-center mt-1 md:justify-start md:items-start">
                <span className="text-xs text-neutral-500 uppercase tracking-widest">
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
              <span className="md:block hidden ">
                <SizingChart productType={getProductType(product.title)} />
              </span>
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
          <div className="md:max-w-[502px] border-t  text-sm md:mt-0 mt-8">
            <Accordion title={'Description'} animations>
              <div
                className="prose border-t border-gray-200 pt-6 text-black text-sm mb-4"
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            </Accordion>
            {['sweatshirt', 'shirt', 'hoodie'].includes(
              getProductType(product.title)?.toLowerCase(),
            ) && (
              <Accordion title={'Care Instructions'} animations>
                <div className="bg-white rounded-lg shadow-lg">
                  <p className="text-sm mb-4">
                    To ensure that your DTG-printed garments remain in good
                    condition for as long as possible, it's important to follow
                    the care instructions carefully. The following steps are
                    recommended:
                  </p>
                  <ul className="list-disc mb-4 text-sm">
                    <li>
                      Machine-wash your DTG-printed garments cold and inside-out
                      on a gentle cycle using a mild detergent and similar
                      colors.
                    </li>
                    <li>
                      Use non-chlorine bleach only when necessary. Bleach can
                      damage the fibers of the garment and cause the print to
                      deteriorate faster.
                    </li>
                    <li>
                      Avoid using fabric softeners or dry cleaning the items.
                      Fabric softeners can cause the print to crack, and dry
                      cleaning can cause the colors to fade or bleed.
                    </li>
                    <li>
                      While DTG-printed apparel can be tumble-dried on a low
                      cycle, it's recommended to hang-dry them instead. This
                      helps prevent the garment from shrinking or losing its
                      shape, and it also helps the print to last longer.
                    </li>
                    <li>
                      If you need to iron your apparel, make sure to use a cool
                      iron inside-out and avoid ironing the print directly.
                      Ironing the print can cause it to melt or stick to the
                      iron, ruining the design.
                    </li>
                    <li>
                      Do not dry clean your DTG-printed garments. Dry cleaning
                      can damage the fibers of the garment and cause the print
                      to fade or bleed.
                    </li>
                  </ul>
                  <p className="text-sm">
                    By following these instructions carefully, you can help
                    ensure that your printed apparel remains in good condition
                    for as long as possible. This will help you get the most out
                    of your investment and enjoy your favorite designs for years
                    to come.
                  </p>
                </div>
              </Accordion>
            )}
            {composition && (
              <Accordion title={'Composition'} animations>
                <div
                  className="prose border-t border-gray-200 pt-6 text-black text-md list-disc	"
                  dangerouslySetInnerHTML={{
                    __html: composition.replaceAll('.:', '•'),
                  }}
                />
              </Accordion>
            )}
            <Accordion title="Shipping" animations>
              <div className="">
                <p>
                  <strong>SHIPPING TIMES</strong>&nbsp;
                </p>
                <p>
                  We custom make every order in-house. Please allow 2 to 4
                  business days for all items to be made before shipment. After
                  your item(s) have been processed, you will receive a tracking
                  code in your email. Deliveries typically take{' '}
                  {['sweatshirt', 'shirt', 'hoodie'].includes(
                    getProductType(product.title)?.toLowerCase(),
                  )
                    ? '3-5 business days'
                    : '2-4 weeks'}
                  after fulfillment. Tracking numbers are always provided. We
                  are not responsible for delays caused by individual carriers,
                  but we will always do everything we can to make sure you
                  receive your order as fast as possible.&nbsp;
                </p>
                <br />
                <p>
                  <strong>TRACKING NUMBERS</strong>
                </p>
                <p>
                  Tracking numbers are always provided for every order. If your
                  order is shipped in&nbsp;multiple packages, you will get a
                  tracking number for each.
                </p>
                <br />
                <p>
                  <strong>CANCELLATIONS</strong>
                </p>

                <p>
                  Order changes or cancellation requests can be within 24 hours
                  of your order being made. We do not offer any sort of
                  exchanges or refund for change of mind items after this time.
                  This also includes exchanges or refunds for size changes so
                  please double check sizing charts prior to making your
                  purchase. A 3% transaction fee will be removed from the
                  refunded amount.
                </p>
                <br />
                <p>
                  Returns or exchanges will only be accepted if you received the
                  wrong items or defective/damaged items. To be eligible for a
                  return, your item must be unused and in the same condition
                  that you received it. We reserve the right to deny any item
                  that does not meet these requirements.
                </p>
              </div>
            </Accordion>
          </div>
        </div>
      </div>
      <div className="hidden"></div>
      <div className="">
        <ReviewsSection
          product={product}
          judgeReviews={judgeReviews}
          isAdmin={isAdmin}
        ></ReviewsSection>
      </div>
      <ProductRecommendations
        recommendations={productAnimeRecommendations}
        title={
          getProductAnime(product.title) === undefined
            ? `You may also like`
            : `Shop ${getProductAnime(product.title)}`
        }
      />
      <ProductRecommendations
        recommendations={productTypeRecommendations}
        title={`Shop ${getProductType(product.title)}s`}
      />
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
    <div className="px-5 border border-t-0 border-neutral-200 w-full md:max-w-lg md:text-sm tracking-widest">
      <Disclosure>
        {({open}) => (
          <>
            <Disclosure.Button
              className={`py-4 flex justify-between w-full tracking-widest `}
            >
              <div></div>
              {title}
              <ChevronRightIcon
                className={`w-5 h-5 stroke-1	  ${
                  open
                    ? 'rotate-270 transform transition-transform duration-200'
                    : 'rotate-90'
                }`}
              />
            </Disclosure.Button>

            <AnimatePresence>
              {open && animations && (
                <motion.div
                  className="overflow-hidden"
                  key="content"
                  initial={{height: 0, opacity: 0, translateY: -10}}
                  animate={{height: 'auto', opacity: 1, translateY: 0}}
                  exit={{height: 0, opacity: 0, translateY: -10}}
                  transition={{duration: 0.4}}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>

            {open && !animations && (
              <div className="overflow-hidden">{children}</div>
            )}
          </>
        )}
      </Disclosure>
    </div>
  );
}
