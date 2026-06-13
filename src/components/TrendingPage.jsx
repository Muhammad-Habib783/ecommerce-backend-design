import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';

function TrendingPage({ setPage }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchElectronics();
  }, []);

  const fetchElectronics = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'products'), where('category', '==', 'electronics'));
      const snapshot = await getDocs(q);
      const items = [];
      snapshot.forEach(doc => items.push({ id: doc.id, ...doc.data() }));
      setProducts(items.slice(0, 8));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-teal-400 to-cyan-500 py-16 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-white">
            <p className="text-lg font-normal mb-2">Latest trending</p>
            <h1 className="text-5xl font-bold mb-4">Electronic items</h1>
            <p className="text-teal-100 text-lg mb-6">
              Discover the latest and greatest in consumer electronics. <br />
              From smartphones to laptops, we have it all!
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setPage('listing', 'electronics')}
                className="bg-white text-teal-600 px-6 py-3 rounded-lg font-medium hover:bg-teal-50 transition"
              >
                Shop Now
              </button>
              <button
                onClick={() => setPage('home')}
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-teal-600 transition"
              >
                ← Back to Home
              </button>
            </div>
          </div>
          <div className="text-white text-center">
            <div className="text-9xl">📱</div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-8 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">500+</p>
            <p className="text-gray-500 text-sm">Products Available</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">50+</p>
            <p className="text-gray-500 text-sm">Top Brands</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">24/7</p>
            <p className="text-gray-500 text-sm">Customer Support</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-blue-600">Free</p>
            <p className="text-gray-500 text-sm">Shipping Available</p>
          </div>
        </div>
      </div>

      {/* Featured Categories */}
      <div className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Smartphones', icon: '📱', color: 'bg-blue-50' },
            { name: 'Laptops', icon: '💻', color: 'bg-purple-50' },
            { name: 'Headphones', icon: '🎧', color: 'bg-green-50' },
            { name: 'Smart Watches', icon: '⌚', color: 'bg-orange-50' },
          ].map((cat) => (
            <div
              key={cat.name}
              onClick={() => setPage('listing', cat.name.toLowerCase())}
              className={`${cat.color} p-6 rounded-xl text-center cursor-pointer hover:shadow-md transition`}
            >
              <div className="text-4xl mb-2">{cat.icon}</div>
              <p className="font-medium text-gray-800">{cat.name}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Featured Electronics</h2>
          <button
            onClick={() => setPage('listing', 'electronics')}
            className="text-blue-600 hover:underline text-sm"
          >
            View all →
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-5xl mb-4">📦</div>
            <p>No electronics found. Add some products first!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => setPage('details', product)}
                className="bg-white rounded-xl shadow hover:shadow-lg transition cursor-pointer overflow-hidden group"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs text-gray-400 capitalize mb-1">{product.category}</p>
                  <h3 className="font-medium text-gray-800 text-sm mb-1 truncate">{product.name}</h3>
                  <div className="flex items-center gap-1 mb-1">
                    {[1,2,3,4,5].map(star => (
                      <span key={star} className={`text-sm ${star <= Math.round(product.avgRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
                    ))}
                    <span className="text-xs text-gray-400">({product.totalRatings || 0})</span>
                  </div>
                  <p className="text-blue-600 font-bold">${product.price}</p>
                  <p className="text-xs text-gray-400 mt-1">Stock: {product.stock}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Why Choose Us */}
      <div className="bg-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🚚', title: 'Free Shipping', desc: 'Free shipping on all orders above $50' },
              { icon: '🔒', title: 'Secure Payment', desc: '100% secure payment with SSL encryption' },
              { icon: '↩️', title: 'Easy Returns', desc: '30 day easy return policy' },
            ].map((item) => (
              <div key={item.title} className="text-center p-6 rounded-xl bg-gray-50">
                <div className="text-4xl mb-3">{item.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}

export default TrendingPage;