'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import SweetForm from '../components/SweetForm';
import SweetsTable from '../components/SweetsTable';

export default function AdminDashboard() {
    const [sweets, setSweets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        price: '',
        quantity: '',
        description: '',
        image: ''
    });
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
                setFormData({ name: '', category: '', price: '', quantity: '', description: '', image: '' });
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
            description: sweet.description || '',
            image: sweet.image || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData({ name: '', category: '', price: '', quantity: '', description: '', image: '' });
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

            <SweetForm
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                editingId={editingId}
                onCancel={handleCancelEdit}
            />

            <SweetsTable
                sweets={sweets}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onRestock={(id) => setRestockId(id)}
            />

            {/* Restock Modal */}
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
