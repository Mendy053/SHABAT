import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';
import './MealList.css';

const MealList = ({ meals, currentUser, onDeleteMeal, onEditMeal, showActions }) => {
  if (meals.length === 0) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="empty-icon">🍽️</div>
        <h3>אין פריטים עדיין</h3>
        <p>הוסף פריט ראשון כדי להתחיל!</p>
      </motion.div>
    );
  }

  return (
    <div className="meal-list">
      <AnimatePresence>
        {meals.map((meal, index) => (
          <motion.div
            key={meal.id}
            className="meal-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
            style={{ '--user-color': meal.user_color }}
          >
            <div className="meal-header">
              <div className="meal-user">
                <div 
                  className="user-indicator" 
                  style={{ backgroundColor: meal.user_color }}
                >
                  <span className="user-initial">{meal.user_name.charAt(0)}</span>
                </div>
                <div className="user-info">
                  <span className="user-name">{meal.user_name}</span>
                  <span className="meal-date">
                    {new Date(meal.created_at).toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>
              {showActions && (
                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => onEditMeal(meal)}
                    title="ערוך פריט"
                  >
                    <FaEdit />
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDeleteMeal(meal.id)}
                    title="מחק פריט"
                  >
                    <FaTrash />
                  </button>
                </div>
              )}
            </div>

            <div className="meal-content">
              <h3 className="meal-name">{meal.name}</h3>
              {meal.description && (
                <p className="meal-description">{meal.description}</p>
              )}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default MealList; 