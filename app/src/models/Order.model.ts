// app/src/models/order.model.ts

/**
 * Order Model
 * ----------
 * Representa órdenes de entrega con estado y relaciones.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface OrderAttributes {
  id: number;
  client_id: number;
  warehouse_id: number;
  status: 'pending' | 'in_transit' | 'delivered'; // Estados requeridos
  delivery_date?: Date;
}

export interface OrderCreationAttributes extends Optional<OrderAttributes, 'id'> {}

class Order extends Model<OrderAttributes, OrderCreationAttributes> implements OrderAttributes {
  public id!: number;
  public client_id!: number;
  public warehouse_id!: number;
  public status!: 'pending' | 'in_transit' | 'delivered';
  public delivery_date?: Date;
}

Order.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_transit', 'delivered'),
      allowNull: false,
      defaultValue: 'pending',
    },
    delivery_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'Order',
    tableName: 'orders',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  }
);

export default Order;