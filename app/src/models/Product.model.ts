// app/src/models/product.model.ts

/**
 * Product Model
 * ----------
 * Representa productos con stock y soft delete.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ProductAttributes {
  id: number;
  code: string; // Código único para búsquedas
  name: string;
  price: number;
  description: string;
  stock: number; // Stock global o inicial (validar en servicios)
  is_active: boolean;
}

export interface ProductCreationAttributes extends Optional<ProductAttributes, 'id'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public price!: number;
  public description!: string;
  public stock!: number;
  public is_active!: boolean;
}

Product.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    price: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: 0, // No stock negativo
      },
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'Product',
    tableName: 'products',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Soft delete requerido
    deletedAt: 'deleted_at',
  }
);

export default Product;