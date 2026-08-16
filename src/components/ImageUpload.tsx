import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2, Upload } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder = "products",
  label = "Product Image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const chooseImage = () => {
    if (uploading) return;

    inputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    // Allows selecting the same image again later.
    event.target.value = "";

    if (!file) return;

    setError("");

    // Maximum 5 MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5 MB.");
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError("Please choose a JPG, PNG or WebP image.");
      return;
    }

    setUploading(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const randomName =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2)}`;

      const filePath = `${folder}/${randomName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from("product-images")
        .getPublicUrl(filePath);

      if (!data.publicUrl) {
        throw new Error("Could not create image URL.");
      }

      onChange(data.publicUrl);
    } catch (uploadError) {
      console.error(uploadError);

      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Could not upload image.",
      );
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
    setError("");
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-slate-700">
        {label}
      </label>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {value ? (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
          <div className="relative aspect-video w-full bg-slate-100 sm:aspect-[2/1]">
            <img
              src={value}
              alt="Uploaded preview"
              className="h-full w-full object-contain"
            />
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 bg-white p-4">
            <button
              type="button"
              onClick={chooseImage}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600 disabled:opacity-50"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}

              Replace Image
            </button>

            <button
              type="button"
              onClick={removeImage}
              disabled={uploading}
              className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={chooseImage}
          disabled={uploading}
          className="flex min-h-48 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-8 text-center transition hover:border-emerald-400 hover:bg-emerald-50/50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />

              <span className="mt-3 text-sm font-bold text-slate-700">
                Uploading image...
              </span>
            </>
          ) : (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm">
                <ImagePlus className="h-7 w-7 text-emerald-600" />
              </div>

              <span className="mt-4 text-sm font-bold text-slate-900">
                Choose Image
              </span>

              <span className="mt-1 text-xs text-slate-500">
                Tap to select an image from your phone
              </span>

              <span className="mt-2 text-[11px] text-slate-400">
                JPG, PNG or WebP • Maximum 5 MB
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}