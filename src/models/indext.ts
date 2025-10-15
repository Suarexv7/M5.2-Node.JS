import sequelize from "../config/db";
import User from "./user.model";
import Client from "./client.model";
import Warehouse from "./warehouse.model";
import Product from "./product.model";
import Order from "./order.model";
import OrderItem from "./orderitem.model";

// Asociaciones
Warehouse.hasMany(Product, { foreignKey: 'warehouseId' });
Product.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Client.hasMany(Order, { foreignKey: 'clientId' });
Order.belongsTo(Client, { foreignKey: 'clientId' });

Warehouse.hasMany(Order, { foreignKey: 'warehouseId' });
Order.belongsTo(Warehouse, { foreignKey: 'warehouseId' });

Order.hasMany(OrderItem, { foreignKey: 'orderId' });
OrderItem.belongsTo(Order, { foreignKey: 'orderId' });

Product.hasMany(OrderItem, { foreignKey: 'productId' });
OrderItem.belongsTo(Product, { foreignKey: 'productId' });

export {
  sequelize,
  User,
  Client,
  Warehouse,
  Product,
  Order,
  OrderItem
};

export default sequelize;