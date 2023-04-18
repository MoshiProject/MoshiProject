// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import {Swiper, SwiperSlide} from 'swiper/react';
import {motion} from 'framer-motion';

const animeCollections = [
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/DemonSlayer.png',
    url: '/collections/kimetsu-no-yaiba',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/download_3.png',
    url: '/collections/chainsaw-man',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/JujutsuKaisen_copy.png?v=1681789610',
    url: '/collections/jujutsu-kaisen',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Evangelion.png',
    url: '/collections/neon-genesis-evangelion',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/AoT.png',
    url: '/collections/attack-on-titan',
  },
];

const AnimeCarousel = ({
  titleStyling = 'text-2xl mt-2 font-semibold  text-center px-0.5 lg:text-2xl lg:font-semibold lg:px-4',
}) => {
  return (
    <div className="px-2 py-3">
      <h2 className={titleStyling}>Shop By Anime</h2>
      <Swiper
        className="mt-4 px-4"
        spaceBetween={16}
        slidesPerView={3.5}
        pagination={{clickable: true}}
        breakpoints={{
          // Responsive breakpoints
          640: {
            slidesPerView: 1,
            spaceBetween: 0,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
      >
        {animeCollections.map((item, index) => (
          <SwiperSlide
            className="!flex flex-col justify-center items-center h-full w-full"
            key={index}
          >
            <motion.a
              className="flex flex-col justify-center items-center h-24 w-24"
              href={item.url}
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{duration: 0.5, delay: index * 0.1}}
            >
              <motion.img
                className="w-full"
                src={item.img}
                alt={`Item ${index}`}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
              />
            </motion.a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default AnimeCarousel;
