import React from "react";
// import profileImg from "../assets/profile.jpg"; // replace with your image path

const About: React.FC = () => {
  return (
    <section className="py-20">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-4xl font-bold mb-6">About Me</h2>
          <p className="text-gray-700 mb-4">
            I am a passionate full-stack developer with experience in building
            modern web applications and e-commerce solutions. My goal is to
            create performant, scalable, and user-friendly digital experiences.
          </p>
          <p className="text-gray-600 mb-4">
            I specialize in React, TypeScript, Node.js, and Shopify development.
            I love exploring new technologies and integrating them to deliver
            creative solutions for clients.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
            <div className="bg-gray-100 p-3 rounded text-center">React</div>
            <div className="bg-gray-100 p-3 rounded text-center">
              TypeScript
            </div>
            <div className="bg-gray-100 p-3 rounded text-center">Node.js</div>
            <div className="bg-gray-100 p-3 rounded text-center">Shopify</div>
            <div className="bg-gray-100 p-3 rounded text-center">
              Framer Motion
            </div>
            <div className="bg-gray-100 p-3 rounded text-center">
              Tailwind CSS
            </div>
          </div>
        </div>
        <div className="flex-1 flex justify-center md:justify-end">
          <img
            src="https://avatars.githubusercontent.com/u/64279235?v=4" // replace with your image path
            alt="Profile"
            className="w-64 h-64 object-cover rounded-full shadow-lg"
          />
        </div>
      </div>

      {/* Subtle additional info */}
      <div className="mt-12 text-center text-gray-500 text-sm">
        Outside work, I enjoy photography, traveling, and experimenting with
        creative projects.
      </div>
    </section>
  );
};

export default About;
