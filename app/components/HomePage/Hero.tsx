import React from 'react';
import {Link} from '../Link';
import {motion} from 'framer-motion';
import {Parallax} from 'swiper';
import ParallaxText from '../HeaderMenu/ParallaxText';
interface Props {
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  isGif?: boolean;
}

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

const Hero: React.FC<Props> = ({
  imageUrl,
  title,
  subtitle,
  isGif,
  buttonText,
}) => {
  return (
    <div className="relative w-full h-[60vh] md:h-[75vh]">
      <motion.div
        className="absolute inset-0 bg-black"
        initial={'closed'}
        animate={'open'}
      >
        <motion.img
          src={imageUrl}
          variants={imgVariants}
          alt="Hero Image of Best Sellers"
          className="w-full h-full object-cover object-center"
          style={{filter: isGif ? 'none' : 'brightness(0.7)'}}
        />
        <motion.div className="absolute inset-0 flex items-center justify-center z-10">
          <motion.ul
            key="hero container"
            variants={textContainerVariants}
            className="flex flex-col justify-center items-center text-center text-white list-none p-0 m-0"
          >
            <motion.li className="h-fit overflow-hidden">
              <motion.div
                variants={textVariants}
                className="text-5xl font-semibold md:text-8xl"
              >
                {title}
              </motion.div>
            </motion.li>
            <motion.li className="h-fit overflow-hidden">
              <motion.div
                variants={textVariants}
                className="mt-2 text-xl md:text-3xl"
              >
                {subtitle}
              </motion.div>
            </motion.li>
            <motion.li variants={buttonVariants}>
              <Link to="/collections/featured-products">
                <div className="mt-3 w-full text-lg md:text-lg font-medium bg-red-700 px-6 md:px-8 py-2 md:py-3 rounded-sm">
                  {buttonText}
                </div>
              </Link>
            </motion.li>
          </motion.ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
