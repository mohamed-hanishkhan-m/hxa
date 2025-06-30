// components/DiscountCarousel.jsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const images = [
  "https://firebasestorage.googleapis.com/v0/b/hxa-shopping.firebasestorage.app/o/Discounts%2Fdiscount3.png?alt=media&token=cc5d40ff-0bbc-48a6-af9b-0d516918ec1e",
  "https://firebasestorage.googleapis.com/v0/b/hxa-shopping.firebasestorage.app/o/Discounts%2Fdiscount1.png?alt=media&token=3295281f-3b81-43cc-af99-1463b5cd93b8",
];

const DiscountCarousel = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="w-full overflow-hidden relative">
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={images[index]}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src={images[index]}
              alt={`Discount ${index + 1}`}
              fill
              className="object-fit"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};

export default DiscountCarousel;
