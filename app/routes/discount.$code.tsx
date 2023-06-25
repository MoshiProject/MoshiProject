import {redirect, type LoaderArgs} from '@shopify/remix-oxygen';
import {parse as parseCookie} from 'worktop/cookie';
import type {
  Cart as CartType,
  UserError,
} from '@shopify/hydrogen/storefront-api-types';
import {type AppLoadContext} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';
import {cartCreate} from './Cart';

// DISCOUNT CODE UPDATE FUNCTIONS
export async function cartDiscountCodesUpdate({
  cartId,
  discountCodes,
  storefront,
}: {
  cartId: string;
  discountCodes: string[];
  storefront: AppLoadContext['storefront'];
}) {
  const {cartDiscountCodesUpdate} = await storefront.mutate<{
    cartDiscountCodesUpdate: {cart: CartType; errors: UserError[]};
  }>(DISCOUNT_CODES_UPDATE, {
    variables: {
      cartId,
      discountCodes,
    },
  });

  invariant(
    cartDiscountCodesUpdate,
    'No data returned from the cartDiscountCodesUpdate mutation',
  );

  return cartDiscountCodesUpdate;
}

const DISCOUNT_CODES_UPDATE = `#graphql
  mutation cartDiscountCodesUpdate($cartId: ID!, $discountCodes: [String!], $country: CountryCode = ZZ)
    @inContext(country: $country) {
    cartDiscountCodesUpdate(cartId: $cartId, discountCodes: $discountCodes) {
      cart {
        id
        discountCodes {
          code
        }
      }
      errors: userErrors {
        field
        message
      }
    }
  }
`;

// CART ATTRIBUTE UPDATE FUNCTIONS
export async function cartAttributeUpdate({
  cartId,
  attribute,
  storefront,
}: {
  cartId: string;
  attribute: {discountData: any};
  storefront: AppLoadContext['storefront'];
}) {
  const {cartAttributesUpdate} = await storefront.mutate<{
    cartAttributesUpdate: {cart: CartType; errors: UserError[]};
  }>(ATTRIBUTE_UPDATE, {
    variables: {
      cartId,
      attributes: [{key: 'data', value: JSON.stringify(attribute)}],
    },
  });

  invariant(
    cartDiscountCodesUpdate,
    'No data returned from the cartDiscountCodesUpdate mutation',
  );

  return cartDiscountCodesUpdate;
}

const ATTRIBUTE_UPDATE = `#graphql
  mutation cartAttributesUpdate($cartId: ID!, $attributes: [AttributeInput!]!, $country: CountryCode = ZZ)
    @inContext(country: $country) {
      cartAttributesUpdate(cartId: $cartId, attributes: $attributes) {
      cart {
        id
        attributes {
          key
          value
        }
      }
      errors: userErrors {
        field
        message
      }
    }
  }
`;
/**
 * Automatically applies a discount found on the url
 * If a cart exists it's updated with the discount, otherwise a cart is created with the discount already applied
 * @param ?redirect an optional path to return to otherwise return to the home page
 * @example
 * Example path applying a discount and redirecting
 * ```ts
 * /discount/7R91BP7CYC59?redirect=/products/eva-neon-genesis-evangelion-pullover-hoodie
 *
 * ```
 * @preserve
 */

export async function loader({request, context, params}: LoaderArgs) {
  const {storefront} = context;
  // N.B. This route will probably be removed in the future.
  const session = context.session as any;
  const {code} = params;

  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const redirectParam =
    searchParams.get('redirect') || searchParams.get('return_to') || '/';

  searchParams.delete('redirect');
  searchParams.delete('return_to');

  const redirectUrl = `${redirectParam}?${searchParams}`;
  const headers = new Headers();

  if (!code) {
    return redirect(redirectUrl);
  }
  let cartId = await context.session.get('cartId');
  //! if no existing cart, create one
  if (!cartId) {
    const {cart, errors: graphqlCartErrors} = await cartCreate({
      input: {},
      storefront,
    });

    if (graphqlCartErrors?.length) {
      return redirect(redirectUrl);
    }

    //! cart created - we only need a Set-Cookie header if we're creating
    cartId = cart.id;
    headers.append('Set-Cookie', `cart=${cartId.split('/').pop()}`);
  }

  //! apply discount to the cart
  await cartDiscountCodesUpdate({
    cartId,
    discountCodes: [code],
    storefront,
  });
  return redirect(redirectUrl, {headers});
}
