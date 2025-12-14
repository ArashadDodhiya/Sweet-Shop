'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();

    useEffect(() => {
        checkLoginStatus();
        window.addEventListener('auth-change', checkLoginStatus);
        return () => window.removeEventListener('auth-change', checkLoginStatus);
    }, []);

    const checkLoginStatus = () => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    };

    const handleLogout = async () => {
        try {
            // Call backend logout
            await fetch('/api/auth/logout', { method: 'POST' });

            // Clear local state
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Notify other components
            window.dispatchEvent(new Event('auth-change'));

            router.push('/login');
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <nav className="bg-pink-600 text-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-3xl font-bold tracking-wide hover:text-pink-100 transition flex items-center gap-2">
                    <span className="text-4xl">🍬</span>
                    <span>Sweet Shop</span>
                </Link>
                <div className="space-x-6 flex items-center">
                    <Link href="/" className="hover:text-pink-200 transition font-medium">Home</Link>

                    {isLoggedIn ? (
                        <>
                            {JSON.parse(localStorage.getItem('user') || '{}').role === 'admin' && (
                                <Link href="/admin" className="hover:text-pink-200 transition font-medium">Admin</Link>
                            )}
                            <button
                                onClick={handleLogout}
                                className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold hover:bg-pink-50 transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            href="/login"
                            className="bg-white text-pink-600 px-4 py-2 rounded-full font-bold hover:bg-pink-50 transition"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
