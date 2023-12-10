import {createCookie} from '@shopify/remix-oxygen';

export const userInfo = createCookie('user-info', {
  maxAge: 604_800, // one week
});
