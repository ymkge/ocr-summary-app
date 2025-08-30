import { motion } from 'framer-motion';

export const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex flex-col items-center justify-center space-y-4 my-8"
  >
    <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
    <p className="text-gray-600">AIがテキストを読み取り、要約を作成しています...</p>
  </motion.div>
);
