const isUrlImage = (url: string) => /\.(jpg|jpeg|png|webp|avif|gif|svg|raw|bmp)$/i.test(url);
export default isUrlImage;
