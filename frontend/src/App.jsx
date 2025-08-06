// src/App.jsx
import './App.css';
import AuctionLogo from './assets/AuctionLogo.png';
import personIcon from './assets/person.png';
import { Link, Route, Routes, useNavigate, Navigate, useLocation } from 'react-router-dom';
import Home from './components/pages/Home/Home.jsx';
import About from './components/pages/About/About.jsx';
import Auctions from './components/pages/Auctions/auctions.jsx';
import Contact from './components/pages/Contact/Contact.jsx';
import Login from './components/pages/login/login.jsx';
import DashboardLayout from './components/pages/dashboard/DashboardLayout.jsx';
import Dashboard from './components/pages/dashboard/pages/Dashboard.jsx';
import CreateAuction from './components/pages/dashboard/pages/CreateAuction.jsx';
import Participate from './components/pages/dashboard/pages/Participate.jsx';
import Profile from './components/pages/dashboard/pages/Profile.jsx';
import { useAuth } from './context/AuthContext.jsx';

function App() {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user;
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isDashboardRoute = location.pathname.startsWith('/dashboard');

  return (
    <div className="App">
      {!isDashboardRoute && (
        <div className="navbar-container">
          <img src={AuctionLogo} alt="Auction Logo" />
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/auctions">Auctions</Link>
          <Link to="/contact">Contact</Link>
          <div className="flex-spacer" />

          {isLoggedIn ? (
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          ) : (
            <Link to="/login">
              <img src={personIcon} alt="Login" className="login-icon" />
            </Link>
          )}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard nested routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="create-auction" element={<CreateAuction />} />
          <Route path="participate" element={<Participate />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
