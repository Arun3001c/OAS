import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './CreateAuction.module.css';

const CreateAuction = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [auction, setAuction] = useState({
    title: '',
    description: '',
    startingPrice: '',
    reservePrice: '',
    currency: 'USD',
    endDate: '',
    category: 'general',
    images: [],
    previewImages: [],
    video: null,
    previewVideo: null,
    uniqueCode: generateUniqueCode()
  });

  const currencies = [
    { code: 'USD', name: 'US Dollar' },
    { code: 'EUR', name: 'Euro' },
    { code: 'GBP', name: 'British Pound' },
    { code: 'JPY', name: 'Japanese Yen' },
    { code: 'AUD', name: 'Australian Dollar' },
    { code: 'CAD', name: 'Canadian Dollar' },
    { code: 'INR', name: 'Indian Rupee' }
  ];

  const categories = [
    'general',
    'electronics',
    'art',
    'collectibles',
    'jewelry',
    'vehicles',
    'real-estate'
  ];

  // Generate a unique 8-character alphanumeric code
  function generateUniqueCode() {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAuction(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newImages = [];
    const newPreviews = [];

    files.forEach(file => {
      newImages.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setAuction(prev => ({
      ...prev,
      images: [...prev.images, ...newImages],
      previewImages: [...prev.previewImages, ...newPreviews]
    }));
  };

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate video file (max 50MB and MP4 format)
    if (file.size > 50 * 1024 * 1024) {
      setError('Video file size should be less than 50MB');
      return;
    }

    if (!file.type.includes('mp4')) {
      setError('Please upload a video in MP4 format');
      return;
    }

    setAuction(prev => ({
      ...prev,
      video: file,
      previewVideo: URL.createObjectURL(file)
    }));
  };

  const removeImage = (index) => {
    setAuction(prev => {
      const newImages = [...prev.images];
      const newPreviews = [...prev.previewImages];
      newImages.splice(index, 1);
      newPreviews.splice(index, 1);
      return { ...prev, images: newImages, previewImages: newPreviews };
    });
  };

  const removeVideo = () => {
    setAuction(prev => ({
      ...prev,
      video: null,
      previewVideo: null
    }));
  };

  const regenerateCode = () => {
    setAuction(prev => ({
      ...prev,
      uniqueCode: generateUniqueCode()
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validate form
      if (!auction.title || !auction.description || !auction.startingPrice) {
        throw new Error('Please fill all required fields');
      }

      if (new Date(auction.endDate) <= new Date()) {
        throw new Error('End date must be in the future');
      }

      if (parseFloat(auction.reservePrice) > 0 && 
          parseFloat(auction.reservePrice) < parseFloat(auction.startingPrice)) {
        throw new Error('Reserve price must be higher than starting price');
      }

      // Mock API call - replace with real API in production
      const mockResponse = await new Promise(resolve => {
        setTimeout(() => {
          resolve({
            data: {
              success: true,
              auction: {
                ...auction,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date().toISOString(),
                currentBid: auction.startingPrice,
                bids: [],
                status: 'active'
              }
            }
          });
        }, 1000);
      });

      console.log('Auction created:', mockResponse.data.auction);
      alert('Auction created successfully!');
      navigate(`/auctions/${mockResponse.data.auction.id}`);
    } catch (error) {
      console.error('Error creating auction:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>Create New Auction</h2>
      
      {error && <div className={styles.error}>{error}</div>}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="title">Auction Title*</label>
          <input
            type="text"
            id="title"
            name="title"
            value={auction.title}
            onChange={handleChange}
            required
            className={styles.input}
            placeholder="Enter auction title"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="description">Description*</label>
          <textarea
            id="description"
            name="description"
            value={auction.description}
            onChange={handleChange}
            required
            className={styles.textarea}
            placeholder="Describe your item in detail"
            rows="5"
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="startingPrice">Starting Price*</label>
            <div className={styles.priceInput}>
              <select
                name="currency"
                value={auction.currency}
                onChange={handleChange}
                className={styles.currencySelect}
              >
                {currencies.map(currency => (
                  <option key={currency.code} value={currency.code}>
                    {currency.code}
                  </option>
                ))}
              </select>
              <input
                type="number"
                id="startingPrice"
                name="startingPrice"
                value={auction.startingPrice}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className={styles.priceField}
                placeholder="0.00"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="reservePrice">Reserve Price</label>
            <div className={styles.priceInput}>
              <div className={styles.currencyDisplay}>
                {auction.currency}
              </div>
              <input
                type="number"
                id="reservePrice"
                name="reservePrice"
                value={auction.reservePrice}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={styles.priceField}
                placeholder="Optional minimum price"
              />
            </div>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date & Time*</label>
            <input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={auction.endDate}
              onChange={handleChange}
              required
              className={styles.input}
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={auction.category}
              onChange={handleChange}
              className={styles.select}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="uniqueCode">Auction Participation Code*</label>
          <div className={styles.codeInput}>
            <input
              type="text"
              id="uniqueCode"
              name="uniqueCode"
              value={auction.uniqueCode}
              readOnly
              className={styles.codeField}
            />
            <button
              type="button"
              onClick={regenerateCode}
              className={styles.regenerateButton}
            >
              Regenerate
            </button>
          </div>
          <p className={styles.codeHint}>
            This code will be required for participants to join the auction.
            Share it only with intended bidders.
          </p>
        </div>

        <div className={styles.formGroup}>
          <label>Images (Max 5)</label>
          <div className={styles.imageUpload}>
            <input
              type="file"
              id="images"
              accept="image/*"
              onChange={handleImageChange}
              multiple
              className={styles.fileInput}
            />
            <label htmlFor="images" className={styles.uploadButton}>
              Select Images
            </label>
            <span className={styles.imageCount}>
              {auction.images.length} / 5 selected
            </span>
          </div>

          {auction.previewImages.length > 0 && (
            <div className={styles.imagePreviews}>
              {auction.previewImages.map((preview, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={preview} alt={`Preview ${index}`} />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className={styles.removeImage}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.formGroup}>
          <label>Video (Optional)</label>
          <div className={styles.videoUpload}>
            <input
              type="file"
              id="video"
              accept="video/mp4"
              onChange={handleVideoChange}
              className={styles.fileInput}
            />
            <label htmlFor="video" className={styles.uploadButton}>
              Select Video
            </label>
            {auction.video && (
              <span className={styles.videoName}>
                {auction.video.name}
                <button
                  type="button"
                  onClick={removeVideo}
                  className={styles.removeVideo}
                >
                  ×
                </button>
              </span>
            )}
          </div>
          <p className={styles.videoHint}>
            Maximum 50MB MP4 file. Showcase your item in action.
          </p>

          {auction.previewVideo && (
            <div className={styles.videoPreview}>
              <video controls width="100%">
                <source src={auction.previewVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Auction...' : 'Create Auction'}
        </button>
      </form>
    </div>
  );
};

export default CreateAuction;