const isEmail = (email: string) => {
  return email.toLowerCase().match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/);
};

export default isEmail;
