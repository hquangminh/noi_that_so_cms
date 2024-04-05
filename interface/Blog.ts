import { ProductType } from './Product';

export type BlogCategory = {
  id: number;
  name: string;
  status: boolean;
  blog_total?: number;
};

export type BlogType = {
  id: number;
  title: string;
  image: string;
  summary: string;
  content: string;
  status: boolean;
  publish_date?: string;
  category_id: number;
  blog_category: { name: string };
  blog_products?: { product_id: number; product: ProductType }[];
  blog_hashtags?: { hashtag_id: number }[];
  seo_title?: string;
  seo_description?: string;
};

// Query
export type GetBlogResponse = { blog: BlogType[]; blog_aggregate: { aggregate: { count: number } } };
