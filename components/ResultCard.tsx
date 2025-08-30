import { useState } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface CardProps {
  title: string;
  content: string;
  icon: React.ReactNode;
}

const CopyButton = ({ textToCopy }: { textToCopy: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    toast.success('コピーしました！');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors duration-200"
      aria-label="Copy to clipboard"
    >
      {copied ? <FaCheck className="text-green-500" /> : <FaCopy className="text-gray-600" />}
    </button>
  );
};

export const ResultCard = ({ title, content, icon }: CardProps) => (
  <motion.div 
    className="bg-white shadow-lg rounded-xl w-full relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-full mr-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <CopyButton textToCopy={content} />
      <div className="prose prose-sm max-w-none p-4 bg-gray-50 rounded-md whitespace-pre-wrap h-60 overflow-y-auto">
        {content || 'テキストは抽出されませんでした。'}
      </div>
    </div>
  </motion.div>
);
