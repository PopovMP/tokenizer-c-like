import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("getEndOfFile", () => {
  it("EOF", () => {
    const tokens: IToken[] = tokenize("");
    strictEqual(tokens[0].val, "");
    strictEqual(tokens[0].kind, ETokenKind.EOF);
  });

  it("CN EOF", () => {
    const tokens: IToken[] = tokenize("\n");
    strictEqual(tokens[1].val, "");
    strictEqual(tokens[1].kind, ETokenKind.EOF);
  });
});
