import { apiInnotter } from './axios';

// ==========================================
// 1. SCHEMAS
// ==========================================

export interface TagCreate {
  name: string;
}

export interface TagResponse {
  id: number;
  name: string;
}

// --- PAGE SCHEMAS ---

export interface PageCreateUpdate {
  name: string;
  description: string;
  tags?: number[]; // IDs тегов
}

export interface PageResponse {
  id: number;
  user_id: string;
  group_id: number;
  name: string;
  description: string;
  image_url: string | null;
  is_blocked: boolean;
  unblock_date: string | null;
  created_at: string;
  updated_at: string;
  tags: TagResponse[];
  followers_count: number;
  is_followed: boolean;
}

export interface PageShort {
  id: number;
  name: string;
  tags: TagResponse[];
}

// --- POST SCHEMAS ---

export interface PostCreateUpdate {
  content: string;
  reply_to?: number | null;
}

export interface PostResponse {
  id: number;
  page: number; // Page ID
  content: string;
  reply_to: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  likes_count: number;
  is_liked: boolean;
}

export interface PageWithPosts {
  page: PageResponse;
  posts: PostResponse[]; 
}

// --- FEED & FOLLOWERS SCHEMAS ---

export interface FeedItem extends PostResponse {
  page_details: PageShort;
}

export interface FollowerResponse {
  id: number;
  page: number;
  user_id: string;
  group_id: number;
}

// =========================================================
// 2. ENDPOINTS
// =========================================================

// --- FEED ---
export const getUserFeed = async (): Promise<FeedItem[]> => {
  const response = await apiInnotter.get<FeedItem[]>('/feed/');
  return response.data;
};

// --- PAGES ---
export const createPage = async (data: PageCreateUpdate): Promise<PageResponse> => {
  const response = await apiInnotter.post<PageResponse>('/page/', data);
  return response.data;
};

export const getPageWithPosts = async (
  pageId: number | string,
  page: number = 1,
  pageSize: number = 30
): Promise<PageWithPosts> => {
  const response = await apiInnotter.get<PageWithPosts>(`/page/${pageId}/`, {
    params: { page, page_size: pageSize },
  });
  return response.data;
};

export const updatePage = async (
  pageId: number,
  data: Partial<PageCreateUpdate>
): Promise<PageResponse> => {
  const response = await apiInnotter.patch<PageResponse>(`/page/${pageId}/`, data);
  return response.data;
};

export const deletePage = async (pageId: number): Promise<{ detail: string }> => {
  const response = await apiInnotter.delete<{ detail: string }>(`/pages/${pageId}/`);
  return response.data;
};

export const toggleFollowPage = async (pageId: number): Promise<PageResponse> => {
  const response = await apiInnotter.patch<PageResponse>(`/page/${pageId}/follow/`);
  return response.data;
};

export const getPageFollowers = async (pageId: number): Promise<FollowerResponse[]> => {
  const response = await apiInnotter.get<FollowerResponse[]>(`/page/${pageId}/followers/`);
  return response.data;
};

export const toggleBlockPage = async (pageId: number): Promise<PageResponse> => {
  const response = await apiInnotter.patch<PageResponse>(`/page/${pageId}/block/`);
  return response.data;
};

// --- POSTS ---
export const createPost = async (
  pageId: number | string,
  data: PostCreateUpdate
): Promise<PostResponse> => {
  const response = await apiInnotter.post<PostResponse>(`/page/${pageId}/posts/`, data);
  return response.data;
};

export const toggleLikePost = async (postId: number): Promise<PostResponse> => {
  const response = await apiInnotter.post<PostResponse>(`/post/${postId}/like/`);
  return response.data;
};