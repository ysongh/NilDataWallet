/**
 * Store data in localStorage
 * @param key - The key to store the data under
 * @param value - The data to store (will be JSON.stringify'd)
 * @returns boolean - true if successful, false if failed
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
  try {
    const serializedValue = JSON.stringify(value);
    localStorage.setItem(key, serializedValue);
    return true;
  } catch (error) {
    console.error('Error storing data in localStorage:', error);
    return false;
  }
}

/**
 * Read data from localStorage
 * @param key - The key to retrieve data from
 * @returns The parsed data or null if not found or error occurred
 */
export function getLocalStorage<T>(key: string): T | null {
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    }
    return JSON.parse(item) as T;
  } catch (error) {
    console.error('Error reading data from localStorage:', error);
    return null;
  }
}