import {CartDrawer, useDrawer} from '~/components/Drawer';
import {
  CartLineItems,
  CartActions,
  CartSummary,
  CartShippingBar,
} from '~/components/Cart';
import {Suspense} from 'react';
import {Await, useFetcher} from '@remix-run/react';
import {useFetchers} from '@remix-run/react';
import {useEffect, useState} from 'react';
import {TagIcon} from '@heroicons/react/24/outline';
import {ArrowRightIcon} from '@heroicons/react/20/solid';
import siteSettings from '~/settings';
import LoadingSpinner from '../animations/LoadingSpinner';
export default function CartButton(cart: any) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const fetchers = useFetchers();
  const [quantity, setQuantity] = useState(0);
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
      <CartDrawer open={isOpen} onClose={closeDrawer} quantity={quantity}>
        <Suspense>
          <Await resolve={cart}>
            {(data) => (
              <>
                {data?.totalQuantity > 0 ? (
                  <>
                    {setQuantity(data?.totalQuantity)}
                    <div className="flex-1 overflow-y-auto">
                      <div>
                        <CartShippingBar currentTotal={data.cost} />{' '}
                      </div>
                      <div className="flex flex-col space-y-7 justify-between items-center md:py-8 md:px-12 pl-1 pr-4 py-6 pt-2">
                        <CartLineItems linesObj={data.lines} />
                      </div>
                    </div>
                    <div className="w-full md:px-12 px-4 py-6 space-y-3 border-t border-neutral-800 pt-1">
                      <div>
                        {data.discountCodes.map((discount) => (
                          <div
                            className="flex justify-between items-center w-full"
                            key={discount.code}
                          >
                            <div>
                              {' '}
                              {discount.applicable ? (
                                <span
                                  className={`flex items-center border-2 ${
                                    discount.applicable
                                      ? 'border-green-500'
                                      : 'border-red-600'
                                  } bg-neutral-700 bg-opacity-50 p-1 text-sm w-fit rounded-md px-4`}
                                >
                                  <TagIcon className="h-5 w-5 rotate-90 mr-1" />{' '}
                                  <span className="mx-2">{discount.code}</span>
                                  <RemoveDiscountButton></RemoveDiscountButton>
                                </span>
                              ) : (
                                <>
                                  {' '}
                                  <div className="text-xs p-2 border-red-600 border rounded-lg flex">
                                    <span>
                                      Minimum requirements for discount not met!
                                      Spend $
                                      {(
                                        99 - data.cost.totalAmount.amount
                                      ).toFixed(2)}{' '}
                                      more to use the code!{' '}
                                    </span>
                                  </div>{' '}
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <DiscountForm></DiscountForm>
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
                      <CartActions
                        checkoutUrl={data.checkoutUrl}
                        totalAmount={data.cost}
                      />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 pt-2 h-screen">
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
      </CartDrawer>

      <span className="sr-only">items in cart, view bag</span>
    </div>
  );
}

function RemoveDiscountButton() {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/handleDiscount" method="get">
      <input type="hidden" name="code" value={'empty'} />
      {fetcher.state === 'idle' ? (
        <button
          className=" text-white hover:text-neutral-950 hover:bg-white rounded-md font-small text-center my-2 max-w-xl leading-none flex items-center justify-center"
          type="submit"
        >
          X
        </button>
      ) : (
        <LoadingSpinner />
      )}
    </fetcher.Form>
  );
}
function DiscountForm() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/handleDiscount" method="post">
      <div
        className={`flex items-center ${
          siteSettings.cart.displayDiscounts ? '' : 'hidden'
        } `}
      >
        <input
          className="h-10 bg-neutral-950 border-neutral-400 border-2 w-full text-white rounded-md placeholder:text-neutral-500"
          type="text"
          name="code"
          placeholder="Discount Code"
        />
        {fetcher.state === 'idle' ? (
          <button
            className="bg-neutral-950 mx-2 border-neutral-400 text-white border-2 hover:text-neutral-950 hover:bg-white rounded-md font-small text-center max-w-xl leading-none w-10 h-10 flex items-center justify-center focus:border-red-600"
            type="submit"
          >
            <ArrowRightIcon className="h-5 w-5" />
          </button>
        ) : (
          <div className="mx-2">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </fetcher.Form>
  );
}
