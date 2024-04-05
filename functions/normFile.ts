const normFile = (e: any) => {
  if (Array.isArray(e)) return e;
  return e?.fileList;
};

export default normFile;
