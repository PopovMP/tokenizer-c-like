import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("003 getMultilineComment", () => {
  it("Single-line multiline comment", () => {
    const tokens: IToken[] = tokenize("/* foo */");
    strictEqual(tokens[0].val, "/* foo */");
    strictEqual(tokens[0].kind, ETokenKind.MultilineComment);
    strictEqual(tokens[0].row, 0);
    strictEqual(tokens[0].col, 0);
  });

  it("Multiline comments", () => {
    const tokens: IToken[] = tokenize("  \n    /* Foo\r\n    // Bar */ \r\n");
    strictEqual(tokens[3].val, "/* Foo\r\n    // Bar */");
    strictEqual(tokens[3].kind, ETokenKind.MultilineComment);
  });
});
