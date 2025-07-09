import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import { getApiUrl } from '../config';
import './AddUserModal.css';

const AddUserModal = ({ onClose, onUserAdded }) => {
  const [name, setName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#FF6B6B');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#FF8A80', '#80CBC4', '#81C784', '#FFD54F', '#BA68C8', '#4FC3F7'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('שם המשתמש הוא שדה חובה');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await axios.post(getApiUrl('/api/users'), {
        name: name.trim(),
        color: selectedColor
      });

      onUserAdded();
    } catch (err) {
      setError('שגיאה בהוספת המשתמש');
      console.error('Error adding user:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-content"
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-header">
            <h2>הוסף משתמש חדש</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="name">שם המשתמש</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הכנס שם משתמש"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>בחר צבע</label>
              <div className="color-picker">
                {colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    disabled={loading}
                  >
                    {selectedColor === color && <FaUserPlus />}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {error}
              </motion.div>
            )}

            <div className="modal-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={onClose}
                disabled={loading}
              >
                ביטול
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading || !name.trim()}
              >
                {loading ? 'מוסיף...' : 'הוסף משתמש'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddUserModal; 