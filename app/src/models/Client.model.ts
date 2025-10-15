// app/src/models/client.model.ts

/**
 * Client Model
 * ----------
 * Representa la tabla 'clients' para clientes con cédula única.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface ClientAttributes {
  id: number;
  document_id: string; // Cédula o documento de identificación
  name: string;
  email: string;
}

export interface ClientCreationAttributes extends Optional<ClientAttributes, 'id'> {}

class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: number;
  public document_id!: string;
  public name!: string;
  public email!: string;
}

Client.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    document_id: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
  },
  {
    sequelize,
    modelName: 'Client',
    tableName: 'clients',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Soft delete opcional
    deletedAt: 'deleted_at',
  }
);

export default Client;