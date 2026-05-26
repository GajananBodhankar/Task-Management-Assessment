const express = require('express');
const {
  createTask,
  deleteTask,
  listAllTasks,
  listTasks,
  updateTask,
} = require('../controllers/taskController');
const { protect, requireRole } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { taskPayloadSchema, taskUpdateSchema } = require('../validators/taskValidators');

const router = express.Router();

router.use(protect);
router.get('/', listTasks);
router.post('/', validate(taskPayloadSchema), createTask);
router.get('/admin/all', requireRole('admin'), listAllTasks);
router.patch('/:id', validate(taskUpdateSchema), updateTask);
router.delete('/:id', deleteTask);

module.exports = router;
