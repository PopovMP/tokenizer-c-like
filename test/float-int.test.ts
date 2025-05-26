import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("004 get number", () => {
  it("zero", () => {
    const tokens: IToken[] = tokenize("0;");
    strictEqual(tokens[0].val, "0");
    strictEqual(tokens[0].kind, ETokenKind.IntNumber);
  });

  it("float", () => {
    const tokens: IToken[] = tokenize("3.14;");
    strictEqual(tokens[0].val, "3.14");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("dot float", () => {
    const tokens: IToken[] = tokenize(".14;");
    strictEqual(tokens[0].val, ".14");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("e float", () => {
    const tokens: IToken[] = tokenize("4.3e3;");
    strictEqual(tokens[0].val, "4.3e3");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("float with positive exponent", () => {
    const tokens: IToken[] = tokenize("1.2e+5;");
    strictEqual(tokens[0].val, "1.2e+5");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("float with negative exponent", () => {
    const tokens: IToken[] = tokenize("1.2e-5;");
    strictEqual(tokens[0].val, "1.2e-5");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("zero float", () => {
    const tokens: IToken[] = tokenize("0.0;");
    strictEqual(tokens[0].val, "0.0");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("Leading zero means an octal number", () => {
    const tokens: IToken[] = tokenize("03.22;");
    strictEqual(tokens[0].val, "Wrong number delimiter (.)");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("Too many 'e's in a number", () => {
    const tokens: IToken[] = tokenize("1.2e3e4;");
    strictEqual(tokens[0].val, "Too many 'e's in a number");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("Too many dots in a float", () => {
    const tokens: IToken[] = tokenize("1.2.3;");
    strictEqual(tokens[0].val, "Too many dots in a float");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("EOF after 'e' in a number", () => {
    const tokens: IToken[] = tokenize("42e");
    strictEqual(tokens[0].val, "EOF after 'e' in a number");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("No digits after 'e' in a number", () => {
    const tokens: IToken[] = tokenize("42e;");
    strictEqual(tokens[0].val, "No digits after 'e' in a number");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("unsigned int suffix", () => {
    const tokens: IToken[] = tokenize("42u;");
    strictEqual(tokens[0].val, "42u");
    strictEqual(tokens[0].kind, ETokenKind.IntNumber);
  });

  it("unsigned long suffix", () => {
    const tokens: IToken[] = tokenize("42ul;");
    strictEqual(tokens[0].val, "42ul");
    strictEqual(tokens[0].kind, ETokenKind.IntNumber);
  });

  it("float suffix", () => {
    const tokens: IToken[] = tokenize("3.14f;");
    strictEqual(tokens[0].val, "3.14f");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("double suffix (uppercase F)", () => {
    const tokens: IToken[] = tokenize("2.71F;");
    strictEqual(tokens[0].val, "2.71F");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("unsigned long long suffix", () => {
    const tokens: IToken[] = tokenize("42ull;");
    strictEqual(tokens[0].val, "42ull");
    strictEqual(tokens[0].kind, ETokenKind.IntNumber);
  });
});
