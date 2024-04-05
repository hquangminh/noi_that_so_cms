const removeEmptyObject = (obj: Record<string, any>) =>
  Object.entries(obj).reduce((obj, item) => (item[1] ? Object.assign(obj, { [item[0]]: item[1] }) : obj), {});

export default removeEmptyObject;
