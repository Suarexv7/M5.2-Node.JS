import User from '../models/User.model';
import Client from '../models/Client.model'; // Changed from Cliente
import Warehouse from '../models/Warehouse.model'; // Changed from Bodega
import Product from '../models/Product.model'; // Changed from Producto
import WarehouseProduct from '../models/Warehouse_products.model'; // Changed from BodegaProducto
import bcrypt from 'bcryptjs';

async function seed() {
  try {
    // Users with encrypted passwords
    await User.bulkCreate([
      {
        email: 'admin@fhl.com',
        password: await bcrypt.hash('admin', 10), // Encrypt password
        role: 'admin',
      },
      {
        email: 'analyst@fhl.com', // Changed to English
        password: await bcrypt.hash('analyst', 10), // Encrypt password
        role: 'analyst', // Changed to English
      },
    ]);

    // Clients
    await Client.bulkCreate([
      { document_id: '123456789', name: 'Juan Perez', email: 'juan@email.com' }, // Changed from cedula, nombre, correo
      { document_id: '987654321', name: 'Maria Lopez', email: 'maria@email.com' }, // Changed from cedula, nombre, correo
    ]);

    // Warehouses
    const warehouse1 = await Warehouse.create({ name: 'North Warehouse', active: true }); // Changed from nombre, activa
    const warehouse2 = await Warehouse.create({ name: 'South Warehouse', is_active: true }); // Changed from nombre, activa

    // Products
    const prod1 = await Product.create({ code: 'P001', name: 'Laptop', price: 1000 }); // Changed from codigo, nombre
    const prod2 = await Product.create({ code: 'P002', name: 'Mouse', price: 20 }); // Changed from codigo, nombre

    // Stock
    await WarehouseProduct.bulkCreate([
      { warehouse_id: warehouse1.id, productId: prod1.id, stock: 10 },
      { warehouse_id: warehouse2.id, productId: prod1.id, stock: 5 },
      { warehouse_id: warehouse1.id, productId: prod2.id, stock: 50 },
    ]);

    console.log('Seeded successfully!');
  } catch (error: any) {
    console.error('Seeding failed:', error.message || error);
    throw error; // Re-throw to be caught by the outer .catch
  }
}

seed().catch((error) => {
  console.error('Error during seeding:', error);
  process.exit(1); // Exit with error code if seeding fails
});