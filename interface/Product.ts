import { AggregateCount, GraphQlAggregate } from './Global';

export type ProductOption = {
  id: number;
  index: 0 | 1;
  name: string;
  options: string[];
};

export enum ProductVariationType {
  ByProduct = 1,
  ByOption = 2,
}

export type ProductVariation = {
  id: number;
  combName?: string;
  combUnicode: string;
  link: string;
  price: number;
  promotion_price: number;
  size?: string;
  sku: string;
  stock: number;
  type: ProductVariationType;
  product_id: number;
};

export type ProductType = {
  id: number;
  name: string;
  image: string;
  background_color: string;
  status: boolean;
  preparation_time: number | null;
  partner?: { id: number; name: string };
  product_variations: ProductVariation[];
};

export type ProductDetail = ProductType & {
  material: string[] | null;
  product_category_relations: { category_id: number }[];
  product_styles?: { style_id: number }[];
  product_hashtags?: { hashtag_id: number }[];
  product_options?: ProductOption[];
  product_rooms?: { room_id: number }[];
  order_products_aggregate: GraphQlAggregate<AggregateCount>;
};
