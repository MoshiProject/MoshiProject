import type {ActionArgs} from '@shopify/remix-oxygen';
import {userInfo} from '~/cookies.server';

export async function action({request}: ActionArgs) {
  const cookieHeader = request.headers.get('Cookie');
  const cookie = (await userInfo.parse(cookieHeader)) || {};
  const buyerIP = request.headers.get('oxygen-buyer-ip');
  const payload = await request.json();
  console.log('payload', payload);
  console.log('yeah, cookie', cookie);

  // Post to https://profit-calc.vercel.app/api/createUserEvent with a body containing the event payload and user information
  try {
    const response = await fetch(
      'https://profit-calc.vercel.app/api/createUserEvent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...payload, ...cookie, ip: buyerIP}),
      },
    );

    if (response.ok) {
      console.log('Event successfully posted', await response.json());
    } else {
      console.error(`Failed to post event. Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error posting event:', error);
  }

  return {};
}
export const sendMoshiAnalytics = async (event, items) => {
  try {
    // Send a POST request to "/api/sendEventUser" with event and items as the body
    const response = await fetch('/api/sendEventUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({event, ...items}),
    });

    // Check if the request was successful (status code 200)
    if (response.ok) {
      return {status: 200};
    } else {
      console.error(`Failed to send analytics. Status: ${response.status}`);
      return {status: response.status};
    }
  } catch (error) {
    console.log('Error sending analytics:', error);
    return {status: 500};
  }
};
