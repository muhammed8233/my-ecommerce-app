/**
 * Formats a Spring Boot ISO date string into a readable format.
 * Example: "2023-10-27T10:30:00Z" -> "Oct 27, 2023"
 */
export const formatDate = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

/**
 * Detailed format including time for logs and receipts.
 * Example: "Oct 27, 2023, 10:30 AM"
 */
export const formatDateTime = (dateString: string | undefined | null): string => {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
};
