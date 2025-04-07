const Invoice = require('../models/Invoice');
const Task = require('../models/Task');
const Project = require('../models/Project');
const Client = require('../models/Client');
const { ErrorResponse } = require('../middleware/errorHandler');
const { logger } = require('../utils/logger');

/**
 * @desc    Get all invoices
 * @route   GET /api/finance/invoices
 * @access  Private/Finance,Admin
 */
exports.getInvoices = async (req, res, next) => {
    try {
        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;

        // Filtering
        const filter = {};

        // Filter by status
        if (req.query.status) {
            filter.status = req.query.status;
        }

        // Filter by client
        if (req.query.client) {
            filter.client = req.query.client;
        }

        // Filter by project
        if (req.query.project) {
            filter.project = req.query.project;
        }

        // Filter by date range
        if (req.query.startDate && req.query.endDate) {
            filter.issueDate = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        } else if (req.query.startDate) {
            filter.issueDate = { $gte: new Date(req.query.startDate) };
        } else if (req.query.endDate) {
            filter.issueDate = { $lte: new Date(req.query.endDate) };
        }

        // Get total count
        const total = await Invoice.countDocuments(filter);

        // Query with filters
        const invoices = await Invoice.find(filter)
            .populate({
                path: 'client',
                select: 'name contactEmail contactPhone'
            })
            .populate({
                path: 'project',
                select: 'name'
            })
            .populate({
                path: 'createdBy',
                select: 'name email'
            })
            .skip(startIndex)
            .limit(limit)
            .sort({ issueDate: -1 });

        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: invoices.length,
            pagination,
            total,
            data: invoices
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get single invoice
 * @route   GET /api/finance/invoices/:id
 * @access  Private/Finance,Admin
 */
exports.getInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id)
            .populate({
                path: 'client',
                select: 'name contactEmail contactPhone address'
            })
            .populate({
                path: 'project',
                select: 'name description'
            })
            .populate({
                path: 'createdBy',
                select: 'name email'
            })
            .populate({
                path: 'items.task',
                select: 'title description'
            });

        if (!invoice) {
            return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
        }

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Create new invoice
 * @route   POST /api/finance/invoices
 * @access  Private/Finance,Admin
 */
exports.createInvoice = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        // Validate client exists
        const client = await Client.findById(req.body.client);
        if (!client) {
            return next(new ErrorResponse(`Client not found with id of ${req.body.client}`, 404));
        }

        // Validate project if provided
        if (req.body.project) {
            const project = await Project.findById(req.body.project);
            if (!project) {
                return next(new ErrorResponse(`Project not found with id of ${req.body.project}`, 404));
            }
            // Check if project belongs to the client
            if (project.client.toString() !== req.body.client) {
                return next(new ErrorResponse(`Project does not belong to the selected client`, 400));
            }
        }

        // Generate invoice number if not provided
        if (!req.body.invoiceNumber) {
            const prefix = 'INV';
            const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
            const count = await Invoice.countDocuments() + 1;
            req.body.invoiceNumber = `${prefix}-${date}-${count.toString().padStart(4, '0')}`;
        }

        // Create invoice
        const invoice = await Invoice.create(req.body);

        // Update task status to invoiced if tasks are included
        if (req.body.items && req.body.items.length > 0) {
            for (const item of req.body.items) {
                if (item.task) {
                    await Task.findByIdAndUpdate(
                        item.task,
                        {
                            'invoiceDetails.invoiced': true,
                            'invoiceDetails.invoiceDate': invoice.issueDate,
                            'invoiceDetails.invoiceNumber': invoice.invoiceNumber,
                            status: 'invoiced'
                        }
                    );
                }
            }
        }

        // Log the invoice creation
        logger.info(`Invoice created: ${invoice.invoiceNumber} (${invoice._id}) by ${req.user.name} (${req.user._id})`);

        res.status(201).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update invoice
 * @route   PUT /api/finance/invoices/:id
 * @access  Private/Finance,Admin
 */
exports.updateInvoice = async (req, res, next) => {
    try {
        let invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
        }

        // Don't allow updating if invoice is already paid
        if (invoice.status === 'paid' && !req.user.role.includes('admin')) {
            return next(new ErrorResponse(`Cannot update a paid invoice`, 400));
        }

        // Update the invoice
        invoice = await Invoice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        // Log the invoice update
        logger.info(`Invoice updated: ${invoice.invoiceNumber} (${invoice._id}) by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete invoice
 * @route   DELETE /api/finance/invoices/:id
 * @access  Private/Admin
 */
exports.deleteInvoice = async (req, res, next) => {
    try {
        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
        }

        // Don't allow deleting if invoice is already sent or paid
        if (['sent', 'paid'].includes(invoice.status)) {
            return next(new ErrorResponse(`Cannot delete an invoice that has been sent or paid`, 400));
        }

        // Update tasks to remove invoice reference
        for (const item of invoice.items) {
            if (item.task) {
                await Task.findByIdAndUpdate(
                    item.task,
                    {
                        'invoiceDetails.invoiced': false,
                        'invoiceDetails.invoiceDate': null,
                        'invoiceDetails.invoiceNumber': null,
                        status: 'completed'
                    }
                );
            }
        }

        // Delete the invoice
        await invoice.deleteOne();

        // Log the invoice deletion
        logger.info(`Invoice deleted: ${invoice.invoiceNumber} (${invoice._id}) by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Update invoice status
 * @route   PUT /api/finance/invoices/:id/status
 * @access  Private/Finance,Admin
 */
exports.updateInvoiceStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        // Validate the status
        if (!['draft', 'sent', 'paid', 'cancelled', 'overdue'].includes(status)) {
            return next(new ErrorResponse(`Invalid status: ${status}`, 400));
        }

        const invoice = await Invoice.findById(req.params.id);

        if (!invoice) {
            return next(new ErrorResponse(`Invoice not found with id of ${req.params.id}`, 404));
        }

        // If setting to paid, update paidDate
        if (status === 'paid' && invoice.status !== 'paid') {
            invoice.paidDate = new Date();
            invoice.paidAmount = invoice.total;
        }

        // If setting to sent, update sentDate
        if (status === 'sent' && invoice.status !== 'sent') {
            invoice.sentDate = new Date();
        }

        invoice.status = status;
        await invoice.save();

        // Log the status update
        logger.info(`Invoice status updated: ${invoice.invoiceNumber} (${invoice._id}) to ${status} by ${req.user.name} (${req.user._id})`);

        res.status(200).json({
            success: true,
            data: invoice
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get completed tasks available for invoicing
 * @route   GET /api/finance/tasks/completed
 * @access  Private/Finance,Admin
 */
exports.getCompletedTasks = async (req, res, next) => {
    try {
        // Filter only completed tasks that haven't been invoiced
        const filter = {
            status: 'completed',
            'invoiceDetails.invoiced': { $ne: true }
        };

        // Filter by project if provided
        if (req.query.project) {
            filter.project = req.query.project;
        }

        // Filter by client via project
        if (req.query.client) {
            const projects = await Project.find({ client: req.query.client }).select('_id');
            filter.project = { $in: projects.map(p => p._id) };
        }

        const tasks = await Task.find(filter)
            .populate({
                path: 'project',
                select: 'name client',
                populate: {
                    path: 'client',
                    select: 'name'
                }
            })
            .populate({
                path: 'assignedTo',
                select: 'name email'
            });

        res.status(200).json({
            success: true,
            count: tasks.length,
            data: tasks
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get invoice statistics
 * @route   GET /api/finance/stats
 * @access  Private/Finance,Admin
 */
exports.getInvoiceStats = async (req, res, next) => {
    try {
        // Get total counts by status
        const statusCounts = await Invoice.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    total: { $sum: '$total' }
                }
            }
        ]);

        // Get monthly totals for the current year
        const currentYear = new Date().getFullYear();

        const monthlyTotals = await Invoice.aggregate([
            {
                $match: {
                    issueDate: {
                        $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`),
                        $lte: new Date(`${currentYear}-12-31T23:59:59.999Z`)
                    }
                }
            },
            {
                $group: {
                    _id: { $month: '$issueDate' },
                    total: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);

        // Get overdue invoices
        const overdue = await Invoice.countDocuments({
            status: 'overdue'
        });

        const overdueAmount = await Invoice.aggregate([
            {
                $match: { status: 'overdue' }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' }
                }
            }
        ]);

        // Get top clients by invoice amount
        const topClients = await Invoice.aggregate([
            {
                $group: {
                    _id: '$client',
                    total: { $sum: '$total' },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { total: -1 }
            },
            {
                $limit: 5
            },
            {
                $lookup: {
                    from: 'clients',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'clientDetails'
                }
            },
            {
                $project: {
                    _id: 1,
                    total: 1,
                    count: 1,
                    clientName: { $arrayElemAt: ['$clientDetails.name', 0] }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            data: {
                statusCounts,
                monthlyTotals,
                overdue: {
                    count: overdue,
                    amount: overdueAmount.length > 0 ? overdueAmount[0].total : 0
                },
                topClients
            }
        });
    } catch (error) {
        next(error);
    }
}; 