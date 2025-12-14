'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SweetCard from './components/SweetCard';

export default function Home() {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
        fetchSweets();
    }, []);

    const fetchSweets = async (term = '') => {
        try {
            setLoading(true);
            const url = term
                ? `/api/sweets/search?q=${term}`
                : '/api/sweets';

            const res = await fetch(url);
            const data = await res.json();
            setSweets(data.sweets || []);
        } catch (error) {
            console.error('Failed to fetch sweets', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchSweets(searchTerm);
    };

    const handlePurchase = async (id) => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const res = await fetch(`/api/sweets/${id}/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ quantity: 1 }),
            });

            if (res.ok) {
                alert('Sweet purchased! 🍬');
                fetchSweets(searchTerm);
            } else {
                const data = await res.json();
                alert(data.error || 'Purchase failed');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    return (
        <div className="space-y-20">

            {/* ================= HERO SECTION ================= */}
            <section className="relative rounded-3xl overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1604908177522-4027f7c1f6b6')",
                    }}
                />
                <div className="absolute inset-0 bg-white/70 backdrop-blur-sm" />

                <div className="relative z-10 py-24 px-6 text-center space-y-6">
                    <h1 className="text-6xl font-extrabold text-pink-600 drop-shadow">
                        Sweet Wonderland 🍭
                    </h1>
                    <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                        Handcrafted sweets made with love, tradition,
                        and premium ingredients. One bite and you’re home.
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={() =>
                                document
                                    .getElementById('sweets')
                                    .scrollIntoView({ behavior: 'smooth' })
                            }
                            className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
                        >
                            Explore Sweets
                        </button>
                        <button
                            onClick={() => router.push('/login')}
                            className="bg-white border-2 border-pink-500 text-pink-500 px-8 py-3 rounded-full font-semibold hover:bg-pink-50"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </section>

            {/* ================= WHY CHOOSE US ================= */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center px-4">
                {[
                    {
                        emoji: '🍯',
                        title: 'Freshly Made',
                        desc: 'Prepared daily using traditional recipes.',
                    },
                    {
                        emoji: '🇮🇳',
                        title: 'Authentic Taste',
                        desc: 'True Indian mithai flavors you’ll love.',
                    },
                    {
                        emoji: '🚚',
                        title: 'Fast Delivery',
                        desc: 'From kitchen to doorstep quickly.',
                    },
                ].map((item, i) => (
                    <div
                        key={i}
                        className="bg-white rounded-2xl p-8 shadow hover:shadow-lg transition"
                    >
                        <div className="text-5xl mb-4">{item.emoji}</div>
                        <h3 className="text-xl font-bold text-pink-600">
                            {item.title}
                        </h3>
                        <p className="text-gray-600 mt-2">{item.desc}</p>
                    </div>
                ))}
            </section>

            {/* ================= SEARCH ================= */}
            <section className="text-center space-y-4">
                <h2 className="text-4xl font-bold text-gray-800">
                    🍥 Our Popular Sweets
                </h2>
                <p className="text-gray-500">
                    Loved by hundreds of sweet lovers every day
                </p>

                <form
                    onSubmit={handleSearch}
                    className="max-w-md mx-auto flex gap-2 mt-6"
                >
                    <input
                        type="text"
                        placeholder="Search for sweets..."
                        className="flex-1 px-4 py-3 border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button
                        type="submit"
                        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full font-semibold"
                    >
                        Search
                    </button>
                </form>
            </section>

            {/* ================= SWEETS GRID ================= */}
            <section id="sweets" className="px-4">
                {loading ? (
                    <div className="text-center text-pink-500 text-xl animate-pulse">
                        Loading delightful sweets...
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sweets.length > 0 ? (
                            sweets.map((sweet) => (
                                <SweetCard
                                    key={sweet._id}
                                    sweet={sweet}
                                    onPurchase={handlePurchase}
                                />
                            ))
                        ) : (
                            <div className="col-span-full text-center text-gray-500">
                                No sweets found.{' '}
                                <span
                                    className="text-pink-500 cursor-pointer"
                                    onClick={() => {
                                        setSearchTerm('');
                                        fetchSweets('');
                                    }}
                                >
                                    Clear search
                                </span>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="pt-16 pb-6 text-center text-gray-500 text-sm">
                <p>© {new Date().getFullYear()} Sweet Wonderland</p>
                <p>Made with ❤️ for sweet lovers</p>
            </footer>
        </div>
    );
}
