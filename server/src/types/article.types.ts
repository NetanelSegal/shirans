// Re-export shared types for convenience
export type {
  ArticleResponse,
  ArticleSummaryResponse,
  ArticleFaqResponse,
} from '@shirans/shared';

export interface ArticleFaqInput {
  question: string;
  answer: string;
}

export interface ArticleRequest {
  title: string;
  slug?: string;
  excerpt: string;
  body: string;
  coverImage: string;
  coverImageAlt?: string;
  coverImagePublicId?: string;
  category?: string;
  readingMinutes?: number;
  faq?: ArticleFaqInput[];
  seoTitle?: string;
  seoDescription?: string;
  published?: boolean;
}

export interface ArticleFilters {
  published?: boolean;
  category?: string;
}
