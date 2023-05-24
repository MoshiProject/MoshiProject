import {FormEventHandler, useState, useRef, useEffect} from 'react';
import {useNavigate} from '@remix-run/react';
import {MagnifyingGlassIcon, XMarkIcon} from '@heroicons/react/20/solid';
import {AnimatePresence, motion} from 'framer-motion';
const SearchBar = () => {
  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigate();
  const searchBarRef = useRef(null);

  const handleSearchButtonClick = () => {
    setIsSearchBarVisible(true);
  };

  const handleSearchFormSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    navigation(`/search?query=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setSearchQuery(event.target.value);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      searchBarRef.current &&
      !searchBarRef.current.contains(event.target as Node)
    ) {
      setIsSearchBarVisible(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex justify-end" ref={searchBarRef}>
      <AnimatePresence>
        {isSearchBarVisible ? (
          <motion.div
            key={'animate'}
            initial={{width: '0%', opacity: '0'}}
            animate={{
              width: isSearchBarVisible ? '100%' : '20%',
              opacity: '100%',
            }}
            exit={{width: '0%', opacity: '0'}}
            transition={{when: 'afterChildren'}}
          >
            <form onSubmit={handleSearchFormSubmit}>
              <label htmlFor="mobile-search" className="sr-only">
                Search
              </label>
              <input
                id="mobile-search"
                name="query"
                type="text"
                value={searchQuery}
                onChange={handleSearchInputChange}
                className="text-black block w-full border-gray-300 rounded-md sm:text-sm focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Search"
                autoComplete="off"
              />
              {isSearchBarVisible && (
                <motion.button
                  key={'searchIcon'}
                  initial={{opacity: '0'}}
                  animate={{
                    opacity: '100%',
                  }}
                  exit={{opacity: '0'}}
                  transition={{when: 'afterChildren'}}
                  type="submit"
                  className="text-black absolute top-0 right-0 px-3 py-2"
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon
                    className=" h-6 w-6 md:h-8 md:w-8"
                    aria-hidden="true"
                  />
                </motion.button>
              )}
            </form>
          </motion.div>
        ) : (
          <button
            onClick={handleSearchButtonClick}
            className="flex items-center"
          >
            <span className="sr-only">Search</span>
            <MagnifyingGlassIcon
              className=" h-6 w-6 md:h-8 md:w-8"
              aria-hidden="true"
            />
          </button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchBar;
