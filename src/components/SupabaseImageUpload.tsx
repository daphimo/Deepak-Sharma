import { useRef, type ChangeEvent } from "react";
import { Loader2, UploadCloud, X } from "lucide-react";
import { useUploadFile } from "../hooks/use-upload-file";
import { cn } from "../lib/utils";

type SupabaseImageUploadProps = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  helperText?: string;
  bucket?: string;
  pathPrefix?: string;
  className?: string;
};

export function SupabaseImageUpload({
  label,
  value = "",
  onChange,
  helperText = "Upload to Supabase storage or paste a public URL.",
  bucket = (import.meta.env.VITE_SUPABASE_STORAGE_BUCKET || "").trim(),
  pathPrefix = (import.meta.env.VITE_SUPABASE_STORAGE_PREFIX || "").trim(),
  className = "",
}: SupabaseImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { uploadFile, isUploading, progress, uploadingFile } = useUploadFile({
    bucket,
    pathPrefix,
  });

  const handleFileSelect = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const uploaded = await uploadFile(file);
      if (uploaded?.url) onChange(uploaded.url);
    } catch {
      // Errors are already surfaced via toast in the hook
    } finally {
      event.target.value = "";
    }
  };

  const handleRemove = () => onChange("");

  const progressWidth = Math.min(Math.max(progress || 10, 10), 100);

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between gap-3">
        <label className="block text-gray-700 font-medium">{label}</label>
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="flex items-center gap-1 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100 transition"
          >
            <X className="w-4 h-4" />
            Remove
          </button>
        )}
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 bg-white shadow-sm">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-800">
                Upload or paste an image URL
              </p>
              {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
            </div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-80"
              disabled={isUploading}
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <UploadCloud className="w-4 h-4" />
              )}
              {isUploading ? "Uploading..." : "Choose file"}
            </button>
          </div>

          <input
            type="text"
            placeholder="https://your-image-url.com/cover.jpg"
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />

          {isUploading && (
            <div className="rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-xs text-blue-700">
              <div className="flex items-center gap-2 font-semibold">
                <Loader2 className="w-4 h-4 animate-spin" />
                {uploadingFile?.name || "Uploading file..."}
                <span className="ml-auto text-[11px]">{Math.round(progress)}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/70">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-indigo-500 transition-all duration-150"
                  style={{ width: `${progressWidth}%` }}
                />
              </div>
            </div>
          )}

          {value && (
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img
                src={value}
                alt={`${label} preview`}
                className="h-48 w-full object-cover"
                onError={(event) => {
                  const target = event.target as HTMLImageElement;
                  target.src =
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23f1f5f9'/%3E%3Ctext x='100' y='75' dominant-baseline='middle' text-anchor='middle' fill='%236b7280' font-size='14'%3ENo preview%3C/text%3E%3C/svg%3E";
                }}
              />
              <button
                type="button"
                onClick={handleRemove}
                className="absolute top-2 right-2 rounded-full bg-white/90 p-1 text-gray-700 shadow hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileSelect}
      />
    </div>
  );
}
