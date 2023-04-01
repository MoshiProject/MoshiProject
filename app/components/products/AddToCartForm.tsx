import {useMatches, useFetcher} from '@remix-run/react';

type AddToCartFormProps = {
  variantId: number;
};

export default function AddToCartForm({variantId}: AddToCartFormProps) {
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
