import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("getEndOfLine", () => {
  it("CN", () => {
    const tokens: IToken[] = tokenize("\n");
    strictEqual(tokens[0].val, "\n");
    strictEqual(tokens[0].kind, ETokenKind.EOL);
  });

  it("CR CN", () => {
    const tokens: IToken[] = tokenize("\r\n");
    strictEqual(tokens[0].val, "\r\n");
    strictEqual(tokens[0].kind, ETokenKind.EOL);
  });

  it("Multi EOL", () => {
    const tokens: IToken[] = tokenize("\r\n \n \r\n");
    strictEqual(tokens[0].val, "\r\n");
    strictEqual(tokens[0].kind, ETokenKind.EOL);
    strictEqual(tokens[2].val, "\n");
    strictEqual(tokens[2].kind, ETokenKind.EOL);
    strictEqual(tokens[4].val, "\r\n");
    strictEqual(tokens[4].kind, ETokenKind.EOL);
  });

  it("End of Line cannot be CR", () => {
    const tokens: IToken[] = tokenize("foo \r bar;");
    strictEqual(tokens[2].val, "End of Line cannot be CR");
    strictEqual(tokens[2].kind, ETokenKind.Error);
  });
});
