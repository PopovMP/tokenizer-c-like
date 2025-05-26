import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("getPreprocessor", () => {
  it("#define", () => {
    const tokens: IToken[] = tokenize("#define");
    strictEqual(tokens[0].val, "#define");
    strictEqual(tokens[0].kind, ETokenKind.Preprocessor);
  });


  it("Unknown preprocessor directive", () => {
    const tokens: IToken[] = tokenize("#Foo;");
    strictEqual(tokens[0].val, "Unknown preprocessor directive");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("Preprocessor line continuation LF", () => {
    const tokens: IToken[] = tokenize("#define \\\nFOO 1");
    strictEqual(tokens[0].val, "#define \\\nFOO 1");
    strictEqual(tokens[0].kind, ETokenKind.Preprocessor);
  });

  it("Preprocessor line continuation CRLF", () => {
    const tokens: IToken[] = tokenize("#define \\\r\nFOO 1");
    strictEqual(tokens[0].val, "#define \\\r\nFOO 1");
    strictEqual(tokens[0].kind, ETokenKind.Preprocessor);
  });
});
