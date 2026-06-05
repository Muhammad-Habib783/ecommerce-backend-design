import TrendingPage from './components/TrendingPage';
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Deals from './components/Deals';
import CategorySection from './components/CategorySection';
import RecommendedItems from './components/RecommendedItems';
import Services from './components/Services';
import RegionSuppliers from './components/RegionSuppliers';
import Newsletter from './components/Newsletter';
import Footer from './components/Footer';
import ProductListing from './components/ProductListing';
import ProductDetails from './components/ProductDetails';
import Cart from './components/Cart';
import Profile from './components/Profile';
import Messages from './components/Messages';
import Orders from './components/Orders';
import Auth from './components/Auth';
import AddProduct from './components/AddProduct';

import homeBanner from './assets/Image/backgrounds/image 98.png';
import electronicsBanner from './assets/Image/backgrounds/image 106.png';
import itemH1 from './assets/Image/interior/1.png';
import itemH2 from './assets/Image/interior/3.png';
import itemH3 from './assets/Image/interior/6.png';
import itemH4 from './assets/Image/interior/7.png';
import itemH5 from './assets/Image/interior/8.png';
import itemH6 from './assets/Image/interior/9.png';
import itemH7 from './assets/Image/interior/image 89.png';
import itemH8 from './assets/Image/interior/image 93.png';
import itemE1 from './assets/Image/tech/8.png';
import itemE2 from './assets/Image/tech/image 85.png';
import itemE3 from './assets/Image/tech/image 32.png';
import itemE4 from './assets/Image/tech/image 33.png';
import itemE5 from './assets/Image/tech/image 34.png';
import itemE6 from './assets/Image/tech/image 23.png';
import itemE7 from './assets/Image/tech/image 86.png';
import itemE8 from './assets/Image/tech/6.png';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [user, setUser] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [authMode, setAuthMode] = useState('login');

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setCurrentPage('home');
  };

  const handleSetPage = (page, data = null) => {
    if (page === 'listing' && typeof data === 'string' && data !== 'signup' && data !== 'login') {
      setSearchQuery(data);
    } else if (page === 'auth' && (data === 'signup' || data === 'login')) {
      setAuthMode(data);
    } else if (data && typeof data === 'object') {
      setSelectedProduct(data);
      setSearchQuery('');
    } else {
      setSearchQuery('');
    }
    setCurrentPage(page);
  };

  const homeAndOutdoorItems = [
    { name: "Soft Chair", price: "29", image: itemH1 },
    { name: "Ceramic Vase", price: "15", image: itemH2 },
    { name: "Table Lamp", price: "35", image: itemH3 },
    { name: "File Organizer", price: "19", image: itemH4 },
    { name: "Coffee Machine", price: "89", image: itemH5 },
    { name: "Fruit Juicer", price: "45", image: itemH6 },
    { name: "Indoor Plant", price: "25", image: itemH7 },
    { name: "Air Mattress", price: "59", image: itemH8 },
  ];

  const electronicsItems = [
    { name: "Smart watches", price: "19", image: itemE1 },
    { name: "Electric kettle", price: "240", image: itemE2 },
    { name: "Smartphones", price: "19", image: itemE3 },
    { name: "Smartphones", price: "19", image: itemE4 },
    { name: "Laptop", price: "35", image: itemE5 },
    { name: "Smart Phones", price: "340", image: itemE6 },
    { name: "Headphones", price: "10", image: itemE7 },
    { name: "Cameras", price: "89", image: itemE8 },
  ];

  const renderContent = () => {
    switch (currentPage) {
      case 'listing':
        return <ProductListing setPage={handleSetPage} searchQuery={searchQuery} />;
      case 'details':
        return <ProductDetails setPage={handleSetPage} product={selectedProduct} />;
      case 'cart':
        return <Cart setPage={handleSetPage} />;
      case 'profile':
        return <Profile setPage={handleSetPage} user={user} />;
      case 'message':
        return <Messages setPage={handleSetPage} />;
      case 'orders':
        return <Orders setPage={handleSetPage} />;
      case 'auth':
  return <Auth setPage={handleSetPage} setUser={setUser} mode={authMode} />;
      case 'addproduct':
        return <AddProduct setPage={handleSetPage} />;
        case 'trending':
  return <TrendingPage setPage={handleSetPage} />;
      default:
        return (
          <div className="container">
           <Hero user={user} setPage={handleSetPage} /> 
            <Deals setPage={handleSetPage} />
            <CategorySection
              title="Home and outdoor"
              bannerBg="#FFE6BF"
              bannerImg={homeBanner}
              items={homeAndOutdoorItems}
              setPage={handleSetPage}
            />
            <CategorySection
              title="Consumer electronics"
              bannerBg="#E5F1FF"
              bannerImg={electronicsBanner}
              items={electronicsItems}
              setPage={handleSetPage}
            />
            <RecommendedItems setPage={handleSetPage} />
            <Services />
            <RegionSuppliers />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header setPage={handleSetPage} user={user} onLogout={handleLogout} />
      <main className="flex-grow pb-12">
        {renderContent()}
      </main>
      <Newsletter />
      <Footer />
    </div>
  );
}

export default App;