import {ActionArgs} from '@shopify/remix-oxygen';
import {cartCreate} from './Cart';
import {cartAttributeUpdate, cartDiscountCodesUpdate} from './discount.$code';

export async function action({request, context, params}: ActionArgs) {
  const body = await request.formData();
  console.log('code', body.get('code'));
  let discounts = [];
  if (body.get('code') === 'empty' || !body.get('code')) discounts = [];
  else {
    discounts = [body.get('code')];
  }

  //validate code that is a valid code

  const {storefront} = context;
  let cartId = await context.session.get('cartId');
  //! if no existing cart, create one
  if (!cartId) {
    const {cart, errors: graphqlCartErrors} = await cartCreate({
      input: {},
      storefront,
    });

    //! cart created - we only need a Set-Cookie header if we're creating
    cartId = cart.id;
  }
  //###load product
  let data;
  if (discounts.length > 0) {
    try {
      const response = await fetch(
        'https://moshiproject.myshopify.com/admin/api/2023-04/graphql.json',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': context.env.ADMIN_API_ACCESS_TOKEN,
          },
          body: JSON.stringify({
            query: `query codeDiscountNodeByCode($code: String!) {
          codeDiscountNodeByCode(code: $code) {
            codeDiscount {
              __typename
              ... on DiscountCodeBasic {
                codeCount
                shortSummary
                summary
                status
                title
                minimumRequirement
                customerGets{
                    value{
                        ... on DiscountAmount{
                            amount{
                                amount
                            }
                        }
                        ... on DiscountOnQuantity{
                            quantity{
                                quantity
                            }
                            effect{
                                ... on DiscountPercentage{
                                    percentage
                                }
                            }
                        }
                        ... on DiscountPercentage{
                            percentage
                        }
                    }
                    items
                }
              }
              ... on DiscountCodeBxgy {
                codeCount
                summary
                status
                title
                customerGets{
                    value{
                        ... on DiscountAmount{
                            amount{
                                amount
                            }
                        }
                        ... on DiscountOnQuantity{
                            quantity{
                                quantity
                            }
                            effect{
                                ... on DiscountPercentage{
                                    percentage
                                }
                            }
                        }
                        ... on DiscountPercentage{
                            percentage
                        }
                    }
                    items
                }
              }
            }
            id
          }
        }`,
            variables: {
              code: body.get('code'),
            },
          }),
        },
      );

      data = await response.json();
      console.log('test', data);
      if (data.data.codeDiscountNodeByCode === null) {
        console.log('invalid');
        return {status: '400', code: 'invalid discount code'};
      }
      console.log(
        JSON.stringify(data.data.codeDiscountNodeByCode.codeDiscount),
      );
    } catch (error) {
      console.error(error);
    }
  }

  //! apply discount to the cart
  await cartAttributeUpdate({
    cartId,
    attribute: discounts.length > 0 ? {discountData: {data: data.data}} : {},
    storefront,
  });

  //! apply discount to the cart
  await cartDiscountCodesUpdate({
    cartId,
    discountCodes: discounts,
    storefront,
  });
  return null;
}

export const CODE_DISCOUNT_QUERY = `#graphql query codeDiscountNodeByCode($code: String!) {
    codeDiscountNodeByCode(code: $code) {
      codeDiscount {
        __typename
        ... on DiscountCodeBasic {
          codeCount
          shortSummary
          summary
          status
          title
          minimumRequirement
        }
      }
      id
    }
  }`;
