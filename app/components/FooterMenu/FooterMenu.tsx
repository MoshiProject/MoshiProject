import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Disclosure} from '@headlessui/react';
import {Link} from '@remix-run/react';
import {ChevronDownIcon} from '@heroicons/react/24/outline';

const FooterAccordion: React.FC<{
  title: string;
  links: {label: string; url: string}[];
}> = ({title, links}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Disclosure>
      {({open}) => (
        <>
          <Disclosure.Button
            className="flex justify-between border-b border-neutral-800 items-center w-full p-4 text-sm font-medium text-white bg-neutral-950 focus:outline-none hover:bg-neutral-950"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="w-1/3"></span>
            <span className="w-1/3 text-md">{title}</span>
            <div className="w-1/3 flex justify-end">
              <motion.span
                animate={{rotate: open || isOpen ? 180 : 0}}
                transition={{duration: 0.2}}
              >
                <ChevronDownIcon className="w-5 h-5" />{' '}
              </motion.span>
            </div>
          </Disclosure.Button>
          <Disclosure.Panel
            className="px-4 pt-2 pb-4 text-sm text-white"
            initial={{height: 0}}
            animate={{height: isOpen ? 'auto' : 0}}
            transition={{duration: 0.2}}
          >
            <motion.div
              animate={{height: isOpen ? 'auto' : 0}}
              className="flex flex-col items-center"
            >
              {links.map((link) => (
                <Link
                  key={link.url}
                  to={link.url}
                  className="my-1 hover:bg-neutral-950"
                >
                  {link.label}
                </Link>
              ))}
            </motion.div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

const FooterMenu: React.FC = () => {
  const menuItems = [
    {
      title: 'SUPPORT',
      links: [
        {label: 'Contact Us', url: '/pages/contact-us'},
        {label: 'Link 2', url: '/link2'},
        {label: 'Link 3', url: '/link3'},
      ],
    },
    {
      title: 'Menu 2',
      links: [
        {label: 'Link 4', url: '/link4'},
        {label: 'Link 5', url: '/link5'},
        {label: 'Link 6', url: '/link6'},
      ],
    },
    {
      title: 'Menu 3',
      links: [
        {label: 'Link 7', url: '/link7'},
        {label: 'Link 8', url: '/link8'},
        {label: 'Link 9', url: '/link9'},
      ],
    },
  ];

  return (
    <div className="flex flex-wrap justify-center items-start gap-4 p-4 bg-neutral-950">
      {menuItems.map((item) => (
        <div
          key={item.title}
          className="flex-grow-0 flex-shrink w-full md:w-1/3"
        >
          <FooterAccordion title={item.title} links={item.links} />
        </div>
      ))}
    </div>
  );
};

export default FooterMenu;
