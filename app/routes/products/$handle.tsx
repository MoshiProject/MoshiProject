import {useLoaderData} from '@remix-run/react';
import {json} from 'react-router';
import ProductOptions from '~/components/ProductOptions';
import {MediaFile, Money, ShopPayButton} from '@shopify/hydrogen-react';
import {useMatches, useFetcher} from '@remix-run/react';
import {useState} from 'react';
import {Disclosure, RadioGroup, Tab} from '@headlessui/react';
import {StarIcon} from '@heroicons/react/20/solid';
import {HeartIcon, MinusIcon, PlusIcon} from '@heroicons/react/24/outline';
import {Carousel} from '@mantine/carousel';
import {LoaderArgs} from '@shopify/remix-oxygen';
import {ImageType, Option, Product, Variant} from '~/components/products';
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
      <button className="bg-black text-white px-6 py-3 w-full rounded-md text-center font-medium max-w-[400px]">
        Add to Bag
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
        withIndicators
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
    </div>
  );
}

export default function ProductHandle() {
  const {product, selectedVariant, storeDomain} = useLoaderData();
  const orderable = selectedVariant?.availableForSale || false;
  return (
    <section className="w-full gap-2 md:gap-8 grid  md:px-8 lg:px-12">
      <div className="grid items-start gap-2 lg:gap-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="grid md:grid-flow-row  md:p-0 md:overflow-x-hidden  md:w-full lg:col-span-3 h-fit">
          <ProductGallery media={product.media.nodes} />
        </div>
        <div className="md:sticky md:mx-auto max-w-xl md:max-w-[24rem] grid gap-1 lg:gap-8 p-0 md:p-6 md:px-0 top-[6rem] lg:top-[8rem] xl:top-[10rem] md:col-span-1 lg:col-span-2">
          <div className="grid gap-2">
            <h1 className="text-3xl font-bold leading-10 whitespace-normal">
              {product.title}
            </h1>
          </div>
          <ProductOptions
            options={product.options}
            selectedVariant={selectedVariant}
          />
          <Money
            withoutTrailingZeros
            data={selectedVariant.price}
            className="text-xl font-semibold mb-2"
          />
          {orderable && (
            <div className="space-y-2 w-full">
              <ShopPayButton
                storeDomain={storeDomain}
                variantIds={[selectedVariant?.id]}
                width="340px"
              />
              <ProductForm variantId={selectedVariant?.id} />
            </div>
          )}

          <div
            className="prose border-t border-gray-200 pt-6 text-black text-md"
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          />

          <div
            className="prose border-t border-gray-200 pt-6 text-black text-md"
            dangerouslySetInnerHTML={{__html: product.descriptionHtml}}
          ></div>
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
