// src/components/Contact.tsx
import type { FC } from "react";
import { useEffect, useRef, useState } from "react";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import { FiMail, FiPhone } from "react-icons/fi";
import emailjs from "@emailjs/browser";
import { supabase } from "./lib/supabaseClient";
import type { Tables } from "./types/database.types";

type DownloadItem = {
  name: string;
  file: string;
  storagePath?: string;
};

const isAvailableDownload = (value: unknown): value is DownloadItem => {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const item = value as Record<string, unknown>;
  return (
    typeof item.name === "string" &&
    item.name.trim().length > 0 &&
    typeof item.file === "string" &&
    item.file.trim().length > 0
  );
};

const getDownloadName = (name: string, fileUrl: string) => {
  if (/\.[a-z0-9]+$/i.test(name)) return name;

  try {
    const storedName = decodeURIComponent(new URL(fileUrl).pathname.split("/").pop() || "");
    const extension = storedName.match(/(\.[a-z0-9]+)$/i)?.[1];
    return extension ? `${name}${extension}` : name;
  } catch {
    return name;
  }
};

const Contact: FC = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [contactInfo, setContactInfo] = useState<
    Pick<Tables<"Contents">, "Email" | "Phone" | "Downloads"> | null
  >(null);

  const defaultEmail = "deepakrajeshsharma987654321@gmail.com";
  const defaultPhone = "+91 94270 11442";

  useEffect(() => {
    const fetchContactInfo = async () => {
      const { data, error } = await supabase
        .from("Contents")
        .select("Email, Phone, Downloads")
        .limit(1)
        .maybeSingle();

      if (!error && data) {
        setContactInfo({
          Email: data.Email,
          Phone: data.Phone,
          Downloads: data.Downloads,
        });
      }
    };

    fetchContactInfo();
  }, []);

  const downloads = Array.isArray(contactInfo?.Downloads)
    ? contactInfo.Downloads.filter(isAvailableDownload)
    : [];

  const handleDownload = async (
    event: React.MouseEvent<HTMLAnchorElement>,
    file: DownloadItem
  ) => {
    event.preventDefault();

    try {
      const response = await fetch(file.file);
      if (!response.ok) throw new Error(`Download failed: ${response.status}`);

      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getDownloadName(file.name, file.file);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Unable to download the Supabase file:", error);
      window.open(file.file, "_blank", "noopener,noreferrer");
    }
  };

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
        (error) => {
          console.error("EmailJS failed to send the contact form:", error);
          setLoading(false);
          setStatus("Failed to send ❌ Please try again.");
        }
      );
  };

  return (
    <section className="relative w-full mb-2 text-[var(--foreground)] transition-colors duration-500">
      {/* Contact content container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-20 transition-colors duration-500 text-[var(--foreground)]">
        <div className="w-full p-6 rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.06)] backdrop-blur-xl backdrop-saturate-150 transition-colors duration-500 bg-white/15 border-white/35 dark:bg-white/[0.025] dark:border-white/10 dark:shadow-[0_8px_32px_rgba(0,0,0,0.18)]">
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

              {downloads.length > 0 && (
                <div className="flex flex-wrap gap-x-6 gap-y-2 uppercase">
                  {downloads.map((file, index) => (
                    <a
                      key={file.storagePath || file.file || index}
                      href={file.file}
                      download={getDownloadName(file.name, file.file)}
                      onClick={(event) => handleDownload(event, file)}
                      rel="noreferrer"
                      className="relative inline-block text-sm font-medium text-[var(--foreground)] transition-colors hover:text-[var(--primary)] after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-right after:scale-x-0 after:bg-[var(--primary)] after:transition-transform after:duration-300 hover:after:origin-left hover:after:scale-x-100"
                    >
                      Get {file.name}
                    </a>
                  ))}
                </div>
              )}

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
                <button
                  type="submit"
                  disabled={loading}
                  className="flex cursor-pointer font-bold items-center gap-2 text-sm bg-[var(--primary)] text-[var(--primary-foreground)] px-4 py-2 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  {loading ? "Sending..." : "Send"}
                </button>
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
