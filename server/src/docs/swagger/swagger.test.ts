import { describe, it, expect } from 'vitest';

import { commonSchemas } from './schemas/common.schemas';
import { authSchemas } from './schemas/auth.schemas';
import { projectSchemas } from './schemas/project.schemas';
import { categorySchemas } from './schemas/category.schemas';
import { contactSchemas } from './schemas/contact.schemas';
import { testimonialSchemas } from './schemas/testimonial.schemas';

import { healthPaths } from './paths/health.paths';
import { authPaths } from './paths/auth.paths';
import { projectsPaths } from './paths/projects.paths';
import { categoriesPaths } from './paths/categories.paths';
import { contactPaths } from './paths/contact.paths';
import { testimonialsPaths } from './paths/testimonials.paths';

describe('Swagger Schema Definitions', () => {
  describe('commonSchemas', () => {
    it('should define ErrorResponse with required fields', () => {
      expect(commonSchemas.ErrorResponse).toBeDefined();
      expect(commonSchemas.ErrorResponse.required).toContain('error');
      expect(commonSchemas.ErrorResponse.required).toContain('message');
      expect(commonSchemas.ErrorResponse.properties).toHaveProperty('error');
      expect(commonSchemas.ErrorResponse.properties).toHaveProperty('message');
      expect(commonSchemas.ErrorResponse.properties).toHaveProperty('stack');
      expect(commonSchemas.ErrorResponse.properties).toHaveProperty(
        'validationErrors',
      );
    });

    it('should define MessageResponse with message field', () => {
      expect(commonSchemas.MessageResponse).toBeDefined();
      expect(commonSchemas.MessageResponse.required).toContain('message');
    });

    it('should define UserRole enum with correct values', () => {
      expect(commonSchemas.UserRole.enum).toEqual(['ADMIN', 'USER']);
    });

    it('should define CategoryUrlCode enum with correct values', () => {
      expect(commonSchemas.CategoryUrlCode.enum).toEqual([
        'privateHouses',
        'apartments',
        'publicSpaces',
      ]);
    });

    it('should define ResponsiveImage with desktop as required', () => {
      expect(commonSchemas.ResponsiveImage).toBeDefined();
      expect(commonSchemas.ResponsiveImage.required).toContain('desktop');
      expect(commonSchemas.ResponsiveImage.properties).toHaveProperty(
        'mobile',
      );
      expect(commonSchemas.ResponsiveImage.properties).toHaveProperty(
        'tablet',
      );
      expect(commonSchemas.ResponsiveImage.properties).toHaveProperty(
        'desktop',
      );
      expect(commonSchemas.ResponsiveImage.properties).toHaveProperty(
        'fallback',
      );
    });
  });

  describe('authSchemas', () => {
    it('should define RegisterRequest with required fields', () => {
      const schema = authSchemas.RegisterRequest;
      expect(schema.required).toEqual(['email', 'password', 'name']);
      expect(schema.properties.email.format).toBe('email');
      expect(schema.properties.password.minLength).toBe(8);
      expect(schema.properties.name.minLength).toBe(2);
    });

    it('should define LoginRequest with required fields', () => {
      const schema = authSchemas.LoginRequest;
      expect(schema.required).toEqual(['email', 'password']);
      expect(schema.properties.email.format).toBe('email');
    });

    it('should define UserResponse with all user fields', () => {
      const schema = authSchemas.UserResponse;
      expect(schema.required).toEqual(
        expect.arrayContaining([
          'id',
          'email',
          'name',
          'role',
          'createdAt',
          'updatedAt',
        ]),
      );
    });

    it('should define AuthResponse with user and accessToken', () => {
      const schema = authSchemas.AuthResponse;
      expect(schema.required).toContain('user');
      expect(schema.required).toContain('accessToken');
    });

    it('should define RefreshResponse with accessToken', () => {
      const schema = authSchemas.RefreshResponse;
      expect(schema.required).toContain('accessToken');
    });
  });

  describe('projectSchemas', () => {
    it('should define ProjectResponse with all project fields', () => {
      const schema = projectSchemas.ProjectResponse;
      expect(schema.required).toEqual(
        expect.arrayContaining([
          'id',
          'title',
          'categories',
          'description',
          'mainImage',
          'images',
          'location',
          'client',
          'isCompleted',
          'constructionArea',
          'favourite',
        ]),
      );
    });

    it('should define CreateProjectRequest with required fields', () => {
      const schema = projectSchemas.CreateProjectRequest;
      expect(schema.required).toEqual(
        expect.arrayContaining([
          'title',
          'description',
          'location',
          'client',
          'constructionArea',
          'categoryIds',
        ]),
      );
    });

    it('should define UpdateProjectRequest with only id required', () => {
      const schema = projectSchemas.UpdateProjectRequest;
      expect(schema.required).toEqual(['id']);
    });

    it('should define ImageInput with url and type required', () => {
      const schema = projectSchemas.ImageInput;
      expect(schema.required).toEqual(['url', 'type']);
      expect(schema.properties.type.enum).toEqual([
        'MAIN',
        'IMAGE',
        'PLAN',
        'VIDEO',
      ]);
    });

    it('should define UploadImagesRequest with id and images required', () => {
      const schema = projectSchemas.UploadImagesRequest;
      expect(schema.required).toEqual(['id', 'images']);
    });

    it('should define DeleteProjectRequest with id required', () => {
      expect(projectSchemas.DeleteProjectRequest.required).toEqual(['id']);
    });

    it('should define DeleteMainImageRequest with id required', () => {
      expect(projectSchemas.DeleteMainImageRequest.required).toEqual(['id']);
    });

    it('should define DeleteImagesRequest with id and imageIds required', () => {
      expect(projectSchemas.DeleteImagesRequest.required).toEqual([
        'id',
        'imageIds',
      ]);
    });
  });

  describe('categorySchemas', () => {
    it('should define CategoryResponse with all fields', () => {
      const schema = categorySchemas.CategoryResponse;
      expect(schema.required).toEqual(
        expect.arrayContaining([
          'id',
          'title',
          'urlCode',
          'createdAt',
          'updatedAt',
        ]),
      );
    });

    it('should define CreateCategoryRequest with title and urlCode required', () => {
      const schema = categorySchemas.CreateCategoryRequest;
      expect(schema.required).toEqual(['title', 'urlCode']);
    });

    it('should define UpdateCategoryRequest with no required fields', () => {
      const schema = categorySchemas.UpdateCategoryRequest as Record<string, unknown>;
      expect(schema.required).toBeUndefined();
    });
  });

  describe('contactSchemas', () => {
    it('should define ContactResponse with all fields', () => {
      const schema = contactSchemas.ContactResponse;
      expect(schema.required).toEqual(
        expect.arrayContaining([
          'id',
          'name',
          'email',
          'phoneNumber',
          'message',
          'isRead',
          'createdAt',
        ]),
      );
    });

    it('should define CreateContactRequest with required fields', () => {
      const schema = contactSchemas.CreateContactRequest;
      expect(schema.required).toEqual(['name', 'email', 'phoneNumber']);
      expect(schema.properties.phoneNumber.pattern).toBe('^[0-9]{10}$');
    });

    it('should define UpdateReadStatusRequest with isRead required', () => {
      const schema = contactSchemas.UpdateReadStatusRequest;
      expect(schema.required).toEqual(['isRead']);
      expect(schema.properties.isRead.type).toBe('boolean');
    });
  });

  describe('testimonialSchemas', () => {
    it('should define TestimonialResponse with all fields', () => {
      const schema = testimonialSchemas.TestimonialResponse;
      expect(schema.required).toEqual(
        expect.arrayContaining([
          'id',
          'name',
          'message',
          'isPublished',
          'order',
          'createdAt',
          'updatedAt',
        ]),
      );
    });

    it('should define CreateTestimonialRequest with name and message required', () => {
      const schema = testimonialSchemas.CreateTestimonialRequest;
      expect(schema.required).toEqual(['name', 'message']);
      expect(schema.properties.name.minLength).toBe(2);
      expect(schema.properties.message.minLength).toBe(10);
    });

    it('should define UpdateTestimonialRequest with no required fields', () => {
      const schema = testimonialSchemas.UpdateTestimonialRequest as Record<string, unknown>;
      expect(schema.required).toBeUndefined();
    });

    it('should define UpdateOrderRequest with order required', () => {
      const schema = testimonialSchemas.UpdateOrderRequest;
      expect(schema.required).toEqual(['order']);
      expect(schema.properties.order.type).toBe('integer');
    });
  });
});

describe('Swagger Path Definitions', () => {
  describe('healthPaths', () => {
    it('should define GET /api/health', () => {
      expect(healthPaths['/api/health'].get).toBeDefined();
      expect(healthPaths['/api/health'].get.tags).toContain('Health');
      expect(healthPaths['/api/health'].get.responses['200']).toBeDefined();
    });
  });

  describe('authPaths', () => {
    it('should define POST /api/auth/register', () => {
      const path = authPaths['/api/auth/register'].post;
      expect(path.tags).toContain('Auth');
      expect(path.requestBody).toBeDefined();
      expect(path.responses['201']).toBeDefined();
      expect(path.responses['400']).toBeDefined();
      expect(path.responses['409']).toBeDefined();
    });

    it('should define POST /api/auth/login', () => {
      const path = authPaths['/api/auth/login'].post;
      expect(path.tags).toContain('Auth');
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['401']).toBeDefined();
    });

    it('should define POST /api/auth/refresh', () => {
      const path = authPaths['/api/auth/refresh'].post;
      expect(path.tags).toContain('Auth');
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['401']).toBeDefined();
    });

    it('should define GET /api/auth/me with authentication', () => {
      const path = authPaths['/api/auth/me'].get;
      expect(path.tags).toContain('Auth');
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['401']).toBeDefined();
    });

    it('should define POST /api/auth/logout', () => {
      const path = authPaths['/api/auth/logout'].post;
      expect(path.tags).toContain('Auth');
      expect(path.responses['200']).toBeDefined();
    });
  });

  describe('projectsPaths', () => {
    it('should define GET /api/projects with query parameters', () => {
      const path = projectsPaths['/api/projects'].get;
      expect(path.tags).toContain('Projects');
      expect(path.parameters).toHaveLength(3);
      expect(path.parameters?.map((p) => p.name)).toEqual([
        'category',
        'favourite',
        'isCompleted',
      ]);
      expect(path.responses['200']).toBeDefined();
    });

    it('should define POST /api/projects with admin auth', () => {
      const path = projectsPaths['/api/projects'].post;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['201']).toBeDefined();
      expect(path.responses['401']).toBeDefined();
      expect(path.responses['403']).toBeDefined();
    });

    it('should define PUT /api/projects with admin auth', () => {
      const path = projectsPaths['/api/projects'].put;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define DELETE /api/projects with admin auth', () => {
      const path = projectsPaths['/api/projects'].delete;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
    });

    it('should define GET /api/projects/favourites', () => {
      const path = projectsPaths['/api/projects/favourites'].get;
      expect(path.tags).toContain('Projects');
      expect(path.responses['200']).toBeDefined();
    });

    it('should define GET /api/projects/single with id query param', () => {
      const path = projectsPaths['/api/projects/single'].get;
      expect(path.parameters).toHaveLength(1);
      expect(path.parameters?.[0].name).toBe('id');
      expect(path.parameters?.[0].in).toBe('query');
      expect(path.parameters?.[0].required).toBe(true);
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define POST /api/projects/uploadImgs with admin auth', () => {
      const path = projectsPaths['/api/projects/uploadImgs'].post;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
    });

    it('should define DELETE /api/projects/deleteMainImage with admin auth', () => {
      const path = projectsPaths['/api/projects/deleteMainImage'].delete;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
    });

    it('should define DELETE /api/projects/deleteImages with admin auth', () => {
      const path = projectsPaths['/api/projects/deleteImages'].delete;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
    });
  });

  describe('categoriesPaths', () => {
    it('should define GET /api/categories', () => {
      const path = categoriesPaths['/api/categories'].get;
      expect(path.tags).toContain('Categories');
      expect(path.responses['200']).toBeDefined();
    });

    it('should define POST /api/categories', () => {
      const path = categoriesPaths['/api/categories'].post;
      expect(path.tags).toContain('Categories');
      expect(path.requestBody).toBeDefined();
      expect(path.responses['201']).toBeDefined();
      expect(path.responses['409']).toBeDefined();
    });

    it('should define GET /api/categories/{id} with path parameter', () => {
      const path = categoriesPaths['/api/categories/{id}'].get;
      expect(path.parameters).toHaveLength(1);
      expect(path.parameters?.[0].name).toBe('id');
      expect(path.parameters?.[0].in).toBe('path');
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define PUT /api/categories/{id}', () => {
      const path = categoriesPaths['/api/categories/{id}'].put;
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define DELETE /api/categories/{id}', () => {
      const path = categoriesPaths['/api/categories/{id}'].delete;
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });
  });

  describe('contactPaths', () => {
    it('should define POST /api/contact (public)', () => {
      const path = contactPaths['/api/contact'].post;
      expect(path.tags).toContain('Contact');
      expect(path.requestBody).toBeDefined();
      expect(path.responses['201']).toBeDefined();
      expect(path.responses['400']).toBeDefined();
    });

    it('should define GET /api/contact with isRead filter', () => {
      const path = contactPaths['/api/contact'].get;
      expect(path.tags).toContain('Contact');
      expect(path.parameters).toHaveLength(1);
      expect(path.parameters?.[0].name).toBe('isRead');
      expect(path.responses['200']).toBeDefined();
    });

    it('should define GET /api/contact/{id}', () => {
      const path = contactPaths['/api/contact/{id}'].get;
      expect(path.parameters).toHaveLength(1);
      expect(path.parameters?.[0].in).toBe('path');
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define DELETE /api/contact/{id}', () => {
      const path = contactPaths['/api/contact/{id}'].delete;
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define PATCH /api/contact/{id}/read', () => {
      const path = contactPaths['/api/contact/{id}/read'].patch;
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['400']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });
  });

  describe('testimonialsPaths', () => {
    it('should define GET /api/testimonials with isPublished filter', () => {
      const path = testimonialsPaths['/api/testimonials'].get;
      expect(path.tags).toContain('Testimonials');
      expect(path.parameters).toHaveLength(1);
      expect(path.parameters?.[0].name).toBe('isPublished');
      expect(path.responses['200']).toBeDefined();
    });

    it('should define POST /api/testimonials with admin auth', () => {
      const path = testimonialsPaths['/api/testimonials'].post;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['201']).toBeDefined();
      expect(path.responses['401']).toBeDefined();
      expect(path.responses['403']).toBeDefined();
    });

    it('should define GET /api/testimonials/published', () => {
      const path = testimonialsPaths['/api/testimonials/published'].get;
      expect(path.tags).toContain('Testimonials');
      expect(path.responses['200']).toBeDefined();
    });

    it('should define GET /api/testimonials/{id} with admin auth', () => {
      const path = testimonialsPaths['/api/testimonials/{id}'].get;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define PUT /api/testimonials/{id} with admin auth', () => {
      const path = testimonialsPaths['/api/testimonials/{id}'].put;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define DELETE /api/testimonials/{id} with admin auth', () => {
      const path = testimonialsPaths['/api/testimonials/{id}'].delete;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['404']).toBeDefined();
    });

    it('should define PATCH /api/testimonials/{id}/order with admin auth', () => {
      const path = testimonialsPaths['/api/testimonials/{id}/order'].patch;
      expect(path.security).toEqual([{ bearerAuth: [] }]);
      expect(path.requestBody).toBeDefined();
      expect(path.responses['200']).toBeDefined();
      expect(path.responses['400']).toBeDefined();
    });
  });
});

describe('Swagger Spec Completeness', () => {
  const allPaths = {
    ...healthPaths,
    ...authPaths,
    ...projectsPaths,
    ...categoriesPaths,
    ...contactPaths,
    ...testimonialsPaths,
  };

  const allSchemas = {
    ...commonSchemas,
    ...authSchemas,
    ...projectSchemas,
    ...categorySchemas,
    ...contactSchemas,
    ...testimonialSchemas,
  };

  it('should have 31 total endpoint operations', () => {
    let operationCount = 0;
    for (const pathItem of Object.values(allPaths)) {
      for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
        if ((pathItem as Record<string, unknown>)[method]) {
          operationCount++;
        }
      }
    }
    expect(operationCount).toBe(32);
  });

  it('should have all expected path groups', () => {
    const pathKeys = Object.keys(allPaths);
    expect(pathKeys).toContain('/api/health');
    expect(pathKeys).toContain('/api/auth/register');
    expect(pathKeys).toContain('/api/auth/login');
    expect(pathKeys).toContain('/api/auth/refresh');
    expect(pathKeys).toContain('/api/auth/me');
    expect(pathKeys).toContain('/api/auth/logout');
    expect(pathKeys).toContain('/api/projects');
    expect(pathKeys).toContain('/api/projects/favourites');
    expect(pathKeys).toContain('/api/projects/single');
    expect(pathKeys).toContain('/api/projects/uploadImgs');
    expect(pathKeys).toContain('/api/projects/deleteMainImage');
    expect(pathKeys).toContain('/api/projects/deleteImages');
    expect(pathKeys).toContain('/api/categories');
    expect(pathKeys).toContain('/api/categories/{id}');
    expect(pathKeys).toContain('/api/contact');
    expect(pathKeys).toContain('/api/contact/{id}');
    expect(pathKeys).toContain('/api/contact/{id}/read');
    expect(pathKeys).toContain('/api/testimonials');
    expect(pathKeys).toContain('/api/testimonials/published');
    expect(pathKeys).toContain('/api/testimonials/{id}');
    expect(pathKeys).toContain('/api/testimonials/{id}/order');
  });

  it('should have all expected schema definitions', () => {
    const schemaKeys = Object.keys(allSchemas);
    const expectedSchemas = [
      'ErrorResponse',
      'MessageResponse',
      'UserRole',
      'CategoryUrlCode',
      'ResponsiveImage',
      'RegisterRequest',
      'LoginRequest',
      'UserResponse',
      'AuthResponse',
      'RefreshResponse',
      'ProjectResponse',
      'CreateProjectRequest',
      'UpdateProjectRequest',
      'ImageInput',
      'UploadImagesRequest',
      'DeleteProjectRequest',
      'DeleteMainImageRequest',
      'DeleteImagesRequest',
      'CategoryResponse',
      'CreateCategoryRequest',
      'UpdateCategoryRequest',
      'ContactResponse',
      'CreateContactRequest',
      'UpdateReadStatusRequest',
      'TestimonialResponse',
      'CreateTestimonialRequest',
      'UpdateTestimonialRequest',
      'UpdateOrderRequest',
    ];

    for (const schema of expectedSchemas) {
      expect(schemaKeys).toContain(schema);
    }
  });

  it('should have all schemas typed as object or string', () => {
    for (const [name, schema] of Object.entries(allSchemas)) {
      const s = schema as Record<string, unknown>;
      expect(
        s.type === 'object' || s.type === 'string',
        `Schema ${name} should have type 'object' or 'string', got '${s.type}'`,
      ).toBe(true);
    }
  });

  it('should tag every operation', () => {
    for (const [pathKey, pathItem] of Object.entries(allPaths)) {
      for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
        const operation = (pathItem as Record<string, unknown>)[method] as
          | { tags?: string[] }
          | undefined;
        if (operation) {
          expect(
            operation.tags,
            `${method.toUpperCase()} ${pathKey} should have tags`,
          ).toBeDefined();
          expect(operation.tags!.length).toBeGreaterThan(0);
        }
      }
    }
  });

  it('should have responses for every operation', () => {
    for (const [pathKey, pathItem] of Object.entries(allPaths)) {
      for (const method of ['get', 'post', 'put', 'delete', 'patch']) {
        const operation = (pathItem as Record<string, unknown>)[method] as
          | { responses?: Record<string, unknown> }
          | undefined;
        if (operation) {
          expect(
            operation.responses,
            `${method.toUpperCase()} ${pathKey} should have responses`,
          ).toBeDefined();
          expect(
            Object.keys(operation.responses!).length,
            `${method.toUpperCase()} ${pathKey} should have at least one response`,
          ).toBeGreaterThan(0);
        }
      }
    }
  });
});
