/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/naming-convention */
import {ActionFunction, json} from '@shopify/remix-oxygen';
import {ActionData} from '../account/__private/edit';

const badRequest = (data: ActionData) => json(data, {status: 400});

export const action: ActionFunction = async ({request, context, params}) => {
  const formData = await request.formData();

  const email = formData.get('email');
  if (!email || typeof email !== 'string') {
    return badRequest({
      formError: 'Please provide both an email.',
    });
  }
  const response = await fetch(
    'https://a.klaviyo.com/client/subscriptions/?company_id=ViUH6b',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        revision: '2023-02-22',
      },
      body: JSON.stringify({
        data: {
          type: 'subscription',
          attributes: {
            list_id: 'VPLyn8',
            custom_source: 'Footer signup form',
            email,
          },
        },
      }),
    },
  )
    .then((response) => {
      return response;
    })
    .then((data) => {
      // Handle the response data
      return json(data);
    })
    .catch((error) => {
      // Handle any errors
      return json(error);
    });
  return json(response);
};
