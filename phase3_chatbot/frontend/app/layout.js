import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'VIP Todo AI Chatbot',
  description: 'Premium AI-powered task management system with glassmorphism UI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-white min-h-screen relative`}>
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          backgroundImage: "url('/green.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: -1,
          opacity: 0.8
        }} id="force-bg" />
        {/* Forced Re-render Version: 1.0.2 */}
        {children}
      </body>
    </html>
  );
}