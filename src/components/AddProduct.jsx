import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function AddProduct({ setPage }) {
  const [form, setForm] = useState({
    name: '',
    price: '',
    category: '',
    image: '',
    description: '',
    stock: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await addDoc(collection(db, 'products'), {
        name: form.name,
        price: parseFloat(form.price),
        category: form.category,
        image: form.image || '',
        description: form.description || '',
        stock: parseInt(form.stock) || 0,
        createdAt: new Date().toISOString()
      });
      setSuccess('Product added successfully!');
      setForm({ name: '', price: '', category: '', image: '', description: '', stock: '' });
    } catch (err) {
      setError('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <button
            onClick={() => setPage('listing')}
            className="text-blue-600 hover:underline text-sm"
          >
            ← Back to Products
          </button>
        </div>

        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
        )}
        {success && (
          <div className="bg-green-100 text-green-600 p-3 rounded mb-4 text-sm">{success}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Product Name *</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Soft Chair"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Price ($) *</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="19"
              />
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="">Select Category</option>
                <option value="electronics">Electronics</option>
                <option value="interior">Interior</option>
                <option value="kitchen">Kitchen</option>
                <option value="clothing">Clothing</option>
                <option value="sports">Sports</option>
                <option value="pets">Pets</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 text-sm font-medium mb-2">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">Image URL</label>
              <input
                type="text"
                name="image"
                value={form.image}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="https://images.unsplash.com/..."
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-700 text-sm font-medium mb-2">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                placeholder="Product description..."
              />
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Adding Product...' : 'Add Product'}
          </button>
        </form>

      </div>
    </div>
  );
}

export default AddProduct;