import React, {Suspense, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Link} from '@remix-run/react';
import {
  ArrowPathIcon,
  ChevronDownIcon,
  TruckIcon,
  UserIcon,
} from '@heroicons/react/24/outline';
import {Image} from '@shopify/hydrogen';
import {logoWhiteURL} from '~/components/HeaderMenu/menuSettings';
import SocialMediaIcons from './SocialMediaIcons';
import PaymentSection from './PaymentSection';
import {useFetcher} from '@remix-run/react';
import {useRef} from 'react';
const FooterAccordion: React.FC<{
  title: string;
  links: {label: string; url: string}[];
}> = ({title, links}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="flex justify-between border-t border-neutral-800 uppercase tracking-[.2em] items-center w-full p-5  text-xs tracking-widest font-medium text-white bg-neutral-950 focus:outline-none hover:bg-neutral-950"
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="title-tab"
            className=" pb-4 text-xs  text-white tracking-[.15em]"
            initial={{height: 0}}
            animate={{height: isOpen ? 'auto' : 0}}
            exit={{height: 0}}
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
      </AnimatePresence>
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
          <div className="p-1"></div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

const FooterMenu: React.FC = () => {
  return (
    <Suspense>
      <div className="flex flex-col flex-wrap justify-center items-center gap-2 bg-neutral-950">
        <div className="flex  flex-wrap md:flex-nowrap justify-center  p-4 pt-0 bg-neutral-950 md:w-full  md:pl-64 md:pt-10 md:pb-16">
          {/* <FooterSubscribe /> */}
          <CustomForm />
          {menuItems.map((item) => (
            <div key={item.title} className=" w-full md:w-1/3">
              <div className="md:hidden">
                <FooterAccordion title={item.title} links={item.links} />
              </div>
              <div className="hidden md:block text-left">
                <div className="text-white tracking-widest capitalize px-6 ">
                  <div className=" text-2xl md:text-lg tracking-widest uppercase">
                    {item.title}
                  </div>
                  {item.links.map((link) => {
                    return (
                      <a
                        className="text-xs my-4 block tracking-widest"
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
        <div className="text-xs text-white mb-4 text-center w-full tracking-widest">
          © 2023 MoshiProject. All Rights Reserved.
        </div>
      </div>
    </Suspense>
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

const KlaviyoForm = () => {
  <script
    type="text/javascript"
    src="//www.klaviyo.com/media/js/public/klaviyo_subscribe.js"
  ></script>;
  {
    /* <script>{KlaviyoSubscribe.attachToForms('#email_signup', {
    hide_form_on_success: true,
    extra_properties: {
      $source: '$embed',
      $method_type: 'Klaviyo Form',
      $method_id: 'embed',
      $consent_version: 'Embed default text',
    },
  });}</script> */
  }
  return (
    <form
      id="email_signup_form"
      className="klaviyo_styling klaviyo_gdpr_embed_VPLyn8"
      action="//manage.kmail-lists.com/subscriptions/subscribe"
      data-ajax-submit="//manage.kmail-lists.com/ajax/subscriptions/subscribe"
      method="GET"
      target="_blank"
      noValidate={false}
    >
      <input type="hidden" name="g" value="VPLyn8" />
      <input type="hidden" name="$fields" value="$consent" />
      <input type="hidden" name="$list_fields" value="$consent" />
      <div className="klaviyo_field_group">
        <label htmlFor="k_id_email">Newsletter Sign Up</label>
        <input
          className=""
          type="email"
          defaultValue=""
          name="email"
          id="k_id_email"
          placeholder="Your email"
        />
        <div className="klaviyo_field_group klaviyo_form_actions">
          <div className="klaviyo_helptext">
            {' '}
            How would you like to hear from us? (please select at least one
            option){' '}
          </div>
          <input
            type="checkbox"
            name="$consent"
            id="consent-email"
            value="email"
          />
          <label htmlFor="consent-email">Email</label>
          <br />
          <input type="checkbox" name="$consent" id="consent-web" value="web" />
          <label htmlFor="consent-web">Online advertisements</label>
          <div className="klaviyo_helptext klaviyo_gdpr_text">
            {' '}
            We use email and targeted online advertising to send you product and
            services updates, promotional offers and other marketing
            communications based on the information we collect about you, such
            as your email address, general location, and purchase and website
            browsing history. <br />
            <br />
            We process your personal data as stated in our Privacy Policy . You
            may withdraw your consent or manage your preferences at any time by
            clicking the unsubscribe link at the bottom of any of our marketing
            emails, or by emailing us at .
          </div>
        </div>
      </div>
      <div className="klaviyo_messages">
        <div className="success_message"></div>
        <div className="error_message"></div>
      </div>
      <div className="klaviyo_form_actions">
        <button type="submit" className="klaviyo_submit_button">
          Subscribe
        </button>{' '}
      </div>
    </form>
  );
};
const CustomForm = () => {
  const fetcher = useFetcher();
  const ref = useRef();

  return (
    <div className="flex flex-col md:w-1/3 md:mr-20">
      <div>
        <div className="grid grid-cols-2 grid-rows-2 h-72 w-full gap-2">
          {[
            {
              icon: <TruckIcon className="h-8 w-8" />,
              text: 'Free Shipping On All Orders In the US',
            },
            {
              icon: <UserIcon className="h-8 w-8" />,
              text: 'Over 30,000 Customers',
            },
            {
              icon: (
                <svg
                  aria-hidden="true"
                  focusable="false"
                  role="presentation"
                  className="text-white h-8 w-8 fill-none stroke-white stroke-2"
                  style={{strokeWidth: '5px'}}
                  viewBox="0 0 82 82"
                >
                  <path d="M65.108 47.938c-5.807-.75-10.205-.046-13.552 1.444-.04-3.044-1.16-10.613-10.556-16.2-9.396 5.587-10.516 13.155-10.556 16.2-3.347-1.489-7.745-2.194-13.552-1.444 0 12.239 7.496 24.634 24.107 24.634L41.006 80v-7.428c16.607-.003 24.102-12.396 24.102-24.634Z"></path>
                  <path d="M60.68 63.126C71.442 62.581 80 53.682 80 42.784c0-10.849-8.488-19.691-19.182-20.309.008-.21.029-.417.029-.629C60.846 10.886 51.961 2 41 2c-10.961 0-19.847 8.885-19.847 19.846 0 .212.02.419.028.629C10.488 23.093 2 31.935 2 42.784c0 10.879 8.529 19.766 19.265 20.339"></path>
                </svg>
              ),
              text: (
                <span>
                  High Quality <br /> 100% cotton t-shirts
                </span>
              ),
            },
            {
              icon: <ArrowPathIcon className="h-8 w-8" />,
              text: '30-Day Hassle-Free Returns',
            },
          ].map((box) => {
            return (
              <div
                key={box.text}
                className="flex flex-col items-center justify-center text-white text-center font-semibold text-md"
              >
                <span className="mb-2 h-1/2 flex justify-end items-end">
                  {box.icon}
                </span>
                <span className="h-1/2">{box.text}</span>
              </div>
            );
          })}
        </div>
      </div>
      {fetcher.type === 'done' && fetcher.data.status === 200 ? (
        <div className="text-white mb-4 ">
          Successfully Submitted! Please check your inbox for a confirmation
          email. Use code{' '}
          <span className="text-md text-red-600 font-semibold">NEW10</span> for
          10% off your first order!
        </div>
      ) : (
        <div className="my-4 border-y border-neutral-800 py-8 ">
          <div className=" md:text-sm text-white md:mb-4 text-center text-2xl font-bold mb-2 md:text-left">
            Sign Up and Save
          </div>
          <div className="text-center text-md w-full text-white mb-6  md:text-left md:px-0 tracking-tight">
            {' '}
            Get 10% off your first order! Subscribe to get special offers, free
            giveaways, flash sales.
          </div>
          <div className="w-full flex justify-center md:justify-start">
            {' '}
            {fetcher.type === 'done' && fetcher.data.status !== 200 && (
              <div className="text-white">
                Invalid email or already subscribed
              </div>
            )}
            <fetcher.Form
              className="md:w-3/4 w-full "
              action="subscribe"
              method="post"
            >
              <input
                className="bg-white text-sm  border placeholder:text-neutral-400 text-neutral-850 rounded-md border-white w-full md:w-3/5 mb-2"
                type="text"
                name="email"
                id="email"
                placeholder="Email Address"
                defaultValue=""
              />
              <button className="text-primary/50 text-base bg-red-700 text-white text-center rounded-md  py-3 w-full">
                SUBSCRIBE
              </button>
            </fetcher.Form>
          </div>
        </div>
      )}
      <SocialMediaIcons />
    </div>
  );
};
