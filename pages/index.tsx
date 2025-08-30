import { useState, FormEvent } from 'react';

interface ApiResponse {
  extractedText: string;
  summary: string;
  timings: {
    total: number;
    ocr: number;
    summary: number;
  };
  meta: {
    fileName: string;
    fileSize: number;
  };
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('ファイルサイズは10MB以下にしてください。');
        setFile(null);
        setPreview(null);
        return;
      }
      if (!['image/jpeg', 'image/png'].includes(selectedFile.type)) {
        setError('JPGまたはPNG形式の画像を選択してください。');
        setFile(null);
        setPreview(null);
        return;
      }
      setFile(selectedFile);
      setError(null);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('ファイルが選択されていません。');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/ocr', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'サーバーでエラーが発生しました。');
      }

      const data: ApiResponse = await response.json();
      setResult(data);

    } catch (err: any) {
      setError(err.message || '不明なエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-4">
      <div className="w-full max-w-2xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">画像OCR & 要約アプリ</h1>
        <p className="text-center text-gray-500 mb-6">画像をアップロードしてテキストを抽出し、AIによる要約を取得します。</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="file-upload" className="block text-sm font-medium text-gray-700 mb-2">画像ファイル (JPG/PNG, max 10MB)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {preview ? (
                  <img src={preview} alt="Preview" className="mx-auto h-40 w-auto object-contain" />
                ) : (
                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true"><path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" /></svg>
                )}
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                    <span>アップロードする</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept="image/jpeg, image/png" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">またはドラッグ＆ドロップ</p>
                </div>
                <p className="text-xs text-gray-500">{file ? file.name : 'PNG, JPG up to 10MB'}</p>
              </div>
            </div>
          </div>

          <div>
            <button type="submit" disabled={loading || !file} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed">
              {loading ? '処理中...' : '実行'}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">エラー: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {loading && (
            <div className="mt-6 flex justify-center items-center space-x-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-gray-600">AIがテキストを読み取り、要約を作成しています... (10〜20秒程度かかります)</p>
            </div>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">実行結果</h2>
              <div className="text-sm text-gray-600 space-y-1">
                <p><strong>合計処理時間:</strong> {(result.timings.total / 1000).toFixed(2)}秒</p>
                <p><strong>ファイル名:</strong> {result.meta.fileName}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">要約 (Gemini)</h3>
              <div className="prose prose-sm max-w-none p-4 bg-indigo-50 rounded-md whitespace-pre-wrap">{result.summary}</div>
            </div>

            <details className="bg-gray-50 rounded-lg">
              <summary className="cursor-pointer p-4 font-medium text-gray-700">抽出された原文を表示</summary>
              <div className="p-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{result.extractedText || 'テキストは抽出されませんでした。'}</p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}