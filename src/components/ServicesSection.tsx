"use client";

import { useTranslations } from "next-intl";
import { motion, Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import AnimatedButton from "@/components/AnimatedButton";
import Image from "next/image";

// Define the shape for the service items
interface ServiceItem {
  title: string;
  description: string;
  image: string;
  tags: string[];
}

// Define the shape for the floating tags to resolve the 'any' type error
interface FloatingTag {
  tag: string;
  delay: number;
  top: number;
  left: number;
}

// Variants for the section container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      delayChildren: 0.2,
    },
  },
};

// Variants for the service cards
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Variants for the floating tags
const tagVariants: Variants = {
  initial: { y: "100vh" },
  animate: {
    y: "-100vh",
    transition: {
      duration: 20,
      ease: "linear",
      repeat: Infinity,
    },
  },
};

export default function ServicesSection() {
  const t = useTranslations("services");
  const sectionRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [staggeredTags, setStaggeredTags] = useState<FloatingTag[]>([]);

  useEffect(() => {
    // Generate the tags and their positions only on the client
    const floatingTags = [
      "Next.js",
      "React",
      "Tailwind",
      "TypeScript",
      "Web Design",
      "Software Development",
      "UI/UX",
      "Frontend",
      "Backend",
      "Fullstack",
      "DevOps",
      "Framer Motion",
    ];

    const generatedTags = floatingTags.map((tag, index) => ({
      tag,
      delay: index * 0.1,
      top: Math.random() * 100,
      left: Math.random() * 100,
    }));

    setStaggeredTags(generatedTags);

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      {
        threshold: 0.2,
      }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  const serviceItems: ServiceItem[] = [
    {
      title: t("webDesign.title"),
      description: t("webDesign.description"),
      image: "/webdesign.jpg",
      tags: ["React", "Next.js", "Vue.js", "Tailwind CSS", "Figma", "GSAP"],
    },
    {
      title: t("softwareDevelopment.title"),
      description: t("softwareDevelopment.description"),
      image: "/softwaredev.jpg",
      tags: ["Node.js", "TypeScript", "Python", "Rust", "Go", "Docker", "AWS"],
    },
  ];

  return (
    <section id="services" className="relative p-8 md:p-12 bg-brand-bg">
      <div
        className="absolute inset-0 z-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {staggeredTags.map((item, index) => (
          <motion.div
            key={index}
            className="absolute z-0 px-4 py-2 text-sm text-black rounded-full backdrop-blur-sm opacity-5"
            style={{
              top: `${item.top}%`,
              left: `${item.left}%`,
            }}
            variants={tagVariants}
            initial="initial"
            animate={inView ? "animate" : "initial"}
            // FIX: Removed the invalid transition prop spread.
            // The `tagVariants` already has a transition defined,
            // and `delay` can be set directly.
            transition={{
              duration: 20,
              ease: "linear",
              repeat: Infinity,
              delay: item.delay,
            }}
          >
            {item.tag}
          </motion.div>
        ))}
      </div>

      <div
        ref={sectionRef}
        className="max-w-7xl mx-auto px-4 lg:px-8 py-12 md:py-16 lg:py-20 relative z-10"
      >
        <div className="text-center mb-12">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="inline-flex items-center px-4 py-1 rounded-full text-sm font-medium text-black bg-black/10"
          >
            {t("kicker")}
          </motion.div>
          <motion.h2
            variants={cardVariants}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight text-black font-headline mt-4"
          >
            {t("title")}
          </motion.h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "show" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {serviceItems.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="bg-white rounded-2xl p-8 shadow-lg relative overflow-hidden"
            >
              <div className="relative w-full h-[250px] md:h-[300px] mb-6 rounded-xl overflow-hidden shadow-inner">
                <Image
                  src={service.image}
                  alt={service.title}
                  layout="fill"
                  objectFit="cover"
                  className="transition-transform duration-500 hover:scale-105"
                />
              </div>

              <h3 className="text-3xl font-bold mb-4 font-headline text-black">
                {service.title}
              </h3>
              <p className="text-lg text-black/80 mb-6">
                {service.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {service.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="inline-block px-3 py-1 text-sm font-medium text-black bg-black/5 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <AnimatedButton href="#contact">
                {t("ctaPrimary")}
              </AnimatedButton>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}