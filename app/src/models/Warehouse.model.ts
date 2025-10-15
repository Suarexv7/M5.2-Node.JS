// app/src/models/warehouse.model.ts

/**
 * Warehouse Model
 * ----------
 * Representa bodegas con stock y estado activo.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface WarehouseAttributes {
  id: number;
  name: string;
  location: string;
  is_active: boolean;
}

export interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, 'id'> {}

class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
  public id!: number;
  public name!: string;
  public location!: string;
  public is_active!: boolean;
}

Warehouse.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Warehouse',
    tableName: 'warehouses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true,
    deletedAt: 'deleted_at',
  }
);

export default Warehouse;