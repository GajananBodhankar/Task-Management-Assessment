const Task = require('../models/Task');

const buildTaskQuery = (req, includeAllOwners = false) => {
  const { status, search } = req.query;
  const query = includeAllOwners ? {} : { owner: req.user._id };

  if (status && ['pending', 'completed'].includes(status)) {
    query.status = status;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }

  return query;
};

const getPagination = (req) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 8, 1), 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const listTasks = async (req, res, next) => {
  try {
    const query = buildTaskQuery(req);
    const { page, limit, skip } = getPagination(req);
    const [tasks, total] = await Promise.all([
      Task.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    res.json({
      data: tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    next(error);
  }
};

const listAllTasks = async (req, res, next) => {
  try {
    const query = buildTaskQuery(req, true);
    const { page, limit, skip } = getPagination(req);
    const [tasks, total] = await Promise.all([
      Task.find(query).populate('owner', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
      Task.countDocuments(query),
    ]);

    res.json({
      data: tasks,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) || 1 },
    });
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({ ...req.body, owner: req.user._id });
    res.status(201).json({ data: task });
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.json({ data: task });
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id });

    if (!task) {
      const error = new Error('Task not found');
      error.statusCode = 404;
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = { listTasks, listAllTasks, createTask, updateTask, deleteTask };
