const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');
const { verifyToken } = require('../middleware/auth');

// GET all products with pagination and search
router.get('/', async (req, res) => {
  try {
    const { search, category, page = 1, limit = 8 } = req.query;
    let query = db.collection('products');

    if (category) {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    let products = [];

    snapshot.forEach(doc => {
      products.push({ id: doc.id, ...doc.data() });
    });

    // Search filter
    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Pagination
    const total = products.length;
    const startIndex = (page - 1) * limit;
    const paginated = products.slice(startIndex, startIndex + parseInt(limit));

    res.json({
      products: paginated,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const doc = await db.collection('products').doc(req.params.id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST add new product (protected)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { name, price, category, image, description, stock } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({ error: 'Name, price and category are required' });
    }

    const product = {
      name,
      price: parseFloat(price),
      category,
      image: image || '',
      description: description || '',
      stock: parseInt(stock) || 0,
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('products').add(product);
    res.status(201).json({ id: docRef.id, ...product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE product (protected)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    await db.collection('products').doc(req.params.id).delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add rating to product
router.post('/:id/rate', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Please login to rate' });
    }

    const token = authHeader.split('Bearer ')[1];
    const { auth } = require('../config/firebase');
    const decodedToken = await auth.verifyIdToken(token);

    const { rating } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ error: 'Rating must be between 1 and 5' });
    }

    const productRef = db.collection('products').doc(req.params.id);
    const productDoc = await productRef.get();

    if (!productDoc.exists) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const productData = productDoc.data();
    const ratings = productData.ratings || {};
    ratings[decodedToken.uid] = rating;

    const totalRatings = Object.values(ratings).length;
    const avgRating = Object.values(ratings).reduce((a, b) => a + b, 0) / totalRatings;

    await productRef.update({
      ratings,
      avgRating: Math.round(avgRating * 10) / 10,
      totalRatings
    });

    res.json({ avgRating: Math.round(avgRating * 10) / 10, totalRatings });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;