import {MenuItem} from './MegaMenuItem';

export const logoURL =
  'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Moshi_899c7b09-e639-4c9d-b230-1732c2f3ba02.png?v=1680244718';
export const logoWhiteURL =
  'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Moshi_W.png?v=1681360647';
export const currencies = ['USD', 'CAD', 'AUD', 'EUR', 'GBP'];

export const navigation: MenuItem[] = [
  {title: 'FEATURED', url: '/collections/featured-products', children: []},
  {title: 'HOODIES', url: '/collections/hoodie', children: []},
  {title: 'T-SHIRTS', url: '/collections/t-shirt', children: []},
  {title: 'SWEATSHIRTS', url: '/collections/sweatshirts', children: []},
  {title: 'FIGURES', url: '/collections/figurines', children: []},
  {
    title: 'SHOP BY ANIME',
    url: '',
    children: [
      {title: 'NARUTO', url: '/collections/naruto', children: []},
      {
        title: 'ATTACK ON TITAN',
        url: '/collections/attack-on-titan',
        children: [],
      },
      {
        title: 'JUJUTSU KAISEN',
        url: '/collections/jujutsu-kaisen',
        children: [],
      },
      {
        title: 'MY HERO ACADEMIA',
        url: '/collections/my-hero-academia',
        children: [],
      },
      {
        title: 'DEMON SLAYER',
        url: '/collections/kimetsu-no-yaiba',
        children: [
          {
            title: 'HOODIES',
            url: '/collections/demon-slayer-hoodies',
            children: [],
          },
          {
            title: 'T-SHIRTS',
            url: '/collections/demon-slayer-t-shirts',
            children: [],
          },
          {
            title: 'SWEATSHIRTS',
            url: '/collections/demon-slayer-sweatshirts',
            children: [],
          },
          {
            title: 'FIGURES',
            url: '/collections/demon-slayer-figures',
            children: [],
          },
        ],
      },
      {
        title: 'CHAINSAW MAN',
        url: '/collections/chainsaw-man',
        children: [
          {
            title: 'HOODIES',
            url: '/collections/chainsaw-man-hoodies',
            children: [],
          },
          {
            title: 'T-SHIRTS',
            url: '/collections/chainsaw-man-t-shirts',
            children: [],
          },
          {
            title: 'SWEATSHIRTS',
            url: '/collections/chainsaw-man-sweatshirts',
            children: [],
          },
          {
            title: 'FIGURES',
            url: '/collections/chainsaw-man-figures',
            children: [],
          },
        ],
      },
      {
        title: 'VIOLET EVERGARDEN',
        url: '/collections/violet-evergarden',
        children: [],
      },
      {
        title: 'NEON GENESIS EVANGELION',
        url: '/collections/neon-genesis-evangelion',
        children: [],
      },
      {
        title: 'HUNTER X HUNTER',
        url: '/collections/hunter-x-hunter',
        children: [],
      },
      {
        title: 'KAGUYA-SAMA LOVE IS WAR',
        url: '/collections/kaguya-sama',
        children: [],
      },
      {title: 'DEATH NOTE', url: '/collections/death-note', children: []},
      {title: 'SPY X FAMILY', url: '/collections/spy-x-family', children: []},
    ],
  },
  {
    title: 'ACCESSORIES',
    url: '',
    children: [
      {title: 'PHONE CASES', url: '/collections/phone-cases', children: []},
      {title: 'MOUSE PADS', url: '/collections/mouse-pads', children: []},
      {title: 'STICKERS', url: '/collections/stickers', children: []},
      {title: 'MUGS', url: '/collections/mugs', children: []},
      {title: '3D LAMPS', url: '/collections/3d-lamp', children: []},
    ],
  },
  {
    title: 'BEST SELLERS',
    url: '/collections/best-selling-collection',
    children: [],
  },
  {title: 'REVIEWS', url: '/pages/reviews', children: []},
  {
    title: 'GIFT CARDS',
    url: '/products/moshiproject-store-digital-gift-card',
    children: [],
  },
  // {title: 'SIZING CHARTS', url: '', children: []},
  {title: 'CONTACT US', url: '/pages/contact-us', children: []},
];
