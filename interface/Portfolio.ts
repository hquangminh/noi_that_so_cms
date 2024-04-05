export type PortfolioType = {
  id: number;
  name: string;
  image: string;
};

export type PortfolioDetail = PortfolioType & {
  seo_title?: string;
  seo_description?: string;
  portfolio_rooms: { room_id: number }[];
  portfolio_styles: { style_id: number }[];
  portfolio_hashtags: { hashtag_id: number }[];
};
