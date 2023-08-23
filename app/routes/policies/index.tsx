import {useLoaderData} from '@remix-run/react';
import type {ShopPolicy} from '@shopify/hydrogen/storefront-api-types';
import {json, type LoaderArgs} from '@shopify/remix-oxygen';
import invariant from 'tiny-invariant';

import {Link} from '~/components/Link';
import {Heading, PageHeader, Section} from '~/components/Text';
export const handle = {
  seo: {
    title: 'Policies',
  },
};

export async function loader({context: {storefront}}: LoaderArgs) {
  const data = await storefront.query<{
    shop: Record<string, ShopPolicy>;
  }>(POLICIES_QUERY);

  invariant(data, 'No data returned from Shopify API');
  const policies = Object.values(data.shop || {});

  if (policies.length === 0) {
    throw new Response('Not found', {status: 404});
  }

  return json(
    {
      policies,
    },
    {
      analytics: {
        pageType: 'policy',
      },
    },
  );
}

export default function Policies() {
  const {policies} = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader heading="Policies" />
      <Section padding="x" className="mb-24">
        {policies.map((policy) => {
          return (
            policy && (
              <Heading className="font-normal text-heading" key={policy.id}>
                <Link to={`/policies/${policy.handle}`}>{policy.title}</Link>
              </Heading>
            )
          );
        })}
      </Section>
    </>
  );
}

const POLICIES_QUERY = `#graphql
  fragment Policy on ShopPolicy {
    id
    title
    handle
  }

  query PoliciesQuery {
    shop {
      privacyPolicy {
        ...Policy
      }
      shippingPolicy {
        ...Policy
      }
      termsOfService {
        ...Policy
      }
      refundPolicy {
        ...Policy
      }
      subscriptionPolicy {
        id
        title
        handle
      }
    }
  }
`;
