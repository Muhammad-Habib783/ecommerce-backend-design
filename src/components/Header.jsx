import React, { useState, useEffect } from 'react';
import logo from '../assets/Layout/Brand/logo-colored.png';

function Header({ setPage, user, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showSearchError, setShowSearchError] = useState(false);
  const [cartCount, setCartCount] = useState(0);

useEffect(() => {
  const updateCartCount = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.reduce((sum, item) => sum + item.quantity, 0));
  };
  updateCartCount();
  window.addEventListener('storage', updateCartCount);
  window.addEventListener('cartUpdated', updateCartCount);
  return () => {
    window.removeEventListener('storage', updateCartCount);
    window.removeEventListener('cartUpdated', updateCartCount);
  };
}, []);

const handleLogout = () => {
    setShowLogoutPopup(true);
    setTimeout(() => {
      setShowLogoutPopup(false);
      onLogout();
    }, 2000);
  };
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setShowSearchError(true);
      setTimeout(() => setShowSearchError(false), 3000);
      return;
    }
    setPage('listing', searchQuery.trim());
    setSearchQuery('');
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Logout Popup */}
{showLogoutPopup && (
  <div className="fixed inset-0 flex items-center justify-center z-50">
    <div className="absolute inset-0 bg-black opacity-40"></div>
    <div className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
      <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="w-10 h-10 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Goodbye! 👋</h3>
      <p className="text-gray-500">You have been logged out successfully. See you soon!</p>
      <div className="mt-4 h-1 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full animate-progress"></div>
      </div>
    </div>
  </div>
)}

<style>{`
  @keyframes progress {
    0% { width: 0%; }
    100% { width: 100%; }
  }
  .animate-progress {
    animation: progress 2s linear forwards;
  }
`}</style>
      {/* Top bar */}
      <div className="bg-gray-800 text-white text-xs py-1 px-4 flex justify-between items-center">
        <span>Hi, welcome to Ecommerce store!</span>
        <div className="flex gap-4">
          {user ? (
            <>
              <span className="text-gray-300">Hello, {user.name || user.email}</span>
              <button onClick={handleLogout} className="hover:text-orange-400">Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => setPage('auth', 'login')} className="hover:text-orange-400">Sign in</button>
              <span>/</span>
              <button onClick={() => setPage('auth', 'signup')} className="hover:text-orange-400">Register</button>
            </>
          )}
        </div>
      </div>

      {/* Main header */}
      <div className="flex items-center justify-between px-4 py-3 max-w-7xl mx-auto">
        {/* Logo */}
        <button onClick={() => setPage('home')} className="flex items-center">
          <img src={logo} alt="Logo" className="h-8" />
        </button>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex-1 mx-6 hidden md:flex flex-col">
  <div className="flex">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => { setSearchQuery(e.target.value); setShowSearchError(false); }}
      placeholder="Search products..."
      className={`w-full border rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500 ${showSearchError ? 'border-red-500' : 'border-gray-300'}`}
    />
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700"
    >
      Search
    </button>
  </div>
  {showSearchError && (
    <p className="text-red-500 text-xs mt-1">⚠️ Please enter something to search!</p>
  )}
</form>

        {/* Right icons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setPage('profile')}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>

          <button
            onClick={() => setPage('message')}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <span className="text-xs">Messages</span>
          </button>

          <button
            onClick={() => setPage('orders')}
            className="flex flex-col items-center text-gray-600 hover:text-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <span className="text-xs">Orders</span>
          </button>

          <button
  onClick={() => setPage('cart')}
  className="flex flex-col items-center text-gray-600 hover:text-blue-600 relative"
>
  <div className="relative">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
    {cartCount > 0 && (
      <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
        {cartCount > 9 ? '9+' : cartCount}
      </span>
    )}
  </div>
  <span className="text-xs">Cart</span>
</button>

          {user && user.role === 'admin' && (
  <button
    onClick={() => setPage('addproduct')}
    className="bg-orange-500 text-white px-3 py-1 rounded text-sm hover:bg-orange-600"
  >
    + Add Product
  </button>
)}
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden ml-4"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile search */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-3">
          <form onSubmit={handleSearch} className="flex">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="w-full border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-r-lg">
              Search
            </button>
          </form>
        </div>
      )}
    </header>
  );
}

export default Header;