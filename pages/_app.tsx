import type { AppProps } from 'next/app';
import '@/public/globals.css';
import { ToastProvider } from '@/components/ToastProvider';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <ToastProvider />
      <Component {...pageProps} />
    </> 
  );
}

export default MyApp;