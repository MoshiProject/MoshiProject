// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Link,
  useLocation,
  useSearchParams,
  useTransition,
} from '@remix-run/react';
import {AnimatePresence, motion, useScroll} from 'framer-motion';
import {useRef, useState} from 'react';
import SizingChart from '~/components/products/SizingChart';
import StickyBottomCartButton from './StickyBottomCartButton';
const colorMap = {
  SportGrey: '#B0AFA9',
  Navy: '#234569',
  White: '#FFFFFF',
  Black: '#080808',
  LightBlue: '#9DBED7',
  Maroon: '#4B1F22',
  Red: '#CA1220',
  IceGrey: '#C0BFB8',
  Natural: '#D6D1AA',
  HeatherNavy: '#2C3E4C',
};

export default function ProductOptions({
  options,
  selectedVariant,
  productType,
  productAnalytics,
  setVariantByOptions,
  highlightNoneSelected,
}) {
  const {pathname, search} = useLocation();
  const [currentSearchParams] = useSearchParams();
  const transition = useTransition();
  const optionsRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target: optionsRef,
    offset: ['end start', `${0.1} start`],
  });
  console.log('CURRENT SEARCH: ' + currentSearchParams);
  const [optionsBar, setOptionsBar] = useState(true);
  const searchParamObject = getSearchParamObject(currentSearchParams);
  const paramsWithDefaults = (() => {
    const defaultParams = new URLSearchParams(currentSearchParams);

    if (!selectedVariant) {
      return defaultParams;
    }

    for (const {name, value} of selectedVariant.selectedOptions) {
      if (!currentSearchParams.has(name)) {
        defaultParams.set(name, value);
      }
    }

    return defaultParams;
  })();

  // Update the in-flight request data from the 'transition' (if available)
  // to create an optimistic UI that selects a link before the request is completed
  const searchParams = transition.location
    ? new URLSearchParams(transition.location.search)
    : paramsWithDefaults;

  return (
    <div key={selectedVariant?.title + currentSearchParams}>
      <motion.div
        style={{opacity: scrollYProgress}}
        ref={optionsRef}
        onViewportLeave={() => {
          setOptionsBar(true);
        }}
        onViewportEnter={() => {
          setOptionsBar(false);
        }}
        className="grid my-3 md:my-2 border-b border-neutral-100"
      >
        {options.map((option) => {
          if (!option.values.length) {
            return;
          }
          const isColor = option.name.toLowerCase() === 'color';

          const isSize = option.name.toLowerCase() === 'size';

          // get the currently selected option value
          const currentOptionVal = searchParams.get(option.name);
          if (isSize) {
            option.values.sort((option1: string, option2: string) => {
              const sizeOrder = {
                S: 1,
                M: 2,
                L: 3,
                XL: 4,
                '2XL': 5,
                '3XL': 6,
                '4XL': 7,
                '5XL': 8,
              };
              const option1Val = sizeOrder[option1];
              const option2Val = sizeOrder[option2];
              if (!option1Val && !option2Val) return 0;
              return option1Val - option2Val;
            });
          }
          return (
            <div
              key={option.name}
              className={`flex flex-col justify-center pb-4 md:items-start last:mb-0 w-full pt-2 border-t border-neutral-100 gap-y-2`}
            >
              <div
                className={`flex ${
                  isSize ? 'justify-between' : 'md:justify-start'
                } w-full`}
              >
                {/* {isSize && <span className="w-1/3 md:hidden"></span>} */}
                <h3 className="whitespace-pre-wrap max-w-prose font-normal text-xs uppercase pt-1 tracking-widest">
                  {option.name} -{' '}
                  <span className="text-neutral-500 text-xs">
                    {selectedVariant
                      ? selectedVariant?.selectedOptions?.find(
                          (opt) => opt.name === option.name,
                        ).value
                      : searchParamObject[option.name] ?? (
                          <span
                            className={`${
                              highlightNoneSelected
                                ? 'border-red-600 text-red-500 border rounded-lg p-1'
                                : 'text-neutral-500 p-1'
                            }`}
                          >
                            None Selected
                          </span>
                        )}
                  </span>
                </h3>
                {isSize && (
                  <span className="w-1/3 flex justify-end md:hidden">
                    <SizingChart productType={productType} />
                  </span>
                )}

                {/* <h3 className="whitespace-pre-wrap max-w-prose font-medium text-lead min-w-[4rem] text-sm text-red-600">
              {currentOptionVal}
            </h3> */}
              </div>
              {Options(
                option,
                searchParams,
                currentOptionVal,
                isColor,
                pathname,
                setVariantByOptions,
              )}
            </div>
          );
        })}
      </motion.div>
      <AnimatePresence>
        {optionsBar && (
          <StickyBottomCartButton
            selectedVariant={selectedVariant}
            options={options}
            searchParams={searchParams}
            pathname={pathname}
            productAnalytics={productAnalytics}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
export function Options(
  option: any,
  searchParams: URLSearchParams,
  currentOptionVal: string | null,
  isColor: boolean,
  pathname: string,
  setVariantByOptions?: any,
) {
  return (
    <div className="flex flex-wrap items-center gap-[.45rem] ">
      {option.values.map((value: string) => {
        const linkParams = new URLSearchParams(searchParams);
        const isSelected = currentOptionVal === value;
        linkParams.set(option.name, value);
        if (isColor) {
          const color = colorMap[value.replace(/\s/g, '')];
          return (
            <Link
              key={value}
              onClick={() => {
                setVariantByOptions(getSearchParameters(linkParams));
              }}
              style={{
                backgroundColor: color,
                borderColor: isSelected
                  ? color === '#FFFFFF'
                    ? '#c2c2c2'
                    : color
                  : '#c2c2c2',
              }}
              to={`${pathname}?${linkParams.toString()}`}
              preventScrollReset
              replace
              className={`w-8 h-8 border cursor-pointer rounded-full ${
                isSelected
                  ? 'border-2 p-1 bg-clip-content'
                  : 'border-neutral-50'
              }`}
            ></Link>
          );
        }
        return (
          <Link
            key={value}
            onClick={() => {
              setVariantByOptions(getSearchParameters(linkParams));
            }}
            to={`${pathname}?${linkParams.toString()}`}
            preventScrollReset
            replace
            className={`w-fit md:px-3 h-8 px-2 min-w-[32px] flex justify-center items-center  border-neutral-400 border leading-none cursor-pointer text-sm transition-all duration-200 rounded-lg ${
              isSelected
                ? 'bg-neutral-950 text-white  font-semibold'
                : 'border-neutral-300 font-normal '
            }`}
          >
            {value}
          </Link>
        );
      })}
    </div>
  );
}
function getSearchParameters(searchParams) {
  const paramObj = [];
  for (const key of searchParams.keys()) {
    paramObj[key] =
      searchParams.getAll(key).length > 1
        ? searchParams.getAll(key)
        : searchParams.get(key);
  }
  const output = Object.entries(paramObj).map(([key, value]) => ({key, value}));

  return output;
}
function getSearchParamObject(searchParams) {
  const paramObj = [];
  for (const key of searchParams.keys()) {
    paramObj[key] =
      searchParams.getAll(key).length > 1
        ? searchParams.getAll(key)
        : searchParams.get(key);
  }

  return paramObj;
}
