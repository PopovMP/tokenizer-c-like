import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("getPunctuator", () => {
  it("one character", () => {
    const tokens: IToken[] = tokenize("()");
    strictEqual(tokens[0].val, "(");
    strictEqual(tokens[0].kind, ETokenKind.Punctuator);
    strictEqual(tokens[1].val, ")");
    strictEqual(tokens[1].kind, ETokenKind.Punctuator);
  });

  it("two characters", () => {
    const tokens: IToken[] = tokenize("(2 != 3)");
    strictEqual(tokens[0].val, "(");
    strictEqual(tokens[0].kind, ETokenKind.Punctuator);
    strictEqual(tokens[3].val, "!=");
    strictEqual(tokens[3].kind, ETokenKind.Punctuator);
    strictEqual(tokens[6].val, ")");
    strictEqual(tokens[6].kind, ETokenKind.Punctuator);
  });
});
