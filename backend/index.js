const express = require('express');
const cors = require('cors');
const app = express();

const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// In-memory task list (will be reset on server restart)
let tasks = [];
let idCounter = 1;

// GET all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// POST a new task
app.post('/api/tasks', (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Task text is required' });
  }
  const newTask = { id: idCounter++, text };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// DELETE a task
app.delete('/api/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  tasks = tasks.filter((task) => task.id !== taskId);
  res.json({ message: 'Task deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
});
 
