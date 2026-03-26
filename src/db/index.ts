import { createDatabase } from "@kilocode/app-builder-db";
import type * as schema from "./schema";

// Lazy database initialization to avoid build-time connection errors
let _db: ReturnType<typeof createDatabase<typeof schema>> | null = null;

export function getDb() {
  if (!_db) {
    const schemaModule = require("./schema");
    _db = createDatabase(schemaModule);
  }
  return _db;
}

// Proxy that lazily initializes on first property access
export const db = new Proxy({} as ReturnType<typeof createDatabase<typeof schema>>, {
  get(_target, prop) {
    const instance = getDb();
    return (instance as unknown as Record<string, unknown>)[prop as string];
  },
});
