import { Request, Response, NextFunction } from 'express';
import Client from '../models/Client.model'; // Changed from Cliente
import Joi from 'joi';

// Interfaces for input data
interface SearchInput {
  document_id: string; // Changed from cedula
}

interface CreateUpdateInput {
  document_id: string; // Changed from cedula
  name: string; // Changed from nombre
  email?: string; // Optional field
}

// Validation schemas with Joi
const searchSchema = Joi.object({
  document_id: Joi.string().required().label('Document ID'),
});

const createUpdateSchema = Joi.object({
  document_id: Joi.string().required().label('Document ID'),
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().optional().label('Email'),
});

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: List all clients
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: page
 *         in: query
 *         schema:
 *           type: integer
 *           default: 1
 *       - name: limit
 *         in: query
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *                 total:
 *                   type: integer
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
export const listClients = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: clients } = await Client.findAndCountAll({
      limit,
      offset,
    });

    res.json({
      data: clients,
      total: count,
      page,
      limit,
    });
  } catch (error: any) {
    console.error('Error in listClients:', error);
    res.status(500).json({ error: 'Internal server error while listing clients' });
  }
};

/**
 * @swagger
 * /clients/search:
 *   post:
 *     summary: Search client by document ID
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SearchInput'
 *     responses:
 *       200:
 *         description: Client found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export const searchClient = async (req: Request, res: Response) => {
  try {
    const { error } = searchSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { document_id } = req.body; // Changed from cedula
    const client = await Client.findOne({ where: { document_id } });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    res.json({ data: client });
  } catch (error: any) {
    console.error('Error in searchClient:', error);
    res.status(500).json({ error: 'Internal server error while searching client' });
  }
};

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUpdateInput'
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export const createClient = async (req: Request, res: Response) => {
  try {
    const { error } = createUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { document_id, name, email } = req.body; // Changed from cedula, nombre
    const existingClient = await Client.findOne({ where: { document_id } });
    if (existingClient) {
      return res.status(400).json({ error: 'Document ID already registered' });
    }

    const client = await Client.create({ document_id, name, email });
    res.status(201).json({ data: client });
  } catch (error: any) {
    console.error('Error in createClient:', error);
    res.status(500).json({ error: 'Internal server error while creating client' });
  }
};

/**
 * @swagger
 * /clients/{document_id}:
 *   put:
 *     summary: Update client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: document_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUpdateInput'
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export const updateClient = async (req: Request, res: Response) => {
  try {
    const { error } = createUpdateSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { document_id } = req.params; // Changed from cedula
    const { name, email } = req.body; // Changed from nombre
    const client = await Client.findOne({ where: { document_id } });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.update({ name, email });
    res.json({ data: client });
  } catch (error: any) {
    console.error('Error in updateClient:', error);
    res.status(500).json({ error: 'Internal server error while updating client' });
  }
};

/**
 * @swagger
 * /clients/{document_id}:
 *   delete:
 *     summary: Delete client
 *     tags: [Clients]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: document_id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Client deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Client not found
 *       500:
 *         description: Internal server error
 */
export const deleteClient = async (req: Request, res: Response) => {
  try {
    const { document_id } = req.params; // Changed from cedula
    const client = await Client.findOne({ where: { document_id } });
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }

    await client.destroy();
    res.json({ message: 'Client deleted successfully' });
  } catch (error: any) {
    console.error('Error in deleteClient:', error);
    res.status(500).json({ error: 'Internal server error while deleting client' });
  }
};