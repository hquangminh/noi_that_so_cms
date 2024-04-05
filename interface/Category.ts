type CategoryType = {
  id: number;
  name: string;
};

export type CategoryRoomType = CategoryType & {
  outstanding: boolean;
  portfolio_rooms_aggregate: { aggregate: { count: number } };
  product_rooms_aggregate: { aggregate: { count: number } };
};

export type CategoryStyleType = CategoryType & {
  outstanding: boolean;
  portfolio_styles_aggregate: { aggregate: { count: number } };
  product_styles_aggregate: { aggregate: { count: number } };
};

export type CategoryProductType = CategoryType & {
  parent_id?: number;
  product_category_relations_aggregate: { aggregate: { count: number } };
};

export enum HashtagType {
  PRODUCT = 1,
  PORTFOLIO = 2,
  BLOG = 3,
}

export type HashtagItem = CategoryType & {
  count: number;
  type: HashtagType;
  status: boolean;
};
