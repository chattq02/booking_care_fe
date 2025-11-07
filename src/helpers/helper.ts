export const getFirstLetter = (str: string) => {
  if (!str) return "";
  return str.trim().charAt(0).toUpperCase();
};
