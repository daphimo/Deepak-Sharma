"use client";

import { useEffect, useRef, useState } from "react";
import myImage from "/files/my_profile.png";

const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

type CounterProps = {
  end: number;
  delay?: number;
};
const Counter: React.FC<CounterProps & { suffix?: string }> = ({
  end,
  delay = 300,
  suffix,
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const hasAnimatedRef = useRef(false); // <-- useRef to persist across renders

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimatedRef.current) {
          let start = 0;
          const duration = 2000;
          const increment = end / (duration / 16);

          const timeout = setTimeout(() => {
            const step = () => {
              start += increment;
              if (start < end) {
                setCount(Math.ceil(start));
                requestAnimationFrame(step);
              } else {
                setCount(end);
              }
            };
            step();
          }, delay);

          hasAnimatedRef.current = true; // mark as animated
          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [end, delay]);

  return (
    <div
      ref={ref}
      style={{ color: brandColors.sky }}
      className="text-4xl md:text-5xl lg:text-6xl font-bold"
    >
      {count}
      {suffix}
    </div>
  );
};


const statsData = [
  {
    end: 10000,
    suffix: "+",
    title: "User Reach / Traffic Impact",
    description: "Websites and apps serving large, engaged audiences.",
    desktopPosition: "top-[10%] left-[15%]",
  },
  {
    end: 5,
    suffix: "+",
    title: "Years of Experience",
    description: "Building modern, responsive web applications.",
    desktopPosition: "top-[10%] right-[15%]",
  },
  {
    end: 60,
    suffix: "%",
    title: "Performance Improvements",
    description: "Optimized speed for better user experience.",
    desktopPosition: "top-1/2 -translate-y-1/2 left-[5%]",
  },
  {
    end: 150,
    suffix: "+",
    title: "Completed Projects",
    description: "Delivering creative and functional digital solutions.",
    desktopPosition: "top-1/2 -translate-y-1/2 right-[5%]",
  },
  {
    end: 40,
    suffix: "+",
    title: "Clients Worldwide",
    description: "Providing custom web solutions across industries.",
    desktopPosition: "bottom-[5%] right-[15%]",
  },
  {
    end: 30,
    suffix: "%",
    title: "Conversion / Business Impact",
    description: "Enhancing websites to drive meaningful results.",
    desktopPosition: "bottom-[5%] left-[15%]",
  },
];

const App = () => {
  return (
    <main className="bg-dark min-h-screen max-w-7xl mx-auto text-white flex flex-col items-center px-4  pb-20 pt-40">
      {/* Hero Intro */}
      <section className="text-center mb-16">
        <h1 className="text-6xl uppercase leading-tight">
          Hello, I am <span className="text-sky-400 font-extrabold ">Deepak Sharma</span>
         <br/> <span className="text-sky-400 font-extrabold ">Web Developer</span>
        </h1>
      </section>

      {/* Stats Section */}
      <section className="relative w-full flex flex-col items-center min-h-[600px] md:min-h-[700px]">
        {/* Center Image */}
        <div className="w-64 mb-8 md:mb-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
          <div className="relative shadow-2xl overflow-hidden">
            <img
              src={myImage}
              alt="Deepak Sharma"
              className="w-full h-auto object-cover"
            />
            <div
              className="absolute bottom-0 w-full h-10 pointer-events-none"
              style={{
                left: "50%",
                transform: "translateX(-50%) translateY(8px)",
                background: `radial-gradient(ellipse at center, ${brandColors.sky} 0%, transparent 80%)`,
                filter: "blur(12px)",
              }}
            />
          </div>
        </div>

        {/* Mobile Stacked Stats */}
        <div className="grid grid-cols-2 gap-6 w-full md:hidden mt-8">
          {statsData.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <Counter end={stat.end} suffix={stat.suffix} />
              <p className="text-gray-300 text-lg text-center">{stat.title}</p>
            </div>
          ))}
        </div>

        {/* Desktop Absolute Stats */}
        <div className="hidden md:block">
          {statsData.map((stat, idx) => (
            <div
              key={idx}
              className={`absolute flex flex-col items-center gap-1 max-w-[300px] ${stat.desktopPosition}`}
            >
              <Counter end={stat.end} suffix={stat.suffix} />
              <p className="text-gray-300 text-lg md:text-xl text-center">
                {stat.title}
              </p>
              <p className="text-gray-400 text-sm md:text-base text-center">
                {stat.description}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default App;
