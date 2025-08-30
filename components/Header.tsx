import { FaFileImage } from 'react-icons/fa';

export const Header = () => (
  <header className="text-center mb-10">
    <div className="inline-flex items-center justify-center bg-indigo-100 text-indigo-600 p-4 rounded-full mb-4">
      <FaFileImage className="w-8 h-8" />
    </div>
    <h1 className="text-4xl font-bold text-gray-800">画像OCR & 要約アプリ</h1>
    <p className="text-lg text-gray-500 mt-2">画像をアップロードしてテキストを抽出し、AIによる要約を取得します。</p>
  </header>
);
