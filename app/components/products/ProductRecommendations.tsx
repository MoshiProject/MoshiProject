import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import {Link} from '@remix-run/react';
import {Product} from './products';
import ProductCard from './ProductCard';

type ProductRecommendationsProps = {
  recommendations: Product[];
};

export default function ProductRecommendations({
  recommendations,
}: ProductRecommendationsProps) {
  return (
    <div className="mt-12 swiper-container">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        You may also like
      </h2>
      <Swiper
        slidesPerView={2}
        spaceBetween={10}
        breakpoints={{
          // eslint-disable-next-line @typescript-eslint/naming-convention
          640: {
            slidesPerView: 2.3,
            spaceBetween: 20,
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          768: {
            slidesPerView: 4.3,
            spaceBetween: 30,
          },
          // eslint-disable-next-line @typescript-eslint/naming-convention
          1024: {
            slidesPerView: 6.3,
            spaceBetween: 40,
          },
        }}
      >
        {recommendations.map((product) => (
          <SwiperSlide key={product.id}>
            <ProductCard product={product} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
