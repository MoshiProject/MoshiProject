// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {useLoaderData} from '@remix-run/react';
import {json} from '@shopify/remix-oxygen';
import ProductGrid from '~/components/collections/ProductGrid';
import {type MetaFunction, type LoaderArgs} from '@shopify/remix-oxygen';
import {type SeoHandleFunction} from '@shopify/hydrogen';
import {useEffect, useState} from 'react';
import {Product} from '~/components/products/products';
import {animeNames, productTypes} from '~/functions/titleFilter';
const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: 'Contact Us',
  description: 'Contact Us',
});

export const handle = {
  seo,
};

export async function loader({params, context, request}: LoaderArgs) {
  const {handle} = params;
  const searchParams = new URL(request.url).searchParams;
  const sortParam = searchParams.get('sort');
  const sortDict = {
    title_asc: {sort: 'TITLE', rev: true},
    title_desc: {sort: 'TITLE', rev: false},
    price_asc: {sort: 'PRICE', rev: false},
    price_desc: {sort: 'PRICE', rev: true},
    best: {sort: 'BEST_SELLING', rev: false},
    newest: {sort: 'CREATED', rev: true},
    oldest: {sort: 'CREATED', rev: false},
    featured: {sort: null, rev: false},
  };

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    sortParam,
  });
}

export const meta: MetaFunction = ({data}) => {
  return {
    title: data?.collection?.title ?? 'Collection',
    description: data?.collection?.description,
  };
};

export default function Collection() {
  return (
    <form method="post" action="contact" id="contact" className="contact-form">
      <div className="first-name">
        <label htmlFor="first-name">First name</label>
        <input type="text" name="contact[first_name]" id="first-name" />
      </div>

      <div className="last-name">
        <label htmlFor="last-name">Last name</label>
        <input type="text" name="contact[last_name]" id="last-name" />
      </div>

      <div className="phone">
        <label htmlFor="phone">Phone</label>
        <input type="tel" name="contact[phone]" id="phone" />
      </div>

      <div className="email">
        <label htmlFor="email">Email</label>
        <input type="email" name="contact[email]" id="email" />
      </div>

      <div className="order-number">
        <label htmlFor="order-number">Order number</label>
        <input type="text" name="contact[order_number]" id="order-number" />
      </div>

      <div className="message">
        <label htmlFor="message">Message</label>
        <textarea name="contact[body]" id="message"></textarea>
      </div>

      <div className="submit">
        <input type="submit" value="Create" />
      </div>
    </form>
  );
}

const COLLECTION_QUERY = `#graphql
  query CollectionDetails($handle: String!, $cursor: String, $rev: Boolean, $sort: ProductCollectionSortKeys) {
    collection(handle: $handle) {
      id
      title
      description
      handle
      products(first: 100, after: $cursor, reverse: $rev, sortKey: $sort) {
        pageInfo {
          hasNextPage
          endCursor
        }
        nodes {
          id
          title
          publishedAt
          handle
          variants(first: 1) {
            nodes {
              id
              image {
                url
                altText
                width
                height
              }
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  }
`;
