import React, { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-neon-green/80 [filter:drop-shadow(0_0_8px_theme(colors.neon-green))]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const dragDropClasses = isDragging 
    ? "border-neon-pink shadow-neon-pink scale-105" 
    : "border-neon-cyan/70 color-neon-cyan animate-pulse-glow";

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`w-full p-8 border-2 rounded-xl cursor-pointer transition-all duration-300 ${dragDropClasses}`}
      >
        <input
          type="file"
          ref={inputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <div className="text-center">
            <UploadIcon />
            <p className="mt-4 text-lg font-semibold text-light-text">
                Drag & drop a photo here
            </p>
            <p className="text-sm text-gray-400">or</p>
            <p className="mt-1 text-md font-bold text-neon-green [filter:drop-shadow(0_0_2px_theme(colors.neon-green))]">
                Click to select a file
            </p>
            <p className="text-xs text-gray-500 mt-4">For best results, use a clear, well-lit photo of a single mushroom.</p>
        </div>
      </div>
    </div>
  );
};