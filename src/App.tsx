"use client";

import { useEffect, useRef, useState } from "react";
import myImage from "/files/my_profile.png";
import { supabase } from "./lib/supabaseClient";

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
          const duration = 500;
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
      style={{ color: "var(--primary)" }}
      className="text-4xl md:text-5xl lg:text-6xl font-bold"
    >
      {count}
      {suffix}
    </div>
  );
};


const statsData = [
  {
    end: 95,
    suffix: "%",
    title: "SEO SCORE IMPROVEMENT",
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
    end: 80,
    suffix: "%",
    title: "Performance Improvements",
    description: "Optimized speed for better user experience.",
    desktopPosition: "top-1/2 -translate-y-1/2 left-[5%]",
  },
  {
    end: 40,
    suffix: "+",
    title: "Completed Projects",
    description: "Delivering creative and functional digital solutions.",
    desktopPosition: "top-1/2 -translate-y-1/2 right-[5%]",
  },
  {
    end: 10,
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
  const [profileImage, setProfileImage] = useState<string>(myImage);

  useEffect(() => {
    const fetchProfileImage = async () => {
      const { data, error } = await supabase
        .from("Contents")
        .select("image")
        .limit(1)
        .maybeSingle();

      if (!error && data?.image) {
        setProfileImage(data.image);
      }
    };

    fetchProfileImage();
  }, []);

  return (
    <main className="min-h-screen max-w-7xl mx-auto flex flex-col items-center px-4 pb-20 pt-28 text-[var(--foreground)] transition-colors duration-500">
      {/* Hero Intro */}
      <section className="text-center mb-4">
        <h1 className="text-4xl md:text-6xl uppercase leading-tight">
          Hello, I am <span className="text-sky-400 font-bold ">Deepak Sharma</span>
         <br/> <span className="text-sky-400 font-bold ">Web Developer</span>
        </h1>
      </section>

      {/* Stats Section */}
      <section className="relative w-full flex flex-col items-center min-h-[600px] md:min-h-[700px]">
        {/* Center Image */}
        <div className="w-64 mb-8 md:mb-0 md:absolute md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
          <div className="relative overflow-hidden">
            <img
              src={profileImage}
              alt="Deepak Sharma"
              className="w-full h-auto object-cover"
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
