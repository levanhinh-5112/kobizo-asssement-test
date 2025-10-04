import { Request, Response } from 'express';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const DIRECTUS_URL = process.env.DIRECTUS_URL;
const JWT_SECRET = process.env.JWT_SECRET as string;
const DIRECTUS_ACCESS_TOKEN = process.env.DIRECTUS_ACCESS_TOKEN as string;

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await axios.post(`${DIRECTUS_URL}/users`, { email, password, role: '15813709-24e6-4868-b913-022dc9b31d8e' },
      {
        headers: {
          Authorization: `Bearer ${DIRECTUS_ACCESS_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });
    const token = jwt.sign({ userId: response.data.data.id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error: any) {
    console.error('Directus signup Error:', error.message, JSON.stringify(error.response?.data || error));
    res.status(400).json({ error: 'Signup failed' });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const response = await axios.post(`${DIRECTUS_URL}/auth/login`, { email, password });
    const { access_token, refresh_token, expires } = response.data.data;
    const decoded = jwt.decode(access_token) as { id: string; role: string };
    const userId = decoded.id;
    const role = decoded.role;
    res.json({ access_token, refresh_token, expires, userId, role });
  } catch (error: any) {
    console.error('Directus signin Error:', error.message, JSON.stringify(error.response?.data || error));
    res.status(401).json({ error: 'Invalid credentials' });
  }
};