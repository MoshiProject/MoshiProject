import React, {useState} from 'react';
import '@shopify/shopify-api/adapters/cf-worker';
import {shopifyApi, LATEST_API_VERSION} from '@shopify/shopify-api';
import {LoaderArgs} from '@shopify/remix-oxygen';
import {defer} from '@shopify/remix-oxygen';
import EasyPost from '@easypost/api';
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {ActionArgs, json} from '@shopify/remix-oxygen';
import {type MetaFunction} from '@shopify/remix-oxygen';
import {type SeoHandleFunction} from '@shopify/hydrogen';
import sgMail from '@sendgrid/mail';
import {Form, useActionData} from '@remix-run/react';
import emailjs from '@emailjs/browser';
import {useRef} from 'react';
const seo: SeoHandleFunction<typeof loader> = ({data}) => ({
  title: 'Contact Us',
  description: 'Contact Us',
});

export const handle = {
  seo,
};

export const meta: MetaFunction = ({data}) => {
  return {
    title: data?.collection?.title ?? 'Collection',
    description: data?.collection?.description,
  };
};

export async function loader({request, context, params}: LoaderArgs) {
  const userEmail = 'robert.c.bradshaw827@gmail.com';
  const query = `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/${LATEST_API_VERSION}/orders.json?email=${userEmail}`;
  // Make a GET request to the Shopify Admin API to fetch a product
  const response = await fetch(query, {
    headers: {
      'X-Shopify-Access-Token': context.env.ADMIN_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });

  //   console.log(await response.json());
  //   console.log(query);
  // use sessionId to retrieve session from app's session storage
  // getSessionFromStorage() must be provided by application

  return defer({});
}

export async function action({request, context, params}: ActionArgs) {
  const body = await request.formData();
  const userEmail = body.get('user_email');
  const orderNumber = body.get('order_number');

  const query = `https://${context.env.PUBLIC_STORE_DOMAIN}/admin/api/${LATEST_API_VERSION}/orders.json?fields=created_at,id,shipping_lines,order_number,fulfillments,customer,shipping_address,line_items,fulfillment_status,name,total-price,email&status=any&email=${userEmail}`;
  // Make a GET request to the Shopify Admin API to fetch a product
  const response = await fetch(query, {
    headers: {
      'X-Shopify-Access-Token': context.env.ADMIN_API_ACCESS_TOKEN,
      'Content-Type': 'application/json',
    },
  });
  const user = await response.json();

  const order = user.orders.filter((ord) => {
    return ord.order_number === Number(orderNumber);
  })[0];

  return order;
}
function OrderDetails() {
  const order = useActionData();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState(1);
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <>
      {order ? (
        <div className="flex flex-col justify-center ">
          <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/3 h-fit flex flex-col items-center justify-center">
            <div className="w-full">
              <h1 className="font-medium text-2xl mb-2">
                Order #{order.order_number}
              </h1>
            </div>

            <div className="flex flex-col items-center">
              {/* <svg
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
              </svg> */}
              {/** Customer Name */}
              <div className="border border-neutral-300 p-3 rounded-md flex flex-col items-center w-full mb-4">
                {order.fulfillments.length != 0 ? (
                  // order.fulfillments.map((order_package) => {
                  //   return (
                  //     <div key={order_package.name}>
                  //       {' '}
                  //       <div>
                  //         Shipment Status: {order_package.shipment_status}
                  //       </div>
                  //       <div>
                  //         Tracking Company: {order_package.tracking_company}
                  //       </div>
                  //       <div>
                  //         Tracking Number:{' '}
                  //         <a
                  //           className=" text-red-600 underline"
                  //           href={order_package.tracking_url}
                  //         >
                  //           {order_package.tracking_number}
                  //         </a>
                  //       </div>
                  //       {/* <div className="shadow-sm rounded-xl border border-neutral-300 mt-2 pt-2">
                  //         <h2 className="underline text-2xl font-semibold">
                  //           Items
                  //         </h2>
                  //         <div className="p-4 pt-2">
                  //           {order_package.line_items.map((item) => {
                  //             return (
                  //               <>
                  //                 <div className=" text-sm">
                  //                   {item.name} x {item.quantity}{' '}
                  //                   <span className="text-xs pl-2">
                  //                     ${item.price}
                  //                   </span>
                  //                 </div>
                  //               </>
                  //             );
                  //           })}
                  //         </div>
                  //         <div className="font-normal text-center py-2 border-t border-neutral-200">
                  //           Total Price: {order.total_price}
                  //         </div>
                  //       </div> */}
                  //     </div>
                  //   );
                  // })
                  <div key={order.fulfillments[0].name}>
                    {' '}
                    <div className=" capitalize font-medium">
                      Shipment Status:{' '}
                      <span className="font-normal text-sm">
                        {order.fulfillments[0].shipment_status}
                      </span>
                    </div>
                    <div className=" capitalize font-medium">
                      Tracking Company:{' '}
                      <span className="font-normal text-sm">
                        {order.fulfillments[0].tracking_company}
                      </span>
                    </div>
                    <div className=" capitalize font-medium">
                      Tracking Number:{' '}
                      <span className="font-normal text-sm">
                        <a
                          className=" text-red-600 underline"
                          href={order.fulfillments[0].tracking_url}
                        >
                          {order.fulfillments[0].tracking_number}
                        </a>
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    {' '}
                    <div className=" capitalize">
                      Shipment Status: In Fulfillment
                    </div>
                  </div>
                )}
              </div>
              <div className=" rounded-md border border-neutral-300 p-3 w-full">
                {' '}
                <h2 className="text-base font-medium">Customer Information</h2>
                <div className="text-sm">
                  {order.customer.first_name} {order.customer.last_name}
                </div>
                {/** Customer Email */}
                <div className="text-sm">{order.customer.email}</div>
                <div className="text-base font-medium mt-2">
                  Shipping Information
                </div>
                {/** Shipping Address */}
                <div className="text-sm">
                  {order.shipping_address.first_name}{' '}
                  {order.shipping_address.last_name}
                </div>
                <div className="text-sm">{order.shipping_address.address1}</div>
                <div className="text-sm">
                  {order.shipping_address.city}{' '}
                  {order.shipping_address.province
                    ? order.shipping_address.province
                    : ''}{' '}
                  {order.shipping_address.zip ? order.shipping_address.zip : ''}{' '}
                </div>
                <div>{order.shipping_address.country}</div>
                <div className="text-base font-medium mt-2">
                  Shipping Method
                </div>
                <div className="text-sm">{order.shipping_lines[0].code}</div>
              </div>
              {/** Shipping Code */}

              {/** Order Date */}
              {/** Show Order Items Accordion*/}
              {/** Total Price */}

              <div className="font-normal text-center"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center ">
          <Form
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full md:w-1/3 h-2/3 flex flex-col items-center justify-center"
            method="post"
          >
            <h1 className="font-semibold text-4xl mb-2">Track Your Order</h1>

            <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Order Number
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                name="order_number"
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

            <div className="flex items-center justify-center">
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
                type="submit"
              >
                Track
              </button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
}

export default OrderDetails;
