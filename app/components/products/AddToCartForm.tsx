import {useMatches, useFetcher} from '@remix-run/react';

type AddToCartFormProps = {
  variantId: number;
  textColor: string;
  backgroundColor: string;
};

export default function AddToCartForm({
  variantId,
  textColor = 'text-white',
  backgroundColor = 'bg-black',
}: AddToCartFormProps) {
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
      <button
        className={`${backgroundColor} ${textColor} px-6 py-3 w-full text-center tracking-widest font-semibold text-base max-w-[400px] md:max-w-none uppercase`}
      >
        Add to Cart
      </button>
    </fetcher.Form>
  );
}
