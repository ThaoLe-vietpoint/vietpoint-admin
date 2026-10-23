"use client";
import { useState, useRef, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { uploadImage, MAX_IMAGE_MB } from "@/utils/imageUpload";
import {
  parseBlogImages,
  serializeBlogImages,
  BlogImageConfig,
} from "@/utils/blogImages";
import ImagePickerModal from "./ImagePickerModal";
import { useRouter } from "next/navigation";
import {
  Save,
  ArrowLeft,
  Loader2,
  Trash2,
  Eye,
  EyeOff,
  Bold,
  Italic,
  List,
  Quote,
  Link2,
  ImageIcon,
  Upload,
  Plus,
  Star,
  Copy,
  FilePlus2,
} from "lucide-react";
import Link from "next/link";

type Post = {
  id: string;
  slug?: string;
  title_en: string;
  title_vi: string;
  excerpt_en: string;
  excerpt_vi: string;
  category: string;
  content_en: string;
  content_vi: string;
  image: string;
  published: boolean;
};

function toSlug(text: string): string {
  const map: Record<string, string> = {
    à: "a",
    á: "a",
    ả: "a",
    ã: "a",
    ạ: "a",
    ă: "a",
    ắ: "a",
    ằ: "a",
    ẳ: "a",
    ẵ: "a",
    ặ: "a",
    â: "a",
    ấ: "a",
    ầ: "a",
    ẩ: "a",
    ẫ: "a",
    ậ: "a",
    è: "e",
    é: "e",
    ẻ: "e",
    ẽ: "e",
    ẹ: "e",
    ê: "e",
    ế: "e",
    ề: "e",
    ể: "e",
    ễ: "e",
    ệ: "e",
    ì: "i",
    í: "i",
    ỉ: "i",
    ĩ: "i",
    ị: "i",
    ò: "o",
    ó: "o",
    ỏ: "o",
    õ: "o",
    ọ: "o",
    ô: "o",
    ố: "o",
    ồ: "o",
    ổ: "o",
    ỗ: "o",
    ộ: "o",
    ơ: "o",
    ớ: "o",
    ờ: "o",
    ở: "o",
    ỡ: "o",
    ợ: "o",
    ù: "u",
    ú: "u",
    ủ: "u",
    ũ: "u",
    ụ: "u",
    ư: "u",
    ứ: "u",
    ừ: "u",
    ử: "u",
    ữ: "u",
    ự: "u",
    ỳ: "y",
    ý: "y",
    ỷ: "y",
    ỹ: "y",
    ỵ: "y",
    đ: "d",
    À: "a",
    Á: "a",
    Ả: "a",
    Ã: "a",
    Ạ: "a",
    Ă: "a",
    Ắ: "a",
    Ằ: "a",
    Ẳ: "a",
    Ẵ: "a",
    Ặ: "a",
    Â: "a",
    Ấ: "a",
    Ầ: "a",
    Ẩ: "a",
    Ẫ: "a",
    Ậ: "a",
    È: "e",
    É: "e",
    Ẻ: "e",
    Ẽ: "e",
    Ẹ: "e",
    Ê: "e",
    Ế: "e",
    Ề: "e",
    Ể: "e",
    Ễ: "e",
    Ệ: "e",
    Ì: "i",
    Í: "i",
    Ỉ: "i",
    Ĩ: "i",
    Ị: "i",
    Ò: "o",
    Ó: "o",
    Ỏ: "o",
    Õ: "o",
    Ọ: "o",
    Ô: "o",
    Ố: "o",
    Ồ: "o",
    Ổ: "o",
    Ỗ: "o",
    Ộ: "o",
    Ơ: "o",
    Ớ: "o",
    Ờ: "o",
    Ở: "o",
    Ỡ: "o",
    Ợ: "o",
    Ù: "u",
    Ú: "u",
    Ủ: "u",
    Ũ: "u",
    Ụ: "u",
    Ư: "u",
    Ứ: "u",
    Ừ: "u",
    Ử: "u",
    Ữ: "u",
    Ự: "u",
    Ỳ: "y",
    Ý: "y",
    Ỷ: "y",
    Ỹ: "y",
    Ỵ: "y",
    Đ: "d",
  };
  return text
    .split("")
    .map((c) => map[c] ?? c)
    .join("")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);
}

/* ── HTML (from Word/rich paste) → Markdown ── */
function nodeToMd(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (node.nodeType !== Node.ELEMENT_NODE) return "";
  const el = node as Element;
  const tag = el.tagName.toLowerCase();
  const inner = () => Array.from(el.childNodes).map(nodeToMd).join("");
  switch (tag) {
    case "h1":
      return `# ${inner().trim()}\n\n`;
    case "h2":
      return `## ${inner().trim()}\n\n`;
    case "h3":
      return `### ${inner().trim()}\n\n`;
    case "h4":
    case "h5":
    case "h6":
      return `#### ${inner().trim()}\n\n`;
    case "p": {
      const t = inner().trim();
      return t ? `${t}\n\n` : "";
    }
    case "br":
      return "\n";
    case "strong":
    case "b":
      return `**${inner()}**`;
    case "em":
    case "i":
      return `*${inner()}*`;
    case "u":
      return inner();
    case "s":
    case "strike":
    case "del":
      return `~~${inner()}~~`;
    case "blockquote":
      return (
        inner()
          .trim()
          .split("\n")
          .map((l) => `> ${l}`)
          .join("\n") + "\n\n"
      );
    case "li":
      return `- ${inner().trim()}\n`;
    case "ul":
    case "ol":
      return `${inner()}\n`;
    case "a":
      return `[${inner()}](${el.getAttribute("href") ?? ""})`;
    case "code":
      return `\`${inner()}\``;
    case "pre":
      return `\`\`\`\n${inner().trim()}\n\`\`\`\n\n`;
    case "hr":
      return `---\n\n`;
    case "table":
      return inner() + "\n";
    case "tr":
      return `| ${Array.from(el.querySelectorAll("td,th"))
        .map((c) => (c.textContent ?? "").trim())
        .join(" | ")} |\n`;
    case "thead":
      return inner();
    case "tbody":
      return inner();
    case "img":
      return `![${el.getAttribute("alt") ?? ""}](${el.getAttribute("src") ?? ""})`;
    default:
      return inner();
  }
}
function htmlToMarkdown(html: string): string {
  const div = document.createElement("div");
  div.innerHTML = html;
  // Remove Word's XML/meta nodes
  div
    .querySelectorAll("style,script,meta,link,[class*='MsoNormal']")
    .forEach((n) => {
      // preserve text, just unwrap
      n.replaceWith(document.createTextNode(n.textContent ?? ""));
    });
  return nodeToMd(div)
    .replace(/\n{3,}/g, "\n\n") // collapse extra blank lines
    .trim();
}

/* ── Minimal markdown → HTML for preview ── */
function simpleMarkdown(md: string): string {
  // Preserve <span style="color:..."> before HTML-escaping
  const spans: string[] = [];
  const withPlaceholders = md.replace(
    /<span style="color:([^"]+)">([^<]*)<\/span>/g,
    (_, color, text) => {
      const i = spans.length;
      spans.push(`<span style="color:${color}">${text}</span>`);
      return `\x00SPAN${i}\x00`;
    },
  );
  const escaped = withPlaceholders
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const lines = escaped.split("\n");
  const out: string[] = [];
  let inList = false;
  for (const line of lines) {
    if (/^### /.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(
        `<h3 style="font-size:15px;font-weight:700;margin:14px 0 4px">${inlineMd(line.slice(4))}</h3>`,
      );
    } else if (/^## /.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(
        `<h2 style="font-size:17px;font-weight:700;margin:18px 0 6px">${inlineMd(line.slice(3))}</h2>`,
      );
    } else if (/^# /.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(
        `<h1 style="font-size:20px;font-weight:700;margin:20px 0 8px">${inlineMd(line.slice(2))}</h1>`,
      );
    } else if (/^> /.test(line)) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(
        `<blockquote style="border-left:3px solid #93c5fd;padding-left:10px;color:#64748b;font-style:italic;margin:8px 0">${inlineMd(line.slice(2))}</blockquote>`,
      );
    } else if (/^[-*] /.test(line)) {
      if (!inList) {
        out.push('<ul style="list-style:disc;padding-left:20px;margin:8px 0">');
        inList = true;
      }
      out.push(
        `<li style="margin:3px 0;font-size:13px;color:#374151">${inlineMd(line.slice(2))}</li>`,
      );
    } else if (line.trim() === "") {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push('<div style="height:8px"></div>');
    } else {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(
        `<p style="font-size:13px;color:#374151;margin-bottom:8px;line-height:1.7">${inlineMd(line)}</p>`,
      );
    }
  }
  if (inList) out.push("</ul>");
  let result = out.join("\n");
  // Restore color spans
  spans.forEach((s, i) => {
    result = result.replace(`\x00SPAN${i}\x00`, s);
  });
  return result;
}
function inlineMd(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(
      /`(.+?)`/g,
      '<code style="background:#f1f5f9;padding:1px 5px;border-radius:4px;font-size:11px;font-family:monospace">$1</code>',
    )
    .replace(
      /\[(.+?)\]\((.+?)\)/g,
      '<a href="$2" style="color:#2563eb;text-decoration:underline" target="_blank">$1</a>',
    );
}

const TEXT_COLORS = [
  { hex: "#ef4444", label: "Đỏ" },
  { hex: "#f97316", label: "Cam" },
  { hex: "#eab308", label: "Vàng" },
  { hex: "#22c55e", label: "Xanh lá" },
  { hex: "#14b8a6", label: "Xanh ngọc" },
  { hex: "#3b82f6", label: "Xanh dương" },
  { hex: "#2F5E9E", label: "Navy" },
  { hex: "#a855f7", label: "Tím" },
  { hex: "#ec4899", label: "Hồng" },
  { hex: "#64748b", label: "Xám" },
  { hex: "#1e293b", label: "Đen" },
];

const CATEGORIES = [
  "Featured post",
  "Insurance Knowledge",
  "Customer stories",
  "Health - Life",
  "Investment, Saving & Retire",
  "Event",
  "IUL",
  "Medicare",
  "ACA Marketplace",
  "Auto Insurance",
  "Financial Planning",
  "General",
];

/* ── Component ── */
export default function BlogPostForm({ post }: { post?: Post }) {
  const router = useRouter();
  const isEdit = !!post;
  const [lang, setLang] = useState<"vi" | "en">("vi");
  const [preview, setPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [activeColor, setActiveColor] = useState("#ef4444");
  const editorRef = useRef<HTMLDivElement | null>(null);
  const imageFileRef = useRef<HTMLInputElement | null>(null);
  const coverFileRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [libraryTarget, setLibraryTarget] = useState<"cover" | "editor" | null>(
    null,
  );
  const savedEditorRange = useRef<Range | null>(null);
  const [selectedImg, setSelectedImg] = useState<HTMLImageElement | null>(null);
  const [urlDialog, setUrlDialog] = useState<{
    type: "link" | "image";
    value: string;
    savedRange: Range | null;
  } | null>(null);

  const slugEdited = useRef(!!post?.slug);

  const [imgConfig, setImgConfig] = useState<BlogImageConfig>(() =>
    parseBlogImages(post?.image),
  );
  const [imgLangTab, setImgLangTab] = useState<"vi" | "en">("vi");
  const [newImgUrl, setNewImgUrl] = useState("");

  const [form, setForm] = useState({
    slug: post?.slug ?? "",
    title_en: post?.title_en ?? "",
    title_vi: post?.title_vi ?? "",
    excerpt_en: post?.excerpt_en ?? "",
    excerpt_vi: post?.excerpt_vi ?? "",
    category: post?.category ?? "General",
    content_en: post?.content_en ?? "",
    content_vi: post?.content_vi ?? "",
    image: post?.image ?? "",
    published: post?.published ?? false,
  });

  const set = (k: keyof typeof form, v: string | boolean) =>
    setForm((prev) => ({ ...prev, [k]: v }));

  const updateImgConfig = (
    updater: (prev: BlogImageConfig) => BlogImageConfig,
  ) => {
    setImgConfig((prev) => {
      const next = updater(prev);
      const serialized = serializeBlogImages(next);
      setForm((f) => ({ ...f, image: serialized }));
      return next;
    });
  };

  const activeBucketKey: "shared" | "vi" | "en" =
    imgConfig.mode === "shared" ? "shared" : imgLangTab;
  const activeImages = imgConfig[activeBucketKey];

  const addImagesToBucket = (
    urls: string[],
    bucket: "shared" | "vi" | "en" = activeBucketKey,
  ) => {
    const clean = urls.map((u) => u.trim()).filter(Boolean);
    if (clean.length === 0) return;
    updateImgConfig((prev) => ({
      ...prev,
      [bucket]: [...prev[bucket], ...clean],
    }));
  };

  const removeImageFromBucket = (
    index: number,
    bucket: "shared" | "vi" | "en" = activeBucketKey,
  ) => {
    updateImgConfig((prev) => ({
      ...prev,
      [bucket]: prev[bucket].filter((_, idx) => idx !== index),
    }));
  };

  const setPrimaryImageInBucket = (
    index: number,
    bucket: "shared" | "vi" | "en" = activeBucketKey,
  ) => {
    if (index <= 0) return;
    updateImgConfig((prev) => {
      const list = [...prev[bucket]];
      const [picked] = list.splice(index, 1);
      list.unshift(picked);
      return { ...prev, [bucket]: list };
    });
  };

  // Auto-generate slug from title when slug hasn't been manually edited
  // Priority: title_en (cleaner slug) → title_vi (fallback, Vietnamese chars transliterated)
  useEffect(() => {
    if (!slugEdited.current) {
      const source = form.title_en || form.title_vi;
      if (source) {
        setForm((prev) => ({ ...prev, slug: toSlug(source) }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.title_en, form.title_vi]);

  // Initialize editor and sync on language switch
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.innerHTML =
        lang === "vi" ? form.content_vi : form.content_en;
    }
    setImgLangTab(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  const rawText = (lang === "vi" ? form.content_vi : form.content_en).replace(
    /<[^>]+>/g,
    "",
  );
  const wordCount = rawText.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.round(wordCount / 200));

  /* Execute rich-text command on the editor */
  const execCmd = (cmd: string, value?: string) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value ?? undefined);
    requestAnimationFrame(() => {
      if (editorRef.current) {
        set(
          lang === "vi" ? "content_vi" : "content_en",
          editorRef.current.innerHTML,
        );
      }
    });
  };

  /* Insert one or multiple images at saved cursor position */
  const insertImagesInEditor = (urls: string[]) => {
    const clean = urls.map((u) => u.trim()).filter(Boolean);
    if (clean.length === 0) return;
    const editor = editorRef.current;
    if (!editor) return;
    editor.focus();
    if (savedEditorRange.current) {
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(savedEditorRange.current);
      savedEditorRange.current = null;
    }
    const html = clean
      .map(
        (url) =>
          `<img src="${url}" style="max-width:100%;height:auto;display:block;margin:8px 0;border-radius:6px;" />`,
      )
      .join("<p><br/></p>");
    document.execCommand("insertHTML", false, html);
    requestAnimationFrame(() => {
      if (editor)
        set(lang === "vi" ? "content_vi" : "content_en", editor.innerHTML);
    });
  };

  const insertImageInEditor = (url: string) => insertImagesInEditor([url]);

  const syncEditorContent = () => {
    requestAnimationFrame(() => {
      if (editorRef.current)
        set(
          lang === "vi" ? "content_vi" : "content_en",
          editorRef.current.innerHTML,
        );
    });
  };

  /* Apply text color using CSS spans */
  const applyColor = (color: string) => {
    editorRef.current?.focus();
    document.execCommand("styleWithCSS", false, "true");
    document.execCommand("foreColor", false, color);
    document.execCommand("styleWithCSS", false, "false");
    requestAnimationFrame(() => {
      if (editorRef.current) {
        set(
          lang === "vi" ? "content_vi" : "content_en",
          editorRef.current.innerHTML,
        );
      }
    });
  };

  const toolbarItems = [
    {
      label: "Tiêu đề H2",
      icon: <span className="text-[11px] font-bold">H2</span>,
      action: () => execCmd("formatBlock", "h2"),
    },
    {
      label: "Tiêu đề H3",
      icon: <span className="text-[11px] font-bold">H3</span>,
      action: () => execCmd("formatBlock", "h3"),
    },
    {
      label: "In đậm",
      icon: <Bold size={13} />,
      action: () => execCmd("bold"),
    },
    {
      label: "In nghiêng",
      icon: <Italic size={13} />,
      action: () => execCmd("italic"),
    },
    {
      label: "Danh sách",
      icon: <List size={13} />,
      action: () => execCmd("insertUnorderedList"),
    },
    {
      label: "Trích dẫn",
      icon: <Quote size={13} />,
      action: () => execCmd("formatBlock", "blockquote"),
    },
    {
      label: "Chèn liên kết",
      icon: <Link2 size={13} />,
      action: () => {
        const sel = window.getSelection();
        const savedRange =
          sel && sel.rangeCount > 0 ? sel.getRangeAt(0).cloneRange() : null;
        setUrlDialog({ type: "link", value: "https://", savedRange });
      },
    },
    {
      label: "Chèn 1 hoặc nhiều ảnh",
      icon: <ImageIcon size={13} />,
      action: () => {
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0)
          savedEditorRange.current = sel.getRangeAt(0).cloneRange();
        setUrlDialog({ type: "image", value: "", savedRange: null });
      },
    },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createClient();
    const serializedImage = serializeBlogImages(imgConfig);
    const payload = {
      ...form,
      image: serializedImage,
      updated_at: new Date().toISOString(),
    };
    const { error: err } = isEdit
      ? await supabase.from("blog_posts").update(payload).eq("id", post.id)
      : await supabase.from("blog_posts").insert(payload);
    if (err) {
      setError(err.message);
      setSaving(false);
    } else {
      router.push("/blog");
      router.refresh();
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const supabase = createClient();
    await supabase.from("blog_posts").delete().eq("id", post!.id);
    router.push("/blog");
    router.refresh();
  };

  const handleImageUpload = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (fileArr.length === 0) return;
    for (const file of fileArr) {
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        setError(
          `Ảnh "${file.name}" vượt quá ${MAX_IMAGE_MB}MB. Vui lòng chọn ảnh nhỏ hơn.`,
        );
        return;
      }
    }
    setUploading(true);
    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];
      for (const file of fileArr) {
        const url = await uploadImage(file, supabase);
        uploadedUrls.push(url);
      }
      insertImagesInEditor(uploadedUrls);
      setUrlDialog(null);
    } catch (err) {
      console.error("Upload lỗi:", err);
      setError(
        "Upload thất bại. Kiểm tra bucket 'images' đã tạo trong Supabase Storage chưa.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleCoverUpload = async (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (fileArr.length === 0) return;
    for (const file of fileArr) {
      if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        setError(`Ảnh "${file.name}" vượt quá ${MAX_IMAGE_MB}MB.`);
        return;
      }
    }
    setCoverUploading(true);
    try {
      const supabase = createClient();
      const uploadedUrls: string[] = [];
      for (const file of fileArr) {
        const url = await uploadImage(file, supabase);
        uploadedUrls.push(url);
      }
      addImagesToBucket(uploadedUrls, activeBucketKey);
    } catch (err) {
      console.error("Upload ảnh bài viết lỗi:", err);
      setError(
        "Upload thất bại. Kiểm tra bucket 'images' đã tạo trong Supabase Storage chưa.",
      );
    } finally {
      setCoverUploading(false);
    }
  };

  return (
    <>
      {/* Hidden file input for editor image upload (supports multiple) */}
      <input
        ref={imageFileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleImageUpload(e.target.files);
          }
          e.target.value = "";
        }}
      />
      {/* Hidden file input for post cover/gallery upload (supports multiple) */}
      <input
        ref={coverFileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleCoverUpload(e.target.files);
          }
          e.target.value = "";
        }}
      />
      {/* ── URL Input Dialog (replaces window.prompt) ── */}
      {urlDialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setUrlDialog(null);
          }}
        >
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-md mx-4 space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">
              {urlDialog.type === "link"
                ? "Chèn liên kết"
                : `Chèn ảnh vào nội dung (${lang === "vi" ? "🇻🇳 Tiếng Việt" : "🇺🇸 English"})`}
            </h3>
            {urlDialog.type === "link" ? (
              <input
                autoFocus
                type="url"
                value={urlDialog.value}
                onChange={(e) =>
                  setUrlDialog((d) => d && { ...d, value: e.target.value })
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const url = urlDialog.value;
                    if (url && url !== "https://") {
                      editorRef.current?.focus();
                      if (urlDialog.savedRange) {
                        const sel = window.getSelection();
                        sel?.removeAllRanges();
                        sel?.addRange(urlDialog.savedRange);
                        execCmd("createLink", url);
                      }
                    }
                    setUrlDialog(null);
                  }
                  if (e.key === "Escape") setUrlDialog(null);
                }}
                placeholder="https://"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
              />
            ) : (
              <div>
                <textarea
                  autoFocus
                  rows={3}
                  value={urlDialog.value}
                  onChange={(e) =>
                    setUrlDialog((d) => d && { ...d, value: e.target.value })
                  }
                  placeholder={
                    "Dán 1 hoặc nhiều URL ảnh (mỗi dòng 1 URL)...\nhttps://example.com/anh-1.jpg\nhttps://example.com/anh-2.jpg"
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
                />
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setUrlDialog(null)}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Huỷ
              </button>
              <button
                type="button"
                onClick={() => {
                  const val = urlDialog.value.trim();
                  if (val && val !== "https://") {
                    editorRef.current?.focus();
                    if (urlDialog.type === "link" && urlDialog.savedRange) {
                      const sel = window.getSelection();
                      sel?.removeAllRanges();
                      sel?.addRange(urlDialog.savedRange);
                      execCmd("createLink", val);
                    } else if (urlDialog.type === "image") {
                      const urls = val
                        .split(/[\n,]+/)
                        .map((u) => u.trim())
                        .filter(Boolean);
                      insertImagesInEditor(urls);
                    }
                  }
                  setUrlDialog(null);
                }}
                className="px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                Xác nhận
              </button>
            </div>

            {/* Upload from device — only for image dialog */}
            {urlDialog.type === "image" && (
              <>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-slate-100" />
                  <span className="text-xs text-slate-400">hoặc chọn nhiều ảnh</span>
                  <div className="flex-1 h-px bg-slate-100" />
                </div>
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => imageFileRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition-colors disabled:opacity-50"
                >
                  {uploading ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Upload size={14} />
                      Tải 1 hoặc nhiều ảnh từ thiết bị
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const sel = window.getSelection();
                    if (sel && sel.rangeCount > 0)
                      savedEditorRange.current = sel.getRangeAt(0).cloneRange();
                    setUrlDialog(null);
                    setLibraryTarget("editor");
                  }}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-dashed border-slate-300 rounded-xl text-sm text-slate-600 hover:bg-slate-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  <ImageIcon size={14} />
                  Chọn 1 hoặc nhiều ảnh từ thư viện
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {libraryTarget && (
        <ImagePickerModal
          multiple
          onSelect={(url) => {
            if (libraryTarget === "cover") {
              addImagesToBucket([url], activeBucketKey);
            } else {
              insertImageInEditor(url);
            }
          }}
          onSelectMultiple={(urls) => {
            if (libraryTarget === "cover") {
              addImagesToBucket(urls, activeBucketKey);
            } else {
              insertImagesInEditor(urls);
            }
          }}
          onClose={() => setLibraryTarget(null)}
        />
      )}

      {/* ── Floating image toolbar ── */}
      {selectedImg &&
        !preview &&
        (() => {
          const rect = selectedImg.getBoundingClientRect();
          const top = rect.top + window.scrollY - 46;
          const left = Math.max(
            8,
            Math.min(rect.left, window.innerWidth - 220),
          );
          const setWidth = (w: string) => {
            selectedImg.style.width = w;
            selectedImg.style.maxWidth = w;
            syncEditorContent();
          };
          return (
            <div
              style={{ position: "absolute", top, left, zIndex: 200 }}
              className="flex items-center gap-0.5 bg-slate-800/95 text-white rounded-xl px-2 py-1.5 shadow-2xl border border-slate-600/50 backdrop-blur-sm"
              onMouseDown={(e) => e.preventDefault()}
            >
              <span className="text-[10px] text-slate-400 pr-1.5 border-r border-slate-600 mr-1">
                Ảnh
              </span>
              <button
                type="button"
                title="Nhỏ (33%)"
                onClick={() => setWidth("33%")}
                className="text-[11px] font-bold px-1.5 py-0.5 hover:bg-white/20 rounded transition-colors"
              >
                S
              </button>
              <button
                type="button"
                title="Vừa (60%)"
                onClick={() => setWidth("60%")}
                className="text-[11px] font-bold px-1.5 py-0.5 hover:bg-white/20 rounded transition-colors"
              >
                M
              </button>
              <button
                type="button"
                title="Toàn chiều rộng"
                onClick={() => setWidth("100%")}
                className="text-[11px] font-bold px-1.5 py-0.5 hover:bg-white/20 rounded transition-colors"
              >
                Full
              </button>
              <div className="w-px h-3.5 bg-white/25 mx-1" />
              <button
                type="button"
                title="Xoá ảnh này"
                onClick={() => {
                  selectedImg.remove();
                  setSelectedImg(null);
                  syncEditorContent();
                }}
                className="flex items-center justify-center p-0.5 hover:bg-red-500/80 rounded transition-colors"
              >
                <Trash2 size={12} />
              </button>
            </div>
          );
        })()}

      <form onSubmit={handleSave} className="space-y-6 max-w-5xl">
        {/* ── Header ── */}
        <div className="flex items-center gap-3 flex-wrap">
          <Link
            href="/blog"
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
            Quay lại
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-slate-800">
              {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h1>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {isEdit && !confirmDelete && (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 border border-red-200 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} /> Xoá
              </button>
            )}
            {confirmDelete && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
                <span className="text-xs text-red-700 font-semibold">
                  Xác nhận xoá?
                </span>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="text-xs font-bold text-red-600 hover:text-red-800 px-2.5 py-1 bg-white rounded-lg border border-red-200"
                >
                  {deleting ? (
                    <Loader2 size={11} className="animate-spin" />
                  ) : (
                    "Xoá"
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1"
                >
                  Huỷ
                </button>
              </div>
            )}
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {saving ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}
              {saving
                ? "Đang lưu..."
                : isEdit
                  ? "Lưu thay đổi"
                  : "Tạo bài viết"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* ── Main editor ── */}
          <div className="xl:col-span-2 space-y-5">
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {/* Language tabs */}
              <div className="flex border-b border-slate-100">
                {(["vi", "en"] as const).map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => {
                      setLang(l);
                      setPreview(false);
                    }}
                    className={`flex-1 py-3.5 text-sm font-semibold transition-colors ${
                      lang === l
                        ? "bg-blue-50 text-blue-700 border-b-2 border-blue-600"
                        : "text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {l === "vi" ? "🇻🇳 Tiếng Việt" : "🇺🇸 English"}
                  </button>
                ))}
              </div>

              <div className="p-5 space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    {lang === "vi" ? "Tiêu đề" : "Title"}
                  </label>
                  <input
                    type="text"
                    value={lang === "vi" ? form.title_vi : form.title_en}
                    onChange={(e) =>
                      set(
                        lang === "vi" ? "title_vi" : "title_en",
                        e.target.value,
                      )
                    }
                    placeholder={
                      lang === "vi"
                        ? "Nhập tiêu đề bài viết..."
                        : "Enter post title..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-[15px] font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                  />
                </div>

                {/* Slug — language-agnostic, auto-generated from title_en */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    Slug (URL)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={form.slug}
                      onChange={(e) => {
                        slugEdited.current = true;
                        set(
                          "slug",
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9-]/g, "-")
                            .replace(/-+/g, "-"),
                        );
                      }}
                      placeholder="tu-dong-tao-tu-tieu-de-tieng-anh"
                      className="flex-1 min-w-0 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        slugEdited.current = false;
                        set("slug", toSlug(form.title_en));
                      }}
                      className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-500 hover:bg-slate-50 transition-colors shrink-0"
                      title="Tạo slug từ tiêu đề tiếng Anh"
                    >
                      ↺
                    </button>
                  </div>
                  <p className="mt-1 text-[11px] text-slate-400">
                    {form.slug ? (
                      <>
                        URL: /blog/
                        <span className="text-blue-500">{form.slug}</span>
                      </>
                    ) : (
                      "Tự động tạo từ tiêu đề tiếng Anh"
                    )}
                  </p>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                    {lang === "vi" ? "Tóm tắt" : "Excerpt"}
                  </label>
                  <textarea
                    value={lang === "vi" ? form.excerpt_vi : form.excerpt_en}
                    onChange={(e) =>
                      set(
                        lang === "vi" ? "excerpt_vi" : "excerpt_en",
                        e.target.value,
                      )
                    }
                    rows={2}
                    placeholder={
                      lang === "vi"
                        ? "Đoạn mô tả ngắn hiển thị ở trang danh sách bài viết..."
                        : "Short description shown in blog listing..."
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all resize-none"
                  />
                </div>

                {/* Content */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      {lang === "vi" ? "Nội dung" : "Content"}
                    </label>
                    <div className="flex items-center gap-2.5">
                      <span className="text-[11px] text-slate-400 bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                        {wordCount} từ · ~{readingTime} phút đọc
                      </span>
                      <button
                        type="button"
                        onClick={() => setPreview(!preview)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition-colors ${
                          preview
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {preview ? (
                          <>
                            <EyeOff size={11} /> Chỉnh sửa
                          </>
                        ) : (
                          <>
                            <Eye size={11} /> Xem trước
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Toolbar */}
                  {!preview && (
                    <div className="flex items-center gap-0.5 px-2 py-1.5 bg-slate-50 border border-b-0 border-slate-200 rounded-t-xl">
                      {toolbarItems.map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            item.action();
                          }}
                          title={item.label}
                          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm transition-all min-w-7 flex items-center justify-center"
                        >
                          {item.icon}
                        </button>
                      ))}
                      {/* Separator */}
                      <div className="w-px h-4 bg-slate-200 mx-0.5" />
                      {/* Color picker */}
                      <div className="relative">
                        <button
                          type="button"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setColorPickerOpen((v) => !v);
                          }}
                          title="Màu chữ"
                          className="p-1.5 rounded-md text-slate-500 hover:text-slate-800 hover:bg-white hover:shadow-sm transition-all min-w-7 flex flex-col items-center justify-center gap-0.75"
                        >
                          <span className="text-[11px] font-bold leading-none text-slate-700">
                            A
                          </span>
                          <span
                            className="w-3.5 h-0.75 rounded-full"
                            style={{ background: activeColor }}
                          />
                        </button>
                        {colorPickerOpen && (
                          <div
                            className="absolute top-full left-0 mt-1.5 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 grid grid-cols-4 gap-1.5"
                            style={{ width: 120 }}
                          >
                            {TEXT_COLORS.map(({ hex, label }) => (
                              <button
                                key={hex}
                                type="button"
                                title={label}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setActiveColor(hex);
                                  setColorPickerOpen(false);
                                  applyColor(hex);
                                }}
                                className="w-6 h-6 rounded-full border-2 hover:scale-110 transition-transform"
                                style={{
                                  background: hex,
                                  borderColor:
                                    hex === activeColor
                                      ? "#1e293b"
                                      : "transparent",
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex-1" />
                    </div>
                  )}

                  {/* WYSIWYG editor — always rendered, contentEditable toggled by preview */}
                  <div
                    ref={editorRef}
                    contentEditable={!preview}
                    suppressContentEditableWarning
                    onInput={() => {
                      if (editorRef.current) {
                        set(
                          lang === "vi" ? "content_vi" : "content_en",
                          editorRef.current.innerHTML,
                        );
                      }
                    }}
                    onClick={(e) => {
                      const t = e.target as HTMLElement;
                      if (t.tagName === "IMG") {
                        e.preventDefault();
                        setSelectedImg(t as HTMLImageElement);
                      } else {
                        setSelectedImg(null);
                      }
                    }}
                    style={{ minHeight: "380px" }}
                    className={`article-content w-full px-5 py-4 border border-slate-200 bg-white transition-all outline-none
                    ${
                      !preview
                        ? "rounded-b-xl focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 cursor-text"
                        : "rounded-xl bg-slate-50/50 select-none pointer-events-none"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Settings sidebar ── */}
          <div className="space-y-4">
            {/* Cover & Gallery Images (Multi-image + Optional VI/EN) */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700">
                    Hình ảnh bài viết
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Hỗ trợ nhiều ảnh · Tuỳ chọn tách ảnh VI / EN
                  </p>
                </div>
                {activeImages.length > 0 && (
                  <button
                    type="button"
                    onClick={() =>
                      updateImgConfig((prev) => ({
                        ...prev,
                        [activeBucketKey]: [],
                      }))
                    }
                    className="text-[11px] text-red-500 hover:text-red-700 transition-colors font-medium"
                  >
                    Xoá hết ({activeImages.length})
                  </button>
                )}
              </div>

              {/* Mode toggle: Dùng chung vs Tách riêng VI / EN */}
              <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() =>
                    updateImgConfig((prev) => {
                      const merged =
                        prev.shared.length > 0
                          ? prev.shared
                          : prev.vi.length > 0
                            ? prev.vi
                            : prev.en;
                      return { ...prev, mode: "shared", shared: merged };
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    imgConfig.mode === "shared"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  🌐 Dùng chung ({imgConfig.shared.length})
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateImgConfig((prev) => {
                      const nextVi =
                        prev.vi.length > 0 ? prev.vi : [...prev.shared];
                      return {
                        ...prev,
                        mode: "separate",
                        vi: nextVi,
                      };
                    })
                  }
                  className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-all ${
                    imgConfig.mode === "separate"
                      ? "bg-white text-blue-700 shadow-xs"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  🇻🇳/🇺🇸 Riêng VI · EN
                </button>
              </div>

              {/* Separate VI / EN language sub-tabs */}
              {imgConfig.mode === "separate" && (
                <div className="space-y-2">
                  <div className="flex gap-1.5">
                    <button
                      type="button"
                      onClick={() => setImgLangTab("vi")}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        imgLangTab === "vi"
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      🇻🇳 Hình VI
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white border border-slate-200">
                        {imgConfig.vi.length}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setImgLangTab("en")}
                      className={`flex-1 py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all flex items-center justify-center gap-1.5 ${
                        imgLangTab === "en"
                          ? "bg-blue-50 border-blue-200 text-blue-700"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      🇺🇸 Hình EN
                      <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white border border-slate-200">
                        {imgConfig.en.length}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg bg-amber-50/70 border border-amber-100 text-[11px] text-amber-700">
                    <span>
                      Không bắt buộc cả hai — nếu để trống 1 bên sẽ tự dùng ảnh bên kia.
                    </span>
                  </div>

                  {/* Quick copy between VI and EN */}
                  {imgLangTab === "en" &&
                    imgConfig.en.length === 0 &&
                    imgConfig.vi.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateImgConfig((prev) => ({
                            ...prev,
                            en: [...prev.vi],
                          }))
                        }
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50/60 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"
                      >
                        <Copy size={11} /> Sao chép {imgConfig.vi.length} ảnh từ VI sang EN
                      </button>
                    )}
                  {imgLangTab === "vi" &&
                    imgConfig.vi.length === 0 &&
                    imgConfig.en.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          updateImgConfig((prev) => ({
                            ...prev,
                            vi: [...prev.en],
                          }))
                        }
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-semibold text-blue-600 bg-blue-50/60 hover:bg-blue-50 rounded-lg border border-blue-100 transition-colors"
                      >
                        <Copy size={11} /> Sao chép {imgConfig.en.length} ảnh từ EN sang VI
                      </button>
                    )}
                </div>
              )}

              {/* Primary cover preview + Image Gallery list */}
              {activeImages.length > 0 ? (
                <div className="space-y-2.5">
                  {/* Cover image (#1) */}
                  <div className="rounded-xl overflow-hidden border border-blue-200 bg-slate-50 relative group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={activeImages[0]}
                      alt="Cover preview"
                      className="w-full object-cover"
                      style={{ height: "145px" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100'%3E%3Crect fill='%23f1f5f9' width='100%25' height='100'/%3E%3Ctext fill='%2394a3b8' x='50%25' y='55' font-size='11' text-anchor='middle' font-family='sans-serif'%3EKhông load được ảnh%3C/text%3E%3C/svg%3E";
                      }}
                    />
                    <span className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-600 text-white shadow">
                      <Star size={10} fill="currentColor" /> Ảnh bìa chính
                      {imgConfig.mode === "separate"
                        ? ` (${imgLangTab.toUpperCase()})`
                        : ""}
                    </span>
                    <div className="absolute bottom-2 right-2 flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => insertImageInEditor(activeImages[0])}
                        title="Chèn ảnh này vào nội dung bài viết"
                        className="px-2 py-1 rounded-lg bg-slate-900/80 hover:bg-blue-600 text-white text-[10px] font-semibold flex items-center gap-1 transition-colors backdrop-blur-xs"
                      >
                        <FilePlus2 size={11} /> Chèn vào bài
                      </button>
                      <button
                        type="button"
                        onClick={() => removeImageFromBucket(0)}
                        title="Xoá ảnh này"
                        className="p-1 rounded-lg bg-red-600/90 hover:bg-red-700 text-white transition-colors"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>

                  {/* Additional images list (#2, #3, ...) */}
                  {activeImages.length > 1 && (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-semibold text-slate-500">
                          Danh sách ảnh ({activeImages.length} ảnh)
                        </span>
                        <button
                          type="button"
                          onClick={() => insertImagesInEditor(activeImages)}
                          className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                        >
                          <FilePlus2 size={11} /> Chèn cả {activeImages.length} ảnh vào bài
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-0.5">
                        {activeImages.map((imgUrl, idx) => (
                          <div
                            key={`${imgUrl}-${idx}`}
                            className={`relative rounded-xl overflow-hidden border group ${
                              idx === 0
                                ? "border-blue-400 ring-1 ring-blue-300"
                                : "border-slate-200"
                            }`}
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={imgUrl}
                              alt={`Image ${idx + 1}`}
                              className="w-full h-20 object-cover bg-slate-50"
                            />
                            <span
                              className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                idx === 0
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-900/75 text-white"
                              }`}
                            >
                              {idx === 0 ? "★ Bìa" : `#${idx + 1}`}
                            </span>
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-1.5 flex items-center justify-end gap-1 opacity-95 group-hover:opacity-100 transition-opacity">
                              {idx > 0 && (
                                <button
                                  type="button"
                                  onClick={() => setPrimaryImageInBucket(idx)}
                                  title="Đặt làm ảnh bìa chính"
                                  className="px-1.5 py-0.5 rounded bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold"
                                >
                                  Đặt bìa
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => insertImageInEditor(imgUrl)}
                                title="Chèn vào nội dung"
                                className="px-1.5 py-0.5 rounded bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-semibold"
                              >
                                Chèn
                              </button>
                              <button
                                type="button"
                                onClick={() => removeImageFromBucket(idx)}
                                title="Xoá ảnh"
                                className="p-1 rounded bg-red-600 hover:bg-red-700 text-white"
                              >
                                <Trash2 size={10} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-4 text-center">
                  <ImageIcon size={22} className="mx-auto text-slate-300 mb-1" />
                  <p className="text-xs text-slate-500 font-medium">
                    {imgConfig.mode === "separate"
                      ? `Chưa có ảnh riêng cho ${imgLangTab === "vi" ? "🇻🇳 Tiếng Việt" : "🇺🇸 English"}`
                      : "Chưa có hình ảnh nào"}
                  </p>
                  {imgConfig.mode === "separate" && (
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Nếu để trống, web tự dùng ảnh của ngôn ngữ còn lại
                    </p>
                  )}
                </div>
              )}

              {/* Action buttons: Upload multiple files or Pick multiple from Library */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => coverFileRef.current?.click()}
                  disabled={coverUploading}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors disabled:opacity-50"
                >
                  {coverUploading ? (
                    <Loader2 size={13} className="animate-spin text-blue-600" />
                  ) : (
                    <Upload size={13} />
                  )}
                  Tải 1 / nhiều ảnh
                </button>
                <button
                  type="button"
                  onClick={() => setLibraryTarget("cover")}
                  className="flex items-center justify-center gap-1.5 py-2 px-3 text-xs font-semibold text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl border border-slate-200 transition-colors"
                >
                  <ImageIcon size={13} />
                  Chọn từ thư viện
                </button>
              </div>

              {/* Add image by URL */}
              <div className="flex gap-1.5">
                <input
                  type="url"
                  value={newImgUrl}
                  onChange={(e) => setNewImgUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      if (newImgUrl.trim()) {
                        addImagesToBucket(
                          newImgUrl.split(/[\n,]+/),
                          activeBucketKey,
                        );
                        setNewImgUrl("");
                      }
                    }
                  }}
                  placeholder="Dán URL ảnh rồi nhấn + để thêm..."
                  className="flex-1 min-w-0 px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (newImgUrl.trim()) {
                      addImagesToBucket(
                        newImgUrl.split(/[\n,]+/),
                        activeBucketKey,
                      );
                      setNewImgUrl("");
                    }
                  }}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold flex items-center gap-1 shrink-0 transition-colors"
                  title="Thêm URL ảnh"
                >
                  <Plus size={13} /> Thêm
                </button>
              </div>
            </div>

            {/* Post settings */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
              <h3 className="text-sm font-semibold text-slate-700">Cài đặt</h3>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                  Danh mục
                </label>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 transition-all bg-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">
                  Trạng thái
                </label>
                <label className="flex items-center gap-3 cursor-pointer select-none p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={(e) => set("published", e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-11 h-6 rounded-full transition-colors ${
                        form.published ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full shadow absolute top-0.5 transition-transform ${
                          form.published ? "translate-x-5" : "translate-x-0.5"
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        form.published ? "text-emerald-700" : "text-slate-700"
                      }`}
                    >
                      {form.published ? "Xuất bản" : "Bản nháp"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {form.published
                        ? "Hiển thị trên website"
                        : "Chỉ lưu nội bộ"}
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
