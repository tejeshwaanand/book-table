'use client'
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from '../public/images/logo.png';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header>
      <nav className="navbar">
        <div className="logo">
          <Link href="/">
            <Image src={logo} alt='logo' style={{'maxHeight': '50px', 'maxWidth': '50px'}} />
            WoFood
          </Link>
        </div>
        <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
          <Link href="/">Book Slot</Link>
          <Link href="/CancelBookingPage">Cancel Table</Link>
          <Link href="/admin">Admin</Link>
        </div>
        <button
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? '✖' : '☰'}
        </button>
      </nav>
    </header>
  );
};

export default Navbar;
