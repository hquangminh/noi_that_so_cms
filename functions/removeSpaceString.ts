const removeSpaceString = (str: string, type: 'multiple-to-one' | 'all' = 'multiple-to-one') => {
  switch (type) {
    case 'all':
      return str.replace(/\s+/, '');
    case 'multiple-to-one':
      return str.replace(/\s+/g, ' ').trim();
    default:
      return str;
  }
};

export default removeSpaceString;
