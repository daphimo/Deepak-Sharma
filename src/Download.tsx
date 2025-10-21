import React from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import Magnet from "./assets/components/Magnet";

type FileItem = {
  id: number;
  title: string;
  description: string;
  fileUrl: string;
};

const files: FileItem[] = [
  {
    id: 1,
    title: "Resume",
    description: "My Resume",
    fileUrl: "/files/resume.pdf",
  },
  {
    id: 2,
    title: "Projects Catalog",
    description: "All the Projects I've worked on.",
    fileUrl: "/files/myprojects.pdf",
  },
  {
    id: 3,
    title: "Proposal",
    description: "Business Proposal Brief",
    fileUrl: "/files/brief_proposal.pdf",
  },
];

const DownloadPage: React.FC = () => {
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

      <motion.div
        className="relative flex flex-wrap justify-center gap-6 max-w-5xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.8 }}
      >
        {files.map((file, index) => (
          <motion.div
            key={file.id}
            className="group bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 w-72 shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-white mb-2 transition">
              {file.title}
            </h2>
            <p className="text-gray-300 text-sm mb-4 line-clamp-2">
              {file.description}
            </p>
            <div className="flex justify-between items-center">
              <Magnet padding={50} disabled={false} magnetStrength={5}>
                <a
                  href={file.fileUrl}
                  download={file.title}
                  className="flex items-center gap-2 text-sm text-[#1a1a1a] bg-[#d4af37] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <Download size={16} />
                  Download
                </a>
              </Magnet>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default DownloadPage;
