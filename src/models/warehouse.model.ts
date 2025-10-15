import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface WarehouseAttributes {
  id: number;
  name: string;
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface WarehouseCreationAttributes extends Optional<WarehouseAttributes, 'id'> {}

class Warehouse extends Model<WarehouseAttributes, WarehouseCreationAttributes> implements WarehouseAttributes {
  public id!: number;
  public name!: string;
  public active!: boolean;
}

Warehouse.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING, allowNull: false },
  active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
}, { sequelize, tableName: 'warehouses' });

export default Warehouse;