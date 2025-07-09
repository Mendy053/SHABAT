import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { getApiUrl } from '../config';
import './AddMealModal.css';

const AddMealModal = ({ selectedUser, onClose, onMealAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('שם הפריט הוא שדה חובה');
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      await axios.post(getApiUrl('/api/meals'), {
        name: name.trim(),
        description: description.trim(),
        userId: selectedUser.id
      });

      onMealAdded();
    } catch (err) {
      setError('שגיאה בהוספת הפריט');
      console.error('Error adding meal:', err);
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
            <h2>הוסף פריט חדש</h2>
            <button className="close-button" onClick={onClose}>
              <FaTimes />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label htmlFor="name">שם הפריט</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="הכנס שם פריט"
                className="form-input"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">תיאור (אופציונלי)</label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="הוסף תיאור לפריט..."
                className="form-textarea"
                rows="3"
                disabled={loading}
              />
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
                {loading ? 'מוסיף...' : 'הוסף פריט'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddMealModal; 