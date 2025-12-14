'use client';

export default function SweetsTable({ sweets, onEdit, onDelete, onRestock }) {
    return (
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
            <table className="w-full text-left">
                <thead className="bg-pink-50 text-pink-700">
                    <tr>
                        <th className="p-4">Image</th>
                        <th className="p-4">Name</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Qty</th>
                        <th className="p-4">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sweets.map(sweet => (
                        <tr key={sweet._id} className="border-b border-gray-100 hover:bg-pink-50 transition">
                            <td className="p-4">
                                <div className="w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-lg flex items-center justify-center overflow-hidden">
                                    {sweet.image ? (
                                        <img src={sweet.image} alt={sweet.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <span className="text-2xl">🍬</span>
                                    )}
                                </div>
                            </td>
                            <td className="p-4 font-semibold">{sweet.name}</td>
                            <td className="p-4">
                                <span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs uppercase font-bold">
                                    {sweet.category}
                                </span>
                            </td>
                            <td className="p-4">${sweet.price}</td>
                            <td className={`p-4 ${sweet.quantity === 0 ? 'text-red-500 font-bold' : ''}`}>
                                {sweet.quantity}
                            </td>
                            <td className="p-4 flex gap-2">
                                <button
                                    onClick={() => onEdit(sweet)}
                                    className="text-blue-500 hover:text-blue-700 font-semibold text-sm"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => onDelete(sweet._id)}
                                    className="text-red-500 hover:text-red-700 font-semibold text-sm"
                                >
                                    Delete
                                </button>
                                <button
                                    onClick={() => onRestock(sweet._id)}
                                    className="text-green-500 hover:text-green-700 font-semibold text-sm"
                                >
                                    Restock
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
