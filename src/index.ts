/**
 * Парсит строковое значение из переменной окружения.
 * Кидает ошибку, если переменная отсутствует и не предоставлено значение по умолчанию.
 * @param key Ключ переменной окружения.
 * @param defaultValue Значение по умолчанию (опционально).
 * @returns Значение переменной окружения или значение по умолчанию.
 * @throws Error если переменная отсутствует и нет значения по умолчанию.
 */
export function parseStringFromEnv(
  key: string,
  defaultValue?: string // Значение по умолчанию опционально
): string {
  const value = process.env[key];

  // Если переменная существует и не undefined, возвращаем ее.
  // Пустая строка считается валидным значением, если она присутствует.
  if (value !== undefined) {
    return value;
  }

  // Если переменная не существует, но есть значение по умолчанию, возвращаем его.
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  // Если переменная отсутствует и нет значения по умолчанию, кидаем ошибку.
  throw new Error(`Missing environment variable: ${key}`);
}

/**
 * Парсит целочисленное значение из переменной окружения.
 * Кидает ошибку, если переменная отсутствует или значение не является корректным числом
 * и не предоставлено значение по умолчанию.
 * @param key Ключ переменной окружения.
 * @param defaultValue Значение по умолчанию (опционально).
 * @returns Целочисленное значение переменной окружения или значение по умолчанию.
 * @throws Error если переменная отсутствует или значение некорректно и нет значения по умолчанию.
 */
export function parseIntFromEnv(
  key: string,
  defaultValue?: number // Значение по умолчанию опционально
): number {
  const value = process.env[key];

  // Если переменная существует (не undefined и не пустая строка)
  if (value !== undefined && value !== "") {
    const parsedValue = parseInt(value, 10); // Всегда указываем основание 10

    // Если парсинг успешен (не вернул NaN)
    if (!isNaN(parsedValue)) {
      return parsedValue;
    }

    // Если парсинг не удался, но есть дефолтное значение, используем его.
    if (defaultValue !== undefined) {
      console.warn(
        `Invalid integer value for environment variable ${key}: "${value}". Using default value.`
      );
      return defaultValue;
    }

    // Если парсинг не удался и нет дефолта, кидаем ошибку.
    throw new Error(
      `Invalid integer value for environment variable ${key}: "${value}" and no default value provided.`
    );
  }

  // Если переменная отсутствует или пустая, но есть дефолтное значение, используем его.
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  // Если переменная отсутствует/пустая и нет дефолта, кидаем ошибку.
  throw new Error(`Missing environment variable: ${key}`);
}

/**
 * Парсит булево значение из переменной окружения.
 * Считает "true", "1", "yes", "on" (регистронезависимо) как true.
 * Считает "false", "0", "no", "off", "" (регистронезависимо) как false.
 * Кидает ошибку, если переменная отсутствует и не предоставлено значение по умолчанию.
 * @param key Ключ переменной окружения.
 * @param defaultValue Значение по умолчанию (опционально).
 * @returns Булево значение переменной окружения или значение по умолчанию.
 * @throws Error если переменная отсутствует и нет значения по умолчанию.
 */
export function parseBooleanFromEnv(
  key: string,
  defaultValue?: boolean // Значение по умолчанию опционально
): boolean {
  const value = process.env[key]?.toLowerCase(); // Приводим к нижнему регистру

  // Если переменная существует и не undefined
  if (value !== undefined) {
    // Парсим "правдивые" значения
    if (["true", "1", "yes", "on"].includes(value)) {
      return true;
    }
    // Парсим "ложные" значения (включая пустую строку)
    if (["false", "0", "no", "off", ""].includes(value)) {
      return false;
    }

    // Если значение есть, но оно не парсится как boolean, и есть дефолт, используем его.
    if (defaultValue !== undefined) {
      console.warn(
        `Invalid boolean value for environment variable ${key}: "${process.env[key]}". Using default value.`
      );
      return defaultValue;
    }

    // Если значение есть, но оно не парсится как boolean, и нет дефолта, кидаем ошибку.
    throw new Error(
      `Invalid boolean value for environment variable ${key}: "${process.env[key]}" and no default value provided.`
    );
  }

  // Если переменная отсутствует, но есть дефолтное значение, используем его.
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  // Если переменная отсутствует и нет дефолта, кидаем ошибку.
  throw new Error(`Missing environment variable: ${key}`);
}

/**
 * Парсит JSON строку из переменной окружения в объект.
 * Кидает ошибку, если переменная отсутствует, значение не является корректным JSON
 * и не предоставлено значение по умолчанию.
 * @param key Ключ переменной окружения.
 * @param defaultValue Значение по умолчанию (опционально).
 * @returns Объект, полученный из JSON строки, или значение по умолчанию.
 * @throws Error если переменная отсутствует, значение некорректно и нет значения по умолчанию.
 */
export function parseJsonFromEnv<T = any>( // Используем дженерик для типизации возвращаемого объекта
  key: string,
  defaultValue?: T // Значение по умолчанию опционально, может быть любого типа
): T {
  const value = process.env[key];

  // Если переменная существует и не undefined
  if (value !== undefined) {
    try {
      // Пытаемся распарсить JSON
      return JSON.parse(value) as T; // Приводим к типу T
    } catch (error: any) {
      // Если парсинг не удался, но есть дефолтное значение, используем его.
      if (defaultValue !== undefined) {
        console.warn(
          `Invalid JSON value for environment variable ${key}: "${value}". Using default value. Error: ${error.message}`
        );
        return defaultValue;
      }

      // Если парсинг не удался и нет дефолта, кидаем ошибку.
      throw new Error(
        `Invalid JSON value for environment variable ${key}: "${value}" and no default value provided. Error: ${error.message}`
      );
    }
  }

  // Если переменная отсутствует, но есть дефолтное значение, используем его.
  if (defaultValue !== undefined) {
    return defaultValue;
  }

  // Если переменная отсутствует и нет дефолта, кидаем ошибку.
  throw new Error(`Missing environment variable: ${key}`);
}
