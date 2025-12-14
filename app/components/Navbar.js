'use client';
import Link from 'next/link';

export default function Navbar() {
    return (
        <nav className="bg-pink-600 text-white shadow-lg">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <Link href="/" className="text-2xl font-bold tracking-wide hover:text-pink-100 transition">
                    🍬 Sweet Shop
                </Link>
                <div className="space-x-4">
                    <Link href="/" className="hover:text-pink-200 transition">Home</Link>
                    {/* We'll add dynamic links later based on auth status */}
                    <Link href="/login" className="hover:text-pink-200 transition">Login</Link>
                </div>
            </div>
        </nav>
    );
}
