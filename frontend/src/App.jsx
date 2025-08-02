// App.jsx
import './App.css';
import AuctionLogo from './assets/AuctionLogo.png';
import personIcon from './assets/person.png';
import {
    Link,
    Route,
    Routes
} from 'react-router-dom';
import Home from './components/pages/Home/Home.jsx';
import About from './components/pages/About/About.jsx';
import Auctions from './components/pages/Auctions/Auctions.jsx';
import Contact from './components/pages/Contact/Contact.jsx';
import Login from './components/pages/login/login.jsx';

function App() {
    return (
        <div className="App">
            <div className="navbar-container">
                <img src={AuctionLogo} alt="Auction Logo" />
                <Link to="/">Home +</Link>
                <Link to="/about">About</Link>
                <Link to="/auctions">Auction+</Link>
                <Link to="/contact">Contact</Link>
                <div className="flex-spacer" />
                <Link to="/login">
                    <img src={personIcon} alt="Login" className="login-icon" />
                </Link>
            </div>

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/auctions" element={<Auctions />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </div>
    );
}

export default App;
