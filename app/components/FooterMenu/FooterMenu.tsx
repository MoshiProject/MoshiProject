import React, {useState} from 'react';
import {motion} from 'framer-motion';
import {Disclosure} from '@headlessui/react';
import {Link} from '@remix-run/react';
import {ChevronDownIcon} from '@heroicons/react/24/outline';
import {Image} from '@shopify/hydrogen';
import {logoWhiteURL} from '~/components/HeaderMenu/menuSettings';
import SocialMediaIcons from './SocialMediaIcons';
import PaymentSection from './PaymentSection';

const FooterAccordion: React.FC<{
  title: string;
  links: {label: string; url: string}[];
}> = ({title, links}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="flex justify-between border-t border-neutral-800 uppercase tracking-[.2em] items-center w-full p-5  text-xs font-medium text-white bg-neutral-950 focus:outline-none hover:bg-neutral-950"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="w-1/3"></span>
        <span className="w-1/3 text-xs tracking-[.2em]">{title}</span>
        <div className="w-1/3 flex justify-end">
          <motion.span
            animate={{rotate: isOpen || isOpen ? 180 : 0}}
            transition={{duration: 0.2}}
          >
            <ChevronDownIcon className="w-5 h-5" />{' '}
          </motion.span>
        </div>
      </button>
      {isOpen && (
        <motion.div
          className=" pb-4 text-xs text-white tracking-[.15em]"
          initial={{height: 0}}
          animate={{height: isOpen ? 'auto' : 0}}
          transition={{duration: 0.2}}
        >
          <motion.div
            animate={isOpen ? 'expanded' : 'collapsed'}
            variants={{
              expanded: {height: 'auto', opacity: 1},
              collapsed: {height: 0, opacity: 0},
            }}
            transition={{duration: 0.2}}
            className="flex flex-col items-center"
          >
            {links.map((link) => (
              <motion.div
                variants={{
                  expanded: {
                    height: 'auto',
                    opacity: 1,
                    marginTop: '4px',
                    marginBottom: '4px',
                  },
                  collapsed: {
                    height: 0,
                    opacity: 0,
                    marginTop: '0',
                    marginBottom: '0',
                  },
                }}
                key={link.url}
                className="my-2 hover:bg-neutral-950"
              >
                <Link to={link.url}>{link.label}</Link>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

const FooterSubscribe: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <motion.div
      className="px-4 pt-2 pb-4 text-sm text-white"
      initial={{height: 0}}
      animate={{height: isOpen ? 'auto' : 0}}
      transition={{duration: 0.2}}
    >
      <motion.div
        animate={isOpen ? 'expanded' : 'collapsed'}
        variants={{
          expanded: {height: 'auto', opacity: 1},
          collapsed: {height: 0, opacity: 0},
        }}
        transition={{duration: 0.2}}
        className="flex flex-col items-center"
      >
        <motion.div
          variants={{
            expanded: {
              height: 'auto',
              opacity: 1,
              marginTop: '4px',
              marginBottom: '4px',
            },
            collapsed: {
              height: 0,
              opacity: 0,
              marginTop: '0',
              marginBottom: '0',
            },
          }}
          className="my-2 hover:bg-neutral-950"
        >
          {' '}
          <div className="p-1">
            <div className="klaviyo-form-UjQG6G"></div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const FooterMenu: React.FC = () => {
  return (
    <>
      <div className="flex flex-col flex-wrap justify-center items-center gap-2 bg-neutral-950">
        <div className="flex flex-wrap justify-center  p-4 pt-0 bg-neutral-950">
          <FooterSubscribe />
          <SocialMediaIcons />
          {menuItems.map((item) => (
            <div key={item.title} className=" w-full md:w-1/3">
              <div className="md:hidden">
                <FooterAccordion title={item.title} links={item.links} />
              </div>
              <div className="hidden md:block">
                <div className="text-white capitalize px-6 text-center">
                  <div className=" text-2xl ">{item.title}</div>
                  {item.links.map((link) => {
                    return (
                      <a
                        className="text-md block"
                        key={link.label}
                        href={link.url}
                      >
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>
        <PaymentSection />
        <div className="flex justify-center items-center my-6 rounded-full w-full">
          <a href="/">
            <span className="sr-only">MoshiProject</span>
            <Image
              data={{
                url: logoWhiteURL,
                altText: 'item.imageAlt',
              }}
              className="object-cover object-center h-12 rounded-lg"
              width={'full'}
              height={'full'}
            />
          </a>
        </div>
        <div className="text-xs text-white mb-4 text-center w-full ">
          © 2023 MoshiProject. All Rights Reserved.
        </div>
      </div>
    </>
  );
};

export default FooterMenu;
const menuItems = [
  {
    title: 'Support',
    links: [
      {label: 'Contact Us', url: '/pages/contact-us'},
      {label: 'Wash & Care', url: '/pages/wash-care'},
      {label: 'About Us', url: 'pages/about-us'},
    ],
  },
  {
    title: 'Policies',
    links: [
      {label: 'Privacy Policy', url: '/policies/privacy-policy'},
      {label: 'Refund Policy', url: '/policies/refund-policy'},
      {label: 'Terms Of Service', url: '/policies/terms-of-service'},
      {label: 'DMCA Policy', url: '/pages/dmca-policy'},
    ],
  },
];
