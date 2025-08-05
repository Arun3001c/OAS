// src/App.jsx
import './App.css';
import AuctionLogo from './assets/AuctionLogo.png';
import personIcon from './assets/person.png';
import { Link, Route, Routes, useNavigate } from 'react-router-dom';
import Home from './components/pages/Home/Home.jsx';
import About from './components/pages/About/About.jsx';
import Auctions from './components/pages/Auctions/Auctions.jsx';
import Contact from './components/pages/Contact/Contact.jsx';
import Login from './components/pages/login/login.jsx';
import Dashboard from './components/pages/Dashboard/dashboard.jsx';
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="App">
      <div className="navbar-container">
        <img src={AuctionLogo} alt="Auction Logo" />
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/auctions">Auctions</Link>
        <Link to="/contact">Contact</Link>
        <div className="flex-spacer" />

        {isLoggedIn ? (
          <>
            {/* <span style={{ marginRight: '10px', fontWeight: 'bold' }}>
              {user?.name?.split(' ')[0]}
            </span> */}
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <img src={personIcon} alt="Login" className="login-icon" />
          </Link>
        )}
      </div>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  );
}

export default App;
