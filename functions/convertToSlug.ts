const convertToSlug = (text: string) => {
  text = text.toString().toLowerCase();

  // Convert Vietnamese to Alphabet
  text = text.replace(/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/g, 'a');
  text = text.replace(/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/g, 'e');
  text = text.replace(/(ì|í|ị|ỉ|ĩ)/g, 'i');
  text = text.replace(/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/g, 'o');
  text = text.replace(/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/g, 'u');
  text = text.replace(/(ỳ|ý|ỵ|ỷ|ỹ)/g, 'y');
  text = text.replace(/(đ)/g, 'd');

  text = text.replace(/\s+/g, '-'); // Replace spaces with -
  text = text.replace(/[^\w\-]+/g, ''); // Remove all non-word chars
  text = text.replace(/\-\-+/g, '-'); // Replace multiple - with single -
  text = text.replace(/^-+/, ''); // Trim - from start of text
  text = text.replace(/-+$/, ''); // Trim - from end of text
  return text;
};

export default convertToSlug;
