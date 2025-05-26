import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("006 getWord", () => {
  it("foo", () => {
    const tokens: IToken[] = tokenize("foo");
    strictEqual(tokens[0].val, "foo");
    strictEqual(tokens[0].kind, ETokenKind.Word);
  });

  it("foo _Bar _baz_orx", () => {
    const tokens: IToken[] = tokenize("foo _Bar _baz_orx");
    strictEqual(tokens[0].val, "foo");
    strictEqual(tokens[0].kind, ETokenKind.Word);
    strictEqual(tokens[2].val, "_Bar");
    strictEqual(tokens[2].kind, ETokenKind.Word);
    strictEqual(tokens[4].val, "_baz_orx");
    strictEqual(tokens[4].kind, ETokenKind.Word);
  });


  it("several variables", () => {
    const tokens: IToken[] = tokenize("foo = a + b;");
    strictEqual(tokens[0].val, "foo");
    strictEqual(tokens[0].kind, ETokenKind.Word);
    strictEqual(tokens[4].val, "a");
    strictEqual(tokens[4].kind, ETokenKind.Word);
    strictEqual(tokens[8].val, "b");
    strictEqual(tokens[8].kind, ETokenKind.Word);
  });
});
