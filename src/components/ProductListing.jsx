import React, { useState, useEffect } from 'react';
import { getProducts } from '../api';

function ProductListing({ setPage, searchQuery }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchQuery || '');
  const [category, setCategory] = useState('');
  const [page, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchProducts(searchQuery || '', '', 1);
  }, [searchQuery]);

  const fetchProducts = async (searchVal = '', categoryVal = '', pageVal = 1) => {
    setLoading(true);
    try {
      const res = await getProducts({
        search: searchVal || '',
        category: categoryVal || '',
        page: pageVal,
        limit: 8
      });
      setProducts(res.data.products);
      setTotalPages(res.data.totalPages);
      setTotal(res.data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchProducts(search, category, 1);
  };

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCurrentPage(1);
    fetchProducts(search, cat, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          All Products {total > 0 && <span className="text-gray-400 text-lg">({total})</span>}
        </h1>
        <button onClick={() => setPage('home')} className="text-blue-600 hover:underline text-sm">
          ← Back to Home
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products by name or category..."
          className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:border-blue-500"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-r-lg hover:bg-blue-700">
          Search
        </button>
      </form>

      <div className="flex gap-3 mb-6 flex-wrap">
        {['', 'electronics', 'interior', 'kitchen', 'clothing', 'sports', 'pets'].map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryChange(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              category === cat
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {cat === '' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">Loading products...</div>
        </div>
      ) : products.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg">No products found</div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => setPage('details', product)}
              className="bg-white rounded-lg shadow hover:shadow-md transition cursor-pointer overflow-hidden"
            >
              <div className="h-48 bg-gray-100 overflow-hidden">
                <img
                  src={product.image || 'https://via.placeholder.com/300'}
                  alt={product.name}
                  className="w-full h-full object-cover hover:scale-105 transition"
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

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => { setCurrentPage(p => p - 1); fetchProducts(search, category, page - 1); }}
            disabled={page === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => { setCurrentPage(i + 1); fetchProducts(search, category, i + 1); }}
              className={`px-4 py-2 border rounded-lg ${page === i + 1 ? 'bg-blue-600 text-white' : 'hover:bg-gray-100'}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => { setCurrentPage(p => p + 1); fetchProducts(search, category, page + 1); }}
            disabled={page === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-100"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductListing;