// ── Request payloads ──

export interface RWRegisterPayload {
  user: {
    username: string;
    email: string;
    password: string;
  };
}

export interface RWLoginPayload {
  user: {
    email: string;
    password: string;
  };
}

export interface RWCreateArticlePayload {
  article: {
    title: string;
    description: string;
    body: string;
    tagList?: string[];
  };
}

export interface RWUpdateArticlePayload {
  article: {
    title?: string;
    description?: string;
    body?: string;
  };
}

export interface RWCreateCommentPayload {
  comment: {
    body: string;
  };
}

// ── Response shapes ──

export interface RWAuthor {
  username: string;
  bio: string | null;
  image: string | null;
  following: boolean;
}

export interface RWUserResponse {
  user: {
    email: string;
    token: string;
    username: string;
    bio: string | null;
    image: string | null;
  };
}

export interface RWArticle {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: RWAuthor;
}

export interface RWArticleResponse {
  article: RWArticle;
}

export interface RWArticlesResponse {
  articles: RWArticle[];
  articlesCount: number;
}

export interface RWComment {
  id: number;
  createdAt: string;
  updatedAt: string;
  body: string;
  author: RWAuthor;
}

export interface RWCommentResponse {
  comment: RWComment;
}

export interface RWCommentsResponse {
  comments: RWComment[];
}

export interface RWProfileResponse {
  profile: {
    username: string;
    bio: string | null;
    image: string | null;
    following: boolean;
  };
}

export interface RWErrorResponse {
  errors: {
    body: string[];
  };
}

export interface RWTagsResponse {
  tags: string[];
}