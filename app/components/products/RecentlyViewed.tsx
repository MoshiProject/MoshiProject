import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import {Link} from '@remix-run/react';
import {Product} from './products';
import ProductCard from './ProductCard';

type RecentlyViewedProps = {
  recentlyViewed: Product[];
};

export default function RecentlyViewed({recentlyViewed}: RecentlyViewedProps) {
  return (
    <div className="mt-12 swiper-container">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Recently Viewed
      </h2>
      <Swiper
        slidesPerView={2}
        spaceBetween={10}
        breakpoints={{
          // eslint-disable-next-line @typescript-eslint/naming-convention
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          1024: {
            slidesPerView: 4,
            spaceBetween: 40,
          },
        }}
      >
        {recentlyViewed.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
