import {Fragment, useState} from 'react';
import {Dialog, Popover, Transition} from '@headlessui/react';
import {
  Bars3Icon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import {ChevronDownIcon} from '@heroicons/react/20/solid';
import ParallaxText from './ParallaxText';
import {Image} from '@shopify/hydrogen';
import {currencies, logoURL, logoWhiteURL} from './menuSettings';
import MegaMenuMobile from './MegaMenuMobile';
import CartButton from './CartButton';

import useScrollDirection from '~/functions/useScrollDirection';
import SearchBar from './SearchBar';
import DesktopMegaMenu from './DesktopMegaMenu';

export default function HeaderMenu({cart}: any) {
  const [open, setOpen] = useState(false);
  const scrollDirection = useScrollDirection();

  return (
    <div
      className={`bg-neutral-950 text-neutral-50 fixed z-40 h-fit w-screen transition-all duration-500 tracking-widest md:border-b md:border-neutral-300 md:shadow-neutral-200 md:bg-white md:text-black ${
        scrollDirection === 'down' ? '-top-24' : 'top-0'
      }`}
    >
      {/* Mobile menu */}
      {/* infinite looping free shipping bar */}
      <div className="py-1 md:hidden">
        <ParallaxText baseVelocity={-5}>
          FREE SHIPPING ON ALL ORDERS | LIMITED TIME ONLY.
        </ParallaxText>
      </div>
      <div className="py-2 hidden md:flex justify-center scroller tracking-wider font-medium bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-lg">
        <span>FREE SHIPPING ON ALL ORDERS | LIMITED TIME ONLY.</span>
      </div>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-40 lg:hidden " onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25 md:bg-white md:text-black" />
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
              <Dialog.Panel className="relative flex w-full max-w-[22rem] flex-col overflow-y-auto bg-neutral-950 pb-12 shadow-xl ">
                <div className="flex px-6 pt-5 pb-2 justify-between">
                  <div className="-m-2 inline-flex items-center justify-center rounded-md p-6 text-gray-200 tracking-widest"></div>

                  <div className="lg:flex lg:flex-1 lg:items-center">
                    <a href="/">
                      <span className="sr-only">MoshiProject</span>
                      <Image
                        sizes="h-10 md:h-14"
                        data={{
                          url: logoWhiteURL,
                          altText: 'logo',
                        }}
                        width={'full'}
                        height={'full'}
                        className="object-cover object-center h-10 md:h-14"
                      />
                    </a>
                  </div>
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-gray-200 tracking-widest"
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
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <header className="relative z-10">
        <nav aria-label="Top">
          {/* Secondary navigation */}
          <div className=" bg-neutral-950 md:bg-white md:text-black">
            <div className="mx-auto md:max-w-[82.7%] px-4 sm:px-6 lg:px-8 md:mt-2">
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
                        width={'full'}
                        height={'full'}
                        className="object-cover object-center h-10 md:h-16"
                      />
                    </a>
                  </div>

                  <div className="hidden h-full lg:flex">
                    {/* Flyout menus */}
                    <Popover.Group className="inset-x-0 bottom-0 px-4 md:px-0">
                      <div className="flex h-full justify-center space-x-8"></div>
                    </Popover.Group>
                  </div>

                  {/* Logo (lg-) */}

                  <a href="/" className="lg:hidden">
                    <span className="sr-only">MoshiProject</span>
                    <Image
                      data={{
                        url: logoWhiteURL,
                        altText: 'item.imageAlt',
                      }}
                      width={'full'}
                      height={'full'}
                      className="object-cover object-center h-10"
                    />
                  </a>

                  <div className="flex flex-1 items-center justify-end">
                    {/* <a
                      href="/search"
                      className="hidden text-sm font-medium text-gray-100 hover:text-gray-50 lg:block"
                    >
                      Search
                    </a> */}

                    <div className="flex items-center lg:ml-8">
                      {/* Search */}

                      <SearchBar />

                      {/* Mobile menu and search (lg-) */}
                      {CartButton(cart)}
                      <div className="flex flex-1 items-center lg:hidden">
                        <button
                          type="button"
                          className=" rounded-md bg-neutral-950  text-gray-200  md:text-black"
                          onClick={() => setOpen(true)}
                        >
                          <span className="sr-only">Open menu</span>
                          <Bars3Icon
                            className="h-9 w-[38px]"
                            aria-hidden="true"
                          />
                        </button>
                      </div>
                      {/* <a
                        href="/FAQ"
                        className="hidden text-sm font-medium text-gray-100 hover:text-gray-50 lg:block"
                      ></a> */}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block md:mt-2 md:max-w-[86.5%] px-4 sm:px-6 lg:px-8">
            <DesktopMegaMenu />
          </div>
        </nav>
      </header>
    </div>
  );
}
