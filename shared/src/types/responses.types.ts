import type { UserRole, CategoryUrlCode } from './common.types';
import type { ProjectImageType } from '../constants/projectImage';

export interface UserResponse {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMediaItem {
  id: string;
  url: string;
  type: ProjectImageType;
  order: number;
}

export interface ProjectResponse {
  id: string;
  title: string;
  categories: CategoryUrlCode[];
  description: string;
  media: ProjectMediaItem[];
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

export interface ArticleFaqResponse {
  question: string;
  answer: string;
}

export interface ArticleResponse {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  /** HTML. Sanitised on the server before it was stored. */
  body: string;
  coverImage: string;
  coverImageAlt: string | null;
  coverImagePublicId: string | null;
  category: string | null;
  readingMinutes: number;
  faq: ArticleFaqResponse[];
  seoTitle: string | null;
  seoDescription: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** The list view: everything but the body, which no listing needs. */
export type ArticleSummaryResponse = Omit<ArticleResponse, 'body' | 'faq'>;

export interface TestimonialResponse {
  id: string;
  name: string;
  message: string;
  isPublished: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}
