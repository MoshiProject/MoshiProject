import {Dialog, Transition} from '@headlessui/react';
import {XMarkIcon} from '@heroicons/react/24/outline';
import {Fragment, useEffect, useState} from 'react';
import {Product} from '../products/products';
import CollectionFilter from './CollectionFilter';
import {charactersMap} from '~/functions/titleFilter';

export type FilterType = 'anime' | 'productType' | 'character';

type FilterSidebarProps = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  filteredProducts: Product[];
  filteredProductTypeDefault: [];
};

function FilterSidebar({
  products,
  setProducts,
  filteredProducts,
  filteredProductTypeDefault = [],
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCharacters, setFilteredCharacters] = useState([]);
  const [filteredAnime, setFilteredAnime] = useState([]);
  const [filteredProductType, setFilteredProductType] = useState(
    filteredProductTypeDefault,
  );
  console.log('filteredProductType', filteredProductType);
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
      <button
        className={'flex h-full items-center'}
        onClick={() => setIsOpen(true)}
      >
        <FilterIcon />
        <span className="ml-2 text-xs">Filter</span>
      </button>
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-40 " onClose={setIsOpen}>
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
                <div className="flex px-6 pt-5 pb-4 justify-between border-b border-neutral-900">
                  <div></div>
                  <div className="lg:flex lg:flex-1 lg:items-center font-semibold tracking-widest uppercase">
                    Filter
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
                <div className="mx-1">
                  <>
                    <CollectionFilter
                      products={filteredProducts}
                      selected={filteredAnime}
                      setSelected={setFilteredAnime}
                      setProducts={setProducts}
                      type={'anime'}
                      title="Anime"
                    />
                  </>
                  <>
                    <CollectionFilter
                      products={filteredProducts}
                      selected={filteredCharacters}
                      setSelected={setFilteredCharacters}
                      setProducts={setProducts}
                      type={'character'}
                      title="Character"
                    />
                  </>
                  <>
                    <CollectionFilter
                      products={filteredProducts}
                      selected={filteredProductType}
                      setSelected={setFilteredProductType}
                      setProducts={setProducts}
                      type={'productType'}
                      title="Product"
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
function FilterIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-5 h-5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
      />
    </svg>
  );
}
