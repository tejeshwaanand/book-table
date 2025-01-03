import { Inter } from 'next/font/google';
import Navbar from '../components/Navbar';
import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main className={`${inter.variable} main-container`} >
        {children}
      </main>
    </>
  );
}
