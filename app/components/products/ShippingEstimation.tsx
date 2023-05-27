import React, {useState} from 'react';

interface ShippingEstimationProps {}

const ShippingEstimation: React.FC<ShippingEstimationProps> = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const estimatedLowDeliveryDate = new Date(currentDate);
  estimatedLowDeliveryDate.setDate(currentDate.getDate() + 4); // Add 5-8 days to current date
  const estimatedHighDeliveryDate = new Date(currentDate);
  estimatedHighDeliveryDate.setDate(currentDate.getDate() + 8); // Add 5-8 days to current date
  return (
    <div className="flex justify-center">
      <span className="text-xs text-center font-medium text-neutral-600">
        Estimated Delivery between{' '}
        <span className=" font-bold text-black">
          {estimatedLowDeliveryDate
            .toDateString()
            .split(' ')
            .slice(0, 3)
            .join(' ')}
        </span>{' '}
        to{' '}
        <span className=" font-bold text-black">
          {' '}
          {estimatedHighDeliveryDate
            .toDateString()
            .split(' ')
            .slice(0, 3)
            .join(' ')}
        </span>
      </span>
    </div>
  );
};

export default ShippingEstimation;
