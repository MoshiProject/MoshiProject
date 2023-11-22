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
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/DeathNote.png',
    url: 'https://www.moshiproject.com/collections/death-note',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/HunterXHunter.png',
    url: 'https://www.moshiproject.com/collections/hunter-x-hunter',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/My-Hero-Academia-Logo.png',
    url: 'https://www.moshiproject.com/collections/my-hero-academia',
  },
  {
    img: 'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Naruto.webp',
    url: 'https://www.moshiproject.com/collections/naruto',
  },
];

const AnimeCarousel = ({
  titleStyling = 'text-2xl md:text-4xl mt-2 tracking-widest font-semibold  text-center px-0.5 lg:text-4xl lg:font-semibold lg:px-4',
  spaceBetween = 3.5,
}) => {
  return (
    <div className="px-2 py-1 bg-white">
      <h2 className={titleStyling}>Shop By Anime</h2>
      <div className="relative">
        <div className="absolute right-0 w-12  top-0 bottom-0 "></div>
        <Swiper
          className="mt-2 px-4 md:w-3/4"
          spaceBetween={16}
          slidesPerView={spaceBetween}
          pagination={{clickable: true}}
          breakpoints={{
            // Responsive breakpoints
            640: {
              slidesPerView: 5.5,
              spaceBetween: 0,
            },
            768: {
              slidesPerView: 6,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 9,
              spaceBetween: 0,
            },
          }}
        >
          {animeCollections.map((item, index) => (
            <SwiperSlide
              className="!flex flex-col justify-center items-center h-full w-full"
              key={index}
            >
              <motion.a
                className={`flex flex-col justify-center items-center ${
                  spaceBetween > 4 ? 'h-16 w-16' : 'h-24 w-24'
                }`}
                href={item.url}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.5, delay: index * 0.1}}
              >
                <motion.img
                  className="w-full"
                  src={item.img}
                  alt={`Item ${index}`}
                  loading="lazy"
                  initial={{opacity: 0, y: 20}}
                  animate={{opacity: 1, y: 0}}
                  transition={{duration: 0.5, delay: index * 0.1}}
                />
              </motion.a>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default AnimeCarousel;
