const express = require('express');
const router = express.Router();
const { auth, db } = require('../config/firebase');

// Verify token and get user info
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.exists ? userDoc.data() : {};

    res.json({
      uid: decodedToken.uid,
      email: decodedToken.email,
      ...userData
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Save user profile after signup
router.post('/profile', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    const { name, phone } = req.body;

    await db.collection('users').doc(decodedToken.uid).set({
      name: name || '',
      phone: phone || '',
      email: decodedToken.email,
      role: 'user',
      updatedAt: new Date().toISOString()
    }, { merge: true });

    res.json({ message: 'Profile saved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Make user admin (only callable by existing admin)
router.post('/make-admin', async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await auth.verifyIdToken(token);

    // Check if requester is admin
    const requesterDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!requesterDoc.exists || requesterDoc.data().role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can make other admins' });
    }

    const { userId } = req.body;
    await db.collection('users').doc(userId).set({ role: 'admin' }, { merge: true });

    res.json({ message: 'User promoted to admin' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;