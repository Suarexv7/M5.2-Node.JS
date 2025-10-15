// app/src/models/warehouseProduct.model.ts

/**
 * WarehouseProduct Model
 * ----------
 * Tabla intermedia para stock de productos por bodega (many-to-many).
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface WarehouseProductAttributes {
  id: number;
  warehouse_id: number;
  product_id: number;
  stock: number;
}

export interface WarehouseProductCreationAttributes extends Optional<WarehouseProductAttributes, 'id'> {}

class WarehouseProduct extends Model<WarehouseProductAttributes, WarehouseProductCreationAttributes> implements WarehouseProductAttributes {
  public id!: number;
  public warehouse_id!: number;
  public product_id!: number;
  public stock!: number;
}

WarehouseProduct.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    warehouse_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'warehouses',
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
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0,
      },
    },
  },
  {
    sequelize,
    modelName: 'WarehouseProduct',
    tableName: 'warehouse_products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default WarehouseProduct;