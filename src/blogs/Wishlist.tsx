"use client";

import React, { useState } from "react";
import { Copy } from "lucide-react";
import { Link } from "react-router-dom";
import Magnet from "../components/Magnet";

// 🎨 Shared color palette for accents
const accentColors = [
  "text-pink-400",
  "text-yellow-400",
  "text-green-400",
  "text-blue-400",
  "text-purple-400",
  "text-orange-400",
  "text-teal-400",
  "text-red-400",
];

const BlogWishlistGuide: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sampleCode = `
  // Example: Add wishlist button
  <button className="wishlist-btn" onClick={() => addToWishlist(product.id)}>
    ❤️ Add to Wishlist
  </button>

  const addToWishlist = (id) => {
    console.log("Added product to wishlist:", id);
  };
  `;

  return (
    <main className="min-h-screen w-full text-white py-28 px-5 flex flex-col items-center">
      {/* 🖼️ Static Banner Image */}
      <div className="w-full max-w-5xl mb-10 rounded-3xl overflow-hidden shadow-lg border border-white/10">
        <img
          src="/files/blogs/wishlist-banner.webp"
          alt="Add Wishlist to Shopify Blog Banner"
          className="w-full h-auto object-cover"
        />
      </div>

      {/* 🏷️ Blog Header */}
      <header className="text-center mb-16 max-w-3xl">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          How to Add Wishlist to Your Shopify Store
        </h1>
        <p className="text-gray-300 text-lg leading-relaxed">
          Learn how to build a simple wishlist feature using custom code — no app required.
          This guide walks you through adding a wishlist button and saving items locally.
        </p>
      </header>

      {/* 📘 Blog Body */}
      <article className="max-w-4xl w-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl shadow-[0_0_50px_-10px_rgba(255,255,255,0.1)] p-10 space-y-12">
        {/* Step 1 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Step 1: Add a Wishlist Button
          </h2>
          <p className="text-gray-300 mb-5 leading-relaxed">
            Start by adding a button inside your product card or product page.
          </p>

          <div className="relative bg-[#0a0a0a]/90 border border-white/10 rounded-xl overflow-hidden font-mono text-sm shadow-inner">
            <pre className="p-4 overflow-x-auto text-gray-200 whitespace-pre-wrap">
              {sampleCode}
            </pre>
            <button
              onClick={() => handleCopy(sampleCode)}
              className="absolute cursor-pointer top-2 right-2 flex items-center gap-1 text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-lg transition"
            >
              <Copy size={14} /> {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </section>

        {/* Step 2 */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            Step 2: Store Wishlist Data
          </h2>
          <p className="text-gray-300 leading-relaxed">
            You can store wishlist data using{" "}
            <span className="text-white font-medium">localStorage</span>, a custom app,
            or Shopify metafields depending on your store setup.
          </p>
        </section>

        {/* 💡 Pro Tip */}
        <section className="bg-white/5 p-6 rounded-2xl border border-white/10">
          <h3 className="text-xl font-semibold mb-2 text-yellow-400">
            💡 Pro Tip
          </h3>
          <p className="text-gray-300 leading-relaxed">
            Sync wishlist items with logged-in customers using Shopify metafields for a seamless experience across devices.
          </p>
        </section>

        {/* Accent Tags */}
        <section className="flex flex-wrap gap-3 pt-6 border-t border-white/10">
          {["Shopify", "Custom Code", "Wishlist", "LocalStorage", "UX"].map(
            (tag, i) => (
              <span
                key={i}
                className={`${
                  accentColors[i % accentColors.length]
                } text-xs font-semibold uppercase tracking-wide`}
              >
                #{tag}
              </span>
            )
          )}
        </section>
      </article>

      {/* 🌟 Explore More */}
      <section className="max-w-6xl w-full mt-28 text-center">
        <h3 className="text-3xl font-semibold mb-10">Explore More</h3>
        <Magnet padding={60} magnetStrength={6}>
          <Link
            to="/blogs"
            className="inline-block text-sm font-semibold px-8 py-3 bg-yellow-400 text-black rounded-lg shadow-md transition-all duration-300 active:scale-95 hover:bg-yellow-300"
          >
            Browse All Blogs →
          </Link>
        </Magnet>
      </section>
    </main>
  );
};

export default BlogWishlistGuide;
