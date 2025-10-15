import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import Client from '../models/Client.model';
import WarehouseProduct from '../models/Warehouse_products.model';

export const validateCedulaUnique = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { client_document_id } = req.body;
    if (!client_document_id) {
      return res.status(400).json({ error: 'Cédula del cliente es requerida' });
    }

    const client = await Client.findOne({ where: { document_id: client_document_id } });
    if (client) {
      return res.status(400).json({ error: `La cédula ${client_document_id} ya está registrada` });
    }
    next();
  } catch (error) {
    console.error('Error en validateCedulaUnique:', error);
    return res.status(500).json({ error: 'Error interno al validar la cédula' });
  }
};

export const validateStock = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { warehouse_id, items } = req.body;
    if (!warehouse_id || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'ID de la bodega y al menos un item son requeridos' });
    }

    // Obtener todos los productos de la bodega en una sola consulta
    const productIds = items.map((item: any) => item.product_id);
    const stockRecords = await WarehouseProduct.findAll({
      where: { warehouse_id, product_id: productIds },
    });

    // Convertir a un mapa para acceso rápido
    const stockMap = new Map(stockRecords.map((record) => [record.product_id, record.stock]));

    for (const item of items) {
      const { product_id, quantity } = item;
      if (!product_id || !quantity || !Number.isInteger(quantity) || quantity < 1) {
        return res.status(400).json({ error: `ID de producto y cantidad válida son requeridos para cada item` });
      }

      const availableStock = stockMap.get(product_id) || 0;
      if (availableStock < quantity) {
        return res.status(400).json({
          error: `Stock insuficiente para el producto ${product_id}: solicitado ${quantity}, disponible ${availableStock}`,
        });
      }
    }
    next();
  } catch (error) {
    console.error('Error en validateStock:', error);
    return res.status(500).json({ error: 'Error interno al validar el stock' });
  }
};

export const validateCreateOrden = (req: Request, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    client_document_id: Joi.string()
      .pattern(/^[0-9]{6,12}$/) // Ejemplo: validar cédula de 6 a 12 dígitos
      .required()
      .label('Cédula del cliente'),
    warehouse_id: Joi.number().integer().positive().required().label('ID de la bodega'),
    items: Joi.array()
      .items(
        Joi.object({
          product_id: Joi.number().integer().positive().required().label('ID del producto'),
          quantity: Joi.number().integer().min(1).required().label('Cantidad'),
        })
      )
      .min(1)
      .required()
      .label('Items de la orden'),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errorMessages = error.details.map((detail) => detail.message).join(', ');
    return res.status(400).json({ error: errorMessages });
  }
  next();
};