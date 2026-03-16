/**
 * Formats a number into a USD currency string.
 * Example: 1250.5 => $1,250.50
 */
export const formatCurrency = (amount: number | undefined | null): string => {
  if (amount === undefined || amount === null) {
    return '$0.00';
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

/**
 * Alternative: Compact format for small UI elements (like dashboard cards)
 * Example: 1500 => $1.5K
 */
export const formatCompactNumber = (number: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(number);
};
