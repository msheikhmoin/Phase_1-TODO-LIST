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
      <body className={`${inter.className} bg-deep-dark text-white min-h-screen`}>
        {children}
      </body>
    </html>
  );
}