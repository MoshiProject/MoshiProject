import {useEffect, useRef, useState} from 'react';
import {useScroll, motion, useSpring} from 'framer-motion';
import * as React from 'react';
function ScaleOutScrollAnim({children}, ...props: any[]) {
  const galleryRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target: galleryRef,
    offset: ['end start', `.85 start`],
  });
  const scale = useSpring(scrollYProgress, {stiffness: 100, damping: 20});
  return (
    <motion.div
      style={{opacity: scale, scale: scrollYProgress}}
      ref={galleryRef}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default ScaleOutScrollAnim;
