import DescriptionTab from './DescriptionTab';
function ShippingInfo() {
  return (
    <DescriptionTab title={'Tracking and Shipping'} height="192px">
      <>
        {' '}
        <div className="p-1 mr-8">
          <div className="mb-3">
            <svg
              aria-hidden="true"
              focusable="false"
              role="presentation"
              className="h-5 w-5 fill-none text-red-600 stroke-red-600"
              viewBox="0 0 24 24"
            >
              <path
                d="M7 19a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm10 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"
                strokeMiterlimit="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M14 17V6.6a.6.6 0 0 0-.6-.6H2.6a.6.6 0 0 0-.6.6v9.8a.6.6 0 0 0 .6.6h2.05M14 17H9.05M14 9h5.61a.6.6 0 0 1 .548.356l1.79 4.028a.6.6 0 0 1 .052.243V16.4a.6.6 0 0 1-.6.6h-1.9M14 17h1"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-lg">Order Tracking</h2>
          <p className=" w-72 whitespace-normal text-xs tracking-wide h-40">
            Please allow 1 to 3 business days for all items to be made before
            shipment. After your item(s) have been processed, you will receive a
            tracking code in your email. If your order is shipped in multiple
            packages, you will get a tracking number for each.
          </p>
        </div>
        <div className="p-1 mr-8 mt-8">
          <h2 className="mb-2 text-lg">Shipping Times</h2>
          <p className=" w-72 whitespace-normal text-xs tracking-wide h-40">
            We custom make every order in-house. Please allow 1 to 3 business
            days for all clothing items to be made before shipment. Deliveries
            typically take 2-4 days after fulfillment.
          </p>
        </div>
        <div className="p-1 mr-8 mt-8">
          <h2 className="mb-2 text-lg">Multi-item orders</h2>
          <p className=" w-72 whitespace-normal text-xs tracking-wide h-40">
            Orders containing more than one product might be delivered at a
            different time due to providers and stock.
          </p>
        </div>
      </>
    </DescriptionTab>
  );
}

export default ShippingInfo;
