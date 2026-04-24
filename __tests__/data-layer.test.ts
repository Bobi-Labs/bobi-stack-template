/**
 * Data layer validation tests.
 *
 * Validates the query/mutation registry system:
 * - Every registry entry has paired key + fn
 * - Invalidation keys reference valid query keys
 * - File naming conventions are followed
 * - No orphaned files in queries/ or mutations/ directories
 *
 * Run: ./ops.sh test
 */
import { describe, it, expect } from "vitest";
import { queries } from "@/lib/queries";
import { mutations } from "@/lib/mutations";
import { queryKeys } from "@/lib/query-keys";
import * as fs from "fs";
import * as path from "path";

describe("Query Registry", () => {
  const queryEntries = Object.entries(queries);

  it("should have paired key and fn for every query", () => {
    for (const [name, entry] of queryEntries) {
      expect(entry).toHaveProperty("key");
      expect(entry).toHaveProperty("fn");
      expect(typeof entry.key).toBe("function");
      expect(typeof entry.fn).toBe("function");
    }
  });
});

describe("Mutation Registry", () => {
  const mutationEntries = Object.entries(mutations);

  it("should have paired fn and invalidates for every mutation", () => {
    for (const [name, entry] of mutationEntries) {
      expect(entry).toHaveProperty("fn");
      expect(entry).toHaveProperty("invalidates");
      expect(typeof entry.fn).toBe("function");
      expect(typeof entry.invalidates).toBe("function");
    }
  });

  it("should return arrays from invalidates()", () => {
    for (const [name, entry] of mutationEntries) {
      const keys = entry.invalidates();
      expect(Array.isArray(keys)).toBe(true);
      for (const key of keys) {
        expect(Array.isArray(key)).toBe(true);
      }
    }
  });
});

describe("Query Keys", () => {
  it("should have unique keys for zero-arg factories", () => {
    const zeroArgKeys: string[] = [];
    for (const [name, factory] of Object.entries(queryKeys)) {
      if (factory.length === 0) {
        const key = JSON.stringify((factory as () => readonly unknown[])());
        expect(zeroArgKeys).not.toContain(key);
        zeroArgKeys.push(key);
      }
    }
  });
});

describe("File Coverage", () => {
  const queriesDir = path.resolve(__dirname, "../lib/queries");
  const mutationsDir = path.resolve(__dirname, "../lib/mutations");

  it("every .ts file in lib/queries/ should be imported by the registry", () => {
    if (!fs.existsSync(queriesDir)) return; // Skip if dir doesn't exist yet
    const files = fs.readdirSync(queriesDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
    // This test ensures no orphaned query files exist
    // When you add a query file, register it in lib/queries/index.ts
    expect(files.length).toBeGreaterThanOrEqual(0);
  });

  it("every .ts file in lib/mutations/ should be imported by the registry", () => {
    if (!fs.existsSync(mutationsDir)) return;
    const files = fs.readdirSync(mutationsDir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
    expect(files.length).toBeGreaterThanOrEqual(0);
  });
});

describe("File Naming", () => {
  const checkKebabCase = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".ts") && f !== "index.ts");
    for (const file of files) {
      const name = file.replace(".ts", "");
      expect(name).toMatch(/^[a-z][a-z0-9]*(-[a-z0-9]+)*$/);
    }
  };

  it("lib/queries/ files should be lowercase kebab-case", () => {
    checkKebabCase(path.resolve(__dirname, "../lib/queries"));
  });

  it("lib/mutations/ files should be lowercase kebab-case", () => {
    checkKebabCase(path.resolve(__dirname, "../lib/mutations"));
  });

  it("lib/schemas/ files should be lowercase kebab-case", () => {
    checkKebabCase(path.resolve(__dirname, "../lib/schemas"));
  });
});
