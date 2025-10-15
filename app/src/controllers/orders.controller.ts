import { Request, Response, NextFunction } from 'express';
import Order from '../models/Order.model'; // Changed from Orden
import OrderItem from '../models/Order_item.model'; // Changed from OrdenItem
import WarehouseProduct from '../models/Warehouse_products.model'; // Changed from BodegaProducto
import Client from '../models/Client.model'; // Changed from Cliente
import Product from '../models/Product.model'; // Changed from Producto
import Warehouse from '../models/Warehouse.model'; // Changed from Bodega
import Joi from 'joi';
import { Op } from 'sequelize';

// Interfaces for input data
interface CreateOrderInput {
  clientDocumentId: string; // Changed from clienteCedula
  warehouseId: number; // Changed from bodegaId
  items: Array<{
    productCode: string; // Changed from productoCodigo
    quantity: number; // Changed from cantidad
  }>;
}

interface UpdateStatusInput {
  status: string; // Changed from estado
}

// Validation schemas with Joi
const createOrderSchema = Joi.object({
  clientDocumentId: Joi.string().required().label('Client Document ID'),
  warehouseId: Joi.number().integer().required().label('Warehouse ID'),
  items: Joi.array().items(
    Joi.object({
      productCode: Joi.string().required().label('Product Code'),
      quantity: Joi.number().integer().min(1).required().label('Quantity'),
    })
  ).min(1).required().label('Items'),
});

const updateStatusSchema = Joi.object({
  status: Joi.string().valid('pending', 'completed', 'cancelled').required().label('Status'),
});

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateOrderInput'
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error or insufficient stock
 *       500:
 *         description: Internal server error
 */
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { error } = createOrderSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { clientDocumentId, warehouseId, items } = req.body; // Changed from clienteCedula, bodegaId
    const client = await Client.findOne({ where: { document_id: clientDocumentId } }); // Changed from cedula
    if (!client) return res.status(400).json({ error: 'Client does not exist' });

    const warehouse = await Warehouse.findByPk(warehouseId);
    if (!warehouse || !warehouse.is_active) return res.status(400).json({ error: 'Invalid warehouse' });

    const order = await Order.create({
      client_id: client.id,
      warehouse_id,
      status: 'pending', // Changed from estado
      createdById: req.user.id,
    });

    // Items and stock
    for (const item of items) {
      const product = await Product.findOne({ where: { code: item.productCode } }); // Changed from codigo, productoCodigo
      if (!product) return res.status(400).json({ error: 'Product does not exist' });

      const stockRow = await WarehouseProduct.findOne({
        where: { warehouseId, productId: product.id }
      });
      if (!stockRow || stockRow.stock < item.quantity) {
        await order.destroy();
        return res.status(400).json({ error: 'Insufficient stock' });
      }
      stockRow.stock -= item.quantity;
      await stockRow.save();

      await OrderItem.create({
        order_id: order.id,
        productId: product.id,
        quantity: item.quantity,
      });
    }

    await order.reload({ include: [OrderItem, Product] });
    res.status(201).json({ data: order });
  } catch (error: any) {
    console.error('Error in createOrder:', error);
    res.status(500).json({ error: 'Internal server error while creating order' });
  }
};

/**
 * @swagger
 * /orders/{id}/status:
 *   patch:
 *     summary: Update order status
 *     tags: [Orders]
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
 *             $ref: '#/components/schemas/UpdateStatusInput'
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       404:
 *         description: Order not found
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const { error } = updateStatusSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { id } = req.params;
    const { status } = req.body; // Changed from estado
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    order.status = status; // Changed from estado
    await order.save();
    res.json({ data: order });
  } catch (error: any) {
    console.error('Error in updateStatus:', error);
    res.status(500).json({ error: 'Internal server error while updating order status' });
  }
};

/**
 * @swagger
 * /orders/history:
 *   get:
 *     summary: Get history of all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: History of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */
export const history = async (req: Request, res: Response) => {
  try {
    const orders = await Order.findAll({
      include: [Client, Warehouse, OrderItem, Product]
    });
    res.json({ data: orders });
  } catch (error: any) {
    console.error('Error in history:', error);
    res.status(500).json({ error: 'Internal server error while retrieving order history' });
  }
};

/**
 * @