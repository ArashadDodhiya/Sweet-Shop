import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

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
                <h1 className="text-5xl font-extrabold text-pink-600 drop-shadow-sm">
                    Welcome to the Sweet Wonderland
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
                            <div key={sweet._id} className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-pink-100 flex flex-col">
                                <div className="h-48 bg-pink-100 flex items-center justify-center text-4xl">
                                    {/* Placeholder for image */}
                                    🍬
                                </div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <div className="flex justify-between items-start mb-2">
                                        <h2 className="text-2xl font-bold text-gray-800">{sweet.name}</h2>
                                        <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                                            {sweet.category}
                                        </span>
                                    </div>
                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">{sweet.description || 'A delicious treat waiting for you.'}</p>

                                    <div className="mt-auto flex items-center justify-between">
                                        <span className="text-2xl font-bold text-pink-600">${sweet.price}</span>
                                        <div className="text-sm text-gray-400">
                                            {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handlePurchase(sweet._id)}
                                        disabled={sweet.quantity <= 0}
                                        className={`mt-4 w-full py-2 rounded-lg font-bold transition ${sweet.quantity > 0
                                            ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 active:scale-95'
                                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {sweet.quantity > 0 ? 'Buy Now' : 'Sold Out'}
                                    </button>
                                </div>
                            </div>
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
