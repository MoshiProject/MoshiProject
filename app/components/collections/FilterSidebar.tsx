import {motion, AnimatePresence} from 'framer-motion';
import {Dialog, Disclosure, Transition} from '@headlessui/react';
import {Image} from '@shopify/hydrogen';
import {ChevronDownIcon, XMarkIcon} from '@heroicons/react/24/outline';
import MegaMenuMobile from '../MegaMenu/MegaMenuMobile';
import {currencies, logoURL} from '../MegaMenu/menuSettings';
import {Fragment, useRef, useState} from 'react';
import {Button} from 'flowbite-react';
import {Product} from '../products/products';

type FilterSidebarProps = {
  products: Product[];
  setProducts: (products: Product[]) => void;
};

function FilterSidebar({products, setProducts}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tag, setTag] = useState('');
  const handleTagChange = (event) => {
    const newTag = event.target.value;
    setTag(newTag);
    filterProductsByTag(newTag);
  };
  //   //console.log(products);
  //   const getAnimeFilters = () => {
  //     const animeFilters = products
  //       .map((product: Product) => {
  //         return product.filters ? product.filters.anime : null;
  //       })
  //       .filter(onlyUnique);
  //     return animeFilters;
  //   };

  //   const getCharacterFilters = () => {
  //     const animeFilters = products
  //       .map((product: Product) => {
  //         return product.filters ? product.filters.character : null;
  //       })
  //       .filter(onlyUnique);
  //     return animeFilters;
  //   };

  //   console.log(getCharacterFilters());
  const filterProductsByTag = (tag) => {
    if (!tag) {
      setProducts(products);
    } else {
      const filtered = products.filter((product) => {
        return (
          product.tags.includes(tag) ||
          product.title.toLowerCase().includes(tag)
        );
      });
      setProducts(filtered);
    }
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)}></Button>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-40 lg:hidden "
          onClose={setIsOpen}
        >
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

          <div className="fixed inset-0 z-40 flex left-0 justify-start ">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-neutral-950 pb-12 shadow-xl text-gray-200">
                <div className="flex px-6 pt-5 pb-2 justify-between">
                  <div className="lg:flex lg:flex-1 lg:items-center">
                    Filters
                  </div>
                  <button
                    type="button"
                    className="-m-2 inline-flex items-center justify-center rounded-md p-2 text-neutral-100"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="sr-only">Close menu</span>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div>
                  {' '}
                  <form>
                    <label>
                      Filter by tag:
                      <select value={tag} onChange={handleTagChange}>
                        <option value="">All</option>
                        <option value="itadori">Itadori</option>
                        <option value="new">New Arrival</option>
                      </select>
                    </label>
                  </form>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

function onlyUnique(value, index, array) {
  return array.indexOf(value) === index;
}
function Counter(arr: []) {
  const count = {};
  arr.forEach((val) => (count[val] = (count[val] || 0) + 1));
  return count;
}

export default FilterSidebar;
