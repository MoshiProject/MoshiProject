import {MediaFile} from '@shopify/hydrogen-react';
import {useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {ImageType} from '~/components/products/products';
import {Controller} from 'swiper';

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
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };

  return (
    <div className="swiper-container w-full max-w-full max-h-full h-fit flex-col">
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
        className="mySwiper w-[120%] max-w-[120%] ml-[-10%] mb-4"
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
            <SwiperSlide key={data.id || data.image.id}>
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
                if (secondSwiper !== null) secondSwiper.slideTo(i, 300, false);
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
  );
}
