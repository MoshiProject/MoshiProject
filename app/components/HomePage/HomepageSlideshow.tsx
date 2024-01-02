import React, {useState, useEffect} from 'react';
import {motion} from 'framer-motion';
import {Link} from '../Link';
const HomepageSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/t-shirt-mockup-of-a-cool-man-posing-in-a-dark-alley-2357-el1_c6b7cfa1-32fa-439e-ac4a-0013c4835b5d.webp?v=1699561269',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/1_4_3655b351-6f33-4cf0-9de4-5d3e38ad675a.webp?v=1699561270',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Homie-1.webp?v=1699607952',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/t-shirt-mockup-of-a-punk-man-covering-his-eyes-23462.webp?v=1699561270',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/1_3.webp?v=1699561270',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Homie-Eva.webp?v=1699608183',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/Mockup_of_girl_With_hand_over_head_copy_bc2df58a-1302-481f-a021-aa37468b0535.webp?v=1699561270',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/00015-3138317020.webp?v=1699561270',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/1_5.webp?v=1699561270',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/1_18.webp?v=1699561270',
    'https://cdn.shopify.com/s/files/1/0552/4121/2109/files/1_29.webp?v=1699561270',
  ];
  const announcementText = 'HOLIDAY SALE LIVE';
  const subtitleText = 'ANIME MEETS STREETEAR';
  const buttonText = 'Shop Now→';
  useEffect(() => {
    const intervalId = setInterval(() => {
      // Increment the index to display the next image
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change the interval duration as needed (4 seconds in this case)

    return () => {
      // Cleanup the interval when the component unmounts
      clearInterval(intervalId);
    };
  }, [currentImageIndex, images.length]);

  return (
    <>
      {' '}
      <div className="relative w-full h-[66vh] md:h-[75vh]">
        <motion.div
          className="absolute inset-0 bg-black"
          initial={'closed'}
          animate={'open'}
        >
          <motion.img
            src={images[currentImageIndex]}
            variants={imgVariants}
            alt="Hero Image of Best Sellers"
            className="w-full h-[66vh] object-cover brightness-75"
          />
          {/* <motion.img
            src={imageUrl}
            variants={imgVariants}
            alt="Hero Image of Best Sellers"
            className="w-full h-full object-cover object-center"
          /> */}
          <motion.div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.ul
              key="hero container"
              variants={textContainerVariants}
              className="flex flex-col justify-center items-center text-center tracking-widest text-white list-none p-0 m-0"
            >
              <motion.li className="h-fit overflow-hidden">
                <motion.div
                  variants={textVariants}
                  className=" font-semibold md:text-8xl tracking-widest flex justify-center"
                >
                  <div className="bg-red-700 text-lg px-2 rounded-sm">
                    {announcementText}
                  </div>
                </motion.div>
                <motion.div
                  variants={textVariants}
                  className="text-5xl font-semibold md:text-8xl tracking-wide leading-[48px] mt-8 px-4"
                >
                  ALL ITEMS UP TO{' '}
                  <span className="text-red-600 font-black text-6xl">70%</span>{' '}
                  OFF!
                </motion.div>
              </motion.li>
              <motion.li className="h-fit overflow-hidden">
                <motion.div
                  variants={textVariants}
                  className="mt-2 text-xl md:text-3xl tracking-widest"
                >
                  {subtitleText}
                </motion.div>
              </motion.li>
              <motion.li variants={buttonVariants}>
                <Link to="/collections/featured-products">
                  <div className="mt-8 w-full text-lg md:text-lg tracking-widest font-medium bg-red-700 px-6 md:px-8 py-2 md:py-3 rounded-sm border-white border">
                    {buttonText}
                  </div>
                </Link>
              </motion.li>
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

const stiffness = 50;
const velocity = 100;
const mass = 0.8;
const imgVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.5,
      delayChildren: 2,
      stiffness,
      mass,
      velocity,
      type: 'spring',
    },
  },
  closed: {opacity: 0, x: '-50%'},
};

const textVariants = {
  open: {
    opacity: 1,
    height: '100%',
    y: 0,
    transition: {stiffness, mass, velocity, type: 'spring'},
  },
  closed: {opacity: 0, y: '-80%', height: '0'},
};
const buttonVariants = {
  open: {
    opacity: 1,
    height: '100%',
    transition: {duration: 0.75, type: 'tween'},
  },
  closed: {opacity: 0, height: '0'},
};
const textContainerVariants = {
  open: {
    opacity: 1,
    transition: {
      delayChildren: 1.15,
      staggerChildren: 0.85,
      duration: 0.5,
      type: 'tween',
    },
  },
  closed: {opacity: 0},
};

export default HomepageSlideshow;
