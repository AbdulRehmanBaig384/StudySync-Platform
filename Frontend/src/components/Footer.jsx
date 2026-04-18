import React from 'react'
import { Link } from 'react-router-dom'
import { HiOutlineBookOpen } from 'react-icons/hi'
import { FiArrowRight } from 'react-icons/fi'
import { FaTwitter, FaGithub, FaDiscord, FaLinkedinIn, FaInstagram, FaHeart,} from 'react-icons/fa'

const Footer = () => {
    const footerLinks = {
        Platform: [
            { label: 'Features', href: '#features' },
            { label: 'Study Rooms', href: '#study-rooms' },
            { label: 'For Teachers', href: '#teachers' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Pricing', href: '#' },],
        Company: [
            { label: 'About Us', href: '#' },
            { label: 'Blog', href: '#' },
            { label: 'Careers', href: '#' },
            { label: 'Press Kit', href: '#' },
            { label: 'Contact', href: '#' },],
        Resources: [
            { label: 'Documentation', href: '#' },
            { label: 'Help Center', href: '#' },
            { label: 'Community', href: '#' },
            { label: 'Status', href: '#' },
            { label: 'API', href: '#' },],
        Legal: [
            { label: 'Privacy Policy', href: '#' },
            { label: 'Terms of Service', href: '#' },
            { label: 'Cookie Policy', href: '#' },
            { label: 'GDPR', href: '#' },
        ],}
    const socialLinks = [
        { label: 'Twitter', href: '#', Icon: FaTwitter },
        { label: 'GitHub', href: '#', Icon: FaGithub },
        { label: 'Discord', href: '#', Icon: FaDiscord },
        { label: 'LinkedIn', href: '#', Icon: FaLinkedinIn },
        { label: 'Instagram', href: '#', Icon: FaInstagram },
    ]
    return (
        <footer className="bg-[#060b18] border-t border-white/5 pt-16 pb-8">
            <div className="container-max px-6">
                {/* top row */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    {/* Brand Column */}
                    <div className="col-span-2 flex flex-col gap-4">
                        <Link to="/" className="flex items-center gap-2 w-fit">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <HiOutlineBookOpen className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold font-jakarta">
                                <span className="text-white">Study</span>
                                <span className="text-gradient">Sync</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            The collaborative learning platform for university students. Study smarter, together.
                        </p>
                        {/* Social Icons */}
                        <div className="flex gap-3 mt-2">
                            {socialLinks.map(({ label, href, Icon }) => (
                                <a key={label} href={href} aria-label={label}
                                    className="w-9 h-9 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-indigo-600/30 transition-all duration-200" >
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                    </div>
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category} className="flex flex-col gap-4">
                            <h4 className="text-white font-semibold text-sm font-jakarta">{category}</h4>
                            <ul className="flex flex-col gap-2.5">
                                {links.map(link => (
                                    <li key={link.label}>
                                        <a href={link.href} className="text-slate-400 hover:text-white text-sm transition-colors duration-200" >
                                            {link.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                {/* Newsletter */}
                <div className="bg-glass rounded-2xl p-6 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
                    <div>
                        <h4 className="text-white font-semibold font-jakarta mb-1">Stay in the loop</h4>
                        <p className="text-slate-400 text-sm">Get updates on new features and student tips.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-2">
                        <input type="email"
                            placeholder="Enter your email"
                            className="flex-1 md:w-64 bg-white/5 border border-white/10 rounded-xl text-sm text-slate-300 placeholder-slate-500 px-4 py-2.5 outline-none focus:border-indigo-500 transition-colors" />
                        <button className="btn-primary text-sm px-5 py-2.5 rounded-xl whitespace-nowrap flex items-center gap-1.5">
                            <span>Subscribe</span>
                            <FiArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t border-white/5">
                    <p className="text-slate-500 text-sm">
                        © {new Date().getFullYear()} StudySync. All rights reserved.
                    </p>
                    <p className="text-slate-500 text-sm"> Made with <FaHeart /> for students everywhere </p>
                </div>
            </div>
        </footer>
    )}
export default Footer
