export type UserRole = 'ADMIN' | 'USER';
export type CategoryUrlCode = string;
export type ProjectImageType = 'MAIN' | 'IMAGE' | 'PLAN' | 'VIDEO';

export interface ResponsiveImage {
  mobile?: string;
  tablet?: string;
  desktop: string;
  fallback?: string;
}
