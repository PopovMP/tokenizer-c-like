import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("getWhitespace", () => {
  it("tokenize one space", () => {
    const tokens: IToken[] = tokenize(" ");
    strictEqual(tokens[0].val, " ");
    strictEqual(tokens[0].kind, ETokenKind.Whitespace);
    strictEqual(tokens[0].row, 0);
    strictEqual(tokens[0].col, 0);
  });

  it("tokenize many space", () => {
    const tokens: IToken[] = tokenize("   ");
    strictEqual(tokens[0].val, "   ");
    strictEqual(tokens[0].kind, ETokenKind.Whitespace);
    strictEqual(tokens[0].row, 0);
    strictEqual(tokens[0].col, 0);
  });

  it("tokenize mixed space and tabs", () => {
    const tokens: IToken[] = tokenize(" \t\t \t  ");
    strictEqual(tokens[0].val, " \t\t \t  ");
    strictEqual(tokens[0].kind, ETokenKind.Whitespace);
    strictEqual(tokens[0].row, 0);
    strictEqual(tokens[0].col, 0);
  });
});
