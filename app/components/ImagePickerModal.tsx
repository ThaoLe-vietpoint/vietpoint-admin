"use client";
import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { IMAGE_BUCKET, IMAGE_FOLDER } from "@/utils/imageUpload";
import { ImageIcon, Loader2, X, Check } from "lucide-react";

type Props = {
  onSelect: (url: string) => void;
  onClose: () => void;
};

export default function ImagePickerModal({ onSelect, onClose }: Props) {
  const supabase = createClient();
  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    const { data } = await supabase.storage
      .from(IMAGE_BUCKET)
      .list(IMAGE_FOLDER, {
        limit: 200,
        sortBy: { column: "created_at", order: "desc" },
      });

    const items = (data ?? [])
      .filter((f) => f.name !== ".emptyFolderPlaceholder")
      .map((f) => {
        const { data: urlData } = supabase.storage
          .from(IMAGE_BUCKET)
          .getPublicUrl(`${IMAGE_FOLDER}/${f.name}`);
        return { name: f.name, url: urlData.publicUrl };
      });

    setImages(items);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 w-full max-w-2xl mx-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Chọn từ thư viện</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {loading ? "Đang tải..." : `${images.length} ảnh`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {selected && (
              <button
                type="button"
                onClick={() => {
                  onSelect(selected);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Check size={14} />
                Chọn ảnh này
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 size={24} className="animate-spin text-blue-500" />
            </div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <ImageIcon size={36} className="mb-3 text-slate-200" />
              <p className="text-sm font-medium">Chưa có ảnh nào trong thư viện</p>
              <p className="text-xs mt-1 text-slate-400">
                Upload ảnh trong trang Thư viện ảnh trước
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {images.map((img) => (
                <button
                  key={img.name}
                  type="button"
                  onClick={() => {
                    if (selected === img.url) {
                      onSelect(img.url);
                      onClose();
                    } else {
                      setSelected(img.url);
                    }
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                    selected === img.url
                      ? "border-blue-500 shadow-md scale-[1.03]"
                      : "border-transparent hover:border-slate-300"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {selected === img.url && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                        <Check size={12} className="text-white" />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        {!loading && images.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-100 shrink-0">
            <p className="text-xs text-slate-400 text-center">
              Click một lần để chọn · Click lần hai hoặc nhấn &ldquo;Chọn ảnh này&rdquo; để xác nhận
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
