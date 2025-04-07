const express = require('express');
const router = express.Router();
const {
    getInvoices,
    getInvoice,
    createInvoice,
    updateInvoice,
    deleteInvoice,
    updateInvoiceStatus,
    getCompletedTasks,
    getInvoiceStats
} = require('../controllers/finance.controller');

const { protect, authorize } = require('../middleware/auth');
const { validate, invoiceValidation } = require('../middleware/validator');

/**
 * @swagger
 * /api/finance/invoices:
 *   get:
 *     summary: Get all invoices
 *     description: Retrieves a list of invoices with optional filtering and pagination
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [draft, sent, paid, overdue, cancelled]
 *         description: Filter by invoice status
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *         description: Filter by client ID
 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by issue date start (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by issue date end (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: List of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                 total:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Invoice'
 */
router.get(
    '/invoices',
    protect,
    authorize('admin', 'finance'),
    getInvoices
);

/**
 * @swagger
 * /api/finance/invoices/{id}:
 *   get:
 *     summary: Get a single invoice
 *     description: Retrieves a single invoice by ID
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 */
router.get(
    '/invoices/:id',
    protect,
    authorize('admin', 'finance'),
    getInvoice
);

/**
 * @swagger
 * /api/finance/invoices:
 *   post:
 *     summary: Create a new invoice
 *     description: Creates a new invoice
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceInput'
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Bad request
 */
router.post(
    '/invoices',
    protect,
    authorize('admin', 'finance'),
    validate(invoiceValidation.create),
    createInvoice
);

/**
 * @swagger
 * /api/finance/invoices/{id}:
 *   put:
 *     summary: Update an invoice
 *     description: Updates an existing invoice
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InvoiceInput'
 *     responses:
 *       200:
 *         description: Invoice updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 *       400:
 *         description: Bad request or invoice cannot be updated
 */
router.put(
    '/invoices/:id',
    protect,
    authorize('admin', 'finance'),
    validate(invoiceValidation.update),
    updateInvoice
);

/**
 * @swagger
 * /api/finance/invoices/{id}:
 *   delete:
 *     summary: Delete an invoice
 *     description: Deletes an invoice (only drafts can be deleted)
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *       404:
 *         description: Invoice not found
 *       400:
 *         description: Invoice cannot be deleted
 */
router.delete(
    '/invoices/:id',
    protect,
    authorize('admin'),
    deleteInvoice
);

/**
 * @swagger
 * /api/finance/invoices/{id}/status:
 *   put:
 *     summary: Update invoice status
 *     description: Updates the status of an invoice
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [draft, sent, paid, overdue, cancelled]
 *     responses:
 *       200:
 *         description: Invoice status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Invoice'
 *       404:
 *         description: Invoice not found
 *       400:
 *         description: Invalid status
 */
router.put(
    '/invoices/:id/status',
    protect,
    authorize('admin', 'finance'),
    validate(invoiceValidation.updateStatus),
    updateInvoiceStatus
);

/**
 * @swagger
 * /api/finance/tasks/completed:
 *   get:
 *     summary: Get completed tasks for invoicing
 *     description: Retrieves a list of completed tasks that are available for invoicing
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: project
 *         schema:
 *           type: string
 *         description: Filter by project ID
 *       - in: query
 *         name: client
 *         schema:
 *           type: string
 *         description: Filter by client ID
 *     responses:
 *       200:
 *         description: List of completed tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Task'
 */
router.get(
    '/tasks/completed',
    protect,
    authorize('admin', 'finance'),
    getCompletedTasks
);

/**
 * @swagger
 * /api/finance/stats:
 *   get:
 *     summary: Get invoice statistics
 *     description: Retrieves statistics about invoices
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Invoice statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     statusCounts:
 *                       type: array
 *                     monthlyTotals:
 *                       type: array
 *                     overdue:
 *                       type: object
 *                     topClients:
 *                       type: array
 */
router.get(
    '/stats',
    protect,
    authorize('admin', 'finance'),
    getInvoiceStats
);

module.exports = router; 