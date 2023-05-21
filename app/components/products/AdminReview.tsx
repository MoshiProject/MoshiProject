import {Form} from '@remix-run/react';
import {useState} from 'react';
function AdminReview() {
  const [quantity, setQuantity] = useState('');
  return (
    <div className="flex flex-col items-center justify-center ">
      <Form
        className="rounded px-4 pt-6 pb-2 mb-4 w-full md:w-1/3 h-2/3 flex flex-col items-center justify-center"
        method="post"
      >
        <h1 className="font-semibold text-3xl mb-2 text-center">
          Generate Reviews
        </h1>

        <div className="mb-4 flex flex-col items-center justify-center w-full md:w-3/4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="quantity"
          >
            Quantity
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 focus:ring-red-500 focus:border-red-500 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="quantity"
            type="text"
            name="review_quanity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-center">
          <button
            className="bg-neutral-950 hover:bg-neutral-950 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors"
            type="submit"
          >
            Submit
          </button>
        </div>
      </Form>
    </div>
  );
}

export default AdminReview;
