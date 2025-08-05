import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from './login.module.css';
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
  const [activeForm, setActiveForm] = useState('login');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    otp: '',
    newPassword: ''
  });
  const [passwordVisible, setPasswordVisible] = useState({
    password: false,
    confirmPassword: false,
    newPassword: false
  });
  const [otpSent, setOtpSent] = useState(false);
  const [verificationPending, setVerificationPending] = useState(false);
  const [message, setMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const togglePasswordVisibility = (field) => {
    setPasswordVisible(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSendOTP = async () => {
    try {
      await axios.post(`${API}/forgot-password`, { email: formData.email });
      setOtpSent(true);
      setMessage('OTP has been sent to your email');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/reset-password`, {
        email: formData.email,
        otp: formData.otp,
        newPassword: formData.newPassword
      });
      setMessage('Password reset successfully!');
      setActiveForm('login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Password reset failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (activeForm === 'signup') {
        if (formData.password !== formData.confirmPassword) {
          setMessage('Passwords do not match');
          return;
        }

        await axios.post(`${API}/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });

        setMessage('Verification code sent to your email.');
        setVerificationPending(true);
        setActiveForm('verify');

      } else if (activeForm === 'login') {
        const res = await axios.post(`${API}/login`, {
          email: formData.email,
          password: formData.password
        });

        setMessage('Login successful!');
        localStorage.setItem('token', res.data.token);
        login(res.data.token); 
        navigate('/dashboard');
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/verify-otp`, {
        email: formData.email,
        otp: formData.otp
      });
      setMessage('Verification successful. You can now log in.');
      setVerificationPending(false);
      setActiveForm('login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'OTP verification failed');
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(`${API}/resend-otp`, { email: formData.email });
      setMessage('New OTP sent to your email');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to resend OTP');
    }
  };

  const renderPasswordInput = (label, name, value) => (
    <div className={styles.inputGroup}>
      <label>{label}</label>
      <div className={styles.passwordWrapper}>
        <input
          type={passwordVisible[name] ? 'text' : 'password'}
          name={name}
          value={value}
          onChange={handleChange}
          required
        />
        <span
          className={styles.eyeIcon}
          onClick={() => togglePasswordVisibility(name)}
        >
          {passwordVisible[name] ? '👁️' : '🙈'}
        </span>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.logo}>AUCTION</h1>

        {activeForm === 'login' ? (
          <div className={styles.formContent}>
            <h2 className={styles.title}>Welcome Back!</h2>
            <p className={styles.subtitle}>Sign in to continue</p>

            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              {renderPasswordInput('Password', 'password', formData.password)}
              <button type="submit" className={styles.primaryButton}>LOGIN</button>
              <div className={styles.footerLinks}>
                <span onClick={() => setActiveForm('forgot')}>Forgot Password?</span>
                <span onClick={() => setActiveForm('signup')}>Create Account</span>
              </div>
              {message && <div className={styles.message}>{message}</div>}
            </form>
          </div>
        ) : activeForm === 'signup' ? (
          <div className={styles.formContent}>
            <h2 className={styles.title}>Create Account</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required />
              </div>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              {renderPasswordInput('Password', 'password', formData.password)}
              {renderPasswordInput('Confirm Password', 'confirmPassword', formData.confirmPassword)}
              <button type="submit" className={styles.primaryButton}>SIGN UP</button>
              <div className={styles.footerLinks}>
                <span onClick={() => setActiveForm('login')}>Already have an account? Sign in</span>
              </div>
              {message && <div className={styles.message}>{message}</div>}
            </form>
          </div>
        ) : activeForm === 'verify' ? (
          <div className={styles.formContent}>
            <h2 className={styles.title}>Verify Your Email</h2>
            <p className={styles.subtitle}>Enter the code sent to your email</p>
            <form onSubmit={handleVerifyOTP}>
              <div className={styles.inputGroup}>
                <label>OTP</label>
                <input type="text" name="otp" value={formData.otp} onChange={handleChange} required />
              </div>
              <button type="submit" className={styles.primaryButton}>VERIFY</button>
              <button type="button" onClick={handleResendOTP} className={styles.secondaryButton}>RESEND OTP</button>
              {message && <div className={styles.message}>{message}</div>}
            </form>
          </div>
        ) : (
          <div className={styles.formContent}>
            <h2 className={styles.title}>Reset Password</h2>
            <p className={styles.subtitle}>Enter your email to receive OTP</p>
            <form onSubmit={handleResetPassword}>
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />
              </div>
              {otpSent && (
                <>
                  <div className={styles.inputGroup}>
                    <label>OTP</label>
                    <input type="text" name="otp" value={formData.otp} onChange={handleChange} required />
                  </div>
                  {renderPasswordInput('New Password', 'newPassword', formData.newPassword)}
                </>
              )}
              {!otpSent ? (
                <button type="button" onClick={handleSendOTP} className={styles.primaryButton}>SEND OTP</button>
              ) : (
                <button type="submit" className={styles.primaryButton}>RESET PASSWORD</button>
              )}
              <div className={styles.footerLinks}>
                <span onClick={() => setActiveForm('login')}>Back to Login</span>
              </div>
              {message && <div className={styles.message}>{message}</div>}
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
