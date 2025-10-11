type IdToNameMap = Record<string, string>;

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

export function storeIdToName(id: string, name: string): boolean {
  try {
    // Get existing map or create new one
    const existingMap = getIdToNameMap();
    
    // Add/update the id-name pair
    existingMap[id] = name;
    
    // Save back to localStorage
    localStorage.setItem("idToNameMap", JSON.stringify(existingMap));
    return true;
  } catch (error) {
    console.error('Error storing id-to-name mapping:', error);
    return false;
  }
}

/**
 * Get the complete id-to-name mapping object
 * @returns The id-to-name mapping object
 */
export function getIdToNameMap(): IdToNameMap {
  try {
    const item = localStorage.getItem("idToNameMap");
    if (item === null) {
      return {};
    }
    return JSON.parse(item) as IdToNameMap;
  } catch (error) {
    console.error('Error reading id-to-name mapping:', error);
    return {};
  }
}

/**
 * Get a name by id
 * @param id - The unique identifier
 * @returns The name or null if not found
 */
export function getNameById(id: string): string | null {
  const map = getIdToNameMap();
  return map[id] ?? null;
}