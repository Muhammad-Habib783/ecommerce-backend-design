import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

function RecommendedItems({ setPage }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecommended();
  }, []);

  const fetchRecommended = async () => {
    try {
      const snapshot = await getDocs(collection(db, 'products'));
      const allProducts = [];
      snapshot.forEach(doc => {
        allProducts.push({ id: doc.id, ...doc.data() });
      });
      // Just show first 4 products
      setItems(allProducts.slice(0, 4));
    } catch (error) {
      console.error('Error fetching recommended:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Recommended Items</h2>
        <button
          onClick={() => setPage('listing')}
          className="text-blue-600 hover:underline text-sm"
        >
          View all →
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => setPage('details', item)}
            className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden"
          >
            <div className="h-40 bg-gray-100 overflow-hidden">
              <img
                src={item.image || 'https://via.placeholder.com/300'}
                alt={item.name}
                className="w-full h-full object-cover hover:scale-105 transition"
              />
            </div>
            <div className="p-3">
              <p className="text-xs text-gray-400 capitalize mb-1">{item.category}</p>
              <h3 className="font-medium text-gray-800 text-sm truncate">{item.name}</h3>
              <p className="text-blue-600 font-bold mt-1">${item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecommendedItems;