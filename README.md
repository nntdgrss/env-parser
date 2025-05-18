# 📦 env-parser

[![npm version](https://badge.fury.io/js/env-parser.svg)](https://www.npmjs.com/package/@nntdgrss/env-parser)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)

Простая и надежная библиотека для парсинга переменных окружения в Node.js с поддержкой различных типов и значений по умолчанию. Помогает избежать ошибок `TypeError: Cannot read properties of undefined` при работе с `process.env`.

## ✨ Особенности

- Парсинг строковых, целочисленных, булевых и JSON значений.
- Поддержка значений по умолчанию для всех типов.
- Выброс информативной ошибки, если переменная отсутствует и не предоставлено значение по умолчанию.
- Написано на TypeScript с готовыми определениями типов.

## 📦 Установка

Установите пакет с помощью npm или yarn:

```bash
npm install env-parser
# или
yarn add env-parser
# или
bun add env-parser
```

## 🚀 Использование

Важно: Эта библиотека не загружает переменные окружения из файла .env автоматически. Если вы используете файл .env, вам нужно самостоятельно загрузить его в начале вашего приложения, например, с помощью библиотеки dotenv:

```javascript
// В самом начале вашего главного файла приложения (например, index.js или app.ts)
import dotenv from "dotenv";
dotenv.config();

// Далее используйте env-parser
import {
  parseStringFromEnv,
  parseIntFromEnv,
  parseBooleanFromEnv,
  parseJsonFromEnv,
} from "env-parser";

// ... ваш код ...
```

Теперь вы можете использовать функции парсинга:

### Парсинг строк (`parseStringFromEnv`)

```javascript
import { parseStringFromEnv } from "env-parser";

// Получение переменной (кинет ошибку, если SECRET_KEY не задана)
const secretKey = parseStringFromEnv("SECRET_KEY");
console.log("Secret Key:", secretKey);

// Получение переменной со значением по умолчанию
const apiEndpoint = parseStringFromEnv(
  "API_ENDPOINT",
  "http://localhost:3000/api"
);
console.log("API Endpoint:", apiEndpoint); // Вернет значение переменной или дефолтное

// Пример ошибки (предполагая, что NON_EXISTENT_VAR не задана)
try {
  const requiredVar = parseStringFromEnv("NON_EXISTENT_VAR");
  console.log(requiredVar);
} catch (error) {
  console.error("Ошибка при получении переменной:", error.message); // Выведет "Missing environment variable: NON_EXISTENT_VAR"
}
```

### Парсинг целых чисел (`parseIntFromEnv`)

```javascript
import { parseIntFromEnv } from "env-parser";

// .env файл или окружение: PORT=8080

const port = parseIntFromEnv("PORT");
console.log("Port:", port); // 8080 (число)

// Со значением по умолчанию
const timeout = parseIntFromEnv("REQUEST_TIMEOUT_MS", 5000);
console.log("Timeout:", timeout); // Вернет значение переменной или 5000

// Обработка нечислового значения (предполагая, что INVALID_NUMBER="abc")
// В зависимости от реализации (с варнингом и дефолтом или ошибкой)
try {
  const invalidNumber = parseIntFromEnv("INVALID_NUMBER", 100); // Если INVALID_NUMBER="abc"
  console.log("Invalid Number (with default):", invalidNumber); // Выведет 100 и предупреждение
} catch (error) {
  console.error("Ошибка при парсинге числа:", error.message); // Или кинет ошибку, если дефолт не предоставлен
}
```

### Парсинг булевых значений (`parseBooleanFromEnv`)

```javascript
import { parseBooleanFromEnv } from "env-parser";

// .env файл или окружение: FEATURE_ENABLED=true, DEBUG=0, CACHE_DISABLED=""

const featureEnabled = parseBooleanFromEnv("FEATURE_ENABLED");
console.log("Feature Enabled:", featureEnabled); // true

const debugMode = parseBooleanFromEnv("DEBUG");
console.log("Debug Mode:", debugMode); // false

const cacheDisabled = parseBooleanFromEnv("CACHE_DISABLED");
console.log("Cache Disabled:", cacheDisabled); // false (пустая строка парсится как false)

// Со значением по умолчанию
const useHttps = parseBooleanFromEnv("USE_HTTPS", true);
console.log("Use HTTPS:", useHttps); // Вернет значение переменной или true

// Различные "правдивые" и "ложные" значения (регистронезависимо)
// "true", "1", "yes", "on" -> true
// "false", "0", "no", "off", "" -> false
```

### Парсинг JSON (`parseJsonFromEnv`)

```javascript
import { parseJsonFromEnv } from "env-parser";

// .env файл или окружение: USER_CONFIG='{"name": "Alice", "settings": {"theme": "dark"}}'

// Парсинг JSON строки (можно указать тип с помощью дженерика)
interface UserConfig {
  name: string;
  settings: { theme: string };
}

const userConfig = parseJsonFromEnv < UserConfig > "USER_CONFIG";
console.log("User Config:", userConfig.name); // Alice
console.log("User Config Settings:", userConfig.settings.theme); // dark

// Со значением по умолчанию
const appConfig = parseJsonFromEnv("APP_CONFIG", { retries: 3, timeout: 1000 });
console.log("App Config:", appConfig.retries); // Вернет значение переменной или 3

// Обработка некорректного JSON (предполагая INVALID_JSON='not-json')
try {
  const invalidJson = parseJsonFromEnv("INVALID_JSON", { default: true }); // Если INVALID_JSON='not-json'
  console.log("Invalid JSON (with default):", invalidJson); // Выведет { default: true } и предупреждение
} catch (error) {
  console.error("Ошибка при парсинге JSON:", error.message); // Или кинет ошибку, если дефолт не предоставлен
}
```

## ⚠️ Загрузка переменных окружения

Как упоминалось выше, `env-parser` не занимается загрузкой переменных из `.env` файла. Наиболее распространенный способ сделать это — использовать пакет [dotenv](https://www.npmjs.com/package/dotenv). Установите его (`npm install dotenv`) и вызовите `require('dotenv').config()` или `import 'dotenv/config'` (для ES Modules) в самом начале вашего приложения.

## 📄 Лицензия

Этот проект распространяется под лицензией ISC. Подробности смотрите в файле LICENSE.
