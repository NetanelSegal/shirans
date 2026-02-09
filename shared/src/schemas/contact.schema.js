"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateReadStatusSchema = exports.contactIdSchema = exports.createContactSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for submitting a contact form
 */
exports.createContactSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    email: zod_1.z.email('Invalid email address'),
    phoneNumber: zod_1.z
        .string()
        .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
    message: zod_1.z
        .string()
        .max(2000, 'Message must be less than 2000 characters')
        .optional(),
});
/**
 * Zod schema for contact ID parameter
 */
exports.contactIdSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Contact ID must be a valid CUID'),
});
/**
 * Zod schema for updating read status
 */
exports.updateReadStatusSchema = zod_1.z.object({
    isRead: zod_1.z.boolean(),
});
