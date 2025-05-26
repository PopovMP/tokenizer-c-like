import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("002 getLineComment", () => {
  it("only comment", () => {
    const tokens: IToken[] = tokenize("// Foo");
    strictEqual(tokens[0].val, "// Foo");
    strictEqual(tokens[0].kind, ETokenKind.LineComment);
    strictEqual(tokens[0].row, 0);
    strictEqual(tokens[0].col, 0);
  });

  it("Two comments", () => {
    const tokens: IToken[] = tokenize("  \n    // Foo\r\n    // Bar\r\n");
    strictEqual(tokens[3].val, "// Foo");
    strictEqual(tokens[3].kind, ETokenKind.LineComment);
    strictEqual(tokens[6].val, "// Bar");
    strictEqual(tokens[6].kind, ETokenKind.LineComment);
  });
});
