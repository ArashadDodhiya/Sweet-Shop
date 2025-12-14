'use client';

export default function SweetCard({ sweet, onPurchase, isAdmin = false }) {
    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-pink-100 flex flex-col">
            <div className="h-48 bg-gradient-to-br from-pink-100 to-rose-100 flex items-center justify-center overflow-hidden">
                {sweet.image ? (
                    <img
                        src={sweet.image}
                        alt={sweet.name}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    />
                ) : (
                    <div className="text-6xl">🍬</div>
                )}
            </div>
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-bold text-gray-800">{sweet.name}</h2>
                    <span className="bg-pink-100 text-pink-600 text-xs px-2 py-1 rounded-full uppercase tracking-wider font-semibold">
                        {sweet.category}
                    </span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                    {sweet.description || 'A delicious treat waiting for you.'}
                </p>

                <div className="mt-auto flex items-center justify-between">
                    <span className="text-2xl font-bold text-pink-600">${sweet.price}</span>
                    <div className="text-sm text-gray-400">
                        {sweet.quantity > 0 ? `${sweet.quantity} in stock` : 'Out of stock'}
                    </div>
                </div>

                {!isAdmin && (
                    <button
                        onClick={() => onPurchase(sweet._id)}
                        disabled={sweet.quantity <= 0}
                        className={`mt-4 w-full py-2 rounded-lg font-bold transition ${sweet.quantity > 0
                                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white hover:from-pink-600 hover:to-rose-600 active:scale-95'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {sweet.quantity > 0 ? 'Buy Now' : 'Sold Out'}
                    </button>
                )}
            </div>
        </div>
    );
}
