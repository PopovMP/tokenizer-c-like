import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("string", () => {
  it("\"foo\"", () => {
    const tokens: IToken[] = tokenize("\"foo\";");
    strictEqual(tokens[0].val, "\"foo\"");
    strictEqual(tokens[0].kind, ETokenKind.String);
  });

  it("Unclosed string", () => {
    const tokens: IToken[] = tokenize("\"foo");
    strictEqual(tokens[0].val, "Unclosed string literal");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("Escaped quote", () => {
    const tokens: IToken[] = tokenize("\"foo\\\"bar\";");
    strictEqual(tokens[0].val, "\"foo\\\"bar\"");
    strictEqual(tokens[0].kind, ETokenKind.String);
  });

  it("Escaped backslash", () => {
    const tokens: IToken[] = tokenize("\"foo\\\\bar\";");
    strictEqual(tokens[0].val, "\"foo\\\\bar\"");
    strictEqual(tokens[0].kind, ETokenKind.String);
  });

  it("Escaped newline (should error)", () => {
    const tokens: IToken[] = tokenize("\"foo\nbar\";");
    strictEqual(tokens[0].val, "Unclosed string literal (newline)");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("Hex escape", () => {
    const tokens: IToken[] = tokenize("\"foo\\x41bar\";");
    strictEqual(tokens[0].val, "\"foo\\x41bar\"");
    strictEqual(tokens[0].kind, ETokenKind.String);
  });

  it("Octal escape", () => {
    const tokens: IToken[] = tokenize("\"foo\\101bar\";");
    strictEqual(tokens[0].val, "\"foo\\101bar\"");
    strictEqual(tokens[0].kind, ETokenKind.String);
  });
});