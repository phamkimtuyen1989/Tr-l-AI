
import React, { useCallback, useRef } from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  onImageUpload: (dataUrl: string) => void;
  imagePreviewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, imagePreviewUrl }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
     if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          onImageUpload(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  }

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        accept="image/png, image/jpeg, image/webp"
        className="hidden"
      />
      <label
        onClick={handleClick}
        onDragOver={onDragOver}
        onDrop={onDrop}
        className="cursor-pointer group aspect-video w-full flex flex-col justify-center items-center border-2 border-dashed border-gray-600 hover:border-indigo-500 rounded-lg transition-colors duration-300 bg-gray-800/50 hover:bg-gray-700/50"
      >
        {imagePreviewUrl ? (
          <img src={imagePreviewUrl} alt="Preview" className="w-full h-full object-contain rounded-lg" />
        ) : (
          <div className="text-center p-8">
            <UploadIcon className="mx-auto h-12 w-12 text-gray-500 group-hover:text-indigo-400 transition-colors" />
            <p className="mt-4 text-lg font-semibold text-gray-300">
              <span className="text-indigo-400">Click to upload</span> or drag and drop
            </p>
            <p className="mt-1 text-sm text-gray-500">PNG, JPG, or WEBP</p>
          </div>
        )}
      </label>
    </div>
  );
};
