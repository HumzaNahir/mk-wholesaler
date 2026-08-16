import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { supabase } from "../lib/supabase";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  folder: "products" | "categories";
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  folder,
  label = "Image",
}: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    setUploading(true);

    try {
      const extension =
        file.name.split(".").pop()?.toLowerCase() || "jpg";

      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = `${folder}/${fileName}`;

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

      if (inputRef.current) {
        inputRef.current.value = "";
      }
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

      <div className="overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-slate-50">
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt="Preview"
              className="h-64 w-full object-contain bg-white"
            />

            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={uploading}
                className="rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow hover:bg-slate-100 disabled:opacity-50"
              >
                Change
              </button>

              <button
                type="button"
                onClick={removeImage}
                disabled={uploading}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-600 shadow hover:bg-red-50 disabled:opacity-50"
                aria-label="Remove image"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex min-h-52 w-full flex-col items-center justify-center gap-3 px-6 text-center hover:bg-slate-100 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />
                <span className="text-sm font-bold text-slate-700">
                  Uploading image...
                </span>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50">
                  <ImagePlus className="h-7 w-7 text-emerald-600" />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Choose an image
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Tap here to select a photo from your phone
                  </p>

                  <p className="mt-2 text-[11px] text-slate-400">
                    JPG, PNG or WEBP • Maximum 5MB
                  </p>
                </div>
              </>
            )}
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}