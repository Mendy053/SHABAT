import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSignOutAlt, FaPlus, FaEdit } from 'react-icons/fa';
import axios from 'axios';
import AddMealModal from './AddMealModal';
import EditMealModal from './EditMealModal';
import MealList from './MealList';
import LoadingSpinner from './LoadingSpinner';
import './MealPlanner.css';

const MealPlanner = ({ selectedUser, onLogout }) => {
  const [meal, setMeal] = useState(null);
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mealResponse, mealsResponse] = await Promise.all([
        axios.get('/api/meal'),
        axios.get('/api/meals')
      ]);
      setMeal(mealResponse.data);
      setMeals(mealsResponse.data);
      setError(null);
    } catch (err) {
      setError('שגיאה בטעינת הנתונים');
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMeal = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setShowEditModal(false);
    setEditingMeal(null);
  };

  const handleMealAdded = () => {
    setShowAddModal(false);
    fetchData();
  };

  const handleEditMeal = (mealItem) => {
    setEditingMeal(mealItem);
    setShowEditModal(true);
  };

  const handleMealEdited = () => {
    setShowEditModal(false);
    setEditingMeal(null);
    fetchData();
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await axios.delete(`/api/meals/${mealId}`);
      fetchData();
    } catch (err) {
      console.error('Error deleting meal:', err);
    }
  };

  const handleSetMealName = async (mealName) => {
    try {
      await axios.post('/api/meal', {
        name: mealName,
        userId: selectedUser.id
      });
      fetchData();
    } catch (err) {
      console.error('Error setting meal name:', err);
    }
  };

  return (
    <div className="meal-planner">
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="user-info">
          <div 
            className="user-avatar" 
            style={{ backgroundColor: selectedUser.color }}
          >
            <span className="user-initial">{selectedUser.name.charAt(0)}</span>
          </div>
          <div className="user-details">
            <h1 className="welcome-text">שלום, {selectedUser.name}!</h1>
            <p className="subtitle">תכנון ארוחות שבת</p>
          </div>
        </div>
        <button className="logout-button" onClick={onLogout}>
          <FaSignOutAlt />
          <span>התנתק</span>
        </button>
      </motion.div>

      <motion.div
        className="meal-header"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {meal ? (
          <div className="current-meal">
            <h2 className="meal-title">{meal.name}</h2>
            <p className="meal-creator">נוצר על ידי {meal.created_by_name}</p>
          </div>
        ) : (
          <div className="set-meal">
            <h2 className="meal-title">הגדר שם לארוחה</h2>
            <button 
              className="set-meal-button"
              onClick={() => {
                const name = prompt('הכנס שם לארוחה:');
                if (name && name.trim()) {
                  handleSetMealName(name.trim());
                }
              }}
            >
              הגדר שם
            </button>
          </div>
        )}
      </motion.div>

      <motion.div
        className="content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="content-header">
          <h2 className="section-title">מה שכולם מכינים</h2>
          <button className="add-meal-button" onClick={handleAddMeal}>
            <FaPlus />
            <span>הוסף פריט</span>
          </button>
        </div>

        {loading ? (
          <div className="loading-container">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="error-message">
            <p>{error}</p>
            <button onClick={fetchData} className="retry-button">
              נסה שוב
            </button>
          </div>
        ) : (
          <MealList
            meals={meals}
            currentUser={selectedUser}
            onDeleteMeal={handleDeleteMeal}
            onEditMeal={handleEditMeal}
            showActions={true}
          />
        )}
      </motion.div>

      {showAddModal && (
        <AddMealModal
          selectedUser={selectedUser}
          onClose={handleCloseModal}
          onMealAdded={handleMealAdded}
        />
      )}

      {showEditModal && editingMeal && (
        <EditMealModal
          meal={editingMeal}
          onClose={handleCloseModal}
          onMealEdited={handleMealEdited}
        />
      )}
    </div>
  );
};

export default MealPlanner; 