// app/src/models/orderItem.model.ts

/**
 * OrderItem Model
 * ----------
 * Items dentro de una orden (productos solicitados).
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface OrderItemAttributes {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price_at_purchase: number; // Precio al momento de la compra
}

export interface OrderItemCreationAttributes extends Optional<OrderItemAttributes, 'id'> {}

class OrderItem extends Model<OrderItemAttributes, OrderItemCreationAttributes> implements OrderItemAttributes {
  public id!: number;
  public order_id!: number;
  public product_id!: number;
  public quantity!: number;
  public price_at_purchase!: number;
}

OrderItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'orders',
        key: 'id',
      },
    },
    product_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'products',
        key: 'id',
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
      },
    },
    price_at_purchase: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'OrderItem',
    tableName: 'order_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default OrderItem;