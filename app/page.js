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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ quantity: 1 })
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
        <div className="space-y-8">
            {/* Hero Section */}
            <section className="text-center space-y-4">
                <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500 drop-shadow-sm">
                    Welcome to Sweet Wonderland
                </h1>
                <p className="text-xl text-gray-600">
                    Discover the finest collection of handcrafted delights.
                </p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="max-w-md mx-auto flex gap-2">
                    <input
                        type="text"
                        placeholder="Search for sweets..."
                        className="flex-1 px-4 py-2 border-2 border-pink-200 rounded-full focus:outline-none focus:border-pink-500 transition"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded-full font-semibold transition">
                        Search
                    </button>
                </form>
            </section>

            {/* Sweets Grid */}
            {loading ? (
                <div className="text-center text-pink-500 text-xl animate-pulse">Loading delightful sweets...</div>
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
                            No sweets found. <span className="text-pink-500 cursor-pointer" onClick={() => { setSearchTerm(''); fetchSweets(''); }}>Clear search</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
