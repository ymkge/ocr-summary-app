import { useState, FormEvent } from 'react';
import toast from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { FaPaperPlane, FaFileAlt } from 'react-icons/fa';

import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { ResultCard } from '@/components/ResultCard';
import { SummaryCard } from '@/components/SummaryCard';

interface ApiResponse {
  extractedText: string;
  summary: string;
  timings: {
    total: number;
  };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null); // For file validation

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('ファイルが選択されていません。');
      return;
    }

    setLoading(true);
    setResult(null);
    const toastId = toast.loading('ファイルをアップロード中...');

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      toast.dismiss(toastId);

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'サーバーでエラーが発生しました。');
      }

      toast.success('処理が完了しました！');
      const data: ApiResponse = await response.json();
      setResult(data);

    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.message || '不明なエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Header />
        
        <main className="bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-gray-200">
          <form onSubmit={handleSubmit} className="space-y-6">
            <FileUpload 
              onFileSelect={setFile}
              setPreview={setPreview}
              setError={setError}
              preview={preview}
              file={file}
            />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button 
              type="submit" 
              disabled={loading || !file || !!error}
              className="w-full flex items-center justify-center py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
            >
              <FaPaperPlane className="mr-3" />
              {loading ? '処理中...' : '実行'}
            </button>
          </form>
        </main>

        <AnimatePresence>
          {loading && <LoadingSpinner />}
        </AnimatePresence>

        {result && (
          <div className="mt-12 space-y-8">
            <SummaryCard content={result.summary} />
            <ResultCard 
              title="抽出された原文"
              content={result.extractedText}
              icon={<FaFileAlt className="w-5 h-5" />}
            />
          </div>
        )}
      </div>
    </div>
  );
}