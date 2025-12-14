'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({ name: '', category: '', price: '', quantity: '', description: '' });
    const [editingId, setEditingId] = useState(null);
    const [restockId, setRestockId] = useState(null);
    const [restockQty, setRestockQty] = useState('');

    const router = useRouter();

    useEffect(() => {
        checkAuth();
        fetchSweets();
    }, []);

    const checkAuth = () => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (user.role !== 'admin') {
            router.push('/');
        }
    };

    const getHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        };
    };

    const fetchSweets = async () => {
        try {
            const res = await fetch('/api/sweets');
            const data = await res.json();
            setSweets(data.sweets || []);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = editingId ? `/api/sweets/${editingId}` : '/api/sweets';
        const method = editingId ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method,
                headers: getHeaders(),
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setFormData({ name: '', category: '', price: '', quantity: '', description: '' });
                setEditingId(null);
                fetchSweets();
            } else {
                alert('Operation failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure?')) return;
        try {
            const res = await fetch(`/api/sweets/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (res.ok) fetchSweets();
        } catch (error) {
            console.error(error);
        }
    };

    const handleEdit = (sweet) => {
        setEditingId(sweet._id);
        setFormData({
            name: sweet.name,
            category: sweet.category,
            price: sweet.price,
            quantity: sweet.quantity,
            description: sweet.description || ''
        });
    };

    const handleRestock = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`/api/sweets/${restockId}/restock`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ quantity: Number(restockQty) })
            });
            if (res.ok) {
                setRestockId(null);
                setRestockQty('');
                fetchSweets();
            } else {
                alert('Restock failed');
            }
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) return <div className="text-center p-10">Loading Admin...</div>;

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-bold text-pink-600 mb-8">Admin Dashboard</h1>

            {/* Add/Edit Form */}
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">{editingId ? 'Edit Sweet' : 'Add New Sweet'}</h2>
                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input placeholder="Name" className="p-2 border rounded" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
                    <input placeholder="Category" className="p-2 border rounded" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} required />
                    <input type="number" placeholder="Price" className="p-2 border rounded" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} required />
                    <input type="number" placeholder="Quantity" className="p-2 border rounded" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} required disabled={!!editingId} title="Use Restock to change qty" />
                    <input placeholder="Description" className="p-2 border rounded md:col-span-2" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />

                    <div className="md:col-span-2 flex gap-2">
                        <button type="submit" className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition flex-1 font-bold">
                            {editingId ? 'Update Sweet' : 'Add Sweet'}
                        </button>
                        {editingId && (
                            <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', category: '', price: '', quantity: '', description: '' }); }} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* Sweets List Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-pink-100">
                <table className="w-full text-left">
                    <thead className="bg-pink-50 text-pink-700">
                        <tr>
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
                                <td className="p-4 font-semibold">{sweet.name}</td>
                                <td className="p-4"><span className="bg-pink-100 text-pink-600 px-2 py-1 rounded-full text-xs uppercase font-bold">{sweet.category}</span></td>
                                <td className="p-4">${sweet.price}</td>
                                <td className="p-4 {sweet.quantity === 0 ? 'text-red-500 font-bold' : ''}">{sweet.quantity}</td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleEdit(sweet)} className="text-blue-500 hover:text-blue-700 font-semibold text-sm">Edit</button>
                                    <button onClick={() => handleDelete(sweet._id)} className="text-red-500 hover:text-red-700 font-semibold text-sm">Delete</button>
                                    <button onClick={() => setRestockId(sweet._id)} className="text-green-500 hover:text-green-700 font-semibold text-sm">Restock</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Restock Modal (Simple Overlay) */}
            {restockId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-80">
                        <h3 className="text-xl font-bold mb-4">Restock Sweet</h3>
                        <form onSubmit={handleRestock}>
                            <input
                                type="number"
                                placeholder="Quantity to add"
                                className="w-full border p-2 mb-4 rounded"
                                value={restockQty}
                                onChange={e => setRestockQty(e.target.value)}
                                autoFocus
                            />
                            <div className="flex gap-2">
                                <button type="submit" className="flex-1 bg-green-500 text-white py-2 rounded font-bold">Confirm</button>
                                <button type="button" onClick={() => setRestockId(null)} className="flex-1 bg-gray-200 py-2 rounded">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
