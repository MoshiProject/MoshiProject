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
import {Layout} from './components/Layout';
import {Script, Seo, ShopifyPageViewPayload} from '@shopify/hydrogen';
import {defer} from '@shopify/remix-oxygen';
import {CART_QUERY} from '~/queries/cart';
import styles from '~/styles/app.css';
import swiperBCSS from 'swiper/swiper-bundle.min.css';
import ImageZoom from 'react-medium-image-zoom/dist/styles.css';
import {useLocation} from '@remix-run/react';
import {useEffect, useRef} from 'react';

import {
  AnalyticsEventName,
  getClientBrowserParameters,
  sendShopifyAnalytics,
  useShopifyCookies,
} from '@shopify/hydrogen';
import {usePageAnalytics} from './hooks/usePageAnalytics';
import {getPublicEnv, useEnv} from './functions/utils';
import ReactGA from 'react-ga4';
import {userInfo} from './cookies.server';

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
      rel: 'icon',
      href: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Favicon.png?v=1643314556',
    },
    {
      rel: 'preconnect',
      href: 'https://shop.app',
    },
  ];
};
export const handle = {
  seo: {
    title: 'MoshiProject',
    titleTemplate:
      '%s - Anime Clothing, Anime Streetwear & Anime Aesthetics Apparel',
    description:
      'MoshiProject - Your Destination for Premium Anime Clothing and Japanese Streetwear. Shop Trendsetting Anime T-Shirts, Anime Sweatshirts, and Anime Hoodies!',
  },
};

export const meta = () => ({
  charset: 'utf-8',
  viewport: 'width=device-width,initial-scale=1',
});

export async function loader({context, request}: LoaderArgs) {
  //get the cookie
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userInfo.parse(cookieHeader)) || {};

  if (!cookie.userId) {
    cookie.userId = generateUniqueId();
  }

  if (!cookie.utm) {
    //How to get utms
    const url = new URL(request.url);
    const utms = getUTMFromURL(url);
    cookie.utms = utms;
  }

  console.log('cookie', cookie);

  const cartId = await context.session.get('cartId');
  //get cookie data for recently Viewed
  // const cookieHeader = request.headers.get('Cookie');
  // const cookie = await recentlyViewedCookie.parse(cookieHeader);

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
    return defer(
      {
        publicEnv: getPublicEnv(context.env),
        cart: cartId ? getCart(context, cartId) : undefined,
        layout: await context.storefront.query(LAYOUT_QUERY),
        analytics: {
          shopId: 'gid://shopify/Shop/55241212109',
        },
      },
      {
        headers: {
          'Set-Cookie': await userInfo.serialize(cookie),
        },
      },
    );
  }
}

export default function App() {
  const data = useLoaderData();
  const env = useEnv();

  const hasUserConsent = true;
  useShopifyCookies({hasUserConsent});

  ReactGA.initialize('G-TDVVV3C28L');

  const location = useLocation();
  const lastLocationKey = useRef<string>('');
  const pageAnalytics = usePageAnalytics({hasUserConsent});

  useEffect(() => {
    // Filter out useEffect running twice
    if (lastLocationKey.current === location.key) return;

    lastLocationKey.current = location.key;

    const payload: ShopifyPageViewPayload = {
      ...getClientBrowserParameters(),
      ...pageAnalytics,
    };
    sendShopifyAnalytics({
      eventName: AnalyticsEventName.PAGE_VIEW,
      payload,
    });
    ReactGA.send({
      hitType: 'pageview',
      page: payload.url,
      title: payload.products
        ? payload.products[0].title
          ? payload.products[0].title
          : payload.title
        : payload.title,
    });
  }, [location, pageAnalytics]);
  const {name} = data.layout.shop;
  //const recentlyViewed = data.recentlyViewed;
  return (
    <html lang="en">
      <head>
        <Seo />
        <Meta />
        <Links />
        <FacebookPixel />
        {/* <InspectletSnippet /> */}
        <MSClaritySnippet />
        <GAnalyticsSnippet />
      </head>
      <body>
        <Layout title={name}>
          <Outlet />
        </Layout>
        <ScrollRestoration />
        <Scripts />
        <ShopifyChat />
        <KlayivoSnippet />
      </body>
    </html>
  );
}

//getUTMFromTerm
const getUTMFromURL = (url) => {
  const term = url.searchParams;
  const utmSource = term.get('utm_source');
  const utmMedium = term.get('utm_medium');
  const utmCampaign = term.get('utm_campaign');
  console.log('utmSource', utmSource);
  console.log('utmMedium', utmMedium);
  console.log('utmCampaign', utmCampaign);
  return {
    utmSource,
    utmMedium,
    utmCampaign,
    valid: !!(utmSource && utmMedium && utmCampaign),
  };
};

//GENERATE UNIQUE ID
const generateUniqueId = () => {
  const id = Math.random().toString(16).slice(2);
  return id;
};

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
const FacebookPixel = () => {
  return (
    <>
      {/* Facebook Pixel Code */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
!function(f,b,e,v,n,t,s) {
if(f.fbq) return;
n=f.fbq=function() {
  n.callMethod ?
  n.callMethod.apply(n,arguments) :
  n.queue.push(arguments)
};
if(!f._fbq) f._fbq=n;
n.push=n;n.loaded=!0;
n.version='2.0';n.queue=[];
t=b.createElement(e);t.async=!0;
t.src=v;
s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)
}(window, document,'script','https://connect.facebook.net/en_US/fbevents.js');

fbq('init', '487072912450981');
fbq('track', 'PageView');
`,
        }}
      ></script>
      {/* End Facebook Pixel Code */}
    </>
  );
};

const GAnalyticsSnippet = () => {
  return (
    <script
      src="https://www.googletagmanager.com/gtag/js?id=G-TDVVV3C28L"
      dangerouslySetInnerHTML={{
        __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
      
        gtag('config', 'G-TDVVV3C28L');
`,
      }}
    ></script>
  );
};

const InspectletSnippet = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            window.__insp = window.__insp || [];
            __insp.push(['wid', 1244062535]);
            var ldinsp = function(){
            if(typeof window.__inspld != "undefined") return; window.__inspld = 1; var insp = document.createElement('script'); insp.type = 'text/javascript'; insp.async = true; insp.id = "inspsync"; insp.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://cdn.inspectlet.com/inspectlet.js?wid=1244062535&r=' + Math.floor(new Date().getTime()/3600000); var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(insp, x); };
            setTimeout(ldinsp, 0);
            })();
`,
      }}
    ></script>
  );
};

const MSClaritySnippet = () => {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "jw7xr9b2sm");
`,
      }}
    ></script>
  );
};
const KlayivoSnippet = () => {
  return (
    <script
      async
      type="text/javascript"
      src="https://static.klaviyo.com/onsite/js/klaviyo.js?company_id=ViUH6b"
    ></script>
  );
};
const ShopifyChat = () => {
  useEffect(() => {
    const addScript = () => {
      const tag = document.createElement('script');
      tag.src =
        'https://cdn.shopify.com/shopifycloud/shopify_chat/storefront/shopifyChatV1.js?api_env=production&c=%23c71532&i=chat_bubble&p=bottom_right&s=icon&shop_id=OjK3Vm316bxb6PJodSAgw0CpDpmggVKv6ryxPeyQYbw&t=no_text&v=1&shop=moshiproject.myshopify.com';
      document.getElementsByTagName('head')[0].appendChild(tag);
    };

    // Delay the script insertion by 3 seconds
    const timeoutId = setTimeout(addScript, 100);

    return () => {
      // Clean up the script and timeout when the component unmounts
      clearTimeout(timeoutId);
    };
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  return <></>;
};
export const clarityEvent = (tag: string) => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          clarity("set", "event", "${tag}");
`,
        }}
      ></script>
    </>
  );
};
