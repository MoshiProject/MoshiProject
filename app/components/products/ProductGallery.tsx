import {Image} from '@shopify/hydrogen-react';
import {useEffect, useState} from 'react';
import {Controller} from 'swiper';
import {Swiper, SwiperSlide} from 'swiper/react';
import {ImageType} from '~/components/products/products';

export default function ProductGallery({
  media,
  selectedImage,
}: {
  media: {
    mediaContentType: 'MODEL_3D' | 'VIDEO' | 'IMAGE' | 'EXTERNAL_VIDEO';
    image: ImageType;
    alt: string;
    id: string;
  }[];
  selectedImage: string;
}) {
  const getSelectedImageIndex = () => {
    for (let i = 0; i < media.length; i++) {
      if (media[i].image.url === selectedImage) {
        return i;
      }
    }
    return 0;
  };

  const [firstSwiper, setFirstSwiper] = useState(null);
  const [secondSwiper, setSecondSwiper] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const ind = getSelectedImageIndex();
    if (firstSwiper !== null) firstSwiper.slideTo(ind, 300, false);

    if (secondSwiper !== null) secondSwiper.slideTo(ind, 300, false);
    setCurrentIndex(ind);
  }, [selectedImage]);

  useEffect(() => {
    const imagesToBePreloaded = media.map((med) => med.image.src);
    imagesToBePreloaded.forEach((image) => {
      <img src={image} alt="" />;
    });
  }, []);

  const typeNameMap = {
    MODEL_3D: 'Model3d',
    VIDEO: 'Video',
    IMAGE: 'MediaImage',
    EXTERNAL_VIDEO: 'ExternalVideo',
  };
  const swiperSlides = media.map((med, i) => {
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
      __typename: typeNameMap[med.mediaContentType] || typeNameMap['IMAGE'],
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
          setCurrentIndex(i);
        }}
        className={`m-[4px] bg-neutral-200/50 rounded-lg p-[1px] max-w-[80px] h-[80px] ${
          currentIndex === i ? 'border border-neutral-600' : ''
        }`}
      >
        <Image
          data={data.image}
          width={
            typeof window !== 'undefined' && window.innerWidth > 600 ? 200 : 80
          }
          height={
            typeof window !== 'undefined' && window.innerWidth > 600 ? 200 : 80
          }
          className=""
          alt={data.image.altText}
        ></Image>
      </SwiperSlide>
    );
  });
  return (
    <div className="swiper-container w-full max-w-full max-h-full h-fit flex-col md:flex md:flex-row ">
      {/* desktop */}
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
          {swiperSlides}
        </Swiper>
      </div>
      {/* top swiper mobile */}
      <div className="md:w-11/12 relative">
        {' '}
        <Swiper
          modules={[Controller]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSwiper={setSecondSwiper}
          onSlideChange={(swiper) => setCurrentIndex(swiper.activeIndex)}
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
                <Image
                  data={data.image}
                  loading={'eager'}
                  sizes="100vw"
                  alt={data.image.altText}
                ></Image>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
      {/* <button
        type="button"
        className="absolute top-24 right-0 m-4 text-gray-400 hover:text-gray-500 block md:hidden"
      >
        <span className="sr-only">Close</span>
        <div className=" bg-neutral-100 shadow-md rounded-full p-2 border-neutral-200 border">
          <MagnifyingGlassIcon className="w-6 h-6 text-black" />
        </div>
      </button> */}
      <div className="md:hidden ">
        <Swiper
          className="w-full max-w-full"
          modules={[Controller]}
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          onSwiper={setFirstSwiper}
          // controller={{control: secondSwiper}}
          effect={'coverflow'}
          grabCursor={true}
          slidesPerView={4}
          coverflowEffect={{
            rotate: 50,
            stretch: 0,
            depth: 100,
            modifier: 1,
            slideShadows: false,
          }}
        >
          {swiperSlides}
        </Swiper>
      </div>
    </div>
  );
}
