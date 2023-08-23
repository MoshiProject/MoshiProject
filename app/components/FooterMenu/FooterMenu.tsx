import React, {Suspense, useState} from 'react';
import {AnimatePresence, motion} from 'framer-motion';
import {Link} from '@remix-run/react';
import {ChevronDownIcon} from '@heroicons/react/24/outline';
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
      {fetcher.type === 'done' && fetcher.data.status === 200 ? (
        <div className="text-white ">
          Successfully Submitted! Please check your inbox for a confirmation
          email.
        </div>
      ) : (
        <div className="my-4 ">
          <div className="tracking-widest md:text-sm text-white md:mb-4 text-center text-xs mb-2 md:text-left">
            SIGN UP AND SAVE
          </div>
          <div className="text-center text-xs w-full text-white mb-6 px-8 md:text-left md:px-0">
            {' '}
            Subscribe to get special offers, free giveaways, and
            once-in-a-lifetime deals.
          </div>
          <div className="w-full flex justify-center md:justify-start">
            {' '}
            {fetcher.type === 'done' && fetcher.data.status !== 200 && (
              <div className="text-white">
                Invalid email or already subscribed
              </div>
            )}
            <fetcher.Form className="md:w-3/4" action="subscribe" method="post">
              <input
                className="bg-neutral-950 text-sm border-0 border-b placeholder:text-neutral-50 text-white border-white md:w-3/5"
                type="text"
                name="email"
                id="email"
                placeholder="Enter Your Email"
                defaultValue=""
              />
              <button className="text-left text-primary/50 ml-6 text-sm bg-neutral-950 text-white border-white border rounded-md p-4 py-3">
                Subscribe
              </button>
            </fetcher.Form>
          </div>
        </div>
      )}
      <SocialMediaIcons />
    </div>
  );
};
