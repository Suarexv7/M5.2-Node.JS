// app/src/models/user.model.ts

/**
 * User Model
 * ----------
 * Representa la tabla 'users' en la base de datos para autenticación y roles.
 * Roles: 'admin' (CRUD completo), 'analyst' (consultas y actualizaciones de órdenes).
 */

import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/database';

export interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string; // Hash de la contraseña (usar bcrypt en servicios)
  role: 'admin' | 'analyst';
  is_active: boolean;
}

export interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public role!: 'admin' | 'analyst';
  public is_active!: boolean;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING(50),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'analyst'),
      allowNull: false,
      defaultValue: 'analyst',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    paranoid: true, // Soft delete para usuarios si es necesario
    deletedAt: 'deleted_at',
  }
);

export default User;