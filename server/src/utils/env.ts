import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface EnvConfig {
  PORT: number;
  NODE_ENV: 'development' | 'production' | 'test';
  DATABASE_URL: string;
  CORS_ORIGIN: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
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
    value.length < 32
  ) {
    throw new Error(
      'JWT_SECRET must be at least 32 characters long for security'
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
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
};
