"use client";
import myImage from "/files/my_profile.png";

const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

const Hero = () => {
  return (
    <section className="pt-40 pb-20 relative">
      <div className="hero-section max-w-7xl m-auto relative flex justify-center items-center text-white overflow-hidden">
        {/* Desktop Layout */}
        <div className="hidden md:flex relative w-full justify-center items-center">
          {/* Profile Card with border + glow */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="hero-image relative w-64 md:w-72 lg:w-80 rounded-2xl shadow-2xl overflow-hidden">
              <img
                src={myImage}
                alt="Deepak Sharma"
                className="w-full h-auto object-cover rounded-xl"
              />
            </div>

            {/* Bottom Border */}
            <div
              className="w-[100%] h-1 mt-0 rounded-full"
              style={{ backgroundColor: brandColors.sky }}
            />

            {/* Elliptical Glow */}
            <div
              className="absolute bottom-0 z-0 w-[100%] h-10 pointer-events-none"
              style={{
                left: "50%",
                transform: "translateX(-50%) translateY(8px)",
                background: `radial-gradient(ellipse at center, ${brandColors.sky} 0%, transparent 80%)`,
                filter: "blur(12px)",
              }}
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
        <div className="md:hidden flex flex-col items-center gap-8 text-center">
          <h1 className="text-5xl font-extrabold">
            <span className="text-white">Sr.</span> WEB
          </h1>

          {/* Mobile Profile Card */}
          <div
            className="w-72 rounded-3xl shadow-2xl overflow-hidden"
            style={{
              background: `linear-gradient(135deg, ${brandColors.steel}, ${brandColors.sky})`,
            }}
          >
            <img
              src={myImage}
              alt="Deepak Sharma"
              className="w-full h-auto object-cover rounded-2xl"
            />
          </div>

          <h1 className="text-5xl font-extrabold">DEVELOPER</h1>
          <p className="text-lg text-gray-200 leading-relaxed max-w-sm">
            I am India based Web Developer <br /> and Freelancer
          </p>
        </div>
      </div>
    </section>
  );
};

export default Hero;
