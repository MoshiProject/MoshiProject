import {createCookie} from '@shopify/remix-oxygen';
export const recentlyViewedCookie = createCookie('recentlyViewed', {
  maxAge: 31536000,
});
