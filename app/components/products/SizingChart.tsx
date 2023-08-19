import React, {useState} from 'react';
import {Dialog, Transition, Switch} from '@headlessui/react';
import useScrollDirection from '~/functions/useScrollDirection';
import {Image} from '@shopify/hydrogen';

const SizingChartModal: React.FC = ({productType}: {productType: any}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [unit, setUnit] = useState('in');
  const scrollDirection = useScrollDirection();
  const closeModal = () => setIsOpen(false);
  const openModal = () => setIsOpen(true);

  const toggleUnit = () => {
    if (unit === 'in') {
      setUnit('cm');
    } else {
      setUnit('in');
    }
  };
  const productTypeMap = {
    Sweatshirt: SweatshirtChart,
    'T-Shirt': shirtChart,
    Hoodie: hoodieChart,
  };
  const data = productTypeMap[productType];
  return (
    <>
      {data && (
        <>
          <button
            type="button"
            className=" text-[14px] font-medium text-blue-600 hover:text-blue-500 flex justify-end items-center "
            onClick={openModal}
          >
            {rulerSVG}
          </button>

          <Transition appear show={isOpen} as={React.Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-10 overflow-y-auto"
              onClose={closeModal}
            >
              <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />

              <div className="flex items-center justify-center min-h-screen ">
                <div
                  className={`relative bg-white rounded-lg shadow-lg overflow-hidden z-[100000] m-4 h-fit w-fit pb-4 md:w-1/2 md:mt-56 ${
                    scrollDirection !== 'down' ? 'mt-28' : ''
                  }`}
                >
                  <div className="overflow-scroll">
                    <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <Dialog.Title
                          as="h2"
                          className="text-lg font-medium text-gray-900"
                        >
                          Sizing Chart
                        </Dialog.Title>
                        <Switch.Group>
                          <div className="flex items-center">
                            <Switch.Label className="mr-4">IN</Switch.Label>
                            <Switch
                              checked={unit === 'cm'}
                              onChange={toggleUnit}
                              className={`${
                                unit === 'cm' ? 'bg-blue-600' : 'bg-gray-200'
                              } relative inline-flex items-center h-6 rounded-full w-11`}
                            >
                              <span className="sr-only">Toggle</span>
                              <span
                                className={`${
                                  unit === 'cm'
                                    ? 'translate-x-6'
                                    : 'translate-x-1'
                                } inline-block w-4 h-4 transform bg-white rounded-full`}
                              />
                            </Switch>
                            <Switch.Label className="ml-4">CM</Switch.Label>
                          </div>
                        </Switch.Group>
                      </div>
                    </div>

                    <div className="px-4 py-3 ">
                      <div className="flex flex-col mb-4">
                        <div className="-my-2 overflow-x-auto md:overflow-x-hidden sm:-mx-6 lg:mx-0">
                          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-0">
                            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                              <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    {data[0].map((header, index) => (
                                      <th
                                        key={index}
                                        scope="col"
                                        className="px-2 py-3  text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                                      >
                                        {header}
                                      </th>
                                    ))}
                                  </tr>
                                </thead>
                                <tbody>
                                  {data.slice(1).map((row, rowIndex) => (
                                    <tr
                                      key={rowIndex}
                                      className={`${
                                        rowIndex % 2 !== 0
                                          ? 'bg-gray-100'
                                          : 'bg-white'
                                      }`}
                                    >
                                      {row.map((cell, cellIndex) => (
                                        <td
                                          key={cellIndex}
                                          className="px-2 py-3 whitespace-nowrap text-sm text-gray-700"
                                        >
                                          {unit === 'in'
                                            ? cell
                                            : cellIndex === 0
                                            ? cell
                                            : (parseFloat(cell) * 2.54).toFixed(
                                                2,
                                              )}
                                        </td>
                                      ))}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <span className="md:w-1/2">
                        <Image
                          alt="shirtSizing"
                          src="https://cdn.shopify.com/s/files/1/0552/4121/2109/files/ShirtSizing.png?v=1680595932"
                          width={'100%'}
                        />
                      </span>
                    </div>
                    <div className="text-sm px-6">
                      <h3 className=" text-lg font-semibold ">
                        Measuring Guide
                      </h3>
                      <h3 className=" text-base font-semibold mt-3 pt-3 border-t border-neutral-300">
                        How to Measure{' '}
                      </h3>
                      Take a great fitting shirt or hoodie, lay it flat and
                      measure the length and width with a measuring tape
                      according to the steps below and image above. The sleeve
                      length isn't essential for determing your size. If you're
                      between sizes we strongly recommend you take a size
                      larger. We reccomend sizing up for a looser fit on all
                      items.
                      <h3 className=" text-base font-semibold mt-3 pt-3 border-t border-neutral-300">
                        How to Measure Width
                      </h3>{' '}
                      Lay garment flat. From 1” below the arm hole measure the
                      garment across the chest.
                      <h3 className=" text-base font-semibold mt-3 pt-3 border-t border-neutral-300">
                        How to Measure Body Length
                      </h3>
                      Lay garment flat. Measure from highest point of the
                      shoulder to the bottom of the garment{' '}
                      <h3 className=" text-base font-semibold mt-3 pt-3 border-t border-neutral-300">
                        How to Measure Sleeve
                      </h3>
                      Lay garment flat. Measure from bottom top tip of the
                      sleeve to the seam around the shoulder, as shown in the
                      image above.
                    </div>
                  </div>
                  <div className="px-2 py-1 bg-neutral-900 text-right fixed bottom-5 right-5 rounded-full shadow-md bg-opacity-80">
                    <button
                      type="button"
                      className="inline-block p-2 text-sm font-semibold text-white hover:text-white"
                      onClick={closeModal}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition>
        </>
      )}
    </>
  );
};

const shirtChart = [
  ['Size', 'Width', 'Length', 'Sleeve Length'],
  ['S', '18"', '28"', '8.5"'],
  ['M', '20"', '29"', '8.75"'],
  ['L', '22"', '30"', '9"'],
  ['XL', '24"', '31"', '9.25'],
  ['2XL', '26"', '32"', '9.5"'],
  ['3XL', '28"', '33"', '9.75"'],
  ['4XL', '30"', '34"', '10"'],
  ['5XL', '32"', '35"', '10.25"'],
];

const SweatshirtChart = [
  ['Size', 'Width', 'Length', 'Sleeve Length'],
  ['S', '20"', '27"', '20"'],
  ['M', '22"', '28"', '21"'],
  ['L', '24"', '29"', '22"'],
  ['XL', '26"', '30"', '23'],
  ['2XL', '28"', '31"', '24"'],
  ['3XL', '30"', '32"', '25"'],
  ['4XL', '32"', '33"', '26"'],
  ['5XL', '34"', '34"', '27"'],
];

const hoodieChart = [
  ['Size', 'Width', 'Length', 'Sleeve Length'],
  ['S', '20"', '27"', '20"'],
  ['M', '22"', '28"', '21"'],
  ['L', '24"', '29"', '22"'],
  ['XL', '26"', '30"', '23'],
  ['2XL', '28"', '31"', '24"'],
  ['3XL', '30"', '32"', '25"'],
  ['4XL', '32"', '33"', '26"'],
  ['5XL', '34"', '34"', '27"'],
];
export default SizingChartModal;

const rulerSVG = (
  <div className="flex items-center justify-end pb-1">
    <span className="mr-2">
      {' '}
      <svg
        className="size-btn-icon"
        width="25"
        height="25"
        viewBox="0 0 25 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M1.5 15.5V8.5H23.5V15.5H1.5Z"
          stroke="currentcolor"
          strokeLinecap="square"
        ></path>
        <path
          d="M19.1777 8.5V11.3284"
          stroke="currentcolor"
          strokeLinecap="square"
        ></path>
        <path
          d="M15.6416 8.5V12.7426"
          stroke="currentcolor"
          strokeLinecap="square"
        ></path>
        <path
          d="M12.1064 8.5V11.3284"
          stroke="currentcolor"
          strokeLinecap="square"
        ></path>
        <path
          d="M8.57129 8.5V12.7426"
          stroke="currentcolor"
          strokeLinecap="square"
        ></path>
        <path
          d="M5.03516 8.5V11.3284"
          stroke="currentcolor"
          strokeLinecap="square"
        ></path>
      </svg>
    </span>
    <span className="size-btn__title w-24 text-sm"> Sizing Chart </span>
  </div>
);
