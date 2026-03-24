import * as fs from 'fs';
import * as path from 'path';

/**
 * TestDataLoader — Generic typed JSON file loader.
 *
 * The same utility works for both SauceDemo and OrangeHRM — just point it
 * at a different JSON file. This is data-driven testing + reusability together.
 *
 * @example
 * // SauceDemo
 * const users = TestDataLoader.load<LoginUser>('apps/saucedemo/test-data/users.json');
 *
 * // OrangeHRM — exact same call, different data file
 * const users = TestDataLoader.load<LoginUser>('apps/orangehrm/test-data/users.json');
 */
export class TestDataLoader {
  /**
   * Load and parse a JSON file, returning it as a typed array.
   *
   * @param filepath - Relative path from the project root (process.cwd())
   * @returns Parsed array typed as T[]
   * @throws descriptive Error if file not found or JSON is invalid
   */
  static load<T>(filepath: string): T[] {
    const absolutePath = path.join(process.cwd(), filepath);

    if (!fs.existsSync(absolutePath)) {
      throw new Error(
        `[TestDataLoader] File not found: "${absolutePath}"\n` +
          `Make sure the path is relative to the project root.`
      );
    }

    let raw: string;
    try {
      raw = fs.readFileSync(absolutePath, 'utf-8');
    } catch (err) {
      throw new Error(
        `[TestDataLoader] Could not read file: "${absolutePath}"\n${err}`
      );
    }

    try {
      const parsed = JSON.parse(raw) as T[];
      if (!Array.isArray(parsed)) {
        throw new Error('JSON root must be an array');
      }
      return parsed;
    } catch (err) {
      throw new Error(
        `[TestDataLoader] Invalid JSON in file: "${absolutePath}"\n${err}`
      );
    }
  }
}
