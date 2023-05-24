import {MediaFile} from '@shopify/hydrogen-react';
import {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {ImageType} from '~/components/products/products';
import {Controller} from 'swiper';
import ImageModal from './ImageModal';
import {
  MagnifyingGlassCircleIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

export default function ProductGallery({
  media,
}: {
  media: {
    mediaContentType: 'MODEL_3D' | 'VIDEO' | 'IMAGE' | 'EXTERNAL_VIDEO';
    image: ImageType;
    alt: string;
    id: string;
  }[];
}) {
  const [firstSwiper, setFirstSwiper] = useState(null);
  const [secondSwiper, setSecondSwiper] = useState(null);
  console.log('first', firstSwiper);
  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };
  return (
    <div className="swiper-container w-full max-w-full max-h-full h-fit flex-col md:flex md:flex-row">
      <div className="hidden md:block w-fit">
        <Swiper
          modules={[Controller]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSwiper={setFirstSwiper}
          // controller={{control: secondSwiper}}
          effect={'coverflow'}
          grabCursor={true}
          slidesPerView={3}
          direction="vertical"
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          className="w-fit max-w-fit"
        >
          {media.map((med, i) => {
            let extraProps = {};

            if (med.mediaContentType === 'MODEL_3D') {
              extraProps = {
                interactionPromptThreshold: '0',
                ar: true,
                loading: 'eager',
                disableZoom: true,
                style: {height: '100%', margin: '0 auto'},
              };
            }

            const data = {
              ...med,
              __typename:
                typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
              image: {
                ...med.image,
                altText: med.alt || 'Product image',
              },
            };

            return (
              <SwiperSlide
                key={data.id || data.image.id}
                onClick={() => {
                  if (firstSwiper !== null) firstSwiper.slideTo(i, 300, false);
                  if (secondSwiper !== null)
                    secondSwiper.slideTo(i, 300, false);
                }}
              >
                <MediaFile
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  data={data}
                  {...extraProps}
                  className="md:h-24"
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <div className="w-11/12">
        {' '}
        <Swiper
          modules={[Controller]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSwiper={setSecondSwiper}
          controller={{control: firstSwiper}}
          effect={'slide'}
          grabCursor={true}
          slidesPerView={'auto'}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          className="mySwiper w-[120%]  max-w-[120%] ml-[-10%] mb-4 md:w-full md:w-max-full "
        >
          {media.map((med, i) => {
            console.log('med', med);
            let extraProps = {};

            if (med.mediaContentType === 'MODEL_3D') {
              extraProps = {
                interactionPromptThreshold: '0',
                ar: true,
                loading: 'eager',
                disableZoom: true,
                style: {height: '100%', margin: '0 auto'},
              };
            }

            const data = {
              ...med,
              __typename:
                typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
              image: {
                ...med.image,
                altText: med.alt || 'Product image',
              },
            };

            return (
              <SwiperSlide key={data.id || data.image.id}>
                <ImageModal data={data}></ImageModal>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      <button
        type="button"
        className="absolute top-24 right-0 m-4 text-gray-400 hover:text-gray-500 block md:hidden"
      >
        <span className="sr-only">Close</span>
        <div className=" bg-neutral-100 shadow-md rounded-full p-2 border-neutral-200 border">
          <MagnifyingGlassIcon className="w-6 h-6 text-black" />
        </div>
      </button>
      <div className="md:hidden">
        <Swiper
          modules={[Controller]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSwiper={setFirstSwiper}
          // controller={{control: secondSwiper}}
          effect={'coverflow'}
          grabCursor={true}
          slidesPerView={5}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
          className="w-full max-w-full"
        >
          {media.map((med, i) => {
            let extraProps = {};

            if (med.mediaContentType === 'MODEL_3D') {
              extraProps = {
                interactionPromptThreshold: '0',
                ar: true,
                loading: 'eager',
                disableZoom: true,
                style: {height: '100%', margin: '0 auto'},
              };
            }

            const data = {
              ...med,
              __typename:
                typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
              image: {
                ...med.image,
                altText: med.alt || 'Product image',
              },
            };

            return (
              <SwiperSlide
                key={data.id || data.image.id}
                onClick={() => {
                  if (firstSwiper !== null) firstSwiper.slideTo(i, 300, false);
                  if (secondSwiper !== null)
                    secondSwiper.slideTo(i, 300, false);
                }}
              >
                <MediaFile
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  //@ts-ignore
                  data={data}
                  {...extraProps}
                />
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </div>
  );
}
