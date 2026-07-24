/**
 * Helper Utilities
 * 
 * Common utility functions.
 */

import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { config } from '../config';

/**
 * Generate random string
 */
export const generateRandomString = (length = 32): string => {
  return crypto.randomBytes(length).toString('hex');
};

/**
 * Generate unique ID
 */
export const generateId = (): string => {
  return crypto.randomUUID();
};

/**
 * Hash password
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(parseInt(config.get('BCRYPT_SALT_ROUNDS')));
  return bcrypt.hash(password, salt);
};

/**
 * Compare password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Sleep utility
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Deep clone object
 */
export const deepClone = <T>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Remove undefined values from object
 */
export const removeUndefined = <T extends Record<string, any>>(obj: T): Partial<T> => {
  const result: any = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      result[key] = value;
    }
  }
  return result;
};

/**
 * Pick specific keys from object
 */
export const pick = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};

/**
 * Omit specific keys from object
 */
export const omit = <T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Convert to slug
 */
export const toSlug = (str: string): string => {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Parse pagination params
 */
export const parsePagination = (page?: string, limit?: string) => {
  const p = Math.max(1, parseInt(page || '1') || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit || '10') || 10));
  const skip = (p - 1) * l;
  
  return { page: p, limit: l, skip };
};

/**
 * Parse sort params
 */
export const parseSort = (sortBy?: string, sortOrder?: string) => {
  const field = sortBy || 'createdAt';
  const order = sortOrder === 'asc' ? 1 : -1;
  
  return { [field]: order };
};

export default {
  generateRandomString,
  generateId,
  hashPassword,
  comparePassword,
  sleep,
  deepClone,
  removeUndefined,
  pick,
  omit,
  capitalize,
  toSlug,
  parsePagination,
  parseSort,
};
