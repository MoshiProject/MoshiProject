import {useState} from 'react';
import {Listbox} from '@headlessui/react';
import {ArrowsUpDownIcon, ChevronDownIcon} from '@heroicons/react/24/outline';
import {useSubmit, useSearchParams} from '@remix-run/react';

const sortOptions = [
  {label: 'Featured', value: 'featured'},
  {label: 'Best Selling', value: 'best'},
  {label: 'Alphabetically A-Z', value: 'title_desc'},
  {label: 'Alphabetically Z-A', value: 'title_asc'},
  {label: 'Newest', value: 'newest'},
  {label: 'Oldest', value: 'oldest'},
  {label: 'Price Low-High', value: 'price_asc'},
  {label: 'Price High-Low', value: 'price_desc'},
];

export default function CollectionSort() {
  const [searchParams] = useSearchParams();
  const sort = searchParams.get('sort');

  const [selectedSortOption, setSelectedSortOption] = useState<string>(
    sort ? sort : sortOptions[0].value,
  );
  const submit = useSubmit();

  const handleSortOptionChange = (selectedOption: string) => {
    setSelectedSortOption(selectedOption);
    // Update search parameters here
    submit({sort: selectedOption});
  };

  return (
    <Listbox value={selectedSortOption} onChange={handleSortOptionChange}>
      {({open}) => (
        <>
          <div className="relative z-30">
            <Listbox.Button
              className={`w-48 h-full pl-1 pr-1 text-xs tracking-widest font-medium border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md`}
            >
              {/* <span className={`block truncate`}>
                Sort:{' '}
                {sortOptions.find((o) => o.value === selectedSortOption).label}
              </span>
              <span className="absolute inset-y-0 right-0 flex items-center pr-1 pointer-events-none">
                <ChevronDownIcon
                  className={`w-5 h-5 text-gray-400`}
                  aria-hidden="true"
                />
              </span> */}
              <div className="flex h-full justify-end items-center border-r border-neutral-400 pr-2">
                <span className=" text-center tracking-widest">
                  {
                    sortOptions.find((o) => o.value === selectedSortOption)
                      .label
                  }
                </span>
                <ArrowsUpDownIcon className="text-black stroke-1 h-6 w-6 ml-2" />
              </div>
            </Listbox.Button>
            <Listbox.Options
              className={`absolute z-10 w-full py-1 mt-1 overflow-auto text-sm tracking-widest  bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm`}
            >
              {sortOptions.map((option) => (
                <Listbox.Option
                  key={option.value}
                  value={option.value}
                  className={`cursor-default select-none relative py-2 pl-2 pr-4 ${
                    selectedSortOption === option.value
                      ? 'font-semibold bg-red-600 text-white tracking-widest'
                      : ''
                  } ${
                    open && selectedSortOption === option.value
                      ? 'bg-gray-100'
                      : ''
                  }`}
                >
                  {({selected}) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? 'font-semibold' : 'font-normal'
                        }`}
                      >
                        {option.label}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 tracking-widest flex items-center pl-3 ${
                            open ? 'text-white' : 'text-red-600'
                          }`}
                        >
                          {/* <ChevronDownIcon
                            className={`w-5 h-5`}
                            aria-hidden="true"
                          /> */}
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </div>
        </>
      )}
    </Listbox>
  );
}
