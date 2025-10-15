import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import yaml from 'js-yaml'; // npm i js-yaml @types/js-yaml -D si usas yaml
import fs from 'fs';
import authRoutes from './auth.routes';
import clientsRoutes from './clients.routes';
import warehousesRoutes from './warehouses.routes';
import productsRoutes from './products.routes';
import ordersRoutes from './orders.routes';

const router = express.Router();

const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'FHL API', version: '1.0.0' },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/controllers/*.ts'], // For jsdoc comments
};

const specs = swaggerJsdoc(swaggerOptions);
router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(specs));

// Mount routes with updated names
router.use('/auth', authRoutes);
router.use('/clients', clientsRoutes);
router.use('/warehouses', warehousesRoutes); // Changed from /bodegas
router.use('/products', productsRoutes); // Changed from /productos
router.use('/orders', ordersRoutes); // Changed from /ordenes

export default router;