import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/db";

interface ClientAttributes {
  id: number;
  cedula: string;
  name: string;
  email?: string;
  address?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ClientCreationAttributes extends Optional<ClientAttributes, 'id'> {}

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public cedula!: string;
  public name!: string;
  public email?: string;
  public address?: string;
}

Client.init({
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  cedula: { type: DataTypes.STRING, allowNull: false, unique: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
}, { sequelize, tableName: 'clients' });

export default Client;