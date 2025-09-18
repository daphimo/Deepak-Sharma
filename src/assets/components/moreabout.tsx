import { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";

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

const Counter: React.FC<CounterProps> = ({ end, delay = 300 }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasAnimated) {
          let start = 0;
          const duration = 2000; // 2s animation
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
          setHasAnimated(true);
          return () => clearTimeout(timeout);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [end, delay, hasAnimated]);

  return (
    <div
      ref={ref}
      style={{ color: brandColors.sky }}
      className="text-4xl font-bold"
    >
      {count}+
    </div>
  );
};

const MoreAboutMe = () => {
  return (
    <section className="bg-transparent text-white pt-12">
      {/* Stats Section */}
      <div className="flex flex-col md:flex-row gap-10 mb-10">
        <div>
          <Counter end={5} />
          <p className="text-sm mt-1">Years of Experience</p>
        </div>
        <div>
          <Counter end={150} />
          <p className="text-sm mt-1">Completed Projects</p>
        </div>
        <div>
          <Counter end={40} />
          <p className="text-sm mt-1">Clients Worldwide</p>
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-col md:flex-row gap-10">
        <div className="mb-6">
          <p className="font-semibold">Call Today:</p>
          <p className="text-gray-300">+91 942 701 1442</p>
        </div>
        <div className="mb-6">
          <p className="font-semibold">Email:</p>
          <p className="text-gray-300">deepakrajeshsharma987654321@gmail.com</p>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex gap-6 mt-6">
        <a
          href="https://www.linkedin.com/in/deepak-sharma-97954a211/"
          target="_blank"
          aria-label="LinkedIn"
          rel="noopener noreferrer"
          className="hover:text-sky-400 transition-colors"
        >
          <FaLinkedin className="text-2xl" />
        </a>
        <a
          href="https://github.com/daphimo"
          target="_blank"
          aria-label="GitHub"
          rel="noopener noreferrer"
          className="hover:text-sky-400 transition-colors"
        >
          <FaGithub className="text-2xl" />
        </a>
      </div>
    </section>
  );
};

export default MoreAboutMe;
