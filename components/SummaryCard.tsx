import { useState } from 'react';
import { FaCopy, FaCheck, FaBrain } from 'react-icons/fa';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface SummaryCardProps {
  content: string;
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
      className="absolute top-4 right-4 p-2 rounded-full bg-indigo-200 hover:bg-indigo-300 transition-colors duration-200"
      aria-label="Copy summary to clipboard"
    >
      {copied ? <FaCheck className="text-green-600" /> : <FaCopy className="text-indigo-700" />}
    </button>
  );
};

export const SummaryCard = ({ content }: SummaryCardProps) => (
  <motion.div 
    className="bg-indigo-600 text-white shadow-2xl rounded-xl w-full relative"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    <div className="p-6">
      <div className="flex items-center mb-4">
        <div className="bg-white text-indigo-600 p-3 rounded-full mr-4">
          <FaBrain className="w-5 h-5" />
        </div>
        <h3 className="text-xl font-semibold">AIによる要約 (Gemini)</h3>
      </div>
      <CopyButton textToCopy={content} />
      <div className="prose prose-sm max-w-none text-indigo-100 whitespace-pre-wrap">
        {content}
      </div>
    </div>
  </motion.div>
);
