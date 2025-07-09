import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaUserPlus, FaUsers } from 'react-icons/fa';
import AddUserModal from './AddUserModal';
import './UserSelection.css';

const UserSelection = ({ users, onUserSelect, onRefreshUsers }) => {
  const [showAddModal, setShowAddModal] = useState(false);

  const handleAddUser = () => {
    setShowAddModal(true);
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
  };

  const handleUserAdded = () => {
    setShowAddModal(false);
    onRefreshUsers();
  };

  return (
    <div className="user-selection">
      <motion.div
        className="header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="title">״יהודים מתכוננים לשבת״</h1>
        <br />
        <p className="subtitle">בחרו את המשתמש שלכם</p>
      </motion.div>

      <motion.div
        className="users-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {users.map((user, index) => (
          <motion.div
            key={user.id}
            className="user-card"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onUserSelect(user)}
            style={{ '--user-color': user.color }}
          >
            <div className="user-avatar" style={{ backgroundColor: user.color }}>
              <span className="user-initial">{user.name.charAt(0)}</span>
            </div>
            <h3 className="user-name">{user.name}</h3>
            <div className="user-color-indicator" style={{ backgroundColor: user.color }}></div>
          </motion.div>
        ))}

        <motion.div
          className="user-card add-user-card"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: users.length * 0.1 }}
          whileHover={{ scale: 1.05, y: -5 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAddUser}
        >
          <div className="user-avatar add-avatar">
            <FaUserPlus className="add-icon" />
          </div>
          <h3 className="user-name">הוסף משתמש</h3>
        </motion.div>
      </motion.div>

      <motion.div
        className="footer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="users-count">
          <FaUsers className="users-icon" />
          <span>{users.length} משתמשים במערכת</span>
        </div>
      </motion.div>

      {showAddModal && (
        <AddUserModal
          onClose={handleCloseModal}
          onUserAdded={handleUserAdded}
        />
      )}
    </div>
  );
};

export default UserSelection; 