import {Disclosure} from '@headlessui/react';
import {ChevronRightIcon} from '@heroicons/react/20/solid';
import {Await, useActionData, useLoaderData} from '@remix-run/react';
import type {SeoHandleFunction} from '@shopify/hydrogen';
import {AnalyticsPageType} from '@shopify/hydrogen';
import {Money, ShopPayButton} from '@shopify/hydrogen-react';
import {ActionArgs, LoaderArgs, defer} from '@shopify/remix-oxygen';
import {AnimatePresence} from 'framer-motion';
import {Suspense, useEffect, useRef, useState} from 'react';
import ReviewsSection from '~/components/Reviews/ReviewsSection';
import AddToCartForm from '~/components/products/AddToCartForm';
import DescriptionTab from '~/components/products/DescriptionTab';
import ProductGallery from '~/components/products/ProductGallery';
import ProductOptions from '~/components/products/ProductOptions';
import ProductRecommendations from '~/components/products/ProductRecommendations';
import ReturnInfo from '~/components/products/ReturnInfo';
import Seperator from '~/components/products/Seperator';
import ShippingEstimation from '~/components/products/ShippingEstimation';
import ShippingInfo from '~/components/products/ShippingInfo';
import SizingChart from '~/components/products/SizingChart';
import {Option, Product, Variant} from '~/components/products/products';
import titleFilter, {
  getProductAnime,
  getProductType,
  productAnimeHandles,
  productTypeHandles,
} from '~/functions/titleFilter';
import {PRODUCT_QUERY} from '~/queries/product';
import {SMALL_COLLECTION_QUERY} from '../collections/$handle';
import ContactUs from '../pages/contact-us';

const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: data?.product?.seo?.title,
  description: data?.product?.seo?.description,
});
export const handle = {
  seo,
};

export const loader = async ({params, context, request}: LoaderArgs) => {
  console.time('get Products');
  console.time('total');

  //###load necessary parameters
  const storeDomain = context.storefront.getShopifyDomain();
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  //###load admin mode if required
  const selectedOptions: Option[] = [];
  let isAdmin = false;
  // set selected options from the query string
  searchParams.forEach((value, name) => {
    selectedOptions.push({name, value});
    isAdmin = name === 'amr' && value === 'edit';
  });
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
  console.timeEnd('get Products');
  console.time('get type Recs');
  //###handle product recommendations
  const cursor = searchParams.get('cursor');
  const rev = false;
  const sort = null;

  const productType = getProductType(product.title);
  const typeHandle = productTypeHandles[productType];

  const productAnime = getProductAnime(product.title);
  const animeHandle = productAnimeHandles[productAnime];
  const {collection: productTypeRecommendations}: any = animeHandle
    ? await context.storefront.query(SMALL_COLLECTION_QUERY, {
        variables: {
          handle: typeHandle,
          cursor,
          rev,
          sort,
        },
      })
    : {collection: []};
  console.timeEnd('get type Recs');
  console.time('get anime Recs');

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
  console.timeEnd('get anime Recs');
  console.time('get judge');

  // optionally set a default variant so you always have an "orderable" product selected
  const selectedVariant: Variant =
    product.selectedVariant ?? product?.variants?.nodes[0];
  const id = product.id.substr(product.id.lastIndexOf('/') + 1);

  const judgeReviews = getJudgeMeReviews(id, context);

  console.timeEnd('get judge');
  console.timeEnd('total');

  // let reviewCount: number;
  // if (product.metafields[0] !== null && product.metafields[1] !== null) {
  //   reviewCount = product.metafields.find((metafield) => {
  //     return metafield && metafield.key === 'reviewCount';
  //   }).value;
  // } else {
  //   reviewCount = 0;
  // }

  return defer({
    judgeReviews,
    product,
    selectedVariant,
    storeDomain,
    productAnimeRecommendations: productAnimeRecommendations?.products?.nodes,
    productTypeRecommendations: productTypeRecommendations?.products?.nodes,
    analytics: {
      pageType: AnalyticsPageType.product,
      products: [product],
    },
    isAdmin,
  });
};
// };

async function getJudgeMeReviews(id: string, context) {
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
    judgeReviews = response.json();
  } catch (error) {
    console.error(error);
  }
  return judgeReviews;
}

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

  const url = `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/2023-07/products/${id}/metafields.json`;

  const accessToken = context.env.ADMIN_API_ACCESS_TOKEN;

  const headers = {
    'X-Shopify-Access-Token': accessToken,
    'Content-Type': 'application/json',
  };
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });

    const result = await response.json();

    let oldReviews = '';
    if (result.metafields) {
      oldReviews = result.metafields.find((metafield) => {
        return (
          metafield.namespace === 'hydrogen' && metafield.key === 'reviews'
        );
      });
    }

    if (!oldReviews) {
      oldReviews = '';
    }

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

    const postResponse = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    const postResult = await postResponse.json();

    return data.metafield.value;
  } catch (error) {
    console.error('Error:', error);
  }

  if (isAdmin) {
    return data;
  }
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

  const actionData = useActionData();
  const desc = product.descriptionHtml;
  const reviewsMetafield = product?.metafield
    ? product.metafields.find((metafield) => {
        return metafield.key === 'reviews';
      }).value
    : '';
  const [selectedImage, setSelectedImage] = useState(selectedVariant.image.url);
  const [reviewCount, setReviewCount] = useState(null);
  const [reviewAverage, setReviewAverage] = useState(null);
  const [customReviews, setCustomReviews] = useState(
    reviewsMetafield ? reviewStringToArray(reviewsMetafield) : [],
  );

  const reviewsRef = useRef(null);
  const executeScroll = (event) => {
    const elmnt = reviewsRef;
    elmnt.current.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'start',
    });
  };
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
  const reviewCounterWidget = reviewCount ? (
    reviewCount > 0 && (
      <div className="md:my-2" key={reviewCount}>
        <button className="w-full" onClick={executeScroll}>
          <div className="flex items-center font-bold text-neutral-600 text-md w-full">
            {[0, 1, 2, 3].map((star) => {
              return (
                <SharpStarIcon
                  key={star}
                  className={`h-5 w-5 ${'text-black'}`}
                />
              );
            })}
            <div className="relative h-5 w-5">
              <SharpStarIcon
                className={`h-5 w-5 fill-neutral-400  absolute left-0 top-0 `}
              />
              <div
                className={`absolute left-0 top-0 overflow-hidden`}
                style={{width: 15 * (reviewAverage - 4)}}
              >
                <SharpStarIcon className={`h-5 w-5 text-black `} />
              </div>
            </div>
            <span className="ml-1">({reviewCount})</span>
          </div>
        </button>
      </div>
    )
  ) : (
    <></>
  );

  useEffect(() => {
    setSelectedImage(selectedVariant.image.url);
  }, [selectedVariant]);
  useEffect(() => {
    if (actionData) {
      setCustomReviews(actionData ? reviewStringToArray(actionData) : []);
    }
  }, [actionData]);
  const orderable = selectedVariant?.availableForSale || false;
  return (
    <section className="w-full  gap-2 px-2  md:gap-8 grid  mt-1 md:px-24 md:mt-0">
      <div className="grid items-start gap-1 lg:gap-12 md:grid-cols-2 lg:grid-cols-11 px-3">
        {/* Product Images */}
        <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-hidden  md:w-full lg:col-span-6 h-fit md:mt-20 mt-4">
          <ProductGallery
            media={product.media.nodes}
            selectedImage={selectedImage}
          />
        </div>
        <div className="md:hidden grid grid-flow-row gap-3">
          {/* Title */}
          <h1 className="md:hidden mt-4 tracking-widest md:text-start text-[40px] md:text-[48px] md:mb-4 md:bold  font-bold leading-none whitespace-normal uppercase">
            {titleFilter(product.title)}
          </h1>
          {/* Reviews */}
          {reviewCounterWidget}

          {/* Price */}
          <div className="flex md:justify-center">
            <div className="md:hidden flex md:justify-start md:items-start">
              {selectedVariant.compareAtPrice && (
                <Money
                  withoutTrailingZeros
                  data={selectedVariant.compareAtPrice}
                  className="text-lg font-normal text-neutral-800 line-through	mr-3"
                />
              )}
              <Money
                withoutTrailingZeros
                data={selectedVariant.price}
                className="text-lg font-normal text-red-600 "
              />
              <span className="text-lg font-normal text-red-600 ml-2">
                {'  USD'}
              </span>
            </div>
          </div>
        </div>
        <ItemIsInStock />
        <div className="md:sticky md:mx-auto max-w-xl md:max-w-[502px] grid lg:gap-2 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem] md:col-span-1 lg:col-span-5">
          <div className="grid gap-2">
            <h1 className="hidden md:block text-center tracking-widest md:text-start text-2xl md:text-[48px] md:mb-4 md:bold  font-bold leading-none whitespace-normal uppercase">
              {titleFilter(product.title)}
            </h1>
            <div className="hidden md:block"> {reviewCounterWidget}</div>

            <div className="grid gap-2 items-center md:justify-start md:items-start">
              <div className="hidden md:flex justify-center md:justify-start md:items-start">
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
              <div className="hidden">
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
              <div className="hidden md:block">
                <DescriptionBlock product={product} />
              </div>
            </div>
          )}
        </div>
      </div>{' '}
      <div className="md:hidden">
        <Seperator />
      </div>
      <div className="md:hidden">
        <Seperator />
      </div>
      <div className="md:hidden">
        <DescriptionBlock product={product} />
      </div>
      <ProductPageGraphic />
      <Seperator />
      <div key={reviewCount}>
        <Suspense fallback={<div></div>}>
          <Await resolve={judgeReviews}>
            {(judgeReviews) => (
              <ReviewsSection
                forwardRef={reviewsRef}
                customReviews={customReviews}
                product={product}
                judgeReviews={judgeReviews.reviews}
                isAdmin={isAdmin}
                setReviewCount={setReviewCount}
                setReviewAverage={setReviewAverage}
              ></ReviewsSection>
            )}
          </Await>
        </Suspense>
      </div>
      <Seperator />
      <Suspense fallback={<div></div>}>
        <Await resolve={productAnimeRecommendations}>
          {(productAnimeRecommendations) => (
            <ProductRecommendations
              recommendations={productAnimeRecommendations}
              title={
                getProductAnime(product.title) === undefined
                  ? `You may also like`
                  : `Shop ${getProductAnime(product.title)}`
              }
            />
          )}
        </Await>
      </Suspense>
      <Seperator />
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
  border?: boolean;
};

export function Accordion({
  title,
  animations,
  children,
  border = true,
}: AccordionProps) {
  return (
    <div
      className={`px-5 ${
        border ? 'border' : ''
      } border-t-0 border-neutral-200 w-full md:max-w-lg md:text-sm tracking-widest`}
    >
      <Disclosure>
        {({open}) => (
          <>
            <Disclosure.Button
              className={`py-4 flex justify-between w-full tracking-widest uppercase items-center `}
            >
              <div></div>
              {title}
              <ChevronRightIcon
                className={`w-7 h-7 stroke-1	  ${
                  open
                    ? 'rotate-270 transform transition-transform duration-200'
                    : 'rotate-90'
                }`}
              />
            </Disclosure.Button>

            <AnimatePresence>
              {open && animations && (
                <div
                  className="overflow-hidden"
                  key="content"
                  initial={{height: 0, opacity: 0, translateY: -10}}
                  animate={{height: 'auto', opacity: 1, translateY: 0}}
                  exit={{height: 0, opacity: 0, translateY: -10}}
                  transition={{duration: 0.4}}
                >
                  {children}
                </div>
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
function DescriptionBlock({product}) {
  return (
    <div className="md:max-w-[502px]">
      {' '}
      <div className="md:max-w-[502px] text-sm md:mt-0 mt-4">
        {/* <Accordion title={'Description'} animations>
      <div
        className="prose border-t border-gray-200 pt-6 text-black text-sm mb-4"
        dangerouslySetInnerHTML={{
          __html: description,
        }}
      />
    </Accordion> */}

        {getProductType(product.title)?.toLowerCase() === 't-shirt' && (
          <DescriptionTab title="Product Details" height="fit-content">
            <div className="md:max-w-[502px] max-w-[100vw] whitespace-normal">
              <div
                initial={{opacity: 0, x: -200}}
                viewport={{once: true}}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {delay: 0, duration: 0.4},
                }}
                className="px-2"
              >
                <h3 className="text-2xl font-bold tracking-widest mb-1">
                  Premium Quality Tee
                </h3>
                <ul className="list-disc pl-8 space-y-2 text-sm">
                  <li>100% Cotton</li>
                  <li>Pre-Shrunk</li>
                  <li>US/EU men’s size</li>
                  <li>Unisex fit</li>
                  <li>Medium-Light thickness</li>
                  <li>Soft and Smooth feel</li>
                  <li>Side seams for lasting quality and durability</li>
                  <li>
                    Ethically produced - Using 7x less water than industry
                    average
                  </li>
                  <li>Light fabric (4.5 oz/yd² (153 g/m²))</li>
                </ul>
              </div>
              <div
                initial={{opacity: 0, x: -200}}
                viewport={{once: true}}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {delay: 0, duration: 0.4},
                }}
                className="mt-12 px-2"
              >
                <h3 className="text-2xl font-bold tracking-widest mb-1 mt-3">
                  Your Unique Experience
                </h3>
                <p className="text-sm">
                  The unisex soft-style t-shirt puts a new spin on casual
                  comfort. Made from very soft materials, this tee is 100%
                  cotton for solid colors. Heather colors and sports grey
                  include polyester. The shoulders have twill tape for improved
                  durability. There are no side seams. The collar is made with
                  ribbed knitting to prevent curling damage.
                </p>
                <p className="text-sm mt-3">
                  Tracking numbers are available once the item finishes being
                  made and ships.
                </p>
                <p className="text-sm mt-3">
                  All our items are standard men's US/EU sizes. They are not
                  Asian sizes, they are not drop-shipped.
                </p>
              </div>
            </div>
          </DescriptionTab>
        )}

        {getProductType(product.title)?.toLowerCase() === 'hoodie' && (
          <DescriptionTab title="Product Details" height="fit-content">
            <div className="md:max-w-[502px] max-w-[100vw] whitespace-normal">
              <div
                initial={{opacity: 0, x: -200}}
                viewport={{once: true}}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {delay: 0, duration: 0.4},
                }}
                className="px-2"
              >
                <h3 className="text-2xl font-bold tracking-widest mb-1">
                  Premium Quality Hoodie
                </h3>
                <ul className="list-disc pl-8 space-y-2 text-sm">
                  <li>50% Cotton 50% Polyester</li>
                  <li>Medium-heavy fabric (8.0 oz/yd² (271.25 g/m²))</li>
                  <li>Classic fit</li>
                  <li>Tear away label</li>
                  <li>Runs true to size</li>
                </ul>
              </div>
              <div
                initial={{opacity: 0, x: -200}}
                viewport={{once: true}}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {delay: 0, duration: 0.4},
                }}
                className="mt-12 px-2"
              >
                <h3 className="text-2xl font-bold tracking-widest mb-1 mt-3">
                  Cozy Comfort and Stylish Design
                </h3>
                <p className="text-sm">
                  This Japanese anime unisex heavy blend hooded sweatshirt is
                  relaxation itself. The material is a thick blend of cotton and
                  polyester, offering a plush, soft feel alongside warmth. There
                  are no side seams, and a spacious kangaroo pocket hangs in
                  front. The hood's drawstring is the same color as the base
                  sweater.
                </p>{' '}
                <p className="text-sm mt-3">
                  Tracking numbers are available once the item finishes being
                  made and ships.
                </p>
                <p className="text-sm mt-3">
                  All our items are standard men's US/EU sizes. They are not
                  Asian sizes, they are not drop-shipped.
                </p>
              </div>
            </div>
          </DescriptionTab>
        )}
        {getProductType(product.title)?.toLowerCase() === 'sweatshirt' && (
          <DescriptionTab title="Product Details" height="fit-content">
            <div className="md:max-w-[502px] max-w-[100vw] whitespace-normal">
              <div
                initial={{opacity: 0, x: -200}}
                viewport={{once: true}}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {delay: 0, duration: 0.4},
                }}
                className="px-2"
              >
                <h3 className="text-2xl font-bold tracking-widest mb-1">
                  Premium Quality Sweatshirt
                </h3>
                <ul className="list-disc pl-8 space-y-2 text-sm">
                  <li>50% Cotton 50% Polyester</li>
                  <li>Medium-heavy fabric (8.0 oz/yd² (271.25 g/m²))</li>
                  <li>Loose fit</li>
                  <li>Sewn-in label</li>
                  <li>Runs true to size</li>
                </ul>
              </div>
              <div
                initial={{opacity: 0, x: -200}}
                viewport={{once: true}}
                whileInView={{
                  opacity: 1,
                  x: 0,
                  transition: {delay: 0, duration: 0.4},
                }}
                className="mt-12 px-2"
              >
                <h3 className="text-2xl font-bold tracking-widest mb-1 mt-3">
                  Pure Comfort for Any Occasion
                </h3>
                <p className="text-sm">
                  Ideal for any situation, a unisex heavy blend crewneck
                  sweatshirt is pure comfort. These garments are made from
                  polyester and cotton, allowing designs to come out looking
                  fresh and beautiful. The collar is ribbed knit, so it retains
                  its shape even after washing. There are no itchy side seams on
                  these sweaters.
                </p>{' '}
                <p className="text-sm mt-3">
                  Tracking numbers are available once the item finishes being
                  made and ships.
                </p>
                <p className="text-sm mt-3">
                  All our items are standard men's US/EU sizes. They are not
                  Asian sizes, they are not drop-shipped.
                </p>
              </div>
            </div>
          </DescriptionTab>
        )}

        {/* {composition && (
          <Accordion title={'Composition'} animations>
            <div
              className="prose border-t border-gray-200 pt-6 text-black text-md list-disc	"
              dangerouslySetInnerHTML={{
                __html: composition.replaceAll('.:', '•'),
              }}
            />
          </Accordion>
        )} */}
        {/* <Accordion title="Shipping" animations>
          <div className="">
            <p>
              <strong>SHIPPING TIMES</strong>&nbsp;
            </p>
            <p>
              We custom make every order in-house. Please allow 2 to 4 business
              days for all items to be made before shipment. After your item(s)
              have been processed, you will receive a tracking code in your
              email. Deliveries typically take{' '}
              {['sweatshirt', 'shirt', 'hoodie'].includes(
                getProductType(product.title)?.toLowerCase(),
              )
                ? '3-5 business days'
                : '2-4 weeks'}
              after fulfillment. Tracking numbers are always provided. We are
              not responsible for delays caused by individual carriers, but we
              will always do everything we can to make sure you receive your
              order as fast as possible.&nbsp;
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
              Order changes or cancellation requests can be within 24 hours of
              your order being made. We do not offer any sort of exchanges or
              refund for change of mind items after this time. This also
              includes exchanges or refunds for size changes so please double
              check sizing charts prior to making your purchase. A 3%
              transaction fee will be removed from the refunded amount.
            </p>
            <br />
            <p>
              Returns or exchanges will only be accepted if you received the
              wrong items or defective/damaged items. To be eligible for a
              return, your item must be unused and in the same condition that
              you received it. We reserve the right to deny any item that does
              not meet these requirements.
            </p>
          </div>
        </Accordion> */}
      </div>
      {['sweatshirt', 't-shirt', 'hoodie'].includes(
        getProductType(product.title)?.toLowerCase(),
      ) && (
        <DescriptionTab title={'Care Instructions'} height="fit-content">
          <div className="md:max-w-[502px] max-w-[100vw] whitespace-normal px-1 mt-3">
            <p className="text-sm mb-4 md:max-w-[502px] max-w-[100vw]">
              To ensure that your DTG-printed garments remain in good condition
              for as long as possible, it's important to follow the care
              instructions carefully. The following steps are recommended:
            </p>
            <ol className=" mb-4 md:max-w-[502px] max-w-[100vw] list-disc pl-8 space-y-2 text-sm">
              <li>
                Machine-wash your DTG-printed garments cold and inside-out on a
                gentle cycle using a mild detergent and similar colors.
              </li>{' '}
              <li>
                Use non-chlorine bleach only when necessary. While DTG-printed
                apparel can be tumble-dried on a low cycle, it's recommended to
                hang-dry them instead.
              </li>{' '}
              <li>
                Do not dry clean your DTG-printed garments. Dry cleaning can
                damage the fibers of the garment and cause the print to fade or
                bleed.
              </li>
            </ol>
          </div>
        </DescriptionTab>
      )}
      <div className="mb-[-8px] border-b border-neutral-200">
        <ShippingInfo />
        <ReturnInfo />
        <DescriptionTab title="Contact Us" height="768px">
          <ContactUs embed={true}></ContactUs>
        </DescriptionTab>
      </div>
    </div>
  );
}
const SharpStarIcon = ({className}) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      width="{24}"
      height="{24}"
      viewBox="0 0 24 24"
    >
      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
    </svg>
  );
};

import ProductPageGraphic from '~/components/products/ProductPageGraphic';

const ItemIsInStock = () => {
  return (
    <div className="flex items-center pb-1 md:hidden">
      <div className="relative mr-4 mb-2">
        <div className="absolute w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <div className="absolute w-2 h-2 bg-green-600 rounded-full animate-ping opacity-50"></div>
      </div>
      <div className="pb-0.5">
        <span className="text-xs leading-1">Item is in stock</span>
      </div>
    </div>
  );
};

const reviewStringToArray = (reviewString: string) => {
  return JSON.parse('[' + reviewString + ']');
};
