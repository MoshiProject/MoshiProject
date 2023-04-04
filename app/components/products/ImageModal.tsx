import React, {useState} from 'react';
import {Dialog, Transition} from '@headlessui/react';
import {MediaFile} from '@shopify/hydrogen'; // assuming this is the import statement for your MediaFile component
import {motion} from 'framer-motion';
type Props = {
  data: object;
  extraProps: Record<string, unknown>;
};

const ImageModal: React.FC<Props> = ({data, extraProps}) => {
  const [isOpen, setIsOpen] = useState(false);

  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  return (
    <>
      <MediaFile data={data} onClick={openModal} {...extraProps} />

      <Transition appear show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <div className="flex items-center justify-center min-h-screen">
            <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

            <motion.div
              onClick={closeModal}
              animate={{scale: isOpen ? 1 : 0, opacity: isOpen ? 1 : 0}}
              className="relative bg-white rounded-md h-screen flex flex-col justify-center"
            >
              <button
                type="button"
                className="absolute top-24 right-0 m-4 text-gray-400 hover:text-gray-500"
                onClick={closeModal}
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
              <div className="w-[140%] -ml-[20%]">
                <MediaFile data={data} {...extraProps} />
              </div>
            </motion.div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ImageModal;
