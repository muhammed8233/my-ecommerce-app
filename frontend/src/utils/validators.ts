/**
 * Simple Regex for email validation
 */
export const isValidEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Password must be at least 6 characters
 */
export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

/**
 * Check if a string is empty or just whitespace
 */
export const isEmpty = (value: string): boolean => {
  return !value || value.trim().length === 0;
};
