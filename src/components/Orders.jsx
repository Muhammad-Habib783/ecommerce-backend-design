import React, { useState, useEffect } from 'react';

function Orders({ setPage }) {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(savedOrders);
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your orders</p>
          <button
            onClick={() => setPage('auth')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 mr-3"
          >
            Sign In
          </button>
          <button
            onClick={() => setPage('home')}
            className="border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Orders</h1>
        <button onClick={() => setPage('home')} className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-6xl mb-4">📦</div>
          <h2 className="text-xl font-medium text-gray-600 mb-4">No orders yet</h2>
          <button
            onClick={() => setPage('listing')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.slice().reverse().map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-gray-800">Order #{order.id.slice(-6)}</h3>
                  <p className="text-sm text-gray-400">{order.date}</p>
                </div>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium">
                  {order.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <img
                      src={item.image || 'https://via.placeholder.com/50'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 text-sm">{item.name}</p>
                      <p className="text-gray-400 text-xs">Qty: {item.quantity} × ${item.price}</p>
                    </div>
                    <p className="font-medium text-gray-800">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 flex justify-between font-bold">
                <span>Total</span>
                <span className="text-blue-600">${order.total}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Orders;