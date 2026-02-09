"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.footerFormSchema = void 0;
const zod_1 = require("zod");
exports.footerFormSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must be less than 50 characters'),
    phoneNumber: zod_1.z.string().length(10, 'Phone number must be exactly 10 digits'),
    email: zod_1.z
        .email('Invalid email address')
        .min(5, 'Email must be at least 5 characters')
        .max(50, 'Email must be less than 50 characters'),
    context: zod_1.z.string().optional(),
});
