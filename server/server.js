const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: './config.env' });

const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// API Routes

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await db.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user by ID
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

// Add new user
app.post('/api/users', async (req, res) => {
  try {
    const { name, color } = req.body;
    if (!name || !color) {
      return res.status(400).json({ error: 'Name and color are required' });
    }
    const user = await db.addUser(name, color);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Get single meal
app.get('/api/meal', async (req, res) => {
  try {
    const meal = await db.getMeal();
    res.json(meal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meal' });
  }
});

// Set single meal (only first user can set it)
app.post('/api/meal', async (req, res) => {
  try {
    const { name, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'Name and userId are required' });
    }

    const meal = await db.setMeal(name, userId);
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to set meal' });
  }
});

// Get all meal items
app.get('/api/meals', async (req, res) => {
  try {
    const meals = await db.getMealItems();
    res.json(meals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch meals' });
  }
});

// Add new meal item
app.post('/api/meals', async (req, res) => {
  try {
    const { name, description, userId } = req.body;
    if (!name || !userId) {
      return res.status(400).json({ error: 'Name and userId are required' });
    }

    const meal = await db.addMealItem(name, description, userId);
    res.status(201).json(meal);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create meal item' });
  }
});

// Update meal item
app.put('/api/meals/:id', async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const result = await db.updateMealItem(req.params.id, name, description);
    if (!result.updated) {
      return res.status(404).json({ error: 'Meal item not found' });
    }
    res.json({ message: 'Meal item updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update meal item' });
  }
});

// Delete meal item
app.delete('/api/meals/:id', async (req, res) => {
  try {
    const result = await db.deleteMealItem(req.params.id);
    if (!result.deleted) {
      return res.status(404).json({ error: 'Meal item not found' });
    }
    res.json({ message: 'Meal item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete meal item' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'SHABAT API is running' });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 SHABAT Server running on port ${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
}); 