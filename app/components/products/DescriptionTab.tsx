import {useState} from 'react';
import {ChevronDownIcon} from '@heroicons/react/24/outline';
import {AnimatePresence, motion} from 'framer-motion';

type AddToCartFormProps = {
  children: JSX.Element;
  title: string;
  height: string;
};
function DescriptionTab({children, title, height}: AddToCartFormProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{opacity: 0}}
      viewport={{once: true}}
      whileInView={{
        opacity: 1,

        transition: {delay: 0, duration: 0.4},
      }}
      className="w-[94vw] md:w-full px-2 border-t border-neutral-200 py-2"
    >
      <button
        className="flex w-full justify-between items-center h-12 "
        onClick={() => {
          setOpen(!open);
        }}
      >
        <h2 className="text-base font-semibold">{title}</h2>
        <motion.span
          initial={{rotate: 0}}
          animate={{rotate: open ? -180 : 0, transition: {damping: 15}}}
        >
          <ChevronDownIcon className="w-5 h-5" />
        </motion.span>
      </button>
      <AnimatePresence>
        {' '}
        {open && (
          <motion.div
            initial={{opacity: 0, height: 0}}
            animate={{opacity: 1, height}}
            exit={{opacity: 0, height: 0}}
            className={`overflow-x-scroll ${height} flex w-full relative whitespace-nowrap overflow-y-hidden`}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default DescriptionTab;
