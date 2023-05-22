import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import {type LoaderArgs} from '@shopify/remix-oxygen';
import tailwind from './styles/tailwind-build.css';
import favicon from '../public/favicon.svg';
import {Layout} from './components/Layout';
import {Seo} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {CART_QUERY} from '~/queries/cart';
import styles from '~/styles/app.css';
import swiperBCSS from 'swiper/swiper-bundle.min.css';
import ImageZoom from 'react-medium-image-zoom/dist/styles.css';
import {Product} from './components/products/products';
import {PRODUCTS_BY_ID_QUERY} from './queries/product';
import {json} from '@shopify/remix-oxygen';
export const links = () => {
  return [
    {rel: 'stylesheet', href: tailwind},
    {
      rel: 'preconnect',
      href: 'https://cdn.shopify.com',
    },
    {rel: 'stylesheet', href: ImageZoom},
    {rel: 'stylesheet', href: styles},
    {rel: 'stylesheet', href: swiperBCSS},
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
    {rel: 'icon', type: 'image/svg+xml', href: favicon},
  ];
};

export const meta = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({context, request}: LoaderArgs) {
  const cartId = await context.session.get('cartId');
  //get cookie data for recently Viewed
  const cookieHeader = request.headers.get('Cookie');
  // const cookie = await recentlyViewedCookie.parse(cookieHeader);
  // console.log('cookie', cookie.recentlyViewed);

  // const {nodes}: {nodes: object[]} = await context.storefront.query(
  //   PRODUCTS_BY_ID_QUERY,
  //   {
  //     variables: {
  //       productIds: cookie.recentlyViewed,
  //     },
  //   },
  // );
  // const recentlyViewed = nodes;
  if (false) {
    // return defer({
    //   cart: cartId ? getCart(context, cartId) : undefined,
    //   layout: await context.storefront.query(LAYOUT_QUERY),
    //   recentlyViewed,
    // });
  } else {
    //sets cookie with header
    return json({
      cart: cartId ? getCart(context, cartId) : undefined,
      layout: await context.storefront.query(LAYOUT_QUERY),
    });
  }
}

export default function App() {
  const data = useLoaderData();

  const {name} = data.layout.shop;
  const recentlyViewed = data.recentlyViewed;
  return (
    <html lang="en">
      <head>
        <Seo />
        <Meta />
        <Links />
      </head>
      <body>
        <script
          async
          type="text/javascript"
          src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=ViUH6b"
        ></script>
        <Layout title={name} recentlyViewed={recentlyViewed}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const LAYOUT_QUERY = `#graphql
  query layout {
    shop {
      name
      description
    }
  }
`;
async function getCart({storefront}: any, cartId: number) {
  if (!storefront) {
    throw new Error('missing storefront client in cart query');
  }

  const {cart} = await storefront.query(CART_QUERY, {
    variables: {
      cartId,
      country: storefront.i18n.country,
      language: storefront.i18n.language,
    },
    cache: storefront.CacheNone(),
  });

  return cart;
}
