import React, { useState } from 'react';

function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    const subscribers = JSON.parse(localStorage.getItem('newsletter') || '[]');

    setTimeout(() => {
      if (subscribers.includes(email.toLowerCase())) {
        setStatus('already');
      } else {
        subscribers.push(email.toLowerCase());
        localStorage.setItem('newsletter', JSON.stringify(subscribers));
        setStatus('success');
      }
      setLoading(false);
    }, 1000);
  };

  const handleTryAnother = () => {
    setEmail('');
    setStatus('');
  };

  return (
    <div className="bg-blue-600 py-12 px-4">
      <div className="max-w-3xl mx-auto text-center">

        <h2 className="text-2xl font-bold text-white mb-2">
          Subscribe to our Newsletter
        </h2>
        <p className="text-blue-200 mb-6">
          Get the latest deals, offers and product updates delivered to your inbox!
        </p>

        {status === 'success' ? (
          <div className="bg-green-500 text-white px-6 py-4 rounded-lg inline-block">
            🎉 Successfully subscribed! Thank you for joining us.
          </div>
        ) : status === 'already' ? (
          <div className="flex flex-col items-center gap-3">
            <div className="bg-yellow-500 text-white px-6 py-4 rounded-lg">
              ⚠️ <strong>{email}</strong> is already subscribed!
            </div>
            <button
              onClick={handleTryAnother}
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition"
            >
              Try Another Email
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-lg focus:outline-none text-gray-800"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-orange-600 transition disabled:opacity-50 whitespace-nowrap"
            >
              {loading ? 'Checking...' : 'Subscribe Now'}
            </button>
          </form>
        )}

        <p className="text-blue-300 text-xs mt-4">
          No spam ever. Unsubscribe at any time.
        </p>
      </div>
    </div>
  );
}

export default Newsletter;