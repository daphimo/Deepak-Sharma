// src/components/Contact.tsx
import type { FC } from "react";
import { useRef, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import emailjs from "@emailjs/browser";

const brandColors = {
  dark: "#000000",
  steel: "#415a77",
  sky: "#778da9",
  light: "#e0e1dd",
};

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
        "codenimata", // <-- replace with EmailJS service ID
        "template_lv6gk0n", // <-- replace with EmailJS template ID
        formRef.current,
        "tJmy4H9Fuf1ebrq7Z" // <-- replace with EmailJS public key
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
    <div className="w-full mb-20 text-white max-w-7xl mx-auto px-4">
      <div
        className="p-6 bg-white/10 
          backdrop-blur-md 
          border border-white/20 
          shadow-lg 
          rounded-2xl 
          w-full"
      >
        {/* Layout: Left (title + content + details) - Right (form) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Contact Info */}
          <div className="flex flex-col space-y-5 justify-center">
            {/* Section Title */}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Get in Touch</h2>
              <p className="text-gray-300 mt-1 text-sm md:text-base">
                I’d love to hear from you. Whether you have a question or just
                want to say hi, feel free to drop a message!
              </p>
            </div>

            {/* Contact Details */}
            <div>
              <h3 className="text-lg font-semibold">Contact Details</h3>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-3 sm:space-y-0 mt-2">
                <a
                  href="mailto:deepakrajeshsharma987654321@gmail.com"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition text-sm"
                >
                  <FiMail className="text-lg" />
                  <span>deepakrajeshsharma987654321@gmail.com</span>
                </a>
                <a
                  href="tel:+1234567890"
                  className="flex items-center space-x-2 text-gray-300 hover:text-white transition text-sm"
                >
                  <FiPhone className="text-lg" />
                  <span>+91 94270 11442</span>
                </a>
              </div>
            </div>

            {/* Social Icons */}
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

          {/* Right Side: Contact Form */}
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

              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 rounded-full font-medium text-sm transition"
                style={{
                  backgroundColor: brandColors.steel,
                  color: brandColors.light,
                }}
              >
                {loading ? "Sending..." : "Send"}
              </button>

              {status && <p className="text-sm mt-2 text-gray-300">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
