import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product.model'; // Changed from Producto
import Joi from 'joi';

/**
 * @swagger
 * /products/{code}:
 *   get:
 *     summary: Get product by code
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: code
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Product'
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
export const getByCode = async (req: Request, res: Response) => {
  try {
    const { code } = req.params; // Changed from codigo
    const product = await Product.findOne({ where: { code } });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ data: product });
  } catch (error: any) {
    console.error('Error in getByCode:', error);
    res.status(500).json({ error: 'Internal server error while retrieving product' });
  }
};

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     summary: Soft delete product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product soft deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
export const softDeleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id); // Added to check existence
    if (!product) return res.status(404).json({ error: 'Product not found' });

    await Product.destroy({ where: { id } }); // Assuming soft delete via a flag (e.g., deletedAt)
    res.json({ message: 'Product soft deleted successfully' });
  } catch (error: any) {
    console.error('Error in softDeleteProduct:', error);
    res.status(500).json({ error: 'Internal server error while soft deleting product' });
  }
};
