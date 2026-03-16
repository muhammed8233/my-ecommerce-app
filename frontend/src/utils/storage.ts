/**
 * Type-safe wrapper for localStorage
 */
export const storage = {
  // Get and parse data
  get: <T>(key: string): T | null => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading ${key} from storage:`, error);
      return null;
    }
  },

  // Stringify and save data
  set: (key: string, value: any): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  },

  // Remove specific key
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },

  // Clear everything
  clear: (): void => {
    localStorage.clear();
  }
};
