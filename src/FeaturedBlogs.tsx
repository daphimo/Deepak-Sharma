import { Link } from "react-router-dom";
import Magnet from "./assets/components/Magnet";
import { FiExternalLink } from "react-icons/fi";

// 🎨 Accent color palette for tags (optional for future categorization)
const tagColors = [
  "text-pink-400",
  "text-yellow-400",
  "text-green-400",
  "text-blue-400",
  "text-purple-400",
  "text-orange-400",
  "text-teal-400",
  "text-red-400",
];

export default function FeaturedBlogs() {
  const blogs = [
    {
      title: "How to Add Wishlist to Shopify Store Wishlist to Shopify Store",
      img: "/files/blogs/wishlist.webp",
      desc: "A step-by-step guide to add a custom wishlist feature to your Shopify theme using React and Liquid.",
      link: "/blogs/wishlist-guide",
      date: "Nov 2025",
      tags: ["Wishlist", "React", "Liquid"],
    },
    {
      title: "Creating Custom Product Slider",
      img: "/files/blogs/slider.webp",
      desc: "Learn how to build a sleek product carousel using Slick.js or Swiper in your Shopify store.",
      link: "/blogs/custom-product-slider",
      date: "Nov 2025",
      tags: ["Slider", "Swiper", "Slick.js"],
    },
    {
      title: "Add Sticky Cart in Shopify",
      img: "/files/blogs/stickycart.webp",
      desc: "Keep your cart visible as users scroll. Enhance conversions with a sticky cart component.",
      link: "/blogs/sticky-cart",
      date: "Oct 2025",
      tags: ["Cart", "UX", "Shopify"],
    },
    {
      title: "Integrate Newsletter Popup",
      img: "/files/blogs/newsletter.webp",
      desc: "Grow your subscriber list with a simple yet stylish popup form connected to Klaviyo or Mailchimp.",
      link: "/blogs/newsletter-popup",
      date: "Oct 2025",
      tags: ["Popup", "Klaviyo", "Mailchimp"],
    },
  ];

  return (
    <div className="mt-20 w-full text-white max-w-7xl mx-auto py-20 px-4">
      {/* Header */}
      <div className="mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Turn Gaps Into Great Features
        </h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
          Explore modern Shopify how-tos that fill the missing pieces — from
          wishlists to popups — helping you build themes that feel polished and
          complete.
        </p>
      </div>

             <div className="flex flex-wrap justify-center gap-10 items-stretch">
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="w-full md:w-[calc(30%-1.25rem)] max-w-[600px] flex"
          >
            <BlogCard blog={blog} />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-12">
        <Magnet padding={50} disabled={false} magnetStrength={5}>
          <Link
            to="/blogs"
            className="flex items-center font-bold gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Explore More Blogs
          </Link>
        </Magnet>
      </div>
    </div>
  );
}

// ✅ Blog Card (no hover effect, equal height)
function BlogCard({ blog }: { blog: any }) {
  return (
    <div className="relative flex flex-col bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl overflow-hidden h-full">
      {/* Blog Image */}
      <a href={blog.link} className="w-full aspect-video">
        <img
          src={blog.img}
          alt={blog.title}
          className="w-full h-full object-cover"
        />
      </a>

      {/* Content */}
      <div className="flex flex-col justify-between flex-grow">
        <div>
          {/* Title & Link */}
          <div className="flex items-center justify-between w-full px-5 mt-4">
            <a
              href={blog.link}
              className="text-2xl font-semibold text-white"
            >
              {blog.title}
            </a>
            <a
              href={blog.link}
              className="text-gray-300"
              aria-label={`Read ${blog.title}`}
            >
              <FiExternalLink size={20} />
            </a>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm px-5 mt-2 line-clamp-2">
            {blog.desc}
          </p>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 px-5 py-4">
          {blog.tags.map((tag: string, i: number) => (
            <span
              key={i}
              className={`${
                tagColors[i % tagColors.length]
              } text-xs font-semibold uppercase tracking-wide`}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
