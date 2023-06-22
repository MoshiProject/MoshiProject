import {Drawer, useDrawer} from '~/components/Drawer';
import {CartLineItems, CartActions, CartSummary} from '~/components/Cart';
import {Suspense} from 'react';
import {Await} from '@remix-run/react';
import {useFetchers} from '@remix-run/react';
import {useEffect} from 'react';

export default function CartButton(cart: any) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const fetchers = useFetchers();

  // Grab all the fetchers that are adding to cart
  const addToCartFetchers = [];
  for (const fetcher of fetchers) {
    if (fetcher?.submission?.formData?.get('cartAction') === 'ADD_TO_CART') {
      addToCartFetchers.push(fetcher);
    }
  }

  // When the fetchers array changes, open the drawer if there is an add to cart action
  useEffect(() => {
    if (isOpen || addToCartFetchers.length === 0) return;
    openDrawer();
  }, [addToCartFetchers]);

  return (
    <div className=" flow-root lg:ml-2">
      <Suspense>
        <Await resolve={cart}>
          {(data) => (
            <button
              className="relative ml-auto flex items-center justify-center w-10 h-10 md:text-black text-white fill-white md:fill-black"
              onClick={openDrawer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                className="w-7 h-7 md:w-8 md:h-8"
              >
                <title>Bag</title>
                <path
                  fillRule="evenodd"
                  d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
                ></path>
              </svg>
              {data?.totalQuantity > 0 && (
                <div className="text-contrast bg-red-500 text-white absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px">
                  <span>{data?.totalQuantity}</span>
                </div>
              )}
            </button>
          )}
        </Await>
      </Suspense>
      <Drawer open={isOpen} onClose={closeDrawer}>
        <Suspense>
          <Await resolve={cart}>
            {(data) => (
              <>
                {data?.totalQuantity > 0 ? (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      <div className="flex flex-col space-y-7 justify-between items-center md:py-8 md:px-12 px-4 py-6">
                        <CartLineItems linesObj={data.lines} />
                        {console.log('data', data)}
                      </div>
                    </div>
                    <div className="w-full md:px-12 px-4 py-6 space-y-6 border-t border-neutral-800">
                      <CartSummary
                        cost={data.cost}
                        compareCost={data.lines.edges
                          .map((line) => {
                            return (
                              line.node.cost.compareAtAmountPerQuantity.amount *
                              line.node.quantity
                            );
                          })
                          .reduce((partialSum, a) => partialSum + a, 0)}
                      />
                      <CartActions checkoutUrl={data.checkoutUrl} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
                    <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
                      Your cart is empty
                    </h2>
                    <button
                      onClick={close}
                      className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
                    >
                      Continue shopping
                    </button>
                  </div>
                )}
              </>
            )}
          </Await>
        </Suspense>
      </Drawer>

      <span className="sr-only">items in cart, view bag</span>
    </div>
  );
}
