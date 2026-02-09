"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteImagesSchema = exports.deleteProjectSchema = exports.deleteMainImageSchema = exports.uploadImagesSchema = exports.singleProjectQuerySchema = exports.projectQuerySchema = exports.updateProjectSchema = exports.createProjectSchema = exports.imageInputSchema = void 0;
const zod_1 = require("zod");
/**
 * Zod schema for project image input
 */
exports.imageInputSchema = zod_1.z.object({
    url: zod_1.z.url('Image URL must be a valid URL').min(1, 'Image URL is required'),
    type: zod_1.z.enum(['MAIN', 'IMAGE', 'PLAN', 'VIDEO'], {
        message: 'Image type must be one of: MAIN, IMAGE, PLAN, VIDEO',
    }),
    order: zod_1.z.number().int().nonnegative().optional(),
});
/**
 * Zod schema for creating a project
 */
exports.createProjectSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, 'Title is required')
        .max(500, 'Title must be less than 500 characters'),
    description: zod_1.z.string().min(1, 'Description is required'),
    location: zod_1.z
        .string()
        .min(1, 'Location is required')
        .max(200, 'Location must be less than 200 characters'),
    client: zod_1.z
        .string()
        .min(1, 'Client is required')
        .max(200, 'Client must be less than 200 characters'),
    isCompleted: zod_1.z.boolean().optional().default(false),
    constructionArea: zod_1.z
        .number()
        .int()
        .positive('Construction area must be a positive number'),
    favourite: zod_1.z.boolean().optional().default(false),
    categoryIds: zod_1.z
        .array(zod_1.z.string().cuid('Category ID must be a valid CUID'))
        .min(1, 'At least one category is required'),
    images: zod_1.z.array(exports.imageInputSchema).optional().default([]),
});
/**
 * Zod schema for updating a project
 */
exports.updateProjectSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Project ID must be a valid CUID'),
    title: zod_1.z.string().min(1).max(500).optional(),
    description: zod_1.z.string().min(1).optional(),
    location: zod_1.z.string().min(1).max(200).optional(),
    client: zod_1.z.string().min(1).max(200).optional(),
    isCompleted: zod_1.z.boolean().optional(),
    constructionArea: zod_1.z.number().int().positive().optional(),
    favourite: zod_1.z.boolean().optional(),
    categoryIds: zod_1.z.array(zod_1.z.string().cuid()).optional(),
});
/**
 * Zod schema for project query parameters
 */
exports.projectQuerySchema = zod_1.z.object({
    category: zod_1.z.string().cuid().optional(),
    favourite: zod_1.z.enum(['true', 'false']).optional(),
    isCompleted: zod_1.z.enum(['true', 'false']).optional(),
});
/**
 * Zod schema for single project query
 */
exports.singleProjectQuerySchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Project ID must be a valid CUID'),
});
/**
 * Zod schema for uploading project images
 */
exports.uploadImagesSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Project ID must be a valid CUID'),
    images: zod_1.z.array(exports.imageInputSchema).min(1, 'At least one image is required'),
});
/**
 * Zod schema for deleting main image
 */
exports.deleteMainImageSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Project ID must be a valid CUID'),
});
/**
 * Zod schema for deleting a project
 */
exports.deleteProjectSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Project ID must be a valid CUID'),
});
/**
 * Zod schema for deleting project images
 */
exports.deleteImagesSchema = zod_1.z.object({
    id: zod_1.z.string().cuid('Project ID must be a valid CUID'),
    imageIds: zod_1.z
        .array(zod_1.z.string().cuid('Image ID must be a valid CUID'))
        .min(1, 'At least one image ID is required'),
});
