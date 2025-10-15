// app/src/models/address.model.ts

/**
 * Address Model
 * ----------
 * Representa direcciones de entrega para clientes.
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface AddressAttributes {
  id: number;
  client_id: number;
  street: string;
  city: string;
  postal_code: string;
  country: string;
}

export interface AddressCreationAttributes extends Optional<AddressAttributes, 'id'> {}

class Address extends Model<AddressAttributes, AddressCreationAttributes> implements AddressAttributes {
  public id!: number;
  public client_id!: number;
  public street!: string;
  public city!: string;
  public postal_code!: string;
  public country!: string;
}

Address.init(
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
    street: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    postal_code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'Address',
    tableName: 'addresses',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default Address;