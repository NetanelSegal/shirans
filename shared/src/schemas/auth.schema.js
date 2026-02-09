"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const isomorphic_dompurify_1 = __importDefault(require("isomorphic-dompurify"));
const zod_1 = require("zod");
/**
 * Zod schema for user registration
 */
exports.registerSchema = zod_1.z.object({
    email: zod_1.z
        .string()
        .min(1, 'Email is required')
        .max(255, 'Email must be less than 255 characters')
        .transform((val) => isomorphic_dompurify_1.default.sanitize(val.trim())),
    password: zod_1.z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(100, 'Password must be less than 100 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(100, 'Name must be less than 100 characters')
        .transform((val) => isomorphic_dompurify_1.default.sanitize(val.trim())),
});
/**
 * Zod schema for user login
 */
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .email('Invalid email format')
        .min(1, 'Email is required')
        .transform((val) => isomorphic_dompurify_1.default.sanitize(val.trim())),
    password: zod_1.z
        .string()
        .min(1, 'Password is required')
        .min(8, 'Password must be at least 8 characters'),
});
