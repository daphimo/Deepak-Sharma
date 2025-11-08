// src/components/Contact.tsx
import type { FC } from "react";
import { useRef, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import emailjs from "@emailjs/browser";
import Ballpit from "./components/Ballpit";
import Magnet from "./assets/components/Magnet";

const Contact: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

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
    <section className="relative w-full mb-20 overflow-hidden">
      {/* Ballpit full background */}
      <div className="absolute inset-0 -z-10 bottom-0" id="BallpitContainer">
        <Ballpit
          hoverIntensity={1}
          rotateOnHover={true}
          hue={0}
          forceHoverState={true}
        />
      </div>

      {/* Contact content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 text-white">
        <div
          className="p-6 bg-white/10 
          backdrop-blur-md 
          border border-white/20 
          shadow-lg 
          rounded-2xl 
          w-full"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Side */}
            <div className="flex flex-col space-y-5 justify-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Get in Touch</h2>
                <p className="text-gray-300 mt-1 text-sm md:text-base">
                  I’d love to hear from you. Whether you have a question or just
                  want to say hi, feel free to drop a message!
                  {/* <a className="!cursor-text" href="/downloads" aria-label="Download Center" target="_blank"> feel free to drop a message!</a> */}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold">Contact Details</h3>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-center flex-wrap sm:space-x-6 space-y-3 sm:space-y-0 mt-2">
                  <a
                    href="mailto:deepakrajeshsharma987654321@gmail.com"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition text-sm break-all"
                  >
                    <FiMail className="text-lg" />
                    <span>deepakrajeshsharma987654321@gmail.com</span>
                  </a>

                  <a
                    href="tel:+919427011442"
                    className="flex items-center space-x-2 text-gray-300 hover:text-white transition text-sm"
                  >
                    <FiPhone className="text-lg" />
                    <span>+91 94270 11442</span>
                  </a>
                </div>
              </div>

              <div className="flex space-x-4 pt-2">
                <a
                  href="https://www.linkedin.com/in/deepak-sharma-97954a211/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition text-xl"
                >
                  <FaLinkedin />
                </a>
                <a
                  href="https://github.com/daphimo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition text-xl"
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
                  className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  className="w-full px-4 py-2 rounded-full bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
                <textarea
                  name="message"
                  rows={4}
                  placeholder="Your Message..."
                  required
                  className="w-full px-4 py-2 rounded-2xl bg-white/10 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                ></textarea>
                <Magnet padding={50} disabled={false} magnetStrength={5}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex cursor-pointer font-bold items-center gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  >
                    {loading ? "Sending..." : "Send"}
                  </button>
                </Magnet>
                {status && (
                  <p className="text-sm mt-2 text-gray-300">{status}</p>
                )}
              </form>
            </div>
          </div>
        </div>

        <div className="mt-15 pb-10 text-gray-400 text-sm grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-2 items-start">
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
              className="hover:text-white"
              aria-label="GitHub"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/deepak-sharma-97954a211/"
              target="_blank"
              className="hover:text-white"
              aria-label="LinkedIn"
            >
              LinkedIn
            </a>
            <a
              href="mailto:deepakrajeshsharma987654321@gmail.com"
              aria-label="Email"
              className="hover:text-white"
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
