import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("007 getKeywords", () => {
  it("for (int i = 0; i < 5; i++)", () => {
    const tokens: IToken[] = tokenize("for (int i = 0; i < 5; i++)");
    strictEqual(tokens[0].val, "for");
    strictEqual(tokens[0].kind, ETokenKind.Keyword);
    strictEqual(tokens[3].val, "int");
    strictEqual(tokens[3].kind, ETokenKind.Keyword);
  });
});
