# API Endpoint Test Coverage

## Summary

**Total Endpoints**: 14  
**Tested Endpoints**: 14  
**Coverage**: 100% ✅

**Total Tests**: 75 tests passing

---

## Endpoint Coverage Details

### Health Endpoints (1 endpoint)

| Endpoint      | Method | Auth Required | Tests   | Status     |
| ------------- | ------ | ------------- | ------- | ---------- |
| `/api/health` | GET    | No            | 3 tests | ✅ Covered |

**Test File**: `test/integration/health.routes.test.ts`

- ✅ Returns 200 with health status
- ✅ Returns JSON content type
- ✅ Accessible without authentication

---

### Auth Endpoints (4 endpoints)

| Endpoint             | Method | Auth Required | Tests   | Status     |
| -------------------- | ------ | ------------- | ------- | ---------- |
| `/api/auth/register` | POST   | No            | 4 tests | ✅ Covered |
| `/api/auth/login`    | POST   | No            | 3 tests | ✅ Covered |
| `/api/auth/me`       | GET    | Yes           | 4 tests | ✅ Covered |
| `/api/auth/logout`   | POST   | No            | 1 test  | ✅ Covered |

**Test File**: `test/integration/auth.routes.test.ts`

**POST /api/auth/register**:

- ✅ Registers new user successfully
- ✅ Returns 409 when email already exists
- ✅ Returns 400 when validation fails
- ✅ Returns 400 when required fields are missing

**POST /api/auth/login**:

- ✅ Logs in user successfully
- ✅ Returns 401 with invalid credentials
- ✅ Returns 400 when validation fails

**GET /api/auth/me**:

- ✅ Returns current user with valid token
- ✅ Returns 401 without token
- ✅ Returns 401 with invalid token
- ✅ Returns 401 with expired token

**POST /api/auth/logout**:

- ✅ Returns success message

**Admin Access Tests**:

- ✅ Returns 401 when accessing admin route without token
- ✅ Returns 403 when accessing admin route with non-admin token
- ✅ Allows admin to access admin routes

---

### Project Endpoints (9 endpoints)

| Endpoint                        | Method | Auth Required | Tests   | Status     |
| ------------------------------- | ------ | ------------- | ------- | ---------- |
| `/api/projects`                 | GET    | No            | 4 tests | ✅ Covered |
| `/api/projects`                 | POST   | Admin         | 6 tests | ✅ Covered |
| `/api/projects`                 | PUT    | Admin         | 3 tests | ✅ Covered |
| `/api/projects`                 | DELETE | Admin         | 3 tests | ✅ Covered |
| `/api/projects/favourites`      | GET    | No            | 1 test  | ✅ Covered |
| `/api/projects/single`          | GET    | No            | 3 tests | ✅ Covered |
| `/api/projects/uploadImgs`      | POST   | Admin         | 4 tests | ✅ Covered |
| `/api/projects/deleteMainImage` | DELETE | Admin         | 2 tests | ✅ Covered |
| `/api/projects/deleteImages`    | DELETE | Admin         | 4 tests | ✅ Covered |

**Test File**: `test/integration/project.routes.test.ts`

**GET /api/projects** (Public):

- ✅ Returns 200 with projects array
- ✅ Filters by category query parameter
- ✅ Filters by favourite query parameter
- ✅ Filters by isCompleted query parameter

**GET /api/projects/favourites** (Public):

- ✅ Returns 200 with favourite projects

**GET /api/projects/single** (Public):

- ✅ Returns 200 with project when id is provided
- ✅ Returns 400 when id is missing
- ✅ Returns 404 when project not found

**POST /api/projects** (Admin):

- ✅ Returns 201 with created project
- ✅ Returns 400 when required fields are missing
- ✅ Returns 400 when categoryIds is empty
- ✅ Returns 400 when constructionArea is not positive
- ✅ Returns 400 when title is too long
- ✅ Validates image URLs

**PUT /api/projects** (Admin):

- ✅ Returns 200 with updated project
- ✅ Returns 400 when id is missing
- ✅ Returns 400 when categoryIds is not an array

**DELETE /api/projects** (Admin):

- ✅ Returns 200 when project is deleted
- ✅ Returns 400 when id is missing
- ✅ Returns 404 when project not found

**POST /api/projects/uploadImgs** (Admin):

- ✅ Returns 200 with updated project
- ✅ Returns 400 when id is missing
- ✅ Returns 400 when images is missing
- ✅ Returns 400 when image type is invalid

**DELETE /api/projects/deleteMainImage** (Admin):

- ✅ Returns 200 when main image is deleted
- ✅ Returns 400 when id is missing

**DELETE /api/projects/deleteImages** (Admin):

- ✅ Returns 200 when images are deleted
- ✅ Returns 400 when id is missing
- ✅ Returns 400 when imageIds is missing
- ✅ Returns 400 when imageIds contains invalid values

---

## Test Statistics

- **Total Test Files**: 4
  - `health.routes.test.ts`: 3 tests
  - `auth.routes.test.ts`: 15 tests
  - `project.routes.test.ts`: 30 tests
  - `project.service.test.ts`: 27 tests (unit tests)

- **Total Integration Tests**: 48 tests
- **Total Unit Tests**: 27 tests
- **Total Tests**: 75 tests

---

## Coverage Summary

✅ **All endpoints are fully tested**

Every API endpoint has comprehensive test coverage including:

- Success cases
- Validation errors (400)
- Authentication errors (401)
- Authorization errors (403)
- Not found errors (404)
- Conflict errors (409)

---

## Running Tests

```bash
# Run all tests
npm run test:run

# Run specific test file
npm run test:run -- test/integration/health.routes.test.ts

# Run tests in watch mode
npm run test
```

---

## Last Updated

2025-02-02
