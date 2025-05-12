const Project = require('../models/Project');
const Task = require('../models/Task');
const Client = require('../models/Client');
const { ErrorResponse } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @desc    Get all projects
 * @route   GET /api/projects
 * @access  Private
 */
exports.getProjects = async (req, res, next) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Project.countDocuments();

        // Filtering
        const filter = { deleted: { $ne: true } };
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.client) {
            filter.client = req.query.client;
        }
        if (req.query.assignedTo) {
            filter.assignedTo = req.query.assignedTo;
        }

        // If user is not admin, only show projects they are assigned to
        // if (req.user.role !== 'admin' && req.user.role !== 'finance' && req.user.role !== 'manager' ) {
        //     filter.assignedTo = req.user.id;
        // }

        // Search
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
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
            sort.createdAt = -1;
        }

        // Query with filters and sort
        const projects = await Project.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sort)
            .populate({
                path: 'client',
                select: 'name contactName contactEmail'
            })
            .populate({
                path: 'assignedTo',
                select: 'name email avatar'
            })
            .populate({
                path: 'createdBy',
                select: 'name email'
            })
            .populate({
                path: 'documents',
                select: 'name fileUrl category uploadedBy createdAt deleted',
                populate: {
                    path: 'uploadedBy',
                    select: 'name email',
                },
            });;
        // 🧠 Add completion stats for each project
        const projectsWithStats = await Promise.all(projects.map(async (project) => {
            const taskIds = project.tasks || [];
            const totalTasks = taskIds.length;

            let completedTasks = 0;
            if (totalTasks > 0) {
                completedTasks = await Task.countDocuments({
                    _id: { $in: taskIds },
                    status: 'completed',
                });
            }

            const completionPercentage = totalTasks > 0
                ? Math.round((completedTasks / totalTasks) * 100)
                : 0;

            const projectObj = project.toObject();
            projectObj.totalTasks = totalTasks;
            projectObj.completedTasks = completedTasks;
            projectObj.completionPercentage = completionPercentage;

            return projectObj;
        }));

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
            count: projects.length,
            pagination,
            total,
            data: projectsWithStats,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single project
 * @route   GET /api/projects/:id
 * @access  Private
 */
exports.getProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id)
            .populate({
                path: 'client',
                select: 'name contactName contactEmail'
            })
            .populate({
                path: 'assignedTo',
                select: 'name email avatar'
            })
            .populate({
                path: 'createdBy',
                select: 'name email avatar'
            })
            .populate({
                path: 'team',
                model: 'User', // 👈 Ensures it's pulling from User collection
                select: 'name email role department avatar', // ⬅️ Add any fields you want
            })
            .populate({
                path: 'documents',
                match: { deleted: false },
                select: 'name fileUrl category uploadedBy createdAt deleted',
                populate: {
                    path: 'uploadedBy',
                    select: 'name email',
                },
            })
            .populate({
                path: 'notes.author',
                select: 'name email role avatar', // or whichever fields you want
            });

        if (!project) {
            return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
        }
        if (project.deleted) {
            return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
        }
        // // Check access - only admin and assigned users can view
        // if (req.user.role !== 'admin' && project.assignedTo.toString() !== req.user.id.toString()) {
        //     return next(new ErrorResponse(`User not authorized to access this project`, 403));
        // }

        const projectObject = project.toObject(); // Convert Mongoose doc to plain object
        // 🧠 Calculate task completion stats
        const taskIds = project.tasks; // array of ObjectId
        const totalTasks = taskIds.length;

        let completedTasks = 0;
        if (totalTasks > 0) {
            completedTasks = await Task.countDocuments({
                _id: { $in: taskIds },
                status: 'completed',
            });
        }

        const completionPercentage = totalTasks > 0
            ? Math.round((completedTasks / totalTasks) * 100)
            : 0;

        projectObject.totalTasks = totalTasks;
        projectObject.completedTasks = completedTasks;
        projectObject.completionPercentage = completionPercentage;
        // Remove budget if user is not admin or finance
        if (!['admin', 'finance'].includes(req.user.role)) {
            delete projectObject.budget;
        }

        res.status(200).json({
            success: true,
            data: projectObject,
        });

    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create project
 * @route   POST /api/projects
 * @access  Private
 */
exports.createProject = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;
        console.log(req.body)
        // Check if client exists
        if (req.body.client) {
            const client = await Client.findById(req.body.client);
            if (!client) {
                return next(new ErrorResponse(`Client not found with id of ${req.body.client}`, 404));
            }
        }

        // Generate project number if not provided
        if (!req.body.projectNumber) {
            const date = new Date();
            const year = date.getFullYear().toString().substr(-2);
            const month = (date.getMonth() + 1).toString().padStart(2, '0');

            const lastProject = await Project.findOne({})
                .sort({ createdAt: -1 });

            let sequence = '001';
            if (lastProject && lastProject.projectNumber) {
                const lastNumber = lastProject.projectNumber.split('-')[2];
                if (lastNumber) {
                    sequence = (parseInt(lastNumber) + 1).toString().padStart(3, '0');
                }
            }

            req.body.projectNumber = `PRJ-${year}${month}-${sequence}`;
        }
  
        
        const project = await Project.create(req.body);

        // Log the project creation
        logger.info(`Project created: ${project.name} (${project._id}) by ${req.user.name} (${req.user._id})`);

        res.status(201).json({
            success: true,
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update project
 * @route   PUT /api/projects/:id
 * @access  Private
 */
exports.updateProject = async (req, res, next) => {
    try {
        let project = await Project.findById(req.params.id);

        if (!project) {
            return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
        }

        // Check access - only admin and assigned users can update
        if (req.user.role !== 'admin' && project.assignedTo.toString() !== req.user.id.toString()) {
            return next(new ErrorResponse(`User not authorized to update this project`, 403));
        }

        // Check if client exists
        if (req.body.client) {
            const client = await Client.findById(req.body.client);
            if (!client) {
                return next(new ErrorResponse(`Client not found with id of ${req.body.client}`, 404));
            }
        }
        if (req.body.notes && Array.isArray(req.body.notes)) {
            req.body.notes = req.body.notes.map(note => ({
                ...note,
                author: req.user._id, // set author field
                createdAt: note.createdAt || new Date(), // fallback if frontend didn't send createdAt
            }));
        }

        project = await Project.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        // Log the project update
        logger.info(`Project updated: ${project.name} (${project._id}) by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete project
 * @route   DELETE /api/projects/:id
 * @access  Private/Admin
 */
exports.deleteProject = async (req, res, next) => {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
        }

        // Check if project has associated tasks
        const taskCount = await Task.countDocuments({ project: req.params.id });
        if (taskCount > 0) {
            return next(new ErrorResponse(`Cannot delete project with ${taskCount} associated tasks`, 400));
        }

        // Log the project deletion
        logger.info(`Project deleted: ${project.name} (${project._id}) by ${req.user.name} (${req.user._id})`);

        await project.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Project deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get project tasks
 * @route   GET /api/projects/:id/tasks
 * @access  Private
 */
exports.getProjectTasks = async (req, res, next) => {
    try {
        console.log(req.params.id,"4444444444444444444444444")
        const project = await Project.findById(req.params.id);

        if (!project) {
            return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
        }

        // Check access - only admin and assigned users can view
        // if (req.user.role !== 'admin' && project.assignedTo.toString() !== req.user.id.toString()) {
        //     return next(new ErrorResponse(`User not authorized to access this project`, 403));
        // }

        const isAdmin = req.user.role === 'admin';
        // console.log(isTeamMember, "isTeamMember")
        const isTeamMember = project.team && 
            project.team.some(teamMember => 
                teamMember.toString() === req.user.id.toString()
            );

        if (!isAdmin && !isTeamMember) {
            return next(new ErrorResponse(`User not authorized to access this project`, 403));
        }

        // Filtering
        const filter = { project: req.params.id, deleted: false };

        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.assignedTo) {
            filter.assignedTo = req.query.assignedTo;
        }
        if (req.query.priority) {
            filter.priority = req.query.priority;
        }

        const tasks = await Task.find(filter)
            .sort({ dueDate: 1, priority: -1 })
            .populate({
                path: 'assignedTo',
                select: 'name email avatar'
            })
            .populate({
                path: 'createdBy',
                select: 'name email'
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
 * @desc    Update project status
 * @route   PUT /api/projects/:id/status
 * @access  Private
 */
exports.updateProjectStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body; // Assuming status is passed in the request body

        // Check if the status is valid (you can add additional checks here)
        const validStatuses = ['Not Started', 'In Progress', 'Completed'];
        if (!validStatuses.includes(status)) {
            return next(new ErrorResponse('Invalid status value', 400));
        }

        // Find project by ID
        let project = await Project.findById(id);

        if (!project) {
            return next(new ErrorResponse(`Project not found with id of ${id}`, 404));
        }

        // Check if the user is authorized to update the project (admin or assigned user)
        if (req.user.role !== 'admin' && project.assignedTo.toString() !== req.user.id.toString()) {
            return next(new ErrorResponse('User not authorized to update this project', 403));
        }

        // Update the project status
        project.status = status;

        // Save the updated project
        project = await project.save();

        // Log the project status update
        logger.info(`Project status updated: ${project.name} (${project._id}) to ${status} by ${req.user.name} (${req.user._id})`);

        // Send success response
        res.status(200).json({
            success: true,
            data: project,
        });
    } catch (error) {
        next(error);
    }
};
