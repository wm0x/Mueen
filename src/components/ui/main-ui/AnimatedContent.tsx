'use client';
import { motion, useInView, Variants } from "framer-motion";
import * as React from 'react';
 
export function TextFade({
  direction,
  children,
  className = '',
  staggerChildren = 0.1,
}: {
  direction: 'up' | 'down';
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
}) {
  const FADE_DOWN: Variants = {
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 20 } },
    hidden: { opacity: 0, y: direction === 'down' ? -18 : 18 },
  };

  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true });
  
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? 'show' : ''}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: staggerChildren,
          },
        },
      }}
      className={className}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child) ? (
          <motion.div variants={FADE_DOWN}>{child}</motion.div>
        ) : (
          child
        )
      )}
    </motion.div>
  );
}