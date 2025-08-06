import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Participate.module.css';

const Participate = () => {
  const navigate = useNavigate();
  const [auctions, setAuctions] = useState([]);
  const [filteredAuctions, setFilteredAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [auctionCode, setAuctionCode] = useState('');
  const [joinError, setJoinError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'live', 'upcoming', 'endingSoon'

  // Mock data fetch - replace with real API call in production
  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        setLoading(true);
        // Simulate API call
        const mockAuctions = await new Promise(resolve => {
          setTimeout(() => {
            resolve([
              {
                id: 'abc123',
                title: 'Rare Vintage Watch Collection',
                description: 'A collection of 5 rare vintage watches from the 1960s',
                currentBid: 1250,
                currency: 'USD',
                endDate: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
                image: 'https://via.placeholder.com/300',
                status: 'live',
                participants: 12
              },
              {
                id: 'def456',
                title: 'Modern Art Painting',
                description: 'Original acrylic painting by contemporary artist',
                currentBid: 850,
                currency: 'EUR',
                endDate: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
                image: 'https://via.placeholder.com/300',
                status: 'live',
                participants: 8
              },
              {
                id: 'ghi789',
                title: 'Antique Jewelry Set',
                description: 'Victorian era jewelry set with precious stones',
                currentBid: 3200,
                currency: 'GBP',
                endDate: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
                image: 'https://via.placeholder.com/300',
                status: 'live',
                participants: 15
              },
              {
                id: 'jkl012',
                title: 'Classic Car Auction',
                description: '1967 Ford Mustang in pristine condition',
                currentBid: 45000,
                currency: 'USD',
                endDate: new Date(Date.now() + 604800000).toISOString(), // 7 days from now
                image: 'https://via.placeholder.com/300',
                status: 'upcoming',
                participants: 0
              }
            ]);
          }, 1000);
        });

        setAuctions(mockAuctions);
        setFilteredAuctions(mockAuctions);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch auctions. Please try again later.');
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // Filter auctions based on search term and active tab
  useEffect(() => {
    let results = auctions;
    
    // Apply tab filter
    switch (activeTab) {
      case 'live':
        results = results.filter(a => a.status === 'live');
        break;
      case 'upcoming':
        results = results.filter(a => a.status === 'upcoming');
        break;
      case 'endingSoon':
        results = results.filter(a => 
          a.status === 'live' && 
          new Date(a.endDate) - new Date() < 86400000 // Ending in less than 24 hours
        );
        break;
      default:
        // 'all' - no filter
        break;
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      results = results.filter(a => 
        a.title.toLowerCase().includes(term) || 
        a.description.toLowerCase().includes(term)
      );
    }
    
    setFilteredAuctions(results);
  }, [searchTerm, activeTab, auctions]);

  const handleJoinByCode = (e) => {
    e.preventDefault();
    setJoinError(null);
    
    if (!auctionCode.trim()) {
      setJoinError('Please enter an auction code');
      return;
    }

    // Check if auction exists (in a real app, this would be an API call)
    const auctionExists = auctions.some(a => a.id === auctionCode.trim());
    
    if (auctionExists) {
      navigate(`/auctions/${auctionCode.trim()}`);
    } else {
      setJoinError('Auction not found. Please check the code and try again.');
    }
  };

  const formatTimeRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = end - now;
    
    if (diff <= 0) return 'Ended';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h remaining`;
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const formatCurrency = (amount, currency) => {
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.header}>Participate in Auctions</h1>
      
      <div className={styles.joinSection}>
        <h2 className={styles.sectionTitle}>Join Auction by Code</h2>
        <form onSubmit={handleJoinByCode} className={styles.codeForm}>
          <input
            type="text"
            value={auctionCode}
            onChange={(e) => setAuctionCode(e.target.value)}
            placeholder="Enter auction code"
            className={styles.codeInput}
          />
          <button type="submit" className={styles.joinButton}>
            Join Auction
          </button>
        </form>
        {joinError && <div className={styles.error}>{joinError}</div>}
      </div>
      
      <div className={styles.searchSection}>
        <div className={styles.searchBar}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search auctions by title or description..."
            className={styles.searchInput}
          />
          <button className={styles.searchButton}>
            <i className="fas fa-search"></i>
          </button>
        </div>
        
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeTab === 'all' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Auctions
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'live' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('live')}
          >
            Live Now
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'upcoming' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={`${styles.tab} ${activeTab === 'endingSoon' ? styles.activeTab : ''}`}
            onClick={() => setActiveTab('endingSoon')}
          >
            Ending Soon
          </button>
        </div>
      </div>
      
      {error && <div className={styles.error}>{error}</div>}
      
      {loading ? (
        <div className={styles.loading}>Loading auctions...</div>
      ) : (
        <div className={styles.auctionsGrid}>
          {filteredAuctions.length > 0 ? (
            filteredAuctions.map(auction => (
              <div key={auction.id} className={styles.auctionCard} onClick={() => navigate(`/auctions/${auction.id}`)}>
                <div className={styles.auctionImage}>
                  <img src={auction.image} alt={auction.title} />
                  <div className={styles.timeRemaining}>
                    {formatTimeRemaining(auction.endDate)}
                  </div>
                </div>
                <div className={styles.auctionDetails}>
                  <h3 className={styles.auctionTitle}>{auction.title}</h3>
                  <p className={styles.auctionDescription}>{auction.description}</p>
                  <div className={styles.auctionStats}>
                    <div className={styles.currentBid}>
                      <span className={styles.label}>Current Bid:</span>
                      <span className={styles.value}>{formatCurrency(auction.currentBid, auction.currency)}</span>
                    </div>
                    <div className={styles.participants}>
                      <span className={styles.label}>Participants:</span>
                      <span className={styles.value}>{auction.participants}</span>
                    </div>
                  </div>
                  <button className={styles.viewButton}>View Auction</button>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.noResults}>
              No auctions found matching your criteria.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Participate;