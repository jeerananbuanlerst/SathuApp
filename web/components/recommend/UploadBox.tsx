"use client";

import { ImagePlus, X } from "lucide-react";

type UploadBoxProps = {
  images: string[];
  onAdd: (files: File[]) => void;
  onRemove: (index: number) => void;
  max?: number;
};

export default function UploadBox({ images, onAdd, onRemove, max = 5 }: UploadBoxProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, max - images.length);
    if (files.length) onAdd(files);
    e.target.value = "";
  }

  return (
    <div>
      <label className="upload flex cursor-pointer flex-col items-center justify-center gap-2 py-10 text-center">
        <ImagePlus size={24} className="text-primary-dark" />
        <span className="text-sm font-medium text-text">แตะเพื่ออัปโหลดรูปภาพ</span>
        <span className="text-xs text-subtext">
          รองรับไฟล์ JPG, PNG (ขนาดไม่เกิน 5MB) สูงสุด {max} รูป
        </span>
        <input
          type="file"
          accept="image/png,image/jpeg"
          multiple
          className="hidden"
          onChange={handleChange}
          disabled={images.length >= max}
        />
      </label>

      {images.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {images.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <div
              key={src}
              className="relative h-16 w-16 overflow-hidden rounded-xl border border-border"
            >
              <img src={src} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}