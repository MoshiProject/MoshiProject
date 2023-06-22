import {Link, useFetcher} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen-react';
import {LineItemType} from './products/products';

export function CartLineItems({linesObj}: any) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="space-y-8">
      {lines.map((line: any) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

function LineItem({lineItem}: {lineItem: LineItemType}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex gap-4">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="flex-shrink-0"
      >
        <Image data={merchandise.image} width={110} height={110} />
      </Link>
      <div className="flex-1">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline hover:underline"
        >
          {merchandise.product.title}
        </Link>
        <div className="text-neutral-200 text-sm tracking-widest">
          {merchandise.title}
        </div>
        <div className="text-neutral-200 text-sm tracking-widest">
          Qty: {quantity}
        </div>
        <ItemRemoveButton lineIds={[lineItem.id]} />
      </div>
      <div className="flex flex-col items-end">
        <span className="line-through	text-sm text-right w-full">
          ${lineItem.cost.compareAtAmountPerQuantity.amount * lineItem.quantity}
        </span>
        <Money
          className="text-red-600 font-medium"
          data={lineItem.cost.totalAmount}
        />
      </div>
    </div>
  );
}

function ItemRemoveButton({lineIds}: {lineIds: string[]}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
      <button
        className="bg-neutral-950 border-white text-white hover:text-neutral-950 hover:bg-white rounded-md font-small text-center my-2 max-w-xl leading-none border w-10 h-10 flex items-center justify-center"
        type="submit"
      >
        <IconRemove />
      </button>
    </fetcher.Form>
  );
}

function IconRemove() {
  return (
    <svg
      fill="transparent"
      stroke="currentColor"
      viewBox="0 0 20 20"
      className="w-5 h-5"
    >
      <title>Remove</title>
      <path
        d="M4 6H16"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M8.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11.5 9V14" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M5.5 6L6 17H14L14.5 6"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 6L8 5C8 4 8.75 3 10 3C11.25 3 12 4 12 5V6"
        strokeWidth="1.25"
      />
    </svg>
  );
}
export function CartSummary({
  cost,
  compareCost,
}: {
  cost: {subtotalAmount: {amount: string}};
  compareCost: number;
}) {
  return (
    <>
      <dl className="space-y-2">
        <div className="flex items-center justify-between">
          <dt>Original Price</dt>
          <dd>
            {compareCost ? (
              <span className="line-through	text-sm text-right w-full">
                ${compareCost}
              </span>
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Savings</dt>
          <dd>
            {compareCost ? (
              <span className="text-sm text-right w-full">
                ${(compareCost - cost?.subtotalAmount.amount).toFixed(2)}
              </span>
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt>Final Price</dt>
          <dd>
            {cost?.subtotalAmount?.amount ? (
              <Money
                className="text-red-600 font-medium text-lg"
                data={cost?.subtotalAmount}
              />
            ) : (
              '-'
            )}
          </dd>
        </div>
        {/* <div className="flex items-center justify-between">
          <dt className="flex items-center">
            <span>Shipping estimate</span>
          </dt>
          <dd className="text-green-400">Free and carbon neutral</dd>
        </div> */}
      </dl>
    </>
  );
}

export function CartActions({checkoutUrl}: {checkoutUrl: string}) {
  if (!checkoutUrl) return null;
  return (
    <div className="flex flex-col mt-2">
      <a
        href={checkoutUrl}
        className="bg-white text-black px-6 py-3 w-full rounded-md text-center font-medium"
      >
        Continue to Checkout
      </a>
    </div>
  );
}
