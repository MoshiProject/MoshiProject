import {Link, useFetcher} from '@remix-run/react';
import {flattenConnection, Image, Money} from '@shopify/hydrogen-react';
import {LineItemType} from './products/products';
import {useEffect, useState} from 'react';
import {TrashIcon} from '@heroicons/react/24/outline';
import {clarityEvent} from '~/root';
import ReactGA from 'react-ga4';
export function CartLineItems({linesObj}: any) {
  const lines = flattenConnection(linesObj);
  return (
    <div className="space-y-8 w-full">
      {lines.map((line: any) => {
        return <LineItem key={line.id} lineItem={line} />;
      })}
    </div>
  );
}

function LineItem({lineItem}: {lineItem: LineItemType}) {
  const {merchandise, quantity} = lineItem;

  return (
    <div className="flex justify-between tracking-normal leading-none w-full">
      <Link
        to={`/products/${merchandise.product.handle}`}
        className="flex-shrink-0"
      >
        <Image data={merchandise.image} width={110} height={110} />
      </Link>
      <div className="flex-1 pl-2">
        <Link
          to={`/products/${merchandise.product.handle}`}
          className="no-underline leading-none hover:underline text-sm font-bold "
        >
          {merchandise.product.title}
        </Link>
        <div className="text-neutral-200 text-xs tracking-widest mt-4">
          <div className="flex">
            <div>
              {' '}
              {merchandise.selectedOptions.map((option) => {
                return (
                  <div
                    className={'mt-2 text-[12px] text-right'}
                    key={option.name}
                  >
                    <div>{option.name}</div>
                  </div>
                );
              })}
            </div>
            <div>
              {merchandise.selectedOptions.map((option) => {
                return (
                  <div className={'mt-2 text-[12px]'} key={option.value}>
                    <div>: {option.value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex mt-3">
          <div className="flex">
            <ItemUpdateButton lines={[lineItem]} quantity={quantity - 1}>
              <button
                className="bg-neutral-950 border-neutral-400 text-neutral-400  active:bg-white rounded-l-sm font-small text-center my-2 max-w-xl leading-none border w-4 h-6 flex items-center justify-center"
                type="submit"
              >
                -
              </button>
            </ItemUpdateButton>
            <span className="bg-neutral-950 border-neutral-400 text-white  active:bg-white font-small text-center my-2 max-w-xl leading-none border w-8 h-6 flex items-center justify-center">
              {quantity}
            </span>
            <ItemUpdateButton lines={[lineItem]} quantity={quantity + 1}>
              <button
                className="bg-neutral-950 border-neutral-400 text-neutral-400 active::bg-white rounded-r-sm font-small text-center my-2 max-w-xl leading-none border w-4 h-6 flex items-center justify-center"
                type="submit"
              >
                +
              </button>
            </ItemUpdateButton>
          </div>
          <ItemRemoveButton lineIds={[lineItem.id]} />
        </div>
      </div>
      <div className="flex flex-col items-end">
        <span className="line-through	text-sm text-right w-full">
          $
          {(
            lineItem.cost.compareAtAmountPerQuantity.amount * lineItem.quantity
          ).toFixed(2)}
        </span>
        <Money
          className="text-red-600 font-sm mt-2"
          data={lineItem.cost.totalAmount}
        />
      </div>
    </div>
  );
}

function ItemRemoveButton({lineIds}: {lineIds: string[]}) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action="/cart" method="post" className="flex items-center">
      <input type="hidden" name="cartAction" value="REMOVE_FROM_CART" />
      <input type="hidden" name="linesIds" value={JSON.stringify(lineIds)} />
      <div className="flex items-center h-[70%]">
        <button
          className="bg-neutral-950 flex items-end text-neutral-300  ml-2 font-sm text-center  leading-none underline"
          type="submit"
        >
          <TrashIcon className="h-6 w-6" />
        </button>
      </div>
    </fetcher.Form>
  );
}

function ItemUpdateButton({
  lines,
  quantity,
  children,
}: {
  lines: any[];
  quantity: number;
  children: any;
}) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form action="/cart" method="post">
      <input type="hidden" name="cartAction" value="UPDATE_IN_CART" />
      <input
        type="hidden"
        name="lines"
        value={JSON.stringify(
          lines.map((line) => {
            return {
              attributes: line.attributes,
              id: line.id,
              merchandiseId: line.merchandise.id,
              quantity,
            };
          }),
        )}
      />

      {children}
    </fetcher.Form>
  );
}

export function CartSummary({
  cost,
  compareCost,
}: {
  cost: {totalAmount: {amount: string}};
  compareCost: number;
}) {
  return (
    <>
      <dl className="space-y-1 mt-1 text-sm">
        <div className="flex items-center justify-between">
          <dt>Original Price</dt>
          <dd>
            {compareCost ? (
              <span className="line-through	text-sm text-right w-full">
                ${compareCost.toFixed(2)}
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
                ${(compareCost - cost?.totalAmount.amount).toFixed(2)}
              </span>
            ) : (
              '-'
            )}
          </dd>
        </div>
        {/* {cost?.totalAmount.amount > 99.99 && (
          <div className="flex items-center justify-between">
            <dt>% Discount</dt>
            <dd>
              {compareCost ? (
                <span className="text-sm text-right w-full">
                  ${(cost?.totalAmount.amount / 10.0).toFixed(2)}
                </span>
              ) : (
                '-'
              )}
            </dd>
          </div>
        )} */}
        <div className="flex items-center justify-between">
          <dt>Final Price</dt>
          <dd>
            {cost?.totalAmount?.amount ? (
              <Money
                className="text-red-600 font-medium text-lg"
                data={{
                  __typename: 'MoneyV2',
                  currencyCode: 'USD',
                  amount: (parseFloat(cost?.totalAmount.amount) * 1)
                    // (cost?.totalAmount?.amount > 99 ? 0.9 : 1)
                    .toString(),
                }}
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

export function CartActions({
  checkoutUrl,
  totalAmount,
}: {
  checkoutUrl: string;
  totalAmount: any;
}) {
  if (!checkoutUrl) return null;
  return (
    <div className="flex flex-col mt-2">
      <a
        onClick={() => {
          clarityEvent('InitiateCheckout');
          ReactGA.event('begin_checkout', {
            currency: 'USD',
            value: totalAmount.totalAmount.amount,
          });
        }}
        href={checkoutUrl}
        className="bg-white text-black px-6 py-3 w-full rounded-md text-center font-medium text-sm leading-4 tracking-wide"
      >
        CHECKOUT • ${totalAmount.totalAmount.amount} USD
      </a>
      <div className="text-[12px] text-center mt-4">
        Discount Codes Can Be Applied At Checkout.
      </div>
    </div>
  );
}

export const CartShippingBar = ({currentTotal}: {currentTotal: any}) => {
  const goals = [
    // {
    //   goalAmount: 99,
    //   goalMessage: 'FREE shipping.',
    //   goalColor: 'bg-white',
    // },
    {
      goalAmount: 99,
      goalMessage: (
        <span>
          an extra{' '}
          <span className="text-red-600 text-lg font-bold">10% OFF</span> your
          WHOLE order with code{' '}
          <span className="text-red-600 text-lg font-bold">BF10</span>!
        </span>
      ),
      goalColor: 'bg-green-500',
    },
  ];

  const [reachedGoals, setReachedGoals] = useState([]);
  const [closestGoal, setClosestGoal] = useState(goals[0]);
  const [difference, setDifference] = useState(
    closestGoal.goalAmount - parseFloat(currentTotal?.subtotalAmount?.amount),
  );

  useEffect(() => {
    const newReachedGoals = goals.filter((goal) => {
      return (
        parseFloat(currentTotal?.subtotalAmount?.amount) >= goal.goalAmount
      );
    });
    setReachedGoals(newReachedGoals);

    const newClosestGoal = goals.reduce((goal1, goal2) => {
      const diff1 =
        goal1.goalAmount - parseFloat(currentTotal?.subtotalAmount?.amount);
      return diff1 > 0 ? goal1 : goal2;
    }, goals[0]);

    setClosestGoal(newClosestGoal);
    setDifference(
      newClosestGoal.goalAmount -
        parseFloat(currentTotal?.subtotalAmount?.amount),
    );
  }, [currentTotal]);

  return difference > 0 ? (
    <div className="">
      <div className="text-xs mx-4 tracking-normal">
        {reachedGoals.length > 0 &&
          `Congratulations! Your order qualifies for ${reachedGoals
            .map((goal) => goal.goalMessage)
            .join(' + ')}! `}
        {`Spend $${difference.toFixed(2)} USD more for `}
        {closestGoal.goalMessage}
      </div>
      <div className="relative w-11/12 h-6 mx-4 mt-3">
        <div
          className={`absolute w-full h-[7px] top-0 left-0 rounded-full ${
            reachedGoals.length > 0
              ? reachedGoals[reachedGoals.length - 1].goalColor
              : 'bg-neutral-900'
          }`}
        ></div>
        <div
          style={{
            width: `${((1 - difference / closestGoal.goalAmount) * 100).toFixed(
              0,
            )}%`,
          }}
          className={`absolute top-0 left-0 h-2 rounded-full ${closestGoal.goalColor}`}
        ></div>
      </div>
    </div>
  ) : (
    <div className="">
      <div className="text-xs mx-4 tracking-normal">
        Congratulations! Your order qualifies for{' '}
        {goals.map((goal) => goal.goalMessage)}
      </div>
      <div className="relative w-11/12 h-12 mx-4 mt-4">
        <div
          className={`absolute w-full top-0 left-0 h-[7px] rounded-full ${
            reachedGoals.length > 0
              ? reachedGoals[reachedGoals.length - 1].goalColor
              : 'bg-neutral-900'
          }`}
        ></div>
        <div
          className={`absolute w-[100%] top-0 left-0 h-2 rounded-full ${goals[0].goalColor}`}
        ></div>
      </div>
    </div>
  );
};
