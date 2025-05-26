import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("getCharacter", () => {
  it("A", () => {
    const tokens: IToken[] = tokenize("'A';");
    strictEqual(tokens[0].val, "'A'");
    strictEqual(tokens[0].kind, ETokenKind.Character);
  });

  it("Escape character", () => {
    const tokens: IToken[] = tokenize("'\\n';");
    strictEqual(tokens[0].val, "'\\n'");
    strictEqual(tokens[0].kind, ETokenKind.Character);
  });

  it("Empty character", () => {
    const tokens: IToken[] = tokenize("'';");
    strictEqual(tokens[0].val, "Empty character literal");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("Unclosed character", () => {
    const tokens: IToken[] = tokenize("'f;");
    strictEqual(tokens[0].val, "Unclosed or multi-character literal");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });
});
