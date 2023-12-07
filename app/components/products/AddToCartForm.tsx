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

export default function AddToCartForm({
  textColor = 'text-white',
  backgroundColor = 'bg-black',
  value = '0',
  productTitle = '',
  analytics,
  lines,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  analytics?: unknown;
}) {
  // return (
  //   <CartForm route="/cart" inputs={{lines}} action={CartForm.ACTIONS.LinesAdd}>
  //     {(fetcher: FetcherWithComponents<any>) => {
  //       return (
  //         <AddToCartAnalytics fetcher={fetcher}>
  //           <input
  //             type="hidden"
  //             name="analytics"
  //             value={JSON.stringify(analytics)}
  //           />
  //           <button
  //             type="submit"
  //             onClick={() => {
  //               clarityEvent('AddToCart');
  //               ReactGA.event('add_to_cart', {
  //                 currency: 'USD',
  //                 value,
  //                 items: productTitle,
  //               });
  //             }}
  //             className={`${backgroundColor} ${textColor} px-6 py-3 w-full text-center tracking-widest font-semibold text-base rounded-[4px] uppercase`}
  //           >
  //             Add to Cart
  //           </button>
  //         </AddToCartAnalytics>
  //       );
  //     }}
  //   </CartForm>
  // );
  return (
    <CartForm
      route="/cart"
      inputs={{
        lines,
      }}
      action={CartForm.ACTIONS.LinesAdd}
    >
      {(fetcher: FetcherWithComponents<any>) => {
        return (
          <AddToCartAnalytics fetcher={fetcher}>
            <input
              type="hidden"
              name="analytics"
              value={JSON.stringify(analytics)}
            />
            <button
              type="submit"
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
  console.log('fetcher', fetcher);

  console.log('formData', formData);
  useEffect(() => {
    if (formData) {
      console.log('formData2', formData);
      const cartData: Record<string, unknown> = {};
      const cartInputs = CartForm.getFormInput(formData);
      console.log('cartInputs', cartInputs);
      try {
        // Get analytics data from form inputs
        if (cartInputs.inputs.analytics) {
          const dataInForm: unknown = JSON.parse(
            String(cartInputs.inputs.analytics),
          );
          Object.assign(cartData, dataInForm);
        }
      } catch {
        // do nothing
      }
      console.log('cartData', cartData);
      console.log('fetcherData', fetcherData);

      // If we got a response from the add to cart action
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
