// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {
  Link,
  useLocation,
  useSearchParams,
  useTransition,
} from '@remix-run/react';
import {useScroll, motion, AnimatePresence} from 'framer-motion';
import {useRef, useState} from 'react';
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
import SizingChart from '~/components/products/SizingChart';
import AddToCartForm from './AddToCartForm';
import StickyBottomCartButton from './StickyBottomCartButton';

export default function ProductOptions({
  options,
  selectedVariant,
  productType,
}) {
  const {pathname, search} = useLocation();
  const [currentSearchParams] = useSearchParams();
  const transition = useTransition();
  const optionsRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target: optionsRef,
    offset: ['end start', `${0.1} start`],
  });
  const [optionsBar, setOptionsBar] = useState(true);

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
    <>
      <motion.div
        style={{opacity: scrollYProgress}}
        ref={optionsRef}
        onViewportLeave={() => {
          setOptionsBar(true);
        }}
        onViewportEnter={() => {
          setOptionsBar(false);
        }}
        className="grid my-4 md:my-2 border-b border-neutral-100"
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
              className={`flex flex-col justify-center items-center pb-4 md:items-start last:mb-0 w-full pt-3 border-t border-neutral-100 gap-y-2`}
            >
              <div
                className={`flex ${
                  isSize ? 'justify-between' : 'justify-center md:justify-start'
                } w-full`}
              >
                {isSize && <span className="w-1/3 md:hidden"></span>}
                <h3 className="whitespace-pre-wrap max-w-prose font-normal text-sm uppercase pt-1 tracking-widest">
                  {option.name} -{' '}
                  <span className="text-neutral-500 text-sm">
                    {
                      selectedVariant.selectedOptions.find(
                        (opt) => opt.name === option.name,
                      ).value
                    }
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
          />
        )}
      </AnimatePresence>
    </>
  );
}
export function Options(
  option: any,
  searchParams: URLSearchParams,
  currentOptionVal: string | null,
  isColor: boolean,
  pathname: string,
) {
  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      {option.values.map((value: string) => {
        const linkParams = new URLSearchParams(searchParams);
        const isSelected = currentOptionVal === value;
        linkParams.set(option.name, value);
        if (isColor) {
          const color = colorMap[value.replace(/\s/g, '')];
          return (
            <Link
              key={value}
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
            to={`${pathname}?${linkParams.toString()}`}
            preventScrollReset
            replace
            className={`w-fit md:px-1 h-8 min-w-[32px] flex justify-center items-center  border-neutral-400 border leading-none cursor-pointer text-sm transition-all duration-200 rounded-full ${
              isSelected
                ? 'border-neutral-800 border-2  bg-clip-content font-semibold'
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
