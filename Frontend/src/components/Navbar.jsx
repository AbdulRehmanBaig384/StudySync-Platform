import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { HiOutlineBars3, HiOutlineXMark } from 'react-icons/hi2'
import { FiChevronRight } from 'react-icons/fi'

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Study Rooms', href: '#study-rooms' },
    { label: 'For Teachers', href: '#teachers' },
    { label: 'How It Works', href: '#how-it-works' },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-glass-dark shadow-lg shadow-black/20' : 'bg-transparent'
      }`}
    >
      <div className="container-max px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-200">
            <HiOutlineBookOpen className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold font-jakarta">
            <span className="text-white">Study</span>
            <span className="text-gradient">Sync</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-400 hover:text-white font-medium transition-colors duration-200 text-sm"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/login"
            className="text-slate-300 hover:text-white font-medium text-sm transition-colors duration-200 px-4 py-2"
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="btn-primary text-sm px-5 py-2.5 rounded-xl inline-flex items-center gap-1.5"
          >
            <span>Get Started Free</span>
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen
            ? <HiOutlineXMark className="w-6 h-6" />
            : <HiOutlineBars3 className="w-6 h-6" />
          }
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-glass-dark border-t border-white/10 px-6 py-4 flex flex-col gap-4 animate-slide-up">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-slate-300 hover:text-white font-medium transition-colors duration-200"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
            <Link to="/login" className="text-slate-300 hover:text-white font-medium">Log In</Link>
            <Link to="/signup" className="btn-primary text-center text-sm py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5">
              <span>Get Started Free</span>
              <FiChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
