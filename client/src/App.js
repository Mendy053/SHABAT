import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { getApiUrl, isUsingNgrok, updateBaseUrl } from './config';
import { detectNgrokUrl } from './utils/ngrokDetector';
import UserSelection from './components/UserSelection';
import MealPlanner from './components/MealPlanner';
import LoadingSpinner from './components/LoadingSpinner';
import './App.css';

function App() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingNgrok, setUsingNgrok] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Try to detect ngrok URL automatically
      const ngrokUrl = await detectNgrokUrl();
      if (ngrokUrl) {
        updateBaseUrl(ngrokUrl);
        console.log('🌐 Detected ngrok URL:', ngrokUrl);
        console.log('📱 App is now accessible from anywhere on the internet!');
      }
      
      // Check if we're using ngrok
      setUsingNgrok(isUsingNgrok());
      
      // Fetch users
      await fetchUsers();
    } catch (error) {
      console.error('Error initializing app:', error);
      setError('שגיאה באתחול המערכת');
    }
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(getApiUrl('/api/users'));
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError('שגיאה בטעינת המשתמשים');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const handleLogout = () => {
    setSelectedUser(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <h2>שגיאה</h2>
          <p>{error}</p>
          {usingNgrok && (
            <div className="ngrok-info">
              <p>🌐 משתמש ב-ngrok לחיבור לאינטרנט</p>
            </div>
          )}
          <button onClick={fetchUsers} className="retry-button">
            נסה שוב
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {usingNgrok && (
        <div className="ngrok-banner">
          🌐 מחובר דרך ngrok - נגיש מכל מקום!
        </div>
      )}
      
      <AnimatePresence mode="wait">
        {!selectedUser ? (
          <motion.div
            key="user-selection"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <UserSelection 
              users={users} 
              onUserSelect={handleUserSelect}
              onRefreshUsers={fetchUsers}
            />
          </motion.div>
        ) : (
          <motion.div
            key="meal-planner"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <MealPlanner 
              selectedUser={selectedUser}
              onLogout={handleLogout}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App; 