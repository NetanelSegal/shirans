"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.categoryIdSchema = exports.updateCategorySchema = exports.createCategorySchema = void 0;
const zod_1 = require("zod");
const categoryUrlCode = zod_1.z.enum(['privateHouses', 'apartments', 'publicSpaces']);
/**
 * Zod schema for creating a category
 */
exports.createCategorySchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(2, 'Title must be at least 2 characters')
        .max(100, 'Title must be less than 100 characters'),
    urlCode: categoryUrlCode,
});
/**
 * Zod schema for updating a category
 */
exports.updateCategorySchema = zod_1.z.object({
    title: zod_1.z.string().min(2).max(100).optional(),
    urlCode: categoryUrlCode.optional(),
});
/**
 * Zod schema for category ID parameter
 */
exports.categoryIdSchema = zod_1.z.object({
    id: zod_1.z.cuid('Category ID must be a valid CUID'),
});
