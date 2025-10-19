import AnimatedBarGraph from "./components/AnimatedBarGraph";

const metricsData = [
  {
    title: "Search Engine Optimization",
    description: `SEO ensures your website is easily discoverable by search engines, driving organic traffic and attracting potential customers. By optimizing content, meta tags, and site structure, we achieved a 70% After in SEO scores. Higher visibility increases traffic, builds credibility, and helps your store reach more of the right audience.`,
    mainMetricValue: 50,
    mainMetricLabel: "Before",
    newMetricValue: 95,
    newMetricLabel: "After",
    mainColor: "#FFffff",
    newColor: "#69F0AE",
  },
  {
    title: "Website Speed Optimization",
    description: `A faster website creates a smoother browsing experience, keeping visitors engaged and reducing bounce rates. Our optimization efforts resulted in a 95% performance After, allowing users to navigate pages, explore products, and complete actions seamlessly. Faster load times directly contribute to higher engagement, better conversions, and a professional impression of your store.`,
    mainMetricValue: 58,
    mainMetricLabel: "Before",
    newMetricValue: 90,
    newMetricLabel: "After",
    mainColor: "#fff",
    newColor: "#69F0AE",
  },
  {
    title: "Accessibility Enhancement",
    description: `Accessibility ensures that every visitor can effortlessly interact with your store, regardless of their abilities. By improving accessibility, we achieved an 84% better experience for all users. Clear navigation, readable content, and easy-to-use features increase usability, build trust, and make your store inclusive — positively impacting engagement and brand perception.`,
    mainMetricValue: 60,
    mainMetricLabel: "Before",
    newMetricValue: 80,
    newMetricLabel: "After",
    mainColor: "#fff",
    newColor: "#69F0AE",
  },
  {
    title: "Lightweight & Reliable Code",
    description: `Our optimized code is 95% lighter, which means faster page load times, smoother interactions, and a more stable site for all users. Leaner code reduces the chance of bugs, improves performance across devices, and creates a seamless experience that keeps visitors engaged and confident in your brand.`,
    mainMetricValue: 42,
    mainMetricLabel: "Before",
    newMetricValue: 85,
    newMetricLabel: "After",
    mainColor: "#fff",
    newColor: "#69F0AE",
  },
  {
    title: "Faster Data Loading",
    description: `API response times have been reduced by 75%, making your website feel instantaneous. Visitors can filter, search, and browse products without waiting, creating a premium and responsive experience. Faster interactions improve satisfaction, reduce drop-offs, and reinforce the perception of a high-quality, reliable store.`,
    mainMetricValue: 40,
    mainMetricLabel: "Before",
    newMetricValue: 75,
    newMetricLabel: "After",
    mainColor: "#fff",
    newColor: "#69F0AE",
  },
];

function App() {
  return (
    <section className="min-h-screen bg-transparent text-white px-6 py-20 flex flex-col gap-20 max-w-7xl mx-auto">
      {metricsData.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col md:flex-row items-end gap-10"
        >
          <div className="flex-1">
            <AnimatedBarGraph
              mainMetricValue={item.mainMetricValue}
              mainMetricLabel={item.mainMetricLabel}
              newMetricValue={item.newMetricValue}
              newMetricLabel={item.newMetricLabel}
              mainColor={item.mainColor}
              newColor={item.newColor}
              wrapperClassName="w-full"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-4">{item.title}</h2>
            <p className="text-gray-300 leading-relaxed mb-3">
              {item.description}
            </p>
          </div>
        </div>
      ))}
      <p className="text-gray-400 text-sm mt-10">
        *Note: The “Before” metrics are approximate averages commonly observed
        on websites — not exact values. Many developers often overlook these
        baseline numbers, so consider them as general reference points.*
      </p>
    </section>
  );
}

export default App;
