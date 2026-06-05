import React, { useState, useEffect } from 'react';

function Cart({ setPage }) {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  }, []);

  const updateQuantity = (id, newQty) => {
    if (newQty < 1) return;
    const updated = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQty } : item
    );
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const removeItem = (id) => {
    const updated = cartItems.filter(item => item.id !== id);
    setCartItems(updated);
    localStorage.setItem('cart', JSON.stringify(updated));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCheckout = () => {
    const user = localStorage.getItem('user');
    if (!user) {
      alert('Please login to checkout!');
      setPage('auth');
      return;
    }
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
      id: Date.now().toString(),
      items: cartItems,
      total: total.toFixed(2),
      date: new Date().toLocaleDateString(),
      status: 'Confirmed'
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    clearCart();
window.dispatchEvent(new Event('cartUpdated'));
alert('Order placed successfully! 🎉');
setPage('orders');
  };

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = total * 0.1;
  const finalTotal = total + tax;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Cart {cartItems.length > 0 && <span className="text-gray-400">({cartItems.length} items)</span>}
        </h1>
        <button onClick={() => setPage('listing')} className="text-blue-600 hover:underline text-sm">
          ← Continue Shopping
        </button>
      </div>

      {cartItems.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="text-xl font-medium text-gray-600 mb-4">Your cart is empty</h2>
          <button
            onClick={() => setPage('listing')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Browse Products
          </button>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Cart Items */}
          <div className="flex-1 bg-white rounded-lg shadow overflow-hidden">
            {cartItems.map((item, index) => (
              <div
                key={item.id}
                className={`flex items-center p-4 gap-4 ${index !== cartItems.length - 1 ? 'border-b' : ''}`}
              >
                <img
                  src={item.image || 'https://via.placeholder.com/80'}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-medium text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-400 capitalize">{item.category}</p>
                  <p className="text-blue-600 font-bold">${item.price}</p>
                </div>
                <div className="flex items-center border rounded-lg overflow-hidden">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold"
                  >-</button>
                  <span className="px-4 py-1">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 font-bold"
                  >+</button>
                </div>
                <p className="font-bold text-gray-800 min-w-16 text-right">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-400 hover:text-red-600 ml-2 text-lg"
                >✕</button>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:w-80 bg-white rounded-lg shadow p-6 h-fit">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Order Summary</h2>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Tax (10%)</span>
              <span className="text-red-500">+${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-2 text-gray-600">
              <span>Shipping</span>
              <span className="text-green-600">Free</span>
            </div>
            <div className="border-t pt-3 mt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-blue-600">${finalTotal.toFixed(2)}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 transition"
            >
              Checkout
            </button>
            <button
              onClick={clearCart}
              className="w-full mt-2 border border-red-400 text-red-400 py-2 rounded-lg text-sm hover:bg-red-50"
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;