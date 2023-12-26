import DescriptionTab from './DescriptionTab';
function ReturnInfo() {
  return (
    <DescriptionTab title={'Returns and Cancellations'} height="236px">
      <>
        {' '}
        <div className="p-1 mr-8">
          <div className="mb-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              className="h-5 w-5 fill-none text-red-600 stroke-red-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-lg">Can I return my items?</h2>
          <p className=" w-72 whitespace-normal text-xs tracking-wide h-48">
            Yes. We offer hassle free replacements for damaged or incorrect
            items. Simply contact us at the portal below or at
            contact@moshiproject.com.
          </p>
        </div>
        {/* <div className="p-1 mr-8 mt-8">
          <h2 className="mb-2 text-lg">Change of mind</h2>
          <p className=" w-72 whitespace-normal text-xs tracking-wide h-48">
            Order changes or cancellation requests can be within 24 hours of
            your order being made for any reason. If you don't like your
            purchase, no worries – we offer a straightforward 30-day refund
            policy for all clothing. Simply contact us at the portal below or at
            contact@moshiproject.com.
          </p>
        </div> */}
        <div className="p-1 mr-8 mt-8">
          <h2 className="mb-2 text-lg">Return Procedure</h2>
          <p className=" w-72 whitespace-normal text-xs tracking-wide h-48">
            On the rare occasion that you receive the wrong size/color, a refund
            can be opted for. Please email contact@moshiproject.com as soon as
            you are made aware of the issue. Include your order number, photos
            and any further information you may have.
          </p>
        </div>
      </>
    </DescriptionTab>
  );
}

export default ReturnInfo;
