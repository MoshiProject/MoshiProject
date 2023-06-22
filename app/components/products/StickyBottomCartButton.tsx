import {motion, AnimatePresence} from 'framer-motion';
import {Link} from '../Link';
import {useState} from 'react';
import {Options} from './ProductOptions';
import AddToCartForm from './AddToCartForm';
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

function StickyBottomCartButton({
  selectedVariant,
  options,
  searchParams,
  pathname,
}) {
  const linkParams = new URLSearchParams(searchParams);
  const [variantSelector, setVariantSelector] = useState('');
  return (
    <>
      {' '}
      <AnimatePresence>
        {' '}
        {variantSelector !== '' && (
          <motion.div
            onClick={() => {
              setVariantSelector('');
            }}
            initial={{opacity: 0, translateY: 60}}
            animate={{opacity: 1, translateY: 0, transition: {damping: 20}}}
            exit={{opacity: 0, translateY: 60}}
            className="fixed flex md:hidden justify-center items-center left-0 bottom-16 min-h-[64px] h-fit bg-black w-full text-white z-50 px-2`"
          >
            {Options(
              options.find((option) => {
                return option.name === variantSelector;
              }),
              searchParams,
              selectedVariant.value,
              variantSelector === 'Color',
              pathname,
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{opacity: 0, translateY: 60}}
        animate={{opacity: 1, translateY: 0, transition: {damping: 20}}}
        exit={{opacity: 0, translateY: 60}}
        className={`fixed flex md:hidden  items-center left-0 bottom-0 h-16 bg-black w-full text-white z-50 px-2`}
      >
        {selectedVariant.selectedOptions.map((option) => {
          linkParams.set(option.name, option.value);
          return option.name.toLowerCase() === 'color' ? (
            <button
              onClick={() => {
                setVariantSelector(option.name);
              }}
              key={option.value}
              style={{
                backgroundColor: colorMap[option.value.replace(/\s/g, '')],
                borderColor:
                  option.value === 'Black'
                    ? '#444'
                    : colorMap[option.value.replace(/\s/g, '')],
              }}
              className={`w-8 h-8 mx-1 text-sm border-2 p-1 bg-clip-content inset cursor-pointer rounded-full ${'rounded-full border border-white w-fit min-w-[36px] h-9'}`}
            ></button>
          ) : (
            <button
              onClick={() => {
                setVariantSelector(option.name);
              }}
              key={option.value}
              style={{
                borderColor: 'white',
              }}
              className={`w-8 h-8 mx-1 text-sm border-2 cursor-pointer rounded-full ${'rounded-full border border-white w-fit min-w-[36px] h-9'}`}
            >
              {option.value}
            </button>
          );
        })}{' '}
        <div className="h-10 border-l w-0 ml-4 border-neutral-700"></div>
        {/* <button className="w-full h-full font-semibold tracking-widest text-lg">
          ADD TO CART
        </button> */}
        <div className="w-full">
          <AddToCartForm variantId={selectedVariant?.id} />
        </div>
      </motion.div>
    </>
  );
}

export default StickyBottomCartButton;
