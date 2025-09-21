// App.tsx
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WhatIDo from "./whatrrado.tsx";
import MoreAbout from "./moreabout.tsx";

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_MIN_WIDTH = 768;

const images = [
  "/files/my_profile.png",
  "/files/what_i_do.jpg",
  "/files/more_about_me.jpg",
];

const App: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const moverRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const cellRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [isMobile, setIsMobile] = useState<boolean>(
    typeof window !== "undefined"
      ? window.innerWidth < DESKTOP_MIN_WIDTH
      : false
  );

  const [currentImage, setCurrentImage] = useState(0);

  const computeCenters = () => {
    const centers: { left: number; top: number }[] = [];
    const docScroll = window.scrollY || window.pageYOffset;
    for (let el of cellRefs.current) {
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const left = rect.left + rect.width / 2 + window.scrollX;
      const top = rect.top + rect.height / 2 + docScroll;
      centers.push({ left, top });
    }
    return centers;
  };

  useEffect(() => {
    const onResize = () => {
      setIsMobile(window.innerWidth < DESKTOP_MIN_WIDTH);
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !moverRef.current || isMobile) return;

    let centers = computeCenters();
    if (centers.length < 3) return;

    const [row1, row2, row3] = centers;

    gsap.set(moverRef.current, {
      position: "fixed",
      left: row1.left - window.scrollX,
      top: row1.top - window.scrollY,
      xPercent: -50,
      yPercent: -50,
      rotationY: 0,
      z: 0,
    });

    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress;
        const direction = self.direction;

        if (progress <= 0.5) {
          const segProgress = progress / 0.5;
          const docLeft = gsap.utils.interpolate(
            row1.left,
            row2.left,
            segProgress
          );
          const docTop = gsap.utils.interpolate(
            row1.top,
            row2.top,
            segProgress
          );

          const rotateY = segProgress * 180;
          const zDepth = (1 - Math.abs(segProgress - 0.5) * 2) * 40;

          if (rotateY > 90 && direction === 1 && currentImage !== 1) {
            setCurrentImage(1);
          } else if (rotateY < 90 && direction === -1 && currentImage !== 0) {
            setCurrentImage(0);
          }

          gsap.set(moverRef.current, {
            position: "fixed",
            left: docLeft - window.scrollX,
            top: docTop - window.scrollY,
            xPercent: -50,
            yPercent: -50,
            rotationY: rotateY,
            z: zDepth,
            transformPerspective: 1200,
            transformOrigin: "center center",
          });
        } else if (progress < 1) {
          const segProgress = (progress - 0.5) / 0.5;
          const docLeft = gsap.utils.interpolate(
            row2.left,
            row3.left,
            segProgress
          );
          const docTop = gsap.utils.interpolate(
            row2.top,
            row3.top,
            segProgress
          );

          const rotateY = segProgress * 180;
          const zDepth = (1 - Math.abs(segProgress - 0.5) * 2) * 40;

          if (rotateY > 90 && direction === 1 && currentImage !== 2) {
            setCurrentImage(2);
          } else if (rotateY < 90 && direction === -1 && currentImage !== 1) {
            setCurrentImage(1);
          }

          gsap.set(moverRef.current, {
            position: "fixed",
            left: docLeft - window.scrollX,
            top: docTop - window.scrollY,
            xPercent: -50,
            yPercent: -50,
            rotationY: rotateY,
            z: zDepth,
            transformPerspective: 1200,
            transformOrigin: "center center",
          });
        } else {
          gsap.set(moverRef.current, {
            position: "absolute",
            left: row3.left,
            top: row3.top,
            xPercent: -50,
            yPercent: -50,
            rotationY: 0,
            z: 0,
          });
        }
      },
    });

    const refreshHandler = () => {
      centers = computeCenters();
    };
    ScrollTrigger.addEventListener("refreshInit", refreshHandler);

    return () => {
      st.kill();
      ScrollTrigger.removeEventListener("refreshInit", refreshHandler);
    };
  }, [isMobile, currentImage]);

  const setCellRef = (el: HTMLDivElement | null, idx: number) => {
    cellRefs.current[idx] = el;
  };

  return (
    <main
      ref={containerRef}
      className="w-full min-h-screen text-white max-w-7xl mx-auto px-4"
    >
      {!isMobile && (
        <>
          {/* floating animated image */}
          <div ref={moverRef} className="csur__image-3d">
            <div className="csur__card">
              <img
                ref={imgRef}
                src={images[currentImage]}
                alt="moving"
                className="w-[300px] h-[400px] object-cover rounded-2xl transition-all duration-500"
                draggable={false}
              />
            </div>
          </div>

          {/* Row 1 */}
          <section className=" py-20 grid grid-cols-2">
            <div
              ref={(el) => setCellRef(el, 0)}
              className="flex items-center justify-center"
            >
              <div className="w-[400px] h-[400px]" />
            </div>
            <div
              className="flex flex-col justify-center p-6 bg-white/10 
             backdrop-blur-md 
             border border-white/20 
             shadow-lg 
             rounded-2xl"
            >
              <h1 className="text-7xl font-bold mb-3 text-left">
                Deepak Sharma
              </h1>
              <p className="text-2xl text-left">
                Senior Shopify Developer & Web Developer
              </p>
              <p className="text-m text-left">
                Hi I am a passionate and experienced web developer.
              </p>
            </div>
          </section>

          {/* Row 2 */}
          <section className=" py-20 grid grid-cols-2">
            <div
              className="flex flex-col justify-start p-6 bg-white/10 
             backdrop-blur-md 
             border border-white/20 
             shadow-lg 
             rounded-2xl"
            >
              <h2 className="text-4xl font-semibold mb-4 text-left">
                What I Can Do For You
              </h2>
              <p className="text-lg text-left">
                I build interactive websites, scalable Shopify stores, and
                modern web apps with React, TypeScript, and GSAP. I specialize
                in smooth transitions and premium UX.
              </p>
              <WhatIDo />
            </div>
            <div
              ref={(el) => setCellRef(el, 1)}
              className="flex items-center justify-center"
            >
              <div className="w-[400px] h-[400px]" />
            </div>
          </section>

          {/* Row 3 */}
          <section className=" py-20 grid grid-cols-2">
            <div
              ref={(el) => setCellRef(el, 2)}
              className="flex items-center justify-center"
            >
              <div className="w-[400px] h-[400px]" />
            </div>
            <div
              className="flex flex-col justify-start p-6 bg-white/10 
             backdrop-blur-md 
             border border-white/20 
             shadow-lg 
             rounded-2xl"
            >
              <h2 className="text-4xl font-semibold mb-4">More About Me</h2>
              <p className="text-lg">
                Education, work experience, and projects — e-commerce stores,
                headless Shopify builds, UI/animation experiments, and more.
              </p>
              <MoreAbout />
            </div>
          </section>
        </>
      )}

      {/* Mobile stacked layout */}
      {isMobile && (
        <div className="flex flex-col gap-16 px-6 py-12">
          {/* Row 1 */}
          <div className="flex flex-col items-center text-left gap-4">
            <img
              src={images[0]}
              alt="row1"
              className="w-full max-w-[350px] rounded-2xl object-cover"
            />
            <div>
              <h1 className="text-4xl font-bold mb-2">Deepak Sharma</h1>
              <p className="text-lg">Senior Shopify Developer & Web Engineer</p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col items-center text-left gap-4">
            <img
              src={images[1]}
              alt="row2"
              className="w-full max-w-[350px] rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-3xl font-semibold mb-2 text-left">
                What I Can Do
              </h2>
              <p className="text-base text-left">
                I build interactive websites, scalable Shopify stores, and
                modern web apps with React, TypeScript, and GSAP. I specialize
                in smooth transitions and premium UX.
              </p>
              <WhatIDo />
            </div>
          </div>

          {/* Row 3 */}
          <div className="flex flex-col items-center text-left gap-4">
            <img
              src={images[2]}
              alt="row3"
              className="w-full max-w-[350px] rounded-2xl object-cover"
            />
            <div>
              <h2 className="text-3xl font-semibold mb-2">More About Me</h2>
              <p className="text-base">
                Education, work experience, and projects — e-commerce stores,
                headless Shopify builds, UI/animation experiments, and more.
              </p>
              <MoreAbout />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default App;
