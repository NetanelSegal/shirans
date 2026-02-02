import { CategoryUrlCode } from '../../prisma/generated/prisma/enums';

export interface CategoryRequest {
  title: string;
  urlCode: CategoryUrlCode;
}

export interface CategoryResponse {
  id: string;
  title: string;
  urlCode: CategoryUrlCode;
  createdAt: Date;
  updatedAt: Date;
}
