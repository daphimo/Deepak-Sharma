// src/components/Contact.tsx
import type { FC } from "react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import emailjs from "@emailjs/browser";
import Magnet from "./assets/components/Magnet";
import { useIsTouchDevice } from "./hooks/use-is-touch-device";
import { supabase } from "./lib/supabaseClient";
import type { Tables } from "./types/database.types";

const Ballpit = lazy(() => import("./components/Ballpit"));

const Contact: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const isTouchDevice = useIsTouchDevice();
  const [contactInfo, setContactInfo] = useState<Pick<Tables<"Contents">, "Email" | "Phone"> | null>(null);

  const defaultEmail = "deepakrajeshsharma987654321@gmail.com";
  const defaultPhone = "+91 94270 11442";

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data, error } = await supabase
        .from("Contents")
        .select("Email, Phone")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setContactInfo({ Email: data.Email, Phone: data.Phone });
      }
    };

    fetchContactInfo();
  }, []);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formRef.current) return;

    setLoading(true);
    setStatus("");

    emailjs
      .sendForm(
        "codenimata",
        "template_lv6gk0n",
        formRef.current,
        "tJmy4H9Fuf1ebrq7Z"
      )
      .then(
        () => {
          setLoading(false);
          setStatus("Message sent successfully ✅");
          formRef.current?.reset();
        },
        () => {
          setLoading(false);
          setStatus("Failed to send ❌ Please try again.");
        }
      );
  };

  return (
    <section className="relative w-full mb-20 text-[var(--foreground)] transition-colors duration-500">
      {/* Ballpit full background */}
      <div className="absolute inset-0 -z-10 bottom-0" id="BallpitContainer">
        {!isTouchDevice ? (
          <Suspense fallback={null}>
            <Ballpit
              hoverIntensity={1}
              rotateOnHover={true}
              hue={0}
              forceHoverState={true}
            />
          </Suspense>
        ) : null}
      </div>

      {/* Contact content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 transition-colors duration-500 text-[var(--foreground)]">
        <div className="w-full p-6 rounded-2xl shadow-lg backdrop-blur-md border transition-colors duration-500 bg-white/75 border-black/10 dark:bg-[var(--card)] dark:border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="flex flex-col space-y-5 justify-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Get in Touch</h2>
                <p className="mt-1 text-sm md:text-base text-[var(--foreground)]">
                  I'd love to hear from you. Whether you have a question or just
                  want to say hi, feel free to drop a message!
                  {/* <a className="!cursor-text" href="/downloads" aria-label="Download Center" target="_blank"> feel free to drop a message!</a> */}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap sm:space-x-6 space-y-3 sm:space-y-0 mt-2">
                  <a
                    href={`mailto:${contactInfo?.Email || defaultEmail}`}
                    className="flex items-center space-x-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors text-sm break-all"
                  >
                    <FiMail className="text-lg" />
                    <span>{contactInfo?.Email || defaultEmail}</span>
                  </a>

                  <a
                    href={`tel:${(contactInfo?.Phone || defaultPhone).replace(/\s/g, "")}`}
                    className="flex items-center space-x-2 text-[var(--foreground)] hover:text-[var(--primary)] transition-colors text-sm"
                  >
                    <FiPhone className="text-lg" />
                    <span>{contactInfo?.Phone || defaultPhone}</span>
                  </a>
                </div>
              </div>

              <div className="flex space-x-4 pt-2">
                <a
                  href="https://www.linkedin.com/in/deepak-sharma-97954a211/"
                  target="_blank"
                  aria-label="Linkedin"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors text-xl"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://github.com/daphimo"
                  target="_blank"
                  aria-label="Github"
                  rel="noopener noreferrer"
                  className="text-[var(--foreground)] hover:text-[var(--primary)] transition-colors text-xl"
                >
                  <FaGithub />
                </a>
              </div>
            </div>

            {/* Right Side */}
            <div>
              <form ref={formRef} onSubmit={sendEmail} className="space-y-3">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  className="w-full px-4 py-2 rounded-full bg-white/70 border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm placeholder:text-[var(--foreground)] dark:bg-white/5 dark:border-white/15"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-2 rounded-full bg-white/70 border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm placeholder:text-[var(--foreground)] dark:bg-white/5 dark:border-white/15"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Your Message..."
                  required
                  className="w-full px-4 py-2 rounded-2xl bg-white/70 border border-black/10 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] text-sm placeholder:text-[var(--foreground)] dark:bg-white/5 dark:border-white/15"
                ></textarea>
                <Magnet padding={50} disabled={false} magnetStrength={5}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex cursor-pointer font-bold items-center gap-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </Magnet>
                {status && (
                  <p className="text-sm mt-2 text-[var(--foreground)]">
                    {status}
                  </p>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="mt-15 pb-10 text-[var(--foreground)] text-sm grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 items-start transition-colors duration-500">
          {/* Left */}
          <div className="text-left">
            © {new Date().getFullYear()} Deepak Sharma. All rights reserved.
          </div>

          {/* Center */}
          <div className="text-left md:text-center">
            Made with <span className="text-red-500">❤️</span> in India
          </div>

          {/* Right - Social links */}
          <div className="justify-start md:justify-end flex flex-wrap gap-4">
            <a
              href="https://github.com/daphimo"
              target="_blank"
              className="hover:text-[var(--primary)] transition-colors"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/deepak-sharma-97954a211/"
              target="_blank"
              className="hover:text-[var(--primary)] transition-colors"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href={`mailto:${contactInfo?.Email || defaultEmail}`}
              aria-label="Email"
              className="hover:text-[var(--primary)] transition-colors"
            >
              Email
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
