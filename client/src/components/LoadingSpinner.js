import React from 'react';
import { motion } from 'framer-motion';
import './LoadingSpinner.css';

const LoadingSpinner = () => {
  return (
    <div className="loading-container">
      <motion.div
        className="loading-card"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="loading-icon">
          <motion.div
            className="spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <div className="spinner-segment" style={{ '--i': 0 }}></div>
            <div className="spinner-segment" style={{ '--i': 1 }}></div>
            <div className="spinner-segment" style={{ '--i': 2 }}></div>
            <div className="spinner-segment" style={{ '--i': 3 }}></div>
            <div className="spinner-segment" style={{ '--i': 4 }}></div>
            <div className="spinner-segment" style={{ '--i': 5 }}></div>
            <div className="spinner-segment" style={{ '--i': 6 }}></div>
            <div className="spinner-segment" style={{ '--i': 7 }}></div>
          </motion.div>
        </div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="loading-title"
        >
          שבת
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="loading-text"
        >
          טוען...
        </motion.p>
      </motion.div>
    </div>
  );
};

export default LoadingSpinner; 