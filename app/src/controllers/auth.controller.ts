
// app/src/controllers/auth.controller.ts

import { Request, Response } from 'express';
import User from '../models/User.model';
import bcrypt from 'bcryptjs';
import { generateToken } from '../config/jwt';
import Joi from 'joi';

// Interfaces for input data
interface RegisterInput {
  email: string;
  password: string;
  role: 'admin' | 'analyst';
  username: string;
}

interface LoginInput {
  email: string;
  password: string;
}

// Validation schemas with Joi
const registerSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
  role: Joi.string().valid('admin', 'analyst').required().label('Role'),
  username: Joi.string().max(50).required().label('Username'), // Added username validation
});

const loginSchema = Joi.object({
  email: Joi.string().email().required().label('Email'),
  password: Joi.string().min(6).required().label('Password'),
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [admin, analyst]
 *                 example: analyst
 *               username:
 *                 type: string
 *                 maxLength: 50
 *                 example: testuser
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: Validation error or duplicate email/username
 *       500:
 *         description: Internal server error
 */
export const register = async (req: Request, res: Response) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { email, password, role, username } = req.body;

    // Check if email or username already exists
    const existingUserByEmail = await User.findOne({ where: { email } });
    if (existingUserByEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUserByUsername = await User.findOne({ where: { username } });
    if (existingUserByUsername) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create the user
    const user = await User.create({ email, password: hashedPassword,role, username,});
      // is_active is optional here since it has a defaultValue of true in the model


    // Generate JWT token
    const token = generateToken({ id: user.id, role: user.role });

    res.status(201).json({ token });
  } catch (error: any) {
    console.error('Error in register:', error);
    res.status(500).json({ error: 'Internal server error while registering user' });
  }
};

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: password123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errorMessages = error.details.map((detail) => detail.message).join(', ');
      return res.status(400).json({ error: errorMessages });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Ensure the user is active before logging in
    if (!user.is_active) {
      return res.status(401).json({ error: 'User account is inactive' });
    }

    const token = generateToken({ id: user.id, role: user.role });
    res.json({ token });
  } catch (error: any) {
    console.error('Error in login:', error);
    res.status(500).json({ error: 'Internal server error while logging in' });
  }
};