export const stringValidation = (
  input: string,
  nullable: boolean = false,
  maxLength: number = 255,
  minLength: number = 1,
  pattern?: RegExp
): boolean => {
  if (!nullable && input === null) {
    return false;
  }
  if (nullable && input === null) {
    return true;
  }
  if (input.length < minLength || input.length > maxLength) {
    return false;
  }
  if (pattern && !pattern.test(input)) {
    return false;
  }
  return true;
};
