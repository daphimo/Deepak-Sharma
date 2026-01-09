import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Magnet from "./assets/components/Magnet";
import { supabase } from "./lib/supabaseClient";

type DownloadItem = {
  name: string;
  description: string;
  file: string;
  storagePath?: string;
};

const fallbackFiles: DownloadItem[] = [
  { name: "Deepak Sharma", description: "My Resume", file: "/files/resume.pdf" },
  { name: "Projects Catalog", description: "All the Projects I've worked on.", file: "/files/myprojects.pdf" },
  { name: "Proposal", description: "Business Proposal Brief", file: "/files/brief_proposal.pdf" },
];

const DownloadPage: React.FC = () => {
  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDownloads = async () => {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.from("Contents").select("Downloads").limit(1).maybeSingle();
      if (error) {
        setError(error.message);
        setDownloads(fallbackFiles);
      } else {
        const list = (data as any)?.Downloads;
        if (Array.isArray(list) && list.length > 0) {
          setDownloads(list as DownloadItem[]);
        } else {
          setDownloads(fallbackFiles);
        }
      }
      setLoading(false);
    };
    fetchDownloads();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <motion.h1
        className="text-4xl md:text-5xl font-bold text-white mb-10 tracking-tight"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Download Center
      </motion.h1>

      {error && (
        <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-gray-200 text-sm">Loading downloads...</div>
      ) : (
      <motion.div
        className="relative flex flex-wrap justify-center gap-6 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {downloads.map((file, index) => (
          <motion.div
            key={file.storagePath || file.file || index}
            className="group bg-[var(--card)] backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-72 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-2 transition">
              {file.name || "Untitled"}
            </h2>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {file.description || "No description provided."}
            </p>
            <div className="flex justify-between items-center">
              <Magnet padding={50} disabled={false} magnetStrength={5}>
                <a
                  href={file.file}
                  download={file.name}
                  className="flex font-bold items-center gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Download size={16} />
                  Download
                </a>
              </Magnet>
            </div>
          </motion.div>
        ))}
      </motion.div>
      )}
    </div>
  );
};

export default DownloadPage;
