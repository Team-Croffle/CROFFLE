export const colorValidation = (color: string): boolean => {
  const isColorValid = /^#([0-9A-F]{3}){1,2}$/i.test(color);
  return isColorValid;
};
