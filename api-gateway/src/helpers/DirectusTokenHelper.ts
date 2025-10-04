import { Request } from 'express';
import { DirectusService } from '../services/DirectusService';

export const SetDirectusToken = (directus: DirectusService, req: Request) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    directus.setToken(token);
  }
};