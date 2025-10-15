// app/src/models/index.ts

import User from './User.model';
import Client from './Client.model';
import Address from './Address.model';
import Warehouse from './Warehouse.model';
import Product from './Product.model';
import WarehouseProduct from './Warehouse_products.model';
import Order from './Order.model';
import OrderItem from './Order_item.model';

// Relaciones
Client.hasMany(Address, { foreignKey: 'client_id' });
Address.belongsTo(Client, { foreignKey: 'client_id' });

Warehouse.belongsToMany(Product, { through: WarehouseProduct, foreignKey: 'warehouse_id' });
Product.belongsToMany(Warehouse, { through: WarehouseProduct, foreignKey: 'product_id' });

Order.belongsTo(Client, { foreignKey: 'client_id' });
Client.hasMany(Order, { foreignKey: 'client_id' });

Order.belongsTo(Warehouse, { foreignKey: 'warehouse_id' });
Warehouse.hasMany(Order, { foreignKey: 'warehouse_id' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

OrderItem.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(OrderItem, { foreignKey: 'product_id' });

export {
  User,
  Client,
  Address,
  Warehouse,
  Product,
  WarehouseProduct,
  Order,
  OrderItem,
};