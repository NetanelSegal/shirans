import apiClient from '../../utils/apiClient';
import { urls } from '../../constants/urls';
import type {
  ArticleResponse,
  ArticleSummaryResponse,
  CreateArticleInput,
} from '@shirans/shared';

/** The admin reads, which include drafts. */
export async function fetchAllArticles(): Promise<ArticleSummaryResponse[]> {
  const { data } = await apiClient.get<ArticleSummaryResponse[]>(urls.articles.getAll);
  return data;
}

export async function fetchArticleById(id: string): Promise<ArticleResponse> {
  const { data } = await apiClient.get<ArticleResponse>(urls.articles.getById(id));
  return data;
}

export async function createArticle(input: CreateArticleInput): Promise<ArticleResponse> {
  const { data } = await apiClient.post<ArticleResponse>(urls.articles.create, input);
  return data;
}

export async function updateArticle(
  id: string,
  input: Partial<CreateArticleInput>,
): Promise<ArticleResponse> {
  const { data } = await apiClient.put<ArticleResponse>(urls.articles.update(id), input);
  return data;
}

export async function deleteArticle(id: string): Promise<void> {
  await apiClient.delete(urls.articles.delete(id));
}

export async function updateArticlesBulk(
  ids: string[],
  published: boolean,
): Promise<{ count: number }> {
  const { data } = await apiClient.patch<{ count: number }>(urls.articles.bulkUpdate, {
    ids,
    published,
  });
  return data;
}

export async function deleteArticlesBulk(ids: string[]): Promise<{ count: number }> {
  const { data } = await apiClient.delete<{ count: number }>(urls.articles.bulkDelete, {
    data: { ids },
  });
  return data;
}

/** One image for an article: the cover, or a picture inside the body. */
export async function uploadArticleImage(
  file: File,
): Promise<{ url: string; publicId: string }> {
  const form = new FormData();
  // The shared upload middleware reads an array field named "files".
  form.append('files', file);
  const { data } = await apiClient.post<{ url: string; publicId: string }>(
    `${urls.articles.getAll}/images`,
    form,
  );
  return data;
}
