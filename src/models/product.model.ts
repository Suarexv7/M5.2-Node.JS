import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";
import Warehouse from "./warehouse.model";

interface ProductAttributes {
  id: number;
  code: string;
  name: string;
  description?: string;
  price: number;
  stock: number;
  warehouseId: number;
  deletedAt?: Date | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ProductCreationAttributes extends Optional<ProductAttributes, 'id' | 'deletedAt'> {}

class Product extends Model<ProductAttributes, ProductCreationAttributes> implements ProductAttributes {
  public id!: number;
  public code!: string;
  public name!: string;
  public description?: string;
  public price!: number;
  public stock!: number;
  public warehouseId!: number;
  public deletedAt?: Date | null;
}

Product.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.DECIMAL, allowNull: false, defaultValue: 0 },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  warehouseId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'warehouses', key: 'id' } },
  deletedAt: { type: DataTypes.DATE, allowNull: true }
}, { sequelize, tableName: 'products', paranoid: true });

export default Product;