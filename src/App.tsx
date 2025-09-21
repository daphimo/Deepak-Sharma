"use client";
import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import myImage from "/files/my_profile.png";

gsap.registerPlugin(ScrollTrigger);

const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

const Hero = () => {
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: ".hero-section",
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      // Image scrolls slower
      tl.to(".hero-image", { yPercent: -15, ease: "power1.out" }, 0);

      // Text scrolls faster (double speed vs before)
      tl.to(".hero-left", { yPercent: -240, ease: "power1.out" }, 0);
      tl.to(".hero-right", { yPercent: -180, ease: "power1.out" }, 0);
      tl.to(".hero-right-bottom", { yPercent: -200, ease: "power1.out" }, 0);
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="pt-40 pb-20">
      <div className="hero-section max-w-7xl m-auto relative flex justify-center items-center text-white overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden md:block relative w-full">
          {/* Profile Card */}
          <div
            className="hero-image relative z-10 mx-auto w-64 md:w-72 lg:w-80 px-4 rounded-2xl shadow-2xl"
            style={{
              background: `linear-gradient(135deg, ${brandColors.steel}, ${brandColors.sky})`,
            }}
          >
            <img
              src={myImage}
              alt="Deepak Sharma"
              className="w-full h-auto object-cover rounded-xl"
            />
          </div>

          {/* Left Text */}
          <div className="hero-left absolute top-1/2 left-[calc(50%-28rem)] -translate-y-1/2 text-left z-20">
            <h1 className="text-7xl font-extrabold leading-none whitespace-nowrap">
              <span className="text-white -mr-2">Sr.</span>{" "}
              <span className="text-white">WEB</span>
            </h1>
          </div>

          {/* Right Text */}
          <div className="hero-right absolute top-1/2 right-[calc(50%-36rem)] -translate-y-1/2 text-right z-20">
            <h1 className="text-7xl font-extrabold leading-none text-white whitespace-nowrap">
              DEVELOPER
            </h1>
          </div>
          <div className="hero-right-bottom absolute top-[60%] right-[calc(50%-36rem)] -translate-y-1/2 text-right z-20">
            <p className="text-base text-gray-200 mt-2">
              I am India based Web Developer <br /> and Freelancer
            </p>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden flex flex-col items-center gap-4 text-center">
          <span className="block text-xs tracking-widest font-medium">
            DEEPAK SHARMA
          </span>
          <h1 className="text-3xl font-extrabold">
            <span className="text-white/40">Sr.</span> WEB
          </h1>

          {/* Mobile Profile Card */}
          <div
            className="w-40 p-3 rounded-2xl shadow-xl"
            style={{
              background: `linear-gradient(135deg, ${brandColors.steel}, ${brandColors.sky})`,
            }}
          >
            <img
              src={myImage}
              alt="Deepak Sharma"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>

          <h1 className="text-3xl font-extrabold">DEVELOPER</h1>
          <p className="text-sm text-gray-200">
            I am India based Web Developer <br /> and Freelancer
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
