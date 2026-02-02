import dotenv from 'dotenv';
import { JWT_SECRET_MIN_LENGTH } from '../constants/auth.constants';

// Load environment variables from .env file
dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  BCRYPT_SALT_ROUNDS: number;
  COOKIE_SECURE: string;
  COOKIE_SAME_SITE: string;
  COOKIE_DOMAIN: string;
}

function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  // Validate JWT_SECRET length (skip in test environment)
  if (
    name === 'JWT_SECRET' &&
    process.env.NODE_ENV !== 'test' &&
    value.length < JWT_SECRET_MIN_LENGTH
  ) {
    throw new Error(
      `JWT_SECRET must be at least ${JWT_SECRET_MIN_LENGTH} characters long for security`
    );
  }

  return value;
}

function getEnvNumber(name: string, defaultValue?: number): number {
  const value = process.env[name] || defaultValue?.toString();
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  const parsed = parseInt(value, 10);
  if (isNaN(parsed)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }
  return parsed;
}

function getEnvNodeEnv(): 'development' | 'production' | 'test' {
  const env = getEnvVar('NODE_ENV', 'development');
  if (env === 'development' || env === 'production' || env === 'test') {
    return env;
  }
  throw new Error(`NODE_ENV must be one of: development, production, test`);
}

export const env: EnvConfig = {
  PORT: getEnvNumber('PORT', 3000),
  NODE_ENV: getEnvNodeEnv(),
  DATABASE_URL: getEnvVar('DATABASE_URL'),
  CORS_ORIGIN: getEnvVar('CORS_ORIGIN', 'http://localhost:5174'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '15m'),
  JWT_REFRESH_EXPIRES_IN: getEnvVar('JWT_REFRESH_EXPIRES_IN', '7d'),
  BCRYPT_SALT_ROUNDS: getEnvNumber('BCRYPT_SALT_ROUNDS', 12),
  COOKIE_SECURE: getEnvVar('COOKIE_SECURE', 'false'),
  COOKIE_SAME_SITE: getEnvVar('COOKIE_SAME_SITE', 'strict'),
  COOKIE_DOMAIN: getEnvVar('COOKIE_DOMAIN', ''),
};
