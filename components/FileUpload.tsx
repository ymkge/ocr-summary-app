import { useState, useCallback } from 'react';
import { FaUpload } from 'react-icons/fa';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  setPreview: (preview: string | null) => void;
  setError: (error: string | null) => void;
  preview: string | null;
  file: File | null;
}

export const FileUpload = ({ onFileSelect, setPreview, setError, preview, file }: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (selectedFile: File | undefined) => {
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('ファイルサイズは10MB以下にしてください。');
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
        setError('JPGまたはPNG形式の画像を選択してください。');
        return;
      }
      setError(null);
      onFileSelect(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFileChange(droppedFile);
  }, []);

  return (
    <div 
      className={`w-full p-8 border-4 border-dashed rounded-2xl transition-colors duration-300 ${
        isDragging ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        {preview ? (
          <img src={preview} alt="Preview" className="mx-auto max-h-48 w-auto object-contain rounded-lg shadow-md" />
        ) : (
          <FaUpload className="w-16 h-16 text-gray-400" />
        )}
        <p className="text-gray-500">
          ここにファイルをドラッグ＆ドロップ、または
          <label htmlFor="file-upload" className="cursor-pointer font-medium text-indigo-600 hover:text-indigo-500">
            {' '}
            クリックして選択
            <input 
              id="file-upload" 
              name="file-upload" 
              type="file" 
              className="sr-only" 
              accept="image/jpeg, image/png" 
              onChange={(e) => handleFileChange(e.target.files?.[0])} 
            />
          </label>
        </p>
        {file && <p className="text-sm text-gray-700 font-medium">選択中のファイル: {file.name}</p>}
        <p className="text-xs text-gray-400">PNG, JPG (最大10MB)</p>
      </div>
    </div>
  );
};
