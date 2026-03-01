import { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  bucket?: string; // Kept for compatibility, but upload handled in parent
  folder?: string; // Kept for compatibility
  value: string | File | (string | File)[];
  onChange: (value: string | File | (string | File)[]) => void;
  multiple?: boolean;
}

export default function ImageUpload({ value, onChange, multiple = false }: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);

  // Correctly normalize values
  const currentItems = Array.isArray(value) ? value : value ? [value] : [];

  useEffect(() => {
    // Generate object URLs for File objects
    const newPreviews = currentItems.map((item) => {
      if (item instanceof File) {
        return URL.createObjectURL(item);
      }
      return item;
    });

    setPreviews(newPreviews);

    // Cleanup object URLs to avoid memory leaks
    return () => {
      newPreviews.forEach((preview) => {
        if (preview.startsWith('blob:')) {
          URL.revokeObjectURL(preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]); // Use value as dependency to react to changes

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const selectedFiles = Array.from(files);

    if (multiple) {
      onChange([...currentItems, ...selectedFiles]);
    } else {
      const firstFile = selectedFiles[0];
      if (firstFile) {
        onChange(firstFile);
      }
    }

    // Reset input
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    const nextItems = currentItems.filter((_, i) => i !== indexToRemove);
    if (multiple) {
      onChange(nextItems);
    } else {
      onChange(nextItems[0] ?? '');
    }
  };

  return (
    <div className="space-y-4">
      <div className={`grid gap-4 ${multiple ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-1'}`}>
        {previews.map((preview, i) => (
          <div
            key={i}
            className="relative group aspect-video rounded-2xl overflow-hidden bg-slate-100 border border-slate-200"
          >
            <img
              src={preview}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              alt={`Preview ${i + 1}`}
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => {
                  removeImage(i);
                }}
                className="bg-white text-red-500 p-2 rounded-xl font-bold hover:bg-red-50 transition-colors shadow-sm"
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ))}

        {!(!multiple && currentItems.length > 0) && (
          <label
            className={`flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-slate-50 hover:border-primary/50 transition-all group ${multiple ? 'aspect-video' : 'h-48'}`}
          >
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <p className="text-sm text-slate-600 font-bold">
                {multiple ? 'Thêm ảnh' : 'Tải lên ảnh'}
              </p>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple={multiple}
              onChange={handleFileChange}
            />
          </label>
        )}
      </div>
    </div>
  );
}
