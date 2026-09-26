import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

/**
 * AuroraCharacterBackground
 * 
 * Refined Minimalist Character:
 * - Floating gracefully on the upper right of the hero canvas without obstructing text
 * - Diffused glowing sphere with soft cyan, violet, and soft blue gradients
 * - High curved eyebrows, dot eyes with glance parallax, and "L" shaped nose line
 * - Calming neutral expression
 * - Smooth fade-out mask at the bottom so the hero section blends seamlessly into the next section
 * - No harsh borders or awkward cut-offs
 */
export default function AuroraCharacterBackground() {
  const [isBlinking, setIsBlinking] = useState(false);

  // Mouse coordinate motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for gentle head float and parallax
  const headX = useSpring(mouseX, { damping: 28, stiffness: 80, mass: 0.8 });
  const headY = useSpring(mouseY, { damping: 28, stiffness: 80, mass: 0.8 });

  // Face elements move slightly for subtle 3D depth
  const faceX = useSpring(mouseX, { damping: 22, stiffness: 120, mass: 0.6 });
  const faceY = useSpring(mouseY, { damping: 22, stiffness: 120, mass: 0.6 });

  // Eyes look subtly towards cursor
  const eyeX = useSpring(mouseX, { damping: 18, stiffness: 150 });
  const eyeY = useSpring(mouseY, { damping: 18, stiffness: 150 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const normX = (e.clientX - innerWidth / 2) / (innerWidth / 2);
      const normY = (e.clientY - innerHeight / 2) / (innerHeight / 2);

      mouseX.set(normX * 25);
      mouseY.set(normY * 20);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 5000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(blinkInterval);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      style={{
        maskImage:
          'linear-gradient(to bottom, black 65%, rgba(0,0,0,0.6) 80%, transparent 100%)',
        WebkitMaskImage:
          'linear-gradient(to bottom, black 65%, rgba(0,0,0,0.6) 80%, transparent 100%)',
      }}
    >
      {/* 1. Base Transparent / Theme Canvas */}
      <div className="absolute inset-0 pointer-events-none" />

      {/* 2. Soft, ultra-diffused atmospheric blue glow with deep radial falloff */}
      <div className="absolute top-[4%] sm:top-[8%] lg:top-[10%] right-[4%] sm:right-[8%] lg:right-[10%] w-[500px] sm:w-[650px] h-[500px] sm:h-[650px] rounded-full bg-gradient-to-br from-blue-400/20 via-blue-600/10 to-transparent blur-[120px] dark:from-blue-500/15 dark:via-blue-900/10 pointer-events-none" />

      {/* 3. Floating Minimalist Character (Head Only) */}
      {/* Positioned comfortably centered vertically alongside the headline block */}
      <div className="absolute top-[20%] sm:top-[24%] lg:top-[26%] right-[5%] sm:right-[8%] lg:right-[11%] flex items-center justify-center opacity-90 sm:opacity-95">
        <motion.div
          animate={{
            y: [-8, 8, -8],
            rotate: [-1, 1, -1],
          }}
          transition={{
            duration: 6.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{
            x: headX,
            y: headY,
          }}
          className="relative flex items-center justify-center cursor-default"
        >
          {/* Diffused Outer Aurora Halo with soft foggy edges - Pure Blue & Neutral */}
          <motion.div
            animate={{
              scale: [1, 1.06, 1],
              opacity: [0.45, 0.65, 0.45],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute size-[280px] sm:size-[360px] rounded-full blur-[60px] pointer-events-none"
            style={{
              background:
                'radial-gradient(circle at 45% 45%, rgba(96, 165, 250, 0.45), rgba(59, 130, 246, 0.3) 50%, rgba(30, 58, 138, 0.15) 70%, transparent 85%)',
            }}
          />

          {/* Secondary subtle wave - Pure Blue */}
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
            className="absolute size-[220px] sm:size-[280px] rounded-full blur-[40px] opacity-50 pointer-events-none"
            style={{
              background:
                'conic-gradient(from 0deg, rgba(147, 197, 253, 0.3), rgba(59, 130, 246, 0.35), rgba(30, 64, 175, 0.25), rgba(147, 197, 253, 0.3))',
            }}
          />

          {/* Main Diffused Glowing Sphere (Translucent, 3D Render Soft Light - Pure Blue & White) */}
          <div
            className="relative size-[170px] sm:size-[210px] rounded-full shadow-[0_20px_50px_-10px_rgba(37,99,235,0.25)] flex items-center justify-center overflow-hidden border border-white/80 dark:border-white/25 backdrop-blur-md"
            style={{
              background:
                'radial-gradient(circle at 35% 30%, rgba(255, 255, 255, 0.98) 0%, rgba(191, 219, 254, 0.85) 24%, rgba(96, 165, 250, 0.8) 55%, rgba(37, 99, 235, 0.75) 80%, rgba(30, 58, 138, 0.85) 100%)',
            }}
          >
            {/* Top Specular 3D Reflection Arc */}
            <div
              className="absolute top-2.5 left-5 w-16 h-8 rounded-full blur-xs opacity-80 transform -rotate-12 pointer-events-none"
              style={{
                background:
                  'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.98), transparent 75%)',
              }}
            />

            {/* Notion-Style Minimalist Vector Face Elements */}
            <motion.div
              style={{
                x: faceX,
                y: faceY,
              }}
              className="relative w-full h-full flex flex-col items-center justify-center pointer-events-none select-none"
            >
              <svg
                viewBox="0 0 200 200"
                className="w-full h-full drop-shadow-[0_2px_8px_rgba(255,255,255,0.8)]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* 1. Distinct Notion-style High Curved Eyebrows */}
                <path
                  d="M 52 74 C 62 58, 82 60, 88 72"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  className="transition-all"
                />
                <path
                  d="M 112 72 C 118 60, 138 58, 148 74"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  className="transition-all"
                />

                {/* 2. Simple Dot Eyes with Cursor Glance */}
                {isBlinking ? (
                  <>
                    <line
                      x1="66"
                      y1="90"
                      x2="76"
                      y2="90"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    <line
                      x1="124"
                      y1="90"
                      x2="134"
                      y2="90"
                      stroke="#ffffff"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </>
                ) : (
                  <>
                    <motion.circle
                      cx="71"
                      cy="90"
                      r="4.5"
                      fill="#ffffff"
                      style={{
                        x: eyeX,
                        y: eyeY,
                      }}
                    />
                    <motion.circle
                      cx="129"
                      cy="90"
                      r="4.5"
                      fill="#ffffff"
                      style={{
                        x: eyeX,
                        y: eyeY,
                      }}
                    />
                  </>
                )}

                {/* 3. Prominent "L" Shaped Nose Line */}
                <path
                  d="M 100 82 L 100 108 L 111 108"
                  stroke="#ffffff"
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* 4. Neutral & Calm Expression Mouth Line */}
                <path
                  d="M 88 130 Q 100 133 112 130"
                  stroke="#ffffff"
                  strokeWidth="2.8"
                  strokeLinecap="round"
                />

                {/* Subtle Blue Tint Blush */}
                <circle
                  cx="58"
                  cy="106"
                  r="10"
                  fill="rgba(147, 197, 253, 0.25)"
                  className="blur-xs"
                />
                <circle
                  cx="142"
                  cy="106"
                  r="10"
                  fill="rgba(147, 197, 253, 0.25)"
                  className="blur-xs"
                />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
