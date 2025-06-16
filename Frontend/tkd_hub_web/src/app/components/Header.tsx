'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { useRoles } from '../context/RoleContext';
import { useRouter } from 'next/navigation';
import servicesRoutes from '../routes/servicesRoutes';
import { usePathname } from 'next/navigation';

export const Header = () => {
	// 1. Context hooks
	const { role, setRole } = useRoles();
	const { isLoggedIn, logout } = useAuth();
	const router = useRouter();
	const pathname = usePathname();

	// 2. State hooks
	const [isOpen, setIsOpen] = useState(false);
	const [isServicesOpen, setIsServicesOpen] = useState(false);
	const servicesRef = useRef<HTMLDivElement>(null);

	// 3. Effects
	useEffect(() => {
		if (!isServicesOpen) return;
		function handleClickOutside(event: MouseEvent) {
			if (
				servicesRef.current &&
				!servicesRef.current.contains(event.target as Node)
			) {
				setIsServicesOpen(false);
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () =>
			document.removeEventListener('mousedown', handleClickOutside);
	}, [isServicesOpen]);

	// 4. Functions
	const renderMenuItems = (isMobile = false) => (
		<>
			<Link
				href="/"
				className={`block ${
					isMobile
						? 'px-4 py-2 hover:bg-purple-700 hover:text-white rounded transition-colors duration-200'
						: 'hover:text-gray-300 transition duration-300 ease-in-out'
				} ${pathname === '/' ? 'text-gray-300 font-bold' : ''}`}
			>
				Home
			</Link>
			<Link
				href="/blog"
				className={`block ${
					isMobile
						? 'px-4 py-2 hover:bg-purple-700 hover:text-white rounded transition-colors duration-200'
						: 'hover:text-gray-300 transition duration-300 ease-in-out'
				} ${pathname === '/blog' ? 'text-gray-300 font-bold' : ''}`}
			>
				Blog
			</Link>
			<Link
				href="/about"
				className={`block ${
					isMobile
						? 'px-4 py-2 hover:bg-purple-700 hover:text-white rounded transition-colors duration-200'
						: 'hover:text-gray-300 transition duration-300 ease-in-out'
				} ${pathname === '/about' ? 'text-gray-300 font-bold' : ''}`}
			>
				About
			</Link>
			<Link
				href="/contact"
				className={`block ${
					isMobile
						? 'px-4 py-2 hover:bg-purple-700 hover:text-white rounded transition-colors duration-200'
						: 'hover:text-gray-300 transition duration-300 ease-in-out'
				} ${pathname === '/contact' ? 'text-gray-300 font-bold' : ''}`}
			>
				Contact
			</Link>
			{(role === 'Coach' || role === 'Admin') && (
				<div className="relative" ref={servicesRef}>
					<button
						onClick={() => setIsServicesOpen(!isServicesOpen)}
						className={`flex items-center gap-2 ${
							isMobile
								? 'w-full text-left my-2'
								: 'hover:text-gray-300 transition-colors duration-300 ease-in-out'
						} focus:outline-none font-semibold px-3 py-1 rounded bg-purple-600 hover:bg-purple-700`}
					>
						<i className="bi bi-gear-fill"></i>
						Services
						<i
							className={`bi ${
								isServicesOpen
									? 'bi-chevron-up'
									: 'bi-chevron-down'
							} transition-transform duration-300`}
						></i>
					</button>
					{isServicesOpen && (
						<div className="absolute left-0 mt-2 min-w-[180px] bg-gray-800 rounded-md shadow-lg z-10 border border-purple-500 transition-all duration-300 ease-in-out">
							{servicesRoutes
								.filter(
									(route) =>
										!route.roles ||
										route.roles.includes(role)
								)
								.map((route) => (
									<Link
										key={route.href}
										href={route.href}
										onClick={() => setIsServicesOpen(false)}
										className={`flex items-center px-4 py-2 hover:bg-purple-700 transition-colors rounded ${
											pathname === route.href
												? 'text-purple-300 font-bold'
												: 'text-white'
										}`}
									>
										<i className={`${route.icon} mr-2`}></i>{' '}
										{route.label}
									</Link>
								))}
						</div>
					)}
				</div>
			)}
			{role === 'Student' && (
				<Link
					href="/students"
					className={`block ${
						isMobile
							? 'px-4 py-2'
							: 'hover:text-gray-300 transition duration-300 ease-in-out'
					} ${
						pathname === '/students'
							? 'text-gray-300 font-bold'
							: ''
					}`}
				>
					<i className="bi bi-person-lines-fill mr-2"></i> Students
				</Link>
			)}
		</>
	);

	// 5. Render
	return (
		<nav className="bg-gray-800 text-white shadow-lg">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="flex justify-between items-center h-16">
					{/* Logo */}
					<div className="flex-shrink-0">
						<Link
							href="/"
							className="text-xl font-bold transition duration-300 hover:text-purple-400"
						>
							MyLogo
						</Link>
					</div>

					{/* Show actual role on the right side of the header */}
					<div className="hidden md:flex items-center space-x-2">
						<span className="text-sm text-gray-300">
							Role: <span className="font-semibold">{role}</span>
						</span>
					</div>

					{/* Desktop Menu */}
					<div className="hidden md:flex space-x-4">
						{renderMenuItems()}
						{/* Profile Button (Desktop) */}
						{isLoggedIn && (
							<button
								onClick={() => router.push('/profile')}
								className="ml-4 px-4 py-1 rounded bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center transition duration-300 ease-in-out"
							>
								Profile
							</button>
						)}
						{/* Login/Logout Button */}
						{!isLoggedIn ? (
							<button
								onClick={() => router.push('/login')}
								className={`px-4 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center transition duration-300 ease-in-out`}
							>
								Login
							</button>
						) : (
							<button
								onClick={() => {
									logout();
									setRole('Guest');
									router.push('/');
								}}
								className="ml-4 px-4 py-1 rounded bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center transition duration-300 ease-in-out"
							>
								Logout
							</button>
						)}
					</div>

					{/* Mobile Menu Button */}
					<div className="md:hidden">
						<button
							onClick={() => setIsOpen(!isOpen)}
							className="text-gray-300 hover:text-white focus:outline-none transition duration-300"
							aria-label={isOpen ? 'Close menu' : 'Open menu'}
						>
							<svg
								className="h-6 w-6"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								{isOpen ? (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M6 18L18 6M6 6l12 12"
									/>
								) : (
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M4 6h16M4 12h16m-7 6h7"
									/>
								)}
							</svg>
						</button>
					</div>
				</div>
			</div>

			{/* Mobile Menu */}
			{isOpen && (
				<div className="md:hidden bg-gray-700 transition duration-300">
					{renderMenuItems(true)}
					<div className="flex flex-col gap-2 mt-2 px-4">
						{/* Profile Button (Mobile) */}
						{isLoggedIn && (
							<button
								onClick={() => router.push('/profile')}
								title="Profile"
								className="w-full px-4 py-2 rounded bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center justify-center gap-2 transition duration-300"
							>
								<i className="bi bi-person-circle"></i>
							</button>
						)}
						{/* Login/Logout Button */}
						{!isLoggedIn ? (
							<button
								title="Login"
								onClick={() => router.push('/login')}
								className="w-full px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center justify-center gap-2 transition duration-300"
							>
								<i className="bi bi-box-arrow-in-right"></i>
							</button>
						) : (
							<button
								onClick={() => {
									logout();
									setRole('Guest');
									router.push('/');
								}}
								title="Logout"
								className="w-full px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold flex items-center justify-center gap-2 transition duration-300"
							>
								<i className="bi bi-box-arrow-right"></i>
							</button>
						)}
					</div>
				</div>
			)}
		</nav>
	);
};

export default Header;
