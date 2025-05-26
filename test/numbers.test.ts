import { describe, it } from "node:test";
import { strictEqual } from "node:assert";

import { tokenize } from "../src/tokenizer.ts";
import type { IToken } from "../src/types.ts";
import { ETokenKind } from "../src/types.ts";

describe("numbers", () => {
  it("integer", () => {
    const tokens: IToken[] = tokenize("42 ");
    strictEqual(tokens[0].val, "42");
    strictEqual(tokens[0].kind, ETokenKind.IntNumber);
  });

  it("Int bad delimiter", () => {
    const tokens: IToken[] = tokenize("42foo");
    strictEqual(tokens[0].val, "Wrong number delimiter (o)");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("float", () => {
    const tokens: IToken[] = tokenize("3.14;");
    strictEqual(tokens[0].val, "3.14");
    strictEqual(tokens[0].kind, ETokenKind.FloatNumber);
  });

  it("Float bad delimiter", () => {
    const tokens: IToken[] = tokenize("3.14foo");
    strictEqual(tokens[0].val, "Wrong number delimiter (o)");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("bin 0b101", () => {
    const tokens: IToken[] = tokenize("0b101;");
    strictEqual(tokens[0].val, "0b101");
    strictEqual(tokens[0].kind, ETokenKind.BinNumber);
  });

  it("bin 0B101", () => {
    const tokens: IToken[] = tokenize("0B101;");
    strictEqual(tokens[0].val, "0B101");
    strictEqual(tokens[0].kind, ETokenKind.BinNumber);
  });

  it("Bin bad delimiter", () => {
    const tokens: IToken[] = tokenize("0B01012");
    strictEqual(tokens[0].val, "Wrong number delimiter (2)");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("Octal", () => {
    const tokens: IToken[] = tokenize("01234567;");
    strictEqual(tokens[0].val, "01234567");
    strictEqual(tokens[0].kind, ETokenKind.OctalNumber);
  });

  it("Octal bad delimiter", () => {
    const tokens: IToken[] = tokenize("0123FF");
    strictEqual(tokens[0].val, "Wrong number delimiter (F)");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });

  it("hex 0x", () => {
    const tokens: IToken[] = tokenize("0x1a2B3C;");
    strictEqual(tokens[0].val, "0x1a2B3C");
    strictEqual(tokens[0].kind, ETokenKind.HexNumber);
  });

  it("hex 0X", () => {
    const tokens: IToken[] = tokenize("0X1a2B3C;");
    strictEqual(tokens[0].val, "0X1a2B3C");
    strictEqual(tokens[0].kind, ETokenKind.HexNumber);
  });

  it("Hex bad delimiter", () => {
    const tokens: IToken[] = tokenize("0xABCD.42");
    strictEqual(tokens[0].val, "Wrong number delimiter (.)");
    strictEqual(tokens[0].kind, ETokenKind.Error);
  });
});
