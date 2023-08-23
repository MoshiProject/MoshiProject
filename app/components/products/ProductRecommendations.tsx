import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/swiper-bundle.css';
import ProductCard from './ProductCard';
import {Product} from './products';

type ProductRecommendationsProps = {
  recommendations: Product[];
  title: string;
};

export default function ProductRecommendations({
  recommendations,
  title,
}: ProductRecommendationsProps) {
  return (
    recommendations && (
      <div className="mt-6 swiper-container">
        <h2 className="text-xl font-medium text-gray-900 mb-4 uppercase">
          {title}
        </h2>
        <Swiper
          slidesPerView={1.4}
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
    )
  );
}
