import React, { useState } from 'react';

function Profile({ setPage, user }) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <div className="text-6xl mb-4">👤</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Not Logged In</h2>
          <p className="text-gray-500 mb-6">Please sign in to view your profile</p>
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

  const initials = (user.name || user.email || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
        <button onClick={() => setPage('home')} className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xl font-bold">
            {initials}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name || 'User'}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>

        {editing ? (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
            />
            <div className="flex gap-3 mt-3">
              <button
                onClick={() => {
                  const updatedUser = { ...user, name };
                  localStorage.setItem('user', JSON.stringify(updatedUser));
                  setEditing(false);
                  alert('Profile updated!');
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                Save
              </button>
              <button
                onClick={() => setEditing(false)}
                className="border px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setEditing(true)}
            className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center mb-3"
          >
            <span className="font-medium">Edit Profile</span>
            <span>→</span>
          </button>
        )}

        <button
          onClick={() => setPage('orders')}
          className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center mb-3"
        >
          <span className="font-medium">My Orders</span>
          <span>→</span>
        </button>

        <button
          onClick={() => setPage('cart')}
          className="w-full text-left px-4 py-3 border rounded-lg hover:bg-gray-50 flex justify-between items-center mb-3"
        >
          <span className="font-medium">My Cart</span>
          <span>→</span>
        </button>

        <button
          onClick={() => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('cart');
            setPage('home');
            window.location.reload();
          }}
          className="w-full text-left px-4 py-3 border border-red-200 rounded-lg hover:bg-red-50 flex justify-between items-center text-red-500"
        >
          <span className="font-medium">Logout</span>
          <span>→</span>
        </button>
      </div>
    </div>
  );
}

export default Profile;