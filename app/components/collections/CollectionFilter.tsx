import {Switch} from '@headlessui/react';
import {Product} from '../products/products';
import {useEffect, useState} from 'react';
import {charactersMap} from '~/functions/titleFilter';
import {FilterType} from './FilterSidebar';
import {Accordion} from '~/routes/products/$handle';
import {AnimatePresence, motion} from 'framer-motion';

function CollectionFilter({
  type,
  products,
  setProducts,
  selected,
  setSelected,
  title,
}: {
  type: FilterType;
  products: Product[];
  selected: any[];
  setSelected: (products: Product[]) => void;
  setProducts: (products: any[]) => void;
  title: string;
}) {
  const [displayContents, setDisplayContents] = useState(false);
  const getFilters = (filterName: FilterType) => {
    const animeFilters = products
      .map((product: Product) => {
        return product.filters ? product.filters[filterName] : null;
      })
      .filter(onlyUnique);
    return animeFilters;
  };
  let options: any[] = [];
  let filters = getFilters(type);
  filters.forEach((filter) => {
    if (type === 'character') {
      const mappedCharacters =
        charactersMap[filter as keyof typeof charactersMap];
      if (Array.isArray(mappedCharacters)) {
        return mappedCharacters.forEach((character) => {
          return options.push({value: character, label: character});
        });
      }
      return options.push({
        value: charactersMap[filter as keyof typeof charactersMap],
        label: charactersMap[filter as keyof typeof charactersMap],
      });
    }

    return options.push({value: filter, label: filter});
  });
  options = options
    .filter((filter) => {
      return filter.value != undefined && filter.value != '' && filter.value;
    })
    .filter(
      (v, i, a) =>
        a.findIndex((v2) => ['value', 'label'].every((k) => v2[k] === v[k])) ===
        i,
    );

  function handleSelection(value) {
    setSelected((currentSelection) => {
      const index = currentSelection.indexOf(value);
      if (index === -1) {
        return [...currentSelection, value];
      } else {
        return [
          ...currentSelection.slice(0, index),
          ...currentSelection.slice(index + 1),
        ];
      }
    });
    filters = getFilters(type);
  }

  useEffect(() => {
    setSelected(selected);
    if (selected.length === 0) {
      setProducts(products);
    }
  }, [selected]);
  return (
    <>
      {(selected.length !== 0 || filters.length > 1) && (
        <>
          <div className="px-4 pt-8">
            <button
              className=" tracking-widest font-semibold uppercase flex justify-between w-full"
              onClick={() => {
                setDisplayContents(true);
              }}
            >
              <span>{title}</span>
              <span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </span>{' '}
            </button>
          </div>
          <AnimatePresence>
            {displayContents && (
              <>
                <motion.div
                  key={title + '-filterPage'}
                  className="h-[93vh] fixed top-[7vh] left-0 bg-neutral-950 w-full max-w-xs border-t border-neutral-900 px-5 "
                  initial={{
                    x: -300,
                    opacity: 1,
                  }}
                  animate={{
                    x: 0,
                    opacity: 1,
                    transition: {damping: 1, stiffness: 200},
                  }}
                  exit={{
                    x: -300,
                    opacity: 1,
                    transition: {damping: 1, stiffness: 200},
                  }}
                >
                  <button
                    className="flex pt-8 pb-4 font-semibold uppercase tracking-widest "
                    onClick={() => {
                      setDisplayContents(false);
                    }}
                  >
                    <span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 rotate-180"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                        />
                      </svg>
                    </span>{' '}
                    <span className="ml-4">{title}</span>
                  </button>
                  {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                      <Switch
                        checked={selected.includes(option.value)}
                        onChange={() => handleSelection(option.value)}
                        className={`flex
            relative items-center justify-center flex-shrink-0 h-4 w-4 mr-3
            border-neutral-700 text-neutral-700 border cursor-pointer transition-colors ease-in-out duration-200 bg-neutral-950 p-1`}
                      >
                        {selected.includes(option.value) && <CheckBoxIcon />}
                      </Switch>
                      <span className="text-neutral-200 tracking-widest text-sm my-4 uppercase font-medium">
                        {option.label}
                      </span>
                    </div>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </>
  );
}
function onlyUnique(value: any, index: number, array: any[]) {
  return array.indexOf(value) === index;
}
export default CollectionFilter;

function CheckBoxIcon() {
  return (
    <div className="flex-shrink-0 text-neutral-100">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.5 12.75l6 6 9-13.5"
        />
      </svg>
    </div>
  );
}
