import React from "react";

const Contact: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-12">Contact Me</h2>

        <form className="bg-white p-8 rounded-xl shadow-lg grid gap-6">
          <input
            type="text"
            placeholder="Your Name"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Your Email"
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            placeholder="Your Message"
            rows={5}
            className="border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700 transition-colors"
          >
            Send Message
          </button>
        </form>

        <div className="mt-12 text-center">
          <p className="mb-2">
            Email:{" "}
            <a href="mailto:your.email@example.com" className="text-blue-600">
              your.email@example.com
            </a>
          </p>
          <p className="mb-4">
            Phone: <span className="text-gray-700">+91 1234567890</span>
          </p>
          <div className="flex justify-center gap-6">
            <a href="#" className="text-gray-700 hover:text-blue-600">
              LinkedIn
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              GitHub
            </a>
            <a href="#" className="text-gray-700 hover:text-blue-600">
              Twitter
            </a>
          </div>
        </div>

        {/* Optional subtle address info */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Based in India. Available for remote and on-site projects worldwide.
        </div>
      </div>
    </section>
  );
};

export default Contact;
