import { Request, Response, NextFunction } from 'express';
import Warehouse from '../models/Warehouse.model'; // Changed from Bodega
import WarehouseProduct from '../models/Warehouse_products.model'; // Changed from BodegaProducto
import { Op } from 'sequelize';
import Joi from 'joi';

// Interface for input data
interface ToggleInput {
  active: boolean; // Changed from activa
}

// Validation schema with Joi
const toggleSchema = Joi.object({
  active: Joi.boolean().required().label('Active status'),
});

/**
 * @swagger
 * /warehouses:
 *   get:
 *     summary: List active warehouses with stock
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of active warehouses with stock
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Warehouse'
 *                 total:
 *                   type: integer
 *       500:
 *         description: Internal server error
 */
export const listActiveWarehouses = async (req: Request, res: Response) => {
  try {
    const warehouses = await Warehouse.findAll({
      where: { is_active: true }, // Changed from activa
      include: [{
        model: WarehouseProduct,
        attributes: [['stock', 'stock']]
      }]
    });

    res.json({
      data: warehouses,
      total: warehouses.length, // Simplified total count
    });
  } catch (error: any) {
    console.error('Error in listActiveWarehouses:', error);
    res.status(500).json({ error: 'Internal server error while listing active warehouses' });
  }
};

/**
 * @swagger
 * /warehouses/{id}:
 *   patch:
 *     summary: Toggle warehouse active status
 *     tags: [Warehouses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ToggleInput'
 *     responses:
 *       200:
 *         description: Warehouse status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Warehouse'
 *       404:
 *         description: Warehouse not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export const toggleWarehouse = async (req: Request, res: Response) => {
  try {
    const { error } = toggleSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { id } = req.params;
    const { active } = req.body; // Changed from activa
    const warehouse = await Warehouse.findByPk(id);
    if (!warehouse) {
      return res.status(404).json({ error: 'Warehouse not found' });
    }

    warehouse.is_active = active; // Changed from activa
    await warehouse.save();
    res.json({ data: warehouse });
  } catch (error: any) {
    console.error('Error in toggleWarehouse:', error);
    res.status(500).json({ error: 'Internal server error while toggling warehouse status' });
  }
};
