const Task = require('../models/Task');
const Project = require('../models/Project');
const User = require('../models/User');
const { ErrorResponse } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @desc    Get all tasks
 * @route   GET /api/tasks
 * @access  Private
 */
exports.getTasks = async (req, res, next) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Task.countDocuments();

        // Filtering
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.project) {
            filter.project = req.query.project;
        }
        if (req.query.priority) {
            filter.priority = req.query.priority;
        }

        // If user is not admin, only show tasks they are assigned to
        if (req.user.role !== 'admin') {
            filter.assignedTo = req.user.id;
        } else if (req.query.assignedTo) {
            filter.assignedTo = req.query.assignedTo;
        }

        // Due date filter
        if (req.query.dueBefore) {
            filter.dueDate = { ...filter.dueDate, $lte: new Date(req.query.dueBefore) };
        }
        if (req.query.dueAfter) {
            filter.dueDate = { ...filter.dueDate, $gte: new Date(req.query.dueAfter) };
        }

        // Search
        if (req.query.search) {
            filter.$or = [
                { title: { $regex: req.query.search, $options: 'i' } },
                { description: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        // Sort
        const sort = {};
        if (req.query.sort) {
            const fields = req.query.sort.split(',');
            fields.forEach(field => {
                if (field.startsWith('-')) {
                    sort[field.substring(1)] = -1;
                } else {
                    sort[field] = 1;
                }
            });
        } else {
            sort.dueDate = 1; // Default: sort by dueDate ascending
            sort.priority = -1; // Then by priority descending
        }

        // Query with filters and sort
        const tasks = await Task.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sort)
            .populate({
                path: 'project',
                select: 'name projectNumber'
            })
            .populate({
                path: 'assignedTo',
                select: 'name email'
            })
            .populate({
                path: 'createdBy',
                select: 'name email'
            });

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit,
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit,
            };
        }

        res.status(200).json({
            success: true,
            count: tasks.length,
            pagination,
            total,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single task
 * @route   GET /api/tasks/:id
 * @access  Private
 */
exports.getTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate({
                path: 'project',
                select: 'name projectNumber client',
                populate: {
                    path: 'client',
                    select: 'name contactName'
                }
            })
            .populate({
                path: 'assignedTo',
                select: 'name email'
            })
            .populate({
                path: 'createdBy',
                select: 'name email'
            });

        if (!task) {
            return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
        }

        // Check access - only admin and assigned users can view
        if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id.toString()) {
            return next(new ErrorResponse(`User not authorized to access this task`, 403));
        }

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create task
 * @route   POST /api/tasks
 * @access  Private
 */
exports.createTask = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        // Check if project exists
        if (req.body.project) {
            const project = await Project.findById(req.body.project);
            if (!project) {
                return next(new ErrorResponse(`Project not found with id of ${req.body.project}`, 404));
            }
        }

        // Check if assignedTo user exists
        if (req.body.assignedTo) {
            const user = await User.findById(req.body.assignedTo);
            if (!user) {
                return next(new ErrorResponse(`User not found with id of ${req.body.assignedTo}`, 404));
            }
        }

        // Generate task number if not provided
        if (!req.body.taskNumber) {
            const date = new Date();
            const year = date.getFullYear().toString().substr(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');

            const lastTask = await Task.findOne({})
                .sort({ createdAt: -1 });

            let sequence = '001';
            if (lastTask && lastTask.taskNumber) {
                const lastNumber = lastTask.taskNumber.split('-')[2];
                if (lastNumber) {
                    sequence = (parseInt(lastNumber) + 1).toString().padStart(3, '0');
                }
            }

            req.body.taskNumber = `TSK-${year}${month}-${sequence}`;
        }

        const task = await Task.create(req.body);

        // Log the task creation
        logger.info(`Task created: ${task.title} (${task._id}) by ${req.user.name} (${req.user._id})`);

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update task
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
exports.updateTask = async (req, res, next) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
        }

        // Check access - only admin and assigned users can update
        if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id.toString()) {
            return next(new ErrorResponse(`User not authorized to update this task`, 403));
        }

        // Check if project exists
        if (req.body.project) {
            const project = await Project.findById(req.body.project);
            if (!project) {
                return next(new ErrorResponse(`Project not found with id of ${req.body.project}`, 404));
            }
        }

        // Check if assignedTo user exists
        if (req.body.assignedTo) {
            const user = await User.findById(req.body.assignedTo);
            if (!user) {
                return next(new ErrorResponse(`User not found with id of ${req.body.assignedTo}`, 404));
            }
        }

        task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        }).populate({
            path: 'project',
            select: 'name projectNumber'
        })
            .populate({
                path: 'assignedTo',
                select: 'name email'
            });

        // Log the task update
        logger.info(`Task updated: ${task.title} (${task._id}) by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete task
 * @route   DELETE /api/tasks/:id
 * @access  Private/Admin
 */
exports.deleteTask = async (req, res, next) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
        }

        // Log the task deletion
        logger.info(`Task deleted: ${task.title} (${task._id}) by ${req.user.name} (${req.user._id})`);

        await task.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Task deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update task status
 * @route   PUT /api/tasks/:id/status
 * @access  Private
 */
exports.updateTaskStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!status) {
            return next(new ErrorResponse('Please provide a status', 400));
        }

        let task = await Task.findById(req.params.id);

        if (!task) {
            return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
        }

        // Check access - only admin and assigned users can update
        if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id.toString()) {
            return next(new ErrorResponse(`User not authorized to update this task`, 403));
        }

        // If status is completed, set completedAt date
        const updateData = {
            status,
            updatedBy: req.user.id
        };

        if (status === 'completed') {
            updateData.completedAt = Date.now();
        } else if (status === 'in-progress' && task.status === 'to-do') {
            updateData.startedAt = Date.now();
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
                new: true,
                runValidators: true,
            }
        );

        // Log the status update
        logger.info(`Task status updated for ${task.title} (${task._id}) to ${status} by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Add comment to task
 * @route   POST /api/tasks/:id/comments
 * @access  Private
 */
exports.addTaskComment = async (req, res, next) => {
    try {
        const { content } = req.body;

        if (!content) {
            return next(new ErrorResponse('Please provide comment content', 400));
        }

        let task = await Task.findById(req.params.id);

        if (!task) {
            return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
        }

        // Add comment
        const comment = {
            content,
            user: req.user.id,
            createdAt: Date.now()
        };

        task.comments.push(comment);
        task.updatedBy = req.user.id;

        await task.save();

        // Populate the user in the newly added comment
        const populatedTask = await Task.findById(req.params.id)
            .populate({
                path: 'comments.user',
                select: 'name email avatar'
            });

        // Get the newly added comment
        const newComment = populatedTask.comments[populatedTask.comments.length - 1];

        // Log the comment addition
        logger.info(`Comment added to task ${task.title} (${task._id}) by ${req.user.name} (${req.user._id})`);

        res.status(201).json({
            success: true,
            data: newComment,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update task time tracking
 * @route   PUT /api/tasks/:id/time
 * @access  Private
 */
exports.updateTaskTime = async (req, res, next) => {
    try {
        const { hours, description, date } = req.body;

        if (!hours || !description) {
            return next(new ErrorResponse('Please provide hours and description', 400));
        }

        let task = await Task.findById(req.params.id);

        if (!task) {
            return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
        }

        // Check access - only admin and assigned users can update
        if (req.user.role !== 'admin' && task.assignedTo.toString() !== req.user.id.toString()) {
            return next(new ErrorResponse(`User not authorized to update this task`, 403));
        }

        // Add time entry
        const timeEntry = {
            hours: parseFloat(hours),
            description,
            date: date || Date.now(),
            user: req.user.id
        };

        task.timeTracking.entries.push(timeEntry);

        // Update total actual hours
        task.timeTracking.actualHours = task.timeTracking.entries.reduce(
            (total, entry) => total + entry.hours,
            0
        );

        task.updatedBy = req.user.id;

        await task.save();

        // Populate the user in the newly added time entry
        const populatedTask = await Task.findById(req.params.id)
            .populate({
                path: 'timeTracking.entries.user',
                select: 'name email'
            });

        // Get the newly added time entry
        const newEntry = populatedTask.timeTracking.entries[populatedTask.timeTracking.entries.length - 1];

        // Log the time entry addition
        logger.info(`Time entry added to task ${task.title} (${task._id}) by ${req.user.name} (${req.user._id}): ${hours} hours`);

        res.status(200).json({
            success: true,
            data: {
                entry: newEntry,
                totalActualHours: task.timeTracking.actualHours,
                estimatedHours: task.timeTracking.estimatedHours
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get tasks for current user
 * @route   GET /api/tasks/me
 * @access  Private
 */
exports.getMyTasks = async (req, res, next) => {
    try {
        // Filter tasks assigned to current user
        const filter = { assignedTo: req.user.id };

        // Status filter
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Due date filter for upcoming tasks
        if (req.query.upcoming === 'true') {
            const today = new Date();
            const nextWeek = new Date();
            nextWeek.setDate(today.getDate() + 7);

            filter.dueDate = {
                $gte: today,
                $lte: nextWeek
            };
        }

        // Overdue tasks
        if (req.query.overdue === 'true') {
            const today = new Date();
            filter.dueDate = { $lt: today };
            filter.status = { $ne: 'completed' };
        }

        const tasks = await Task.find(filter)
            .sort({ dueDate: 1, priority: -1 })
            .populate({
                path: 'project',
                select: 'name projectNumber'
            });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Mark task as invoiced
 * @route   PUT /api/tasks/:id/invoice
 * @access  Private/Admin
 */
exports.markTaskAsInvoiced = async (req, res, next) => {
    try {
        const { invoiceId } = req.body;

        let task = await Task.findById(req.params.id);

        if (!task) {
            return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
        }

        // Only tasks with completed status can be invoiced
        if (task.status !== 'completed') {
            return next(new ErrorResponse('Only completed tasks can be marked as invoiced', 400));
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            {
                invoiced: true,
                invoiceId,
                invoicedAt: Date.now(),
                updatedBy: req.user.id
            },
            {
                new: true,
                runValidators: true,
            }
        );

        // Log the invoiced update
        logger.info(`Task marked as invoiced: ${task.title} (${task._id}) by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: task,
        });
    } catch (error) {
        next(error);
    }
}; 