// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {ActionArgs, json} from '@shopify/remix-oxygen';
import {type MetaFunction, type LoaderArgs} from '@shopify/remix-oxygen';
import {type SeoHandleFunction} from '@shopify/hydrogen';
import sgMail from '@sendgrid/mail';
import {Form, useActionData} from '@remix-run/react';
import emailjs from '@emailjs/browser';
import {useRef, useState} from 'react';
const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: 'Contact Us',
  description: 'Contact Us',
});

export const handle = {
  seo,
};

export async function loader({params, context, request}: LoaderArgs) {
  sgMail.setApiKey(context.env.SENDGRID_API_KEY);

  const searchParams = new URL(request.url).searchParams;
  const sortParam = searchParams.get('sort');

  // json is a Remix utility for creating application/json responses
  // https://remix.run/docs/en/v1/utils/json
  return json({
    sortParam,
    analytics: {
      pageType: 'contact',
    },
  });
}

export const meta: MetaFunction = ({data}) => {
  return {
    title: data?.collection?.title ?? 'Collection',
    description: data?.collection?.description,
  };
};

export default function ContactUs() {
  const form = useRef();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        'service_izt8zxs',
        'template_74zpflf',
        form.current,
        '5oISPXESxOT_0drDG',
      )
      .then(
        (result) => {
          console.log(result.text);
          setSent(true);
        },
        (error) => {
          console.log(error.text);
        },
      );
  };

  return (
    <>
      {sent ? (
        <div className="flex flex-col items-center justify-center ">
          <div className="rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/3 h-2/3 flex flex-col items-center justify-center">
            <h1 className="font-semibold text-4xl mb-2">Contact Us</h1>
            <div className="flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-16 h-16 mb-4"
                viewBox="0 0 64 64"
                enableBackground="new 0 0 64 64"
              >
                <path
                  d="M32,2C15.431,2,2,15.432,2,32c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30C62,15.432,48.568,2,32,2z M25.025,50
	l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z"
                  fill="#43a047"
                />
              </svg>
              <h2 className="font-normal text-center">
                Successfully Submitted! We'll get back to you as soon as
                possible!
              </h2>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center ">
          <form
            ref={form}
            className="rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/3 h-2/3 flex flex-col items-center justify-center"
            onSubmit={sendEmail}
          >
            <h1 className="font-semibold text-4xl mb-2">Contact Us</h1>

            <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
              {' '}
              <label
                htmlFor="reason-for-contact"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Reason for Contact
              </label>
              <div className="mt-1 relative w-full">
                <select
                  id="reason-for-contact"
                  name="reason_for_contact"
                  className="block w-full py-2 pl-3 pr-10 text-basefocus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                >
                  <option>Question about Products</option>
                  <option>Report Shipping Issue</option>
                  <option>Request Tracking Update</option>
                  <option>Request Order Change / Cancellation</option>
                  <option>Report Issue with Product Received</option>
                  <option>Provide Feedback / Request Design</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6.293 7.293a1 1 0 0 1 1.414 0L10 9.586l2.293-2.293a1 1 0 0 1 1.414 1.414l-3 3a1 1 0 0 1-1.414 0l-3-3a1 1 0 0 1 0-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="user_name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                name="user_email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="order-number"
              >
                Order number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="order-number"
                type="text"
                name="order_number"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
              />
            </div>

            <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="message"
              >
                Message
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full h-64 py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>
            <div className="flex items-center justify-center">
              <button
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                type="submit"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
