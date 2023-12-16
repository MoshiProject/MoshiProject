import type {ShopifyAddToCartPayload} from '@shopify/hydrogen';
import {
  AnalyticsEventName,
  CartForm,
  getClientBrowserParameters,
  sendShopifyAnalytics,
} from '@shopify/hydrogen';
import type {FetcherWithComponents} from '@remix-run/react';
import {useEffect} from 'react';

import {usePageAnalytics} from '~/hooks/usePageAnalytics';
import {clarityEvent} from '~/root';
import ReactGA from 'react-ga4';
import {sendMoshiAnalytics} from '~/routes/api.sendEventUser';

export default function AddToCartForm({
  textColor = 'text-white',
  backgroundColor = 'bg-black',
  value = '0',
  productTitle = '',
  lines,
  analytics,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  analytics?: unknown;
}) {
  console.log('analytics', analytics);
  return (
    <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <AddToCartAnalytics fetcher={fetcher}>
            <input
              type="hidden"
              name="analytics"
              value={JSON.stringify(analytics)}
            />
            <input type="hidden" name="cartAction" value={'ADD_TO_CART'} />
            <input type="hidden" name="countryCode" value={'US'} />
            <input type="hidden" name="lines" value={JSON.stringify(lines)} />
            <button
              onClick={() => {
                clarityEvent('AddToCart');
                ReactGA.event('add_to_cart', {
                  currency: 'USD',
                  value,
                  items: productTitle,
                });
              }}
              className={`${backgroundColor} ${textColor} px-6 py-3 w-full text-center tracking-widest font-semibold text-base rounded-[4px] uppercase`}
            >
              Add to Cart
            </button>
          </AddToCartAnalytics>
        );
      }}
    </CartForm>
  );
}

function AddToCartAnalytics({
  fetcher,
  children,
}: {
  fetcher: FetcherWithComponents<any>;
  children: React.ReactNode;
}): JSX.Element {
  // Data from action response
  const fetcherData = fetcher.data;
  // Data in form inputs
  const formData = fetcher.formData;
  // Data from loaders
  const pageAnalytics = usePageAnalytics({hasUserConsent: true});

  useEffect(() => {
    if (formData) {
      const cartData: Record<string, unknown> = {};
      const cartInputs = CartForm.getFormInput(formData);

      try {
        if (cartInputs.inputs.analytics) {
          const dataInForm: unknown = JSON.parse(
            String(cartInputs.inputs.analytics),
          );
          Object.assign(cartData, dataInForm);
        }
      } catch {
        // do nothing
      }

      if (Object.keys(cartData).length && fetcherData) {
        const addToCartPayload: ShopifyAddToCartPayload = {
          ...getClientBrowserParameters(),
          ...pageAnalytics,
          ...cartData,
          cartId: fetcherData.cart.id,
        };

        sendShopifyAnalytics({
          eventName: AnalyticsEventName.ADD_TO_CART,
          payload: addToCartPayload,
        });
      }
    }
  }, [fetcherData, formData, pageAnalytics]);
  return <>{children}</>;
}
