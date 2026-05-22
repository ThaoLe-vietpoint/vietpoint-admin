/** Shared image compression + Supabase Storage upload utilities */

export const IMAGE_BUCKET = "images";
export const IMAGE_FOLDER = "blog";
export const MAX_IMAGE_MB = 5;
const MAX_DIM = 1920;
const WEBP_QUALITY = 0.85;

/** Resize and compress a File to WebP using Canvas API (client-side only) */
export async function compressToWebP(file: File): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            URL.revokeObjectURL(objectUrl);
            let { width, height } = img;
            if (width > MAX_DIM || height > MAX_DIM) {
                if (width >= height) {
                    height = Math.round((height / width) * MAX_DIM);
                    width = MAX_DIM;
                } else {
                    width = Math.round((width / height) * MAX_DIM);
                    height = MAX_DIM;
                }
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
            canvas.toBlob(
                (blob) =>
                    blob ? resolve(blob) : reject(new Error("Canvas toBlob failed")),
                "image/webp",
                WEBP_QUALITY,
            );
        };
        img.onerror = reject;
        img.src = objectUrl;
    });
}

/**
 * Validate, compress, and upload an image file to Supabase Storage.
 * Returns the public URL on success, or throws on error.
 */
export async function uploadImage(
    file: File,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    supabase: any,
): Promise<string> {
    if (file.size > MAX_IMAGE_MB * 1024 * 1024) {
        throw new Error(`Ảnh vượt quá ${MAX_IMAGE_MB}MB. Vui lòng chọn ảnh nhỏ hơn.`);
    }
    const blob = await compressToWebP(file);
    const filename = `${IMAGE_FOLDER}/${Date.now()}-${Math.random().toString(36).slice(2)}.webp`;
    const { error } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(filename, blob, { contentType: "image/webp" });
    if (error) throw error;
    const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(filename);
    return data.publicUrl;
}
