import {useEffect, useRef, useState} from 'react';
import {useScroll, motion} from 'framer-motion';
import * as React from 'react';
function FadeOutScrollAnim({children}, start = 0.5, ...props: any[]) {
  const galleryRef = useRef(null);
  const {scrollYProgress} = useScroll({
    target: galleryRef,
    offset: ['end start', `${0.5} start`],
  });
  return (
    <motion.div
      style={{
        opacity: scrollYProgress,
      }}
      ref={galleryRef}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export default FadeOutScrollAnim;
