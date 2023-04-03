import {motion, AnimatePresence} from 'framer-motion';
import {Dialog, Disclosure, Transition} from '@headlessui/react';
import {Image} from '@shopify/hydrogen';
import {ChevronDownIcon, XMarkIcon} from '@heroicons/react/24/outline';
import {Fragment, useEffect, useRef, useState} from 'react';
import {Button} from 'flowbite-react';
import {Product} from '../products/products';
import {RadioGroup} from '@headlessui/react';
import CollectionFilter from './CollectionFilter';
import {charactersMap} from '~/functions/titleFilter';
export type FilterType = 'anime' | 'productType' | 'character';

type FilterSidebarProps = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  filteredProducts: Product[];
};

function FilterSidebar({
  products,
  setProducts,
  filteredProducts,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);
  const [filteredProductType, setFilteredProductType] = useState([]);

  //   Handle Character Filtering
  useEffect(() => {
    if (filteredCharacters.length > 0) {
      const filtered = products.filter((product) => {
        if (!product.filters) return;
        return Array.isArray(charactersMap[product.filters['character']])
          ? charactersMap[product.filters['character']].some((r) =>
              filteredCharacters.includes(r),
            )
          : filteredCharacters.includes(
              charactersMap[product.filters['character']],
            );
      });

      setProducts(filtered);
    }
  }, [filteredCharacters, products, setProducts]);

  //   Handle Anime Filtering
  useEffect(() => {
    if (filteredAnime.length > 0) {
      const filtered = products.filter((product) => {
        if (!product.filters) return;
        return filteredAnime.includes(product.filters['anime']);
      });

      setProducts(filtered);
    }
  }, [filteredAnime, products, setProducts]);

  //   Handle Product Type Filtering
  useEffect(() => {
    if (filteredProductType.length > 0) {
      const filtered = products.filter((product) => {
        if (!product.filters) return;
        return filteredProductType.includes(product.filters['productType']);
      });
      setProducts(filtered);
    }
  }, [filteredProductType, products, setProducts]);

  useEffect(() => {
    if (
      filteredCharacters.length === 0 &&
      filteredAnime.length === 0 &&
      filteredProductType.length === 0
    ) {
      setProducts(products);
    }
  }, [
    filteredCharacters,
    filteredAnime,
    filteredProductType,
    products,
    setProducts,
  ]);
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
                <div className="mx-6">
                  <>
                    <CollectionFilter
                      products={filteredProducts}
                      selected={filteredAnime}
                      setSelected={setFilteredAnime}
                      setProducts={setProducts}
                      type={'anime'}
                      title="Filter by Anime"
                    />
                  </>
                  <>
                    <CollectionFilter
                      products={filteredProducts}
                      selected={filteredCharacters}
                      setSelected={setFilteredCharacters}
                      setProducts={setProducts}
                      type={'character'}
                      title="Filter by Character"
                    />
                  </>
                  <>
                    <CollectionFilter
                      products={filteredProducts}
                      selected={filteredProductType}
                      setSelected={setFilteredProductType}
                      setProducts={setProducts}
                      type={'productType'}
                      title="Filter by Product Type"
                    />
                  </>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}

export default FilterSidebar;
function onlyUnique(value: any, index: number, array: any[]) {
  return array.indexOf(value) === index;
}
