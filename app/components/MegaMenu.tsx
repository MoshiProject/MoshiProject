import {Drawer, useDrawer} from '~/components/Drawer';
import {Fragment, useState} from 'react';
import {Dialog, Popover, Tab, Transition} from '@headlessui/react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
  ShoppingBagIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
import {CartLineItems, CartActions, CartSummary} from '~/components/Cart';

import {Suspense} from 'react';
import {Await} from '@remix-run/react';
import {useFetchers} from '@remix-run/react';
import {useEffect} from 'react';
import {Image} from '@shopify/hydrogen';

const logoURL =
  'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Moshi_899c7b09-e639-4c9d-b230-1732c2f3ba02.png?v=1680244718';
const currencies = ['USD', 'CAD', 'AUD', 'EUR', 'GBP'];

const navigation = {
  categories: [
    {
      name: 'Shop by Anime',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-01.jpg',
          imageAlt:
            'Models sitting back to back, wearing Basic Tee in black and bone.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-02.jpg',
          imageAlt:
            'Close up of Basic Tee fall bundle with off-white, ochre, olive, and black tees.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-03.jpg',
          imageAlt:
            'Model wearing minimalist watch with black wristband and white watch face.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg',
          imageAlt:
            'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg',
          imageAlt:
            'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg',
          imageAlt:
            'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg',
          imageAlt:
            'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-category-04.jpg',
          imageAlt:
            'Model opening tan leather long wallet with credit card pockets and cash pouch.',
        },
      ],
    },
    {
      name: 'Shop by Product',
      featured: [
        {
          name: 'New Arrivals',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-01.jpg',
          imageAlt:
            'Hats and sweaters on wood shelves next to various colors of t-shirts on hangers.',
        },
        {
          name: 'Basic Tees',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-02.jpg',
          imageAlt: 'Model wearing light heather gray t-shirt.',
        },
        {
          name: 'Accessories',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-03.jpg',
          imageAlt:
            'Grey 6-panel baseball hat with black brim, black mountain graphic on front, and light heather gray body.',
        },
        {
          name: 'Carry',
          href: '#',
          imageSrc:
            'https://tailwindui.com/img/ecommerce-images/mega-menu-01-men-category-04.jpg',
          imageAlt:
            'Model putting folded cash into slim card holder olive leather wallet with hand stitching.',
        },
      ],
    },
  ],
  pages: [
    {name: 'Company', href: '#'},
    {name: 'Stores', href: '#'},
  ],
};

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

export default function MegaMenu({cart}: any) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-neutral-950">
      {/* Mobile menu */}
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 " />
          </Transition.Child>

          <div className="fixed inset-0 z-40 flex right-0 justify-end ">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-neutral-950 pb-12 shadow-xl ">
                <div className="flex px-6 pt-5 pb-2 justify-between">
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-200"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="lg:flex lg:flex-1 lg:items-center">
                    <a href="/">
                      <span className="sr-only">MoshiProject</span>
                      <Image
                        data={{
                          url: logoURL,
                          altText: 'item.imageAlt',
                        }}
                        className="object-cover object-center h-10"
                      />
                    </a>
                  </div>
                  <div className="-m-2 inline-flex items-center justify-center rounded-md p-6 text-gray-200 "></div>
                </div>

                {/* Links */}
                <Tab.Group as="div" className="mt-2">
                  <div className="">
                    <Tab.List className="-mb-px flex space-x-8 px-4">
                      {navigation.categories.map((category) => (
                        <Tab
                          key={category.name}
                          className={({selected}) =>
                            classNames(
                              selected
                                ? 'text-red-500 border-red-600'
                                : 'text-gray-200 border-transparent',
                              'flex-1 whitespace-nowrap border-b-2 py-4 px-1 text-base font-medium',
                            )
                          }
                        >
                          {category.name}
                        </Tab>
                      ))}
                    </Tab.List>
                  </div>
                  <Tab.Panels as={Fragment}>
                    {navigation.categories.map((category) => (
                      <Tab.Panel
                        key={category.name}
                        className="space-y-12 px-4 py-6"
                      >
                        <div className="grid grid-cols-2 gap-x-4 gap-y-10">
                          {category.featured.map((item) => (
                            <div key={item.name} className="group relative">
                              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-neutral-900 group-hover:opacity-75">
                                <Image
                                  data={{
                                    url: item.imageSrc,
                                    altText: item.imageAlt,
                                  }}
                                  className="object-cover object-center"
                                />
                              </div>
                              <a
                                href={item.href}
                                className="mt-6 block text-sm font-medium text-white"
                              >
                                <span
                                  className="absolute inset-0 z-10"
                                  aria-hidden="true"
                                />
                                {item.name}
                              </a>
                              <p
                                aria-hidden="true"
                                className="mt-1 text-sm text-gray-300"
                              >
                                Shop now
                              </p>
                            </div>
                          ))}
                        </div>
                      </Tab.Panel>
                    ))}
                  </Tab.Panels>
                </Tab.Group>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {navigation.pages.map((page) => (
                    <div key={page.name} className="flow-root">
                      <a
                        href={page.href}
                        className="-m-2 block p-2 font-medium text-white"
                      >
                        {page.name}
                      </a>
                    </div>
                  ))}
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  <div className="flow-root">
                    <a
                      href="/register"
                      className="-m-2 block p-2 font-medium text-white"
                    >
                      Create an account
                    </a>
                  </div>
                  <div className="flow-root">
                    <a
                      href="/login"
                      className="-m-2 block p-2 font-medium text-white"
                    >
                      Sign in
                    </a>
                  </div>
                </div>

                <div className="space-y-6 border-t border-gray-200 py-6 px-4">
                  {/* Currency selector */}
                  <form>
                    <div className="inline-block">
                      <label htmlFor="mobile-currency" className="sr-only">
                        Currency
                      </label>
                      <div className="group relative -ml-2 rounded-md border-transparent focus-within:ring-2 focus-within:ring-white">
                        <select
                          id="mobile-currency"
                          name="currency"
                          className="flex items-center rounded-md border-transparent bg-none py-0.5 pl-2 pr-5 text-sm font-medium text-gray-100 focus:border-transparent focus:outline-none focus:ring-0 group-hover:text-gray-50"
                        >
                          {currencies.map((currency) => (
                            <option key={currency}>{currency}</option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center">
                          <ChevronDownIcon
                            className="h-5 w-5 text-gray-300"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Secondary navigation */}
          <div className=" bg-neutral-950">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="">
                <div className="flex h-16 items-center justify-between">
                  {/* Logo (lg+) */}
                  <div className="hidden lg:flex lg:flex-1 lg:items-center">
                    <a href="/">
                      <span className="sr-only">MoshiProject</span>
                      <Image
                        data={{
                          url: logoURL,
                          altText: 'item.imageAlt',
                        }}
                        className="object-cover object-center h-10"
                      />
                    </a>
                  </div>

                  <div className="hidden h-full lg:flex">
                    {/* Flyout menus */}
                    <Popover.Group className="inset-x-0 bottom-0 px-4">
                      <div className="flex h-full justify-center space-x-8">
                        {navigation.categories.map((category) => (
                          <Popover key={category.name} className="flex">
                            {({open}) => (
                              <>
                                <div className="relative flex">
                                  <Popover.Button
                                    className={classNames(
                                      open
                                        ? 'border-red-400 text-red-400'
                                        : 'border-transparent text-gray-100 hover:text-gray-50',
                                      'relative z-10 -mb-px flex items-center border-b-2 pt-px text-sm font-medium transition-colors duration-200 ease-out',
                                    )}
                                  >
                                    {category.name}
                                  </Popover.Button>
                                </div>

                                <Transition
                                  as={Fragment}
                                  enter="transition ease-out duration-200"
                                  enterFrom="opacity-0"
                                  enterTo="opacity-100"
                                  leave="transition ease-in duration-150"
                                  leaveFrom="opacity-100"
                                  leaveTo="opacity-0"
                                >
                                  <Popover.Panel className="absolute inset-x-0 top-full text-sm text-gray-300">
                                    {/* Presentational element used to render the bottom shadow, if we put the shadow on the actual panel it pokes out the top, so we use this shorter element to hide the top of the shadow */}
                                    <div
                                      className="absolute inset-0 top-1/2 bg-neutral-950 shadow"
                                      aria-hidden="true"
                                    />

                                    <div className="relative bg-neutral-950">
                                      <div className="mx-auto max-w-7xl px-8">
                                        <div className="grid grid-cols-4 gap-y-10 gap-x-8 py-16">
                                          {category.featured.map((item) => (
                                            <div
                                              key={item.name}
                                              className="group relative"
                                            >
                                              <div className="aspect-w-1 aspect-h-1 overflow-hidden rounded-md bg-neutral-900 group-hover:opacity-75">
                                                <Image
                                                  data={{
                                                    url: item.imageSrc,
                                                    altText: item.imageAlt,
                                                  }}
                                                  className="object-cover object-center"
                                                />
                                              </div>
                                              <a
                                                href={item.href}
                                                className="mt-4 block font-medium text-white"
                                              >
                                                <span
                                                  className="absolute inset-0 z-10"
                                                  aria-hidden="true"
                                                />
                                                {item.name}
                                              </a>
                                              <p
                                                aria-hidden="true"
                                                className="mt-1"
                                              >
                                                Shop now
                                              </p>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </Popover.Panel>
                                </Transition>
                              </>
                            )}
                          </Popover>
                        ))}

                        {navigation.pages.map((page) => (
                          <a
                            key={page.name}
                            href={page.href}
                            className="flex items-center text-sm font-medium text-gray-100 hover:text-gray-50"
                          >
                            {page.name}
                          </a>
                        ))}
                      </div>
                    </Popover.Group>
                  </div>

                  {/* Logo (lg-) */}

                  <a href="/" className="lg:hidden">
                    <span className="sr-only">MoshiProject</span>
                    <Image
                      data={{
                        url: logoURL,
                        altText: 'item.imageAlt',
                      }}
                      className="object-cover object-center h-10"
                    />
                  </a>

                  <div className="flex flex-1 items-center justify-end">
                    <a
                      href="/search"
                      className="hidden text-sm font-medium text-gray-100 hover:text-gray-50 lg:block"
                    >
                      Search
                    </a>

                    <div className="flex items-center lg:ml-8">
                      {/* Search */}
                      <a
                        href="/search"
                        className="ml-2 p-2 text-gray-200 hover:text-gray-300"
                      >
                        <span className="sr-only">Search</span>
                        <MagnifyingGlassIcon
                          className="h-6 w-6"
                          aria-hidden="true"
                        />
                      </a>
                      {/* Mobile menu and search (lg-) */}
                      <div className="flex flex-1 items-center lg:hidden">
                        <button
                          type="button"
                          className=" rounded-md bg-neutral-950 p-2 text-gray-200"
                          onClick={() => setOpen(true)}
                        >
                          <span className="sr-only">Open menu</span>
                          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                        </button>
                      </div>
                      <a
                        href="/FAQ"
                        className="hidden text-sm font-medium text-gray-100 hover:text-gray-50 lg:block"
                      >
                        Help
                      </a>

                      {/* Cart */}
                      {CartButton(cart)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}
function CartButton(cart: any) {
  const {isOpen, openDrawer, closeDrawer} = useDrawer();
  const fetchers = useFetchers();

  // Grab all the fetchers that are adding to cart
  const addToCartFetchers = [];
  for (const fetcher of fetchers) {
    if (fetcher?.submission?.formData?.get('cartAction') === 'ADD_TO_CART') {
      addToCartFetchers.push(fetcher);
    }
  }

  // When the fetchers array changes, open the drawer if there is an add to cart action
  useEffect(() => {
    if (isOpen || addToCartFetchers.length === 0) return;
    openDrawer();
  }, [addToCartFetchers]);

  return (
    <div className=" flow-root lg:ml-8">
      <Suspense>
        <Await resolve={cart}>
          {(data) => (
            <button
              className="relative ml-auto flex items-center justify-center w-10 h-10"
              onClick={openDrawer}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="white"
                className="w-6 h-6"
              >
                <title>Bag</title>
                <path
                  fillRule="evenodd"
                  d="M8.125 5a1.875 1.875 0 0 1 3.75 0v.375h-3.75V5Zm-1.25.375V5a3.125 3.125 0 1 1 6.25 0v.375h3.5V15A2.625 2.625 0 0 1 14 17.625H6A2.625 2.625 0 0 1 3.375 15V5.375h3.5ZM4.625 15V6.625h10.75V15c0 .76-.616 1.375-1.375 1.375H6c-.76 0-1.375-.616-1.375-1.375Z"
                ></path>
              </svg>
              {data?.totalQuantity > 0 && (
                <div className="text-contrast bg-red-500 text-white absolute bottom-1 right-1 text-[0.625rem] font-medium subpixel-antialiased h-3 min-w-[0.75rem] flex items-center justify-center leading-none text-center rounded-full w-auto px-[0.125rem] pb-px">
                  <span>{data?.totalQuantity}</span>
                </div>
              )}
            </button>
          )}
        </Await>
      </Suspense>
      <Drawer open={isOpen} onClose={closeDrawer}>
        <Suspense>
          <Await resolve={cart}>
            {(data) => (
              <>
                {data?.totalQuantity > 0 ? (
                  <>
                    <div className="flex-1 overflow-y-auto">
                      <div className="flex flex-col space-y-7 justify-between items-center md:py-8 md:px-12 px-4 py-6">
                        <CartLineItems linesObj={data.lines} />
                      </div>
                    </div>
                    <div className="w-full md:px-12 px-4 py-6 space-y-6 border border-1 border-gray-00">
                      <CartSummary cost={data.cost} />
                      <CartActions checkoutUrl={data.checkoutUrl} />
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-7 justify-center items-center md:py-8 md:px-12 px-4 py-6 h-screen">
                    <h2 className="whitespace-pre-wrap max-w-prose font-bold text-4xl">
                      Your cart is empty
                    </h2>
                    <button
                      onClick={close}
                      className="inline-block rounded-sm font-medium text-center py-3 px-6 max-w-xl leading-none bg-black text-white w-full"
                    >
                      Continue shopping
                    </button>
                  </div>
                )}
              </>
            )}
          </Await>
        </Suspense>
      </Drawer>

      <span className="sr-only">items in cart, view bag</span>
    </div>
  );
}
