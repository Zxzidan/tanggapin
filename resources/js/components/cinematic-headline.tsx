import React from 'react';
import { motion } from 'framer-motion';

export interface CinematicHeadlineProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'span';
  className?: string;
  highlightText?: string;
  highlightClassName?: string;
}

/**
 * CinematicHeadline
 * Implements the prompt:
 * "Animate the headline by having each word slide up from behind an invisible mask.
 * The movement should be fast at the start and slow down at the end (Power4.out ease),
 * creating a premium, cinematic feel."
 */
export default function CinematicHeadline({
  text,
  as: Component = 'h2',
  className = '',
  highlightText,
  highlightClassName = 'text-blue-700 dark:text-blue-400',
}: CinematicHeadlineProps) {
  const words = text.split(' ');

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const wordVariants = {
    hidden: {
      y: '120%',
      opacity: 0,
    },
    visible: {
      y: '0%',
      opacity: 1,
      transition: {
        duration: 0.8,
        // Power4.out ease (easeOutQuart/Expo): rapid initial movement with smooth, refined deceleration
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <Component className={className}>
      <motion.span
        className="inline-block"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        variants={containerVariants}
      >
        {words.map((word, index) => {
          const isHighlight =
            highlightText &&
            highlightText
              .toLowerCase()
              .split(' ')
              .some((hWord) => word.toLowerCase().includes(hWord.replace(/[^a-zA-Z0-9]/g, '')));

          return (
            <span
              key={index}
              className="inline-block overflow-hidden align-top pb-1 mr-[0.25em] last:mr-0"
            >
              <motion.span
                className={`inline-block ${isHighlight ? highlightClassName : ''}`}
                variants={wordVariants}
              >
                {word}
              </motion.span>
            </span>
          );
        })}
      </motion.span>
    </Component>
  );
}
