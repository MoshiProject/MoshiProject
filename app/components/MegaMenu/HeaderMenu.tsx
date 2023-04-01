import {Fragment, useState} from 'react';
import {Dialog, Popover, Transition} from '@headlessui/react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {ChevronDownIcon} from '@heroicons/react/20/solid';

import {Image} from '@shopify/hydrogen';
import {currencies, logoURL} from './menuSettings';
import MegaMenuMobile from './MegaMenuMobile';
import CartButton from './CartButton';

export default function HeaderMenu({cart}: any) {
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
                  <div className="-m-2 inline-flex items-center justify-center rounded-md p-6 text-gray-200 "></div>

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
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-200"
                    onClick={() => setOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>

                {/* Links */}
                {/* <Tab.Group as="div" className="mt-2">
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
                </Tab.Group> */}
                <MegaMenuMobile />
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
                      <div className="flex h-full justify-center space-x-8"></div>
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
