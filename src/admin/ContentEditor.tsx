import { type ChangeEvent, useEffect, useState } from "react";
import type { Json } from "../types/database.types";
import { supabase } from "../lib/supabaseClient";
import { useRequireAuth } from "./useRequireAuth";
import {
  CheckCircle2,
  Loader2,
  RefreshCw,
  Save,
  UploadCloud,
  X,
  XCircle,
} from "lucide-react";
import { useUploadFile } from "../hooks/use-upload-file";
import { SupabaseImageUpload } from "../components/SupabaseImageUpload";

type PopupState = { type: "success" | "error"; message: string } | null;
const STORAGE_BUCKET = import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "public";

export default function ContentEditor() {
  const checkingAuth = useRequireAuth();
  const [row, setRow] = useState<Record<string, any> | null>(null);
  const [id, setId] = useState<string | number | null>(null);
  const [popup, setPopup] = useState<PopupState>(null);
  const [loading, setLoading] = useState(false);

  const showPopup = (type: "success" | "error", message: string) => {
    setPopup({ type, message });
    setTimeout(() => setPopup(null), 2500);
  };

  useEffect(() => {
    const fetchContent = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Contents")
        .select("*")
        .limit(1)
        .maybeSingle();
      setLoading(false);
      if (error) {
        if (error.message.includes("coerce")) {
          setRow({});
          setId(null);
          return;
        }
        showPopup("error", error.message);
        return;
      }
      setRow(data || { Email: "", Phone: "", Downloads: [] });
      setId((data as any)?.id ?? null);
    };
    if (!checkingAuth) fetchContent();
  }, [checkingAuth]);

  const handleChange = (key: string, value: string | Json) => {
    setRow((prev) => ({ ...(prev || {}), [key]: value }));
  };

  const handleSave = async () => {
    if (!row) return;
    setLoading(true);
    const payload = { ...row, id: id ?? 1 };
    const { error } = await supabase
      .from("Contents")
      .upsert(payload, { onConflict: "id" });
    setLoading(false);
    if (error) showPopup("error", error.message);
    else {
      showPopup("success", "Content saved");
      setId(payload.id);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="p-6 bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl w-full max-w-md text-center">
          Checking session...
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 text-black">
      {popup && <Popup type={popup.type} message={popup.message} />}

      <div className="bg-white shadow-lg rounded-2xl p-6 sm:p-8 border border-gray-200 space-y-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Content Editor
            </h1>
            <p className="text-sm text-gray-600">
              Edit the single content row and save changes (upsert by id).
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg bg-blue-600 text-white px-4 py-2 font-medium shadow hover:bg-blue-700 disabled:opacity-60"
          >
            <Save className="w-4 h-4" />
            {loading ? "Saving..." : "Save"}
          </button>
        </div>

        {!row && (
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-4 h-4 animate-spin" /> Loading content...
          </div>
        )}

        {row && (
          <SupabaseImageUpload
            label="Cover Image"
            value={(row as any).image || ""}
            onChange={(url) => handleChange("image", url)}
            helperText="Uploads to Supabase and saves the public URL."
            className="mb-4"
          />
        )}

        {row && (
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={(row as any).Email || ""}
                onChange={(e) => handleChange("Email", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                type="text"
                value={(row as any).Phone || ""}
                onChange={(e) => handleChange("Phone", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-800"
              />
            </div>

            <DownloadsField
              value={(row as any).Downloads || []}
              onChange={(val) => handleChange("Downloads", val as Json)}
              onNotify={showPopup}
            />
          </div>
        )}
      </div>
    </div>
  );
}

type DownloadItem = {
  name: string;
  description: string;
  file: string;
  storagePath?: string;
};

function DownloadsField({
  value,
  onChange,
  onNotify,
}: {
  value: DownloadItem[];
  onChange: (val: DownloadItem[]) => void;
  onNotify?: (type: "success" | "error", message: string) => void;
}) {
  const downloads = Array.isArray(value) ? value : [];
  const { uploadFile, isUploading, progress, uploadingFile } = useUploadFile({
    pathPrefix: "downloads",
  });
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);

  const updateItem = (index: number, key: keyof DownloadItem, val: string) => {
    const next = downloads.map((item, i) =>
      i === index ? { ...item, [key]: val } : item
    );
    onChange(next);
  };

  const addItem = () => {
    onChange([...downloads, { name: "", description: "", file: "" }]);
  };

  const removeItem = (index: number) => {
    onChange(downloads.filter((_, i) => i !== index));
  };

  const extractPathFromUrl = (url?: string) => {
    if (!url) return null;
    try {
      const bucketIndex = url.indexOf(`/${STORAGE_BUCKET}/`);
      if (bucketIndex === -1) return null;
      return url.substring(bucketIndex + STORAGE_BUCKET.length + 2);
    } catch {
      return null;
    }
  };

  const handleFileUpload = async (index: number, file: File) => {
    setUploadingIndex(index);
    try {
      const uploaded = await uploadFile(file);
      if (uploaded?.url) {
        const next = downloads.map((item, i) =>
          i === index
            ? {
                ...item,
                name: item.name || uploaded.name,
                file: uploaded.url,
                storagePath: uploaded.path || uploaded.key,
              }
            : item
        );
        onChange(next);
        onNotify?.("success", "File uploaded");
      } else {
        onNotify?.("error", "Upload failed");
      }
    } catch {
      onNotify?.("error", "Upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  const removeFromStorage = async (path?: string | null, url?: string) => {
    const storagePath = path || extractPathFromUrl(url);
    if (!storagePath) return;
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .remove([storagePath]);
    if (error) throw error;
  };

  const handleRemoveFile = async (index: number) => {
    const item = downloads[index];
    setRemovingIndex(index);
    try {
      await removeFromStorage(item.storagePath, item.file);
      const next = downloads.map((it, i) =>
        i === index ? { ...it, file: "", storagePath: "" } : it
      );
      onChange(next);
      onNotify?.("success", "File removed");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Unable to remove file";
      onNotify?.("error", message);
    } finally {
      setRemovingIndex(null);
    }
  };

  const handleFileInputChange = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await handleFileUpload(index, file);
    event.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Downloads
        </label>
        <button
          type="button"
          onClick={addItem}
          className="text-sm px-3 py-1 rounded-lg bg-sky-100 text-sky-700 hover:bg-sky-200"
        >
          Add
        </button>
      </div>
      {downloads.length === 0 && (
        <p className="text-xs text-gray-500">
          No downloads yet. Click add to create one.
        </p>
      )}
      <div className="space-y-4">
        {downloads.map((item, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-gray-200 p-3 space-y-2"
          >
            <div className="grid md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Name"
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                value={item.name}
                onChange={(e) => updateItem(idx, "name", e.target.value)}
              />
              <textarea
                placeholder="Description"
                className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800 min-h-[60px]"
                value={item.description}
                onChange={(e) => updateItem(idx, "description", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <div className="grid md:grid-cols-[1fr_auto] gap-3 items-center">
                <input
                  type="text"
                  placeholder="File URL (optional if uploading)"
                  className="border border-gray-300 rounded-lg px-3 py-2 text-gray-800"
                  value={item.file}
                  onChange={(e) => updateItem(idx, "file", e.target.value)}
                />
                <div className="flex flex-wrap items-center gap-2 justify-end">
                  <label
                    htmlFor={`download-file-${idx}`}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                  >
                    {uploadingIndex === idx && isUploading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <UploadCloud className="w-4 h-4" />
                    )}
                    {uploadingIndex === idx && isUploading
                      ? "Uploading..."
                      : "Upload file"}
                  </label>
                  <input
                    id={`download-file-${idx}`}
                    type="file"
                    className="hidden"
                    onChange={(event) => handleFileInputChange(idx, event)}
                  />
                  {item.file && (
                    <>
                      <a
                        href={item.file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm font-medium text-blue-700 underline"
                      >
                        View
                      </a>
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(idx)}
                        className="inline-flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                        disabled={removingIndex === idx}
                      >
                        {removingIndex === idx ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        {removingIndex === idx ? "Removing..." : "Remove file"}
                      </button>
                    </>
                  )}
                </div>
              </div>
              {uploadingIndex === idx && isUploading && (
                <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
                  <div className="flex items-center gap-2 font-semibold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {uploadingFile?.name || "Uploading..."}
                    <span className="ml-auto text-[11px]">
                      {Math.round(progress)}%
                    </span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/70">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 transition-all duration-150"
                      style={{
                        width: `${Math.min(
                          Math.max(progress || 10, 10),
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => removeItem(idx)}
                className="text-xs text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Popup({
  type,
  message,
}: {
  type: "success" | "error";
  message: string;
}) {
  const Icon = type === "success" ? CheckCircle2 : XCircle;
  return (
    <div
      className={`fixed top-6 right-6 flex items-center gap-2 px-4 py-3 rounded-xl text-white shadow-lg transition-all z-[9999] ${
        type === "success" ? "bg-green-600" : "bg-red-600"
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium">{message}</span>
    </div>
  );
}
