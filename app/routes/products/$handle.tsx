import {useLoaderData} from '@remix-run/react';
import {json} from 'react-router';
import ProductOptions from '~/components/ProductOptions';
import {MediaFile, Money, ShopPayButton} from '@shopify/hydrogen-react';
import {useMatches, useFetcher} from '@remix-run/react';
import {useState, useEffect, Suspense} from 'react';
import {Disclosure, RadioGroup, Tab} from '@headlessui/react';
import {StarIcon} from '@heroicons/react/20/solid';
import {HeartIcon, MinusIcon, PlusIcon} from '@heroicons/react/24/outline';
import {Carousel, Embla} from '@mantine/carousel';
import {LoaderArgs} from '@shopify/remix-oxygen';
import {ImageType, Option, Product, Variant} from '~/components/products';
import {Accordion} from '@mantine/core';
type ProductFormProps = {
  variantId: number;
};
function ProductForm({variantId}: ProductFormProps) {
  const [root] = useMatches();
  const selectedLocale = root?.data?.selectedLocale;
  const fetcher = useFetcher();

  const lines = [{merchandiseId: variantId, quantity: 1}];

  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value={'ADD_TO_CART'} />
      <input
        type="hidden"
        name="countryCode"
        value={selectedLocale?.country ?? 'US'}
      />
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <button className="bg-black text-white px-6 py-3 w-full text-center font-semibold text-base max-w-[400px] uppercase">
        Add to Cart
      </button>
    </fetcher.Form>
  );
}

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

  // optionally set a default variant so you always have an "orderable" product selected
  const selectedVariant: Variant =
    product.selectedVariant ?? product?.variants?.nodes[0];

  return json({
    product,
    selectedVariant,
    storeDomain,
  });
};

function ProductGallery({
  media,
}: {
  media: {
    mediaContentType: 'MODEL_3D' | 'VIDEO' | 'IMAGE' | 'EXTERNAL_VIDEO';
    image: ImageType;
    alt: string;
    id: string;
  }[];
}) {
  const [slide, setSlide] = useState(0);
  const [emblaTop, setEmblaTop] = useState<Embla | null>(null);
  const [emblaBot, setEmblaBot] = useState<Embla | null>(null);

  useEffect(() => {
    if (emblaBot) {
      emblaBot.scrollTo(slide);
    }
    if (emblaTop) {
      emblaTop.scrollTo(slide);
    }
  }, [slide, emblaTop, emblaBot]);

  if (!media.length) {
    return null;
  }

  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };

  return (
    <div className="w-full">
      <Carousel
        breakpoints={[{slideSize: '120%', maxWidth: 480}, {slideSize: '90%'}]}
        loop
        getEmblaApi={setEmblaTop}
        onSlideChange={(index) => {
          setSlide(index);
        }}
        withIndicators
        withControls={false}
      >
        {media.map((med, i) => {
          let extraProps = {};

          if (med.mediaContentType === 'MODEL_3D') {
            extraProps = {
              interactionPromptThreshold: '0',
              ar: true,
              loading: 'eager',
              disableZoom: true,
              style: {height: '100%', margin: '0 auto'},
            };
          }

          const data = {
            ...med,
            __typename:
              typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
            image: {
              ...med.image,
              altText: med.alt || 'Product image',
            },
          };

          return (
            <Carousel.Slide key={data.id || data.image.id}>
              <MediaFile
                key={data.id || data.image.id}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                data={data}
                {...extraProps}
              />
            </Carousel.Slide>
          );
        })}
      </Carousel>
      <Carousel
        getEmblaApi={setEmblaBot}
        onSlideChange={(index) => {
          setSlide(index);
        }}
        breakpoints={[{slideSize: '20%', maxWidth: 480}, {slideSize: '100%'}]}
        loop
        align="start"
        withIndicators
        withControls={false}
      >
        {media.map((med, i) => {
          let extraProps = {};

          if (med.mediaContentType === 'MODEL_3D') {
            extraProps = {
              interactionPromptThreshold: '0',
              ar: true,
              loading: 'eager',
              disableZoom: true,
              style: {height: '100%', margin: '0 auto'},
            };
          }

          const data = {
            ...med,
            __typename:
              typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
            image: {
              ...med.image,
              altText: med.alt || 'Product image',
            },
          };

          return (
            <Carousel.Slide
              key={data.id || data.image.id}
              onClick={() => {
                setSlide(i);
                console.log(i);
              }}
            >
              <MediaFile
                key={data.id || data.image.id}
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                //@ts-ignore
                data={data}
                {...extraProps}
              />
            </Carousel.Slide>
          );
        })}
      </Carousel>
    </div>
  );
}

export default function ProductHandle() {
  const {product, selectedVariant, storeDomain} = useLoaderData();
  const orderable = selectedVariant?.availableForSale || false;
  return (
    <section className="w-full gap-2 md:gap-8 grid  md:px-8 lg:px-12">
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
          />

          {orderable && (
            <div className="space-y-2 w-full">
              <ProductForm variantId={selectedVariant?.id} />
              <ShopPayButton
                storeDomain={storeDomain}
                variantIds={[selectedVariant?.id]}
                width="100%"
                className="w-full"
              />
              <div className=" text-xs text-center">
                <shopify-payment-terms
                  variant-id="31417693569158"
                  shopify-meta='{"type":"product","variants":[{"id":31417693569158,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693601926,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693634694,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693667462,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693700230,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693732998,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693765766,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693798534,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693831302,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693864070,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693896838,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true},{"id":31417693929606,"price_per_term":"$6.74","full_price":"$26.99","eligible":false,"available":true}],"min_price":"$50.00","max_price":"$17,500.00","financing_plans":[{"min_price":"$50.00","max_price":"$149.99","terms":[{"apr":0,"loan_type":"split_pay","installments_count":4}]},{"min_price":"$150.00","max_price":"$999.99","terms":[{"apr":0,"loan_type":"split_pay","installments_count":4},{"apr":15,"loan_type":"interest","installments_count":6},{"apr":15,"loan_type":"interest","installments_count":12}]},{"min_price":"$1,000.00","max_price":"$17,500.00","terms":[{"apr":15,"loan_type":"interest","installments_count":3},{"apr":15,"loan_type":"interest","installments_count":6},{"apr":15,"loan_type":"interest","installments_count":12}]}],"installments_buyer_prequalification_enabled":false}'
                ></shopify-payment-terms>
              </div>
            </div>
          )}
          <Accordion defaultValue="customization">
            <Accordion.Item value="description">
              <Accordion.Control>Description</Accordion.Control>
              <Accordion.Panel>
                <div
                  className="prose border-t border-gray-200 pt-6 text-black text-md"
                  dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
                />
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="flexibility">
              <Accordion.Control>Shipping</Accordion.Control>
              <Accordion.Panel>
                <div className="">
                  <p>
                    <strong>SHIPPING TIMES</strong>&nbsp;
                  </p>
                  <p>
                    Orders take 1 - 4 days to be processed. Delivery typically
                    take 5-8 business days but can take 2 -&nbsp;4 weeks.
                    Tracking numbers are always provided. We are not responsible
                    for delays caused by individual carriers, but we will always
                    do everything we can to make sure you receive your order as
                    fast as possible.&nbsp;
                  </p>
                  <p>
                    <strong>TRACKING NUMBERS</strong>
                  </p>
                  <p>
                    Tracking numbers are always provided for every order. If
                    your order is shipped in&nbsp;multiple packages, you will
                    get a tracking number for each
                  </p>
                  <p>
                    <strong>CANCELLATIONS</strong>
                  </p>
                  <p>
                    Orders cannot be cancelled after being placed.&nbsp; If you
                    wish to cancel your order, you will need to wait for your
                    product to arrive so you can process a return.
                  </p>
                </div>
              </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item value="care">
              <Accordion.Control>Washing and Care</Accordion.Control>
              <Accordion.Panel>TODO</Accordion.Panel>
            </Accordion.Item>
          </Accordion>
        </div>
      </div>
    </section>
  );
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

const PRODUCT_QUERY = `#graphql
  query product($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
    product(handle: $handle) {
      id
      title
      handle
      vendor
      descriptionHtml
      media(first: 10) {
        nodes {
          ... on MediaImage {
            mediaContentType
            image {
              id
              url
              altText
              width
              height
            }
          }
          ... on Model3d {
            id
            mediaContentType
            sources {
              mimeType
              url
            }
          }
        }
      }
      options {
        name,
        values
      }
      selectedVariant: variantBySelectedOptions(selectedOptions: $selectedOptions) {
        id
        availableForSale
        selectedOptions {
          name
          value
        }
        image {
          id
          url
          altText
          width
          height
        }
        price {
          amount
          currencyCode
        }
        compareAtPrice {
          amount
          currencyCode
        }
        sku
        title
        unitPrice {
          amount
          currencyCode
        }
        product {
          title
          handle
        }
      }
      variants(first: 1) {
        nodes {
          id
          title
          availableForSale
          price {
            currencyCode
            amount
          }
          compareAtPrice {
            currencyCode
            amount
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
