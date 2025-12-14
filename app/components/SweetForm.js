'use client';

export default function SweetForm({ formData, setFormData, onSubmit, editingId, onCancel }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-pink-100">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
                {editingId ? 'Edit Sweet' : 'Add New Sweet'}
            </h2>
            <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    placeholder="Name"
                    className="p-2 border rounded"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    required
                />
                <select
                    className="p-2 border rounded bg-white"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {['Ladoo', 'Barfi', 'Halwa', 'Syrup-based', 'Dry Fruit', 'Chocolates', 'Other'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <input
                    type="number"
                    step="0.01"
                    placeholder="Price"
                    className="p-2 border rounded"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                    required
                />
                <input
                    type="number"
                    placeholder="Quantity"
                    className="p-2 border rounded"
                    value={formData.quantity}
                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                    required
                    disabled={!!editingId}
                    title="Use Restock to change quantity"
                />
                <input
                    placeholder="Image URL (optional)"
                    className="p-2 border rounded md:col-span-2"
                    value={formData.image || ''}
                    onChange={e => setFormData({ ...formData, image: e.target.value })}
                />
                <input
                    placeholder="Description"
                    className="p-2 border rounded md:col-span-2"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                />

                <div className="md:col-span-2 flex gap-2">
                    <button
                        type="submit"
                        className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 transition flex-1 font-bold"
                    >
                        {editingId ? 'Update Sweet' : 'Add Sweet'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
