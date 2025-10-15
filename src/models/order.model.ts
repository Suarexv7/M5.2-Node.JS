import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Client from "./client.model";
import Warehouse from "./warehouse.model";

export type OrderStatus = 'pending' | 'in_transit' | 'delivered';

interface OrderAttributes {
  id: number;
  clientId: number;
  warehouseId: number;
  status: OrderStatus;
  createdAt?: Date;
  updatedAt?: Date;
}

interface OrderCreationAttributes extends Optional<OrderAttributes, 'id' | 'status'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public clientId!: number;
  public warehouseId!: number;
  public status!: OrderStatus;
}

Order.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  clientId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'clients', key: 'id' } },
  warehouseId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'warehouses', key: 'id' } },
  status: { type: DataTypes.ENUM('pending','in_transit','delivered'), allowNull: false, defaultValue: 'pending' }
}, { sequelize, tableName: 'orders' });

export default Order;