import type { UserRole, CategoryUrlCode } from './common.types';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectResponse {
  id: string;
  title: string;
  categories: CategoryUrlCode[];
  description: string;
  mainImage: string;
  images: string[];
  plans?: string[];
  videos?: string[];
  location: string;
  client: string;
  isCompleted: boolean;
  constructionArea: number;
  favourite: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryResponse {
  id: string;
  title: string;
  urlCode: CategoryUrlCode;
  createdAt: string;
  updatedAt: string;
}

export interface ContactResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  message: string | null;
  isRead: boolean;
  createdAt: string;
}

export interface CalculatorLeadResponse {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  builtAreaSqm: number;
  constructionFinish: string;
  pool: string;
  outdoorAreaSqm: number;
  outdoorFinish: string;
  kitchen: string;
  carpentry: string;
  furniture: string;
  equipment: string;
  priceDisplay: string;
  estimateMin: number;
  estimateMax: number;
  isRead: boolean;
  createdAt: string;
}

export interface TestimonialResponse {
  id: string;
  name: string;
  message: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
