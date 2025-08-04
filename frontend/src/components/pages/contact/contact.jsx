import React, { useState } from 'react';
import { toast } from 'react-toastify';
import emailjs from '@emailjs/browser';
import 'react-toastify/dist/ReactToastify.css';
import styles from './contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for phone number to prevent invalid characters
    if (name === 'phone') {
      const filteredValue = value.replace(/[^0-9+()\- ]/g, '');
      setFormData(prev => ({ ...prev, [name]: filteredValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9+()\- ]*$/;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = 'Only numbers, +, -, (, ) and spaces allowed';
    } else if (formData.phone.replace(/[^0-9]/g, '').length < 8) {
      newErrors.phone = 'Phone must have at least 8 digits';
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please correct the errors in the form');
      return;
    }

    setLoading(true);

    try {
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        {
          to_email: 'arunk330840@gmail.com',
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          subject: formData.subject,
          message: formData.message
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      if (response.status === 200) {
        toast.success('Message sent successfully!');
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      }
    } catch (error) {
      console.error('EmailJS Error:', {
        status: error.status,
        text: error.text,
        message: error.message
      });
      toast.error(`Failed to send: ${error.text || 'Please try again later'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.contactSection}>
      <div className={styles.contactContainer}>
        <form className={styles.contactForm} onSubmit={handleSubmit}>
          <h2 className={styles.contactTitle}>Contact Us</h2>
          
          {/* Name Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Your Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              maxLength={50}
              className={`${styles.formInput} ${errors.name ? styles.errorInput : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <span className={styles.errorText}>{errors.name}</span>}
          </div>
          
          {/* Email Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Your Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.email ? styles.errorInput : ''}`}
              placeholder="example@domain.com"
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
          
          {/* Phone Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Your Phone *</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={15}
              className={`${styles.formInput} ${errors.phone ? styles.errorInput : ''}`}
              placeholder="+1 (123) 456-7890"
              pattern="^[0-9+()\-\ ]*$"
              title="Only numbers, +, -, (, ) and spaces allowed"
            />
            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            <div className={styles.charCounter}>
              Digits: {formData.phone.replace(/[^0-9]/g, '').length}
            </div>
          </div>
          
          {/* Subject Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Subject *</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={`${styles.formInput} ${errors.subject ? styles.errorInput : ''}`}
              placeholder="What's this about?"
            />
            {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
          </div>
          
          {/* Message Field */}
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Message *</label>
            <textarea
              rows={5}
              name="message"
              value={formData.message}
              onChange={handleChange}
              maxLength={1000}
              className={`${styles.formTextarea} ${errors.message ? styles.errorInput : ''}`}
              placeholder="Type your message here..."
            />
            {errors.message && <span className={styles.errorText}>{errors.message}</span>}
            <div className={styles.charCounter}>
              Characters: {formData.message.length}/1000
            </div>
          </div>

          <button
            className={styles.submitButton}
            type="submit"
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
};

export default Contact;