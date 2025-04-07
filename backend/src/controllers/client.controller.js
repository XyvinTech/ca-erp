const Client = require('../models/Client');
const Project = require('../models/Project');
const { ErrorResponse } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @desc    Get all clients
 * @route   GET /api/clients
 * @access  Private
 */
exports.getClients = async (req, res, next) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Client.countDocuments();

        // Filtering
        const filter = {};
        if (req.query.status) {
            filter.status = req.query.status;
        }
        if (req.query.industry) {
            filter.industry = req.query.industry;
        }

        // Search
        if (req.query.search) {
            filter.$or = [
                { name: { $regex: req.query.search, $options: 'i' } },
                { contactName: { $regex: req.query.search, $options: 'i' } },
                { contactEmail: { $regex: req.query.search, $options: 'i' } }
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
        const clients = await Client.find(filter)
            .skip(startIndex)
            .limit(limit)
            .sort(sort)
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
            count: clients.length,
            pagination,
            total,
            data: clients,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single client
 * @route   GET /api/clients/:id
 * @access  Private
 */
exports.getClient = async (req, res, next) => {
    try {
        const client = await Client.findById(req.params.id).populate({
            path: 'createdBy',
            select: 'name email'
        });

        if (!client) {
            return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: client,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create client
 * @route   POST /api/clients
 * @access  Private
 */
exports.createClient = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        // Check if client with same name already exists
        const existingClient = await Client.findOne({ name: req.body.name });
        if (existingClient) {
            return next(new ErrorResponse(`Client with name ${req.body.name} already exists`, 400));
        }

        const client = await Client.create(req.body);

        // Log the client creation
        logger.info(`Client created: ${client.name} (${client._id}) by ${req.user.name} (${req.user._id})`);

        res.status(201).json({
            success: true,
            data: client,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update client
 * @route   PUT /api/clients/:id
 * @access  Private
 */
exports.updateClient = async (req, res, next) => {
    try {
        let client = await Client.findById(req.params.id);

        if (!client) {
            return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
        }

        // If name is being updated, check if it already exists
        if (req.body.name && req.body.name !== client.name) {
            const existingClient = await Client.findOne({ name: req.body.name });
            if (existingClient) {
                return next(new ErrorResponse(`Client with name ${req.body.name} already exists`, 400));
            }
        }

        client = await Client.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });

        // Log the client update
        logger.info(`Client updated: ${client.name} (${client._id}) by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: client,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete client
 * @route   DELETE /api/clients/:id
 * @access  Private/Admin
 */
exports.deleteClient = async (req, res, next) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
        }

        // Check if client has associated projects
        const projectCount = await Project.countDocuments({ client: req.params.id });
        if (projectCount > 0) {
            return next(new ErrorResponse(`Cannot delete client with ${projectCount} associated projects`, 400));
        }

        // Log the client deletion
        logger.info(`Client deleted: ${client.name} (${client._id}) by ${req.user.name} (${req.user._id})`);

        await client.deleteOne();

        res.status(200).json({
            success: true,
            data: {},
            message: 'Client deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Upload client logo
 * @route   PUT /api/clients/:id/logo
 * @access  Private
 */
exports.uploadLogo = async (req, res, next) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
        }

        if (!req.file) {
            return next(new ErrorResponse('Please upload a file', 400));
        }

        // Update logo path in database
        const logoPath = `/uploads/logos/${req.file.filename}`;

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            { logo: logoPath },
            {
                new: true,
                runValidators: true,
            }
        );

        // Log the logo update
        logger.info(`Logo updated for client: ${client.name} (${client._id}) by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: updatedClient,
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get client projects
 * @route   GET /api/clients/:id/projects
 * @access  Private
 */
exports.getClientProjects = async (req, res, next) => {
    try {
        const client = await Client.findById(req.params.id);

        if (!client) {
            return next(new ErrorResponse(`Client not found with id of ${req.params.id}`, 404));
        }

        const projects = await Project.find({ client: req.params.id })
            .populate({
                path: 'createdBy',
                select: 'name email'
            })
            .populate({
                path: 'assignedTo',
                select: 'name email'
            });

        res.status(200).json({
            success: true,
            count: projects.length,
            data: projects,
        });
    } catch (error) {
        next(error);
    }
}; 