import { useEffect, useRef, type ChangeEvent } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

const safeRegisterAttributor = (path: string) => {
  try {
    const Attributor = Quill.import(path);
    if (Attributor) {
      Quill.register(Attributor, true);
    }
  } catch (error) {
    console.warn(`Quill attributor not available: ${path}`, error);
  }
};

safeRegisterAttributor("attributors/style/width");
safeRegisterAttributor("attributors/style/height");

const BaseImageBlot = Quill.import("formats/image") as any;
class ResizableImage extends BaseImageBlot {
  static formats(domNode: HTMLElement) {
    const base = BaseImageBlot.formats(domNode) || {};
    const width = domNode.style.width || domNode.getAttribute("width");
    const height = domNode.style.height || domNode.getAttribute("height");
    return {
      ...base,
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
    };
  }

  format(name: string, value: unknown) {
    if (name === "width" || name === "height") {
      if (value) {
        this.domNode.style.setProperty(name, String(value));
        this.domNode.setAttribute(name, String(value));
      } else {
        this.domNode.style.removeProperty(name);
        this.domNode.removeAttribute(name);
      }
    } else {
      super.format(name, value);
    }
  }
}
Quill.register("formats/image", ResizableImage, true);

const quillToolbar = [
  [{ header: [1, 2, 3, 4, false] }],
  [{ font: [] }, { size: [] }],
  ["bold", "italic", "underline", "strike", "blockquote", "code-block"],
  [{ color: [] }, { background: [] }],
  [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
  [{ align: [] }],
  ["link", "image"],
  ["clean"],
];

const quillModules = {
  toolbar: {
    container: quillToolbar,
  },
  clipboard: { matchVisual: false },
  history: { delay: 500, maxStack: 200, userOnly: true },
};

const quillFormats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "color",
  "background",
  "list",
  "bullet",
  "indent",
  "align",
  "link",
  "image",
  "width",
  "height",
];

type QuillEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  note?: string;
  className?: string;
};

export function QuillEditor({
  value,
  onChange,
  placeholder,
  label,
  note = "Premium editor",
  className = "",
}: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const editorRef = useRef<Quill | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const resizeOverlayRef = useRef<HTMLDivElement | null>(null);
  const selectedImageRef = useRef<HTMLImageElement | null>(null);

  const insertImage = (src: string) => {
    const editor = editorRef.current;
    if (!editor) return;
    const range = editor.getSelection(true);
    const index = range?.index ?? editor.getLength();
    editor.insertEmbed(index, "image", src, "user");
    editor.setSelection(index + 1);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") insertImage(result);
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const detachResizeOverlay = () => {
    const overlay = resizeOverlayRef.current;
    if (overlay?.parentElement) {
      overlay.parentElement.removeChild(overlay);
    }
    resizeOverlayRef.current = null;
    selectedImageRef.current = null;
  };

  const ensureResizeOverlay = () => {
    if (resizeOverlayRef.current) return resizeOverlayRef.current;
    const overlay = document.createElement("div");
    overlay.style.position = "absolute";
    overlay.style.border = "1px dashed #2563eb";
    overlay.style.pointerEvents = "none";
    overlay.style.boxSizing = "border-box";
    overlay.style.zIndex = "40";

    const handle = document.createElement("div");
    handle.style.position = "absolute";
    handle.style.width = "12px";
    handle.style.height = "12px";
    handle.style.right = "-6px";
    handle.style.bottom = "-6px";
    handle.style.background = "#2563eb";
    handle.style.border = "2px solid white";
    handle.style.borderRadius = "4px";
    handle.style.cursor = "nwse-resize";
    handle.style.pointerEvents = "auto";

    overlay.appendChild(handle);
    resizeOverlayRef.current = overlay;
    document.body.appendChild(overlay);
    return overlay;
  };

  const startResize = (event: MouseEvent) => {
    event.preventDefault();
    const img = selectedImageRef.current;
    if (!img) return;
    const startX = event.clientX;
    const startRect = img.getBoundingClientRect();
    const startWidth = startRect.width;
    const startHeight = startRect.height;
    const aspectRatio = startHeight / startWidth || 1;

    const onMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = Math.max(50, startWidth + deltaX);
      const newHeight = newWidth * aspectRatio;
      applySizeToImage(img, newWidth, newHeight);
      positionOverlay();
    };

    const onUp = () => {
      const rect = img.getBoundingClientRect();
      applySizeToImage(img, rect.width, rect.height);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const positionOverlay = () => {
    const img = selectedImageRef.current;
    const overlay = resizeOverlayRef.current;
    if (!img || !overlay) return;
    const rect = img.getBoundingClientRect();
    overlay.style.width = `${rect.width}px`;
    overlay.style.height = `${rect.height}px`;
    overlay.style.left = `${rect.left + window.scrollX}px`;
    overlay.style.top = `${rect.top + window.scrollY}px`;
  };

  const applySizeToImage = (img: HTMLImageElement, width: number, height: number) => {
    img.style.width = `${width}px`;
    img.style.height = `${height}px`;
    const editor = editorRef.current;
    if (!editor) return;
    const blot = Quill.find(img) as any;
    if (blot?.format) {
      blot.format("width", `${width}px`);
      blot.format("height", `${height}px`);
    }
  };

  const attachResizeOverlay = (img: HTMLImageElement) => {
    detachResizeOverlay();
    selectedImageRef.current = img;

    const overlay = ensureResizeOverlay();
    positionOverlay();

    const handle = overlay.querySelector("div");
    if (handle) {
      handle.onmousedown = startResize;
    }
  };

  useEffect(() => {
    if (!containerRef.current) return;
    // Clean up any stray toolbar that Quill may have injected on a prior mount
    const existingToolbar = containerRef.current.previousElementSibling;
    if (existingToolbar?.classList.contains("ql-toolbar")) {
      existingToolbar.remove();
    }

    const editor = new Quill(containerRef.current, {
      theme: "snow",
      modules: quillModules,
      formats: quillFormats,
      placeholder,
    });
    editorRef.current = editor;
    editor.clipboard.dangerouslyPasteHTML(value || "", "silent");

    // Track toolbar Quill adds so we can remove it on cleanup
    const toolbarEl = containerRef.current.previousElementSibling;
    const toolbarModule = editor.getModule("toolbar") as any;
    toolbarModule?.addHandler?.("image", () => fileInputRef.current?.click());
    const imageButton = toolbarEl?.querySelector(".ql-image") as HTMLButtonElement | null;
    if (imageButton) {
      imageButton.title = "Upload image";
    }

    const handleChange = () => onChange(editor.root.innerHTML);
    editor.on("text-change", handleChange);

    return () => {
      editor.off("text-change", handleChange);
      editorRef.current = null;
      if (toolbarEl?.classList.contains("ql-toolbar")) {
        toolbarEl.remove();
      }
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
      detachResizeOverlay();
    };
  }, [onChange, placeholder]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;
    const html = value || "";
    if (editor.root.innerHTML === html) return;
    const selection = editor.getSelection();
    editor.clipboard.dangerouslyPasteHTML(html, "silent");
    if (selection) editor.setSelection(selection);
  }, [value]);

  useEffect(() => {
    const editor = editorRef.current;
    const root = editor?.root;
    if (!editor || !root) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.tagName === "IMG") {
        attachResizeOverlay(target as HTMLImageElement);
      } else {
        detachResizeOverlay();
      }
    };

    const handleScroll = () => positionOverlay();
    const handleResize = () => positionOverlay();

    root.addEventListener("click", handleClick);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      root.removeEventListener("click", handleClick);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
      detachResizeOverlay();
    };
  }, [placeholder]);

  return (
    <div className={`space-y-2 ${className}`}>
      {(label || note) && (
        <div className="flex items-center justify-between">
          {label && <span className="text-sm font-semibold text-gray-800">{label}</span>}
          {note && <span className="text-xs text-gray-500">{note}</span>}
        </div>
      )}
      <div className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm bg-white ring-1 ring-black/5 premium-quill text-gray-800">
        <div ref={containerRef} />
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
