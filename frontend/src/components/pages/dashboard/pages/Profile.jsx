import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './profile.module.css';
import { useAuth } from '../../../../context/AuthContext.jsx';

const Profile = () => {
  const { token } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    _id: '',
    userId: '',
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    profileImage: null,
    previewImage: '/default-profile.png',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = res.data;

        setProfile({
          _id: user._id || '',
          userId: user.userId || '',
          name: user.name || '',
          username: user.username || '',
          email: user.email || '',
          phone: user.phone || '',
          address: user.address || '',
          previewImage: user.profileImage || '/default-profile.png',
          profileImage: null,
        });
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load profile data');
      } finally {
        setIsLoading(false);
      }
    };

    if (token) fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile((prev) => ({
        ...prev,
        profileImage: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('userId', profile.userId);
      formData.append('name', profile.name);
      formData.append('username', profile.username);
      formData.append('email', profile.email);
      formData.append('phone', profile.phone);
      formData.append('address', profile.address);
      if (profile.profileImage) {
        formData.append('profileImage', profile.profileImage);
      }

      await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (err) {
      console.log('Update failed:', err);
      setError('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className={styles.loading}>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.profileContainer}>
      <h2 className={styles.header}>Profile</h2>

      <div className={styles.profileActions}>
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>
            Edit Profile
          </button>
        ) : (
          <button onClick={() => setIsEditing(false)} className={styles.cancelButton}>
            Cancel
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.profileForm}>
        <div className={styles.imageSection}>
          <img
            src={profile.previewImage}
            alt="Profile"
            className={styles.profileImage}
          />
          {isEditing && (
            <>
              <input
                type="file"
                id="profileImage"
                accept="image/*"
                onChange={handleImageChange}
                className={styles.fileInput}
              />
              <label htmlFor="profileImage" className={styles.uploadButton}>
                Change Photo
              </label>
            </>
          )}
        </div>

        {/* <div className={styles.formGroup}>
          <label>User ID</label>
          <input
            type="text"
            value={profile.userId}
            readOnly
            className={styles.inputField}
          />
        </div> */}

        <div className={styles.formGroup}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={profile.username}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Full Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label>Phone Number</label>
          <input
            type="tel"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.inputField}
          />
        </div>

        <div className={styles.formGroup}>
          <label>Address</label>
          <textarea
            name="address"
            value={profile.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={styles.textareaField}
            rows="4"
          />
        </div>

        {isEditing && (
          <button
            type="submit"
            className={styles.saveButton}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        )}
      </form>
    </div>
  );
};

export default Profile;
