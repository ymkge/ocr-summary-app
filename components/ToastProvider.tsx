import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }}
    />
  );
};
