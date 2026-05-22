"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
  uploadImage,
  IMAGE_BUCKET,
  IMAGE_FOLDER,
  MAX_IMAGE_MB,
} from "@/utils/imageUpload";
import {
  ImageIcon,
  Upload,
  Trash2,
  Copy,
  Check,
  Loader2,
  X,
} from "lucide-react";

type StoredImage = {
  name: string;
  url: string;
  created_at: string | null;
};

export default function MediaPage() {
  const supabase = createClient();
  const dropRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [images, setImages] = useState<StoredImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const loadImages = useCallback(async () => {
    setLoading(true);
    const { data, error: err } = await supabase.storage
      .from(IMAGE_BUCKET)
      .list(IMAGE_FOLDER, {
        limit: 200,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (err) {
      setError("Không thể tải danh sách ảnh: " + err.message);
      setLoading(false);
      return;
    }

    const items: StoredImage[] = (data ?? [])
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map((f) => {
        const { data: urlData } = supabase.storage
          .from(IMAGE_BUCKET)
          .getPublicUrl(`${IMAGE_FOLDER}/${f.name}`);
        return {
          name: f.name,
          url: urlData.publicUrl,
          created_at: f.created_at ?? null,
        };
      });

    setImages(items);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const handleFiles = async (files: FileList | File[]) => {
    const arr = Array.from(files);
    setUploading(true);
    setError(null);
    const results: StoredImage[] = [];
    for (const file of arr) {
      try {
        const url = await uploadImage(file, supabase);
        const name = url.split("/").pop() ?? file.name;
        results.push({ name, url, created_at: new Date().toISOString() });
      } catch (e: unknown) {
        setError(
          e instanceof Error
            ? e.message
            : `Lỗi upload "${file.name}". Vui lòng thử lại.`,
        );
      }
    }
    if (results.length > 0) {
      setImages((prev) => [...results, ...prev]);
    }
    setUploading(false);
  };

  const copyUrl = async (url: string) => {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  };

  const deleteImage = async (name: string) => {
    if (!confirm(`Xoá ảnh "${name}"? Hành động này không thể hoàn tác.`))
      return;
    setDeleting(name);
    const { error: err } = await supabase.storage
      .from(IMAGE_BUCKET)
      .remove([`${IMAGE_FOLDER}/${name}`]);
    if (err) {
      setError("Xoá thất bại: " + err.message);
    } else {
      setImages((prev) => prev.filter((img) => img.name !== name));
    }
    setDeleting(null);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };
  const onDragLeave = () => setDragOver(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-slate-800">Thư viện ảnh</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {loading ? "Đang tải..." : `${images.length} ảnh · Supabase Storage`}
        </p>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-2xl px-5 py-4">
          <button onClick={() => setError(null)} className="mt-0.5 shrink-0">
            <X size={15} className="text-red-400 hover:text-red-600" />
          </button>
          <p className="text-sm text-red-700 flex-1">{error}</p>
        </div>
      )}

      {/* Upload zone */}
      <div
        ref={dropRef}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative rounded-2xl border-2 border-dashed transition-colors cursor-pointer flex flex-col items-center justify-center py-10 gap-3 ${
          dragOver
            ? "border-blue-400 bg-blue-50"
            : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/30"
        } ${uploading ? "pointer-events-none opacity-60" : ""}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.length) handleFiles(e.target.files);
            e.target.value = "";
          }}
        />
        {uploading ? (
          <>
            <Loader2 size={28} className="animate-spin text-blue-500" />
            <p className="text-sm text-blue-600 font-medium">Đang tải lên...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
              <Upload size={20} className="text-slate-500" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-700">
                Kéo thả ảnh vào đây hoặc click để chọn
              </p>
              <p className="text-xs text-slate-400 mt-1">
                JPG, PNG, WebP, GIF · Tối đa {MAX_IMAGE_MB}MB mỗi ảnh · Tự động
                nén thành WebP
              </p>
            </div>
          </>
        )}
      </div>

      {/* Gallery grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square rounded-xl bg-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="bg-white rounded-2xl border border-dashed border-slate-200 py-20 text-center">
          <ImageIcon size={36} className="text-slate-200 mx-auto mb-3" />
          <p className="text-sm font-medium text-slate-500">Chưa có ảnh nào</p>
          <p className="text-xs text-slate-400 mt-1">
            Tải ảnh lên bằng khu vực bên trên
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => (
            <div
              key={img.name}
              className="group relative aspect-square rounded-xl overflow-hidden border border-slate-100 bg-slate-50"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover"
                loading="lazy"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    copyUrl(img.url);
                  }}
                  title="Sao chép URL"
                  className="flex items-center gap-1.5 text-[11px] font-semibold bg-white text-slate-800 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors w-28 justify-center"
                >
                  {copied === img.url ? (
                    <>
                      <Check size={12} className="text-emerald-500" />
                      Đã sao chép
                    </>
                  ) : (
                    <>
                      <Copy size={12} />
                      Sao chép URL
                    </>
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteImage(img.name);
                  }}
                  disabled={deleting === img.name}
                  title="Xoá ảnh"
                  className="flex items-center gap-1.5 text-[11px] font-semibold bg-white text-red-600 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors w-28 justify-center disabled:opacity-50"
                >
                  {deleting === img.name ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <Trash2 size={12} />
                  )}
                  {deleting === img.name ? "Đang xoá..." : "Xoá"}
                </button>
              </div>

              {/* File name bar */}
              <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5 translate-y-full group-hover:translate-y-0 transition-transform">
                <p className="text-[10px] text-white truncate">{img.name}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
