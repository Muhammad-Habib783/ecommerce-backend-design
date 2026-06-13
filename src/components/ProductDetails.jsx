import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import StarRating from './StarRating';

function ProductDetails({ setPage, product }) {
  const [productData, setProductData] = useState(product || null);
  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [ratingMsg, setRatingMsg] = useState('');

  useEffect(() => {
    if (product?.id) {
      fetchProduct();
    }
  }, [product]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const docRef = doc(db, 'products', product.id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProductData({ id: docSnap.id, ...docSnap.data() });
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.id === productData.id);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ ...productData, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleRate = async (star) => {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (!user) {
      setRatingMsg('Please login to rate this product!');
      setTimeout(() => setRatingMsg(''), 3000);
      return;
    }
    try {
      const productRef = doc(db, 'products', productData.id);
      const productSnap = await getDoc(productRef);
      const data = productSnap.data();
      const ratings = data.ratings || {};
      ratings[user.uid] = star;
      const totalRatings = Object.values(ratings).length;
      const avgRating = Object.values(ratings).reduce((a, b) => a + b, 0) / totalRatings;
      await updateDoc(productRef, {
        ratings,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings
      });
      setProductData(prev => ({
        ...prev,
        avgRating: Math.round(avgRating * 10) / 10,
        totalRatings
      }));
      setRatingMsg('Thanks for rating! ⭐');
      setTimeout(() => setRatingMsg(''), 3000);
    } catch (error) {
      setRatingMsg('Failed to submit rating. Try again!');
      setTimeout(() => setRatingMsg(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500 text-lg">Product not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => setPage('listing')}
        className="text-blue-600 hover:underline text-sm mb-6 flex items-center gap-1"
      >
        ← Back to Products
      </button>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          <div className="bg-gray-100 rounded-lg overflow-hidden h-80 md:h-96">
            <img
              src={productData.image || 'https://via.placeholder.com/400'}
              alt={productData.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-between">
            <div>
              <p className="text-sm text-gray-400 capitalize mb-2">{productData.category}</p>
              <h1 className="text-2xl font-bold text-gray-800 mb-3">{productData.name}</h1>
              <p className="text-3xl font-bold text-blue-600 mb-3">${productData.price}</p>

              <div className="mb-4">
                <p className="text-sm text-gray-500 mb-1">Rate this product:</p>
                <StarRating
                  rating={productData.avgRating || 0}
                  totalRatings={productData.totalRatings || 0}
                  productId={productData.id}
                  onRate={handleRate}
                />
                {ratingMsg && (
                  <p className={`text-sm mt-2 ${ratingMsg.includes('Thanks') ? 'text-green-600' : 'text-red-500'}`}>
                    {ratingMsg}
                  </p>
                )}
              </div>

              <p className="text-gray-600 mb-4">{productData.description}</p>
              <p className="text-sm text-gray-500 mb-6">
                Stock: <span className={productData.stock > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                  {productData.stock > 0 ? `${productData.stock} available` : 'Out of stock'}
                </span>
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-gray-700 font-medium">Quantity:</span>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 font-bold"
                  >-</button>
                  <span className="px-4 py-2 font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(productData.stock, q + 1))}
                    className="px-3 py-2 bg-gray-100 hover:bg-gray-200 font-bold"
                  >+</button>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={productData.stock === 0}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {addedToCart ? '✓ Added to Cart!' : 'Add to Cart'}
                </button>
                <button
                  onClick={() => setPage('cart')}
                  className="flex-1 border border-blue-600 text-blue-600 py-3 rounded-lg font-medium hover:bg-blue-50 transition"
                >
                  View Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;