import { ETokenKind } from "./types.ts";
import type { IToken } from "./types.ts";

export { ETokenKind } from "./types.ts";

export const keywords: string[] = [
  "auto", "break", "case", "char", "const", "continue", "default", "do", "double", "else",
  "enum", "extern", "float", "for", "goto", "if", "inline", "int", "long", "register",
  "restrict", "return", "short", "signed", "sizeof", "static", "struct", "switch", "typedef",
  "union", "unsigned", "void", "volatile", "while",
  "_Alignas", "_Alignof", "_Atomic", "_Bool", "_Complex", "_Imaginary", "_Generic",
  "_Noreturn", "_Static_assert", "_Thread_local",
];
export const preprocessors: string[] = [
  "#define", "#undef", "#include", "#ifdef", "#ifndef", "#if", "#else", "#elif", "#endif",
  "#error", "#pragma", "#line",
];
export const oneCharPuncts: string[] = "! % & * + - . / : < = > ? ( ) { } [ ] , ;".split(" ");
export const twoCharPuncts: string[] = "++ -- == <= >= != += -= *= /= %= && ||".split(" ");
export const numberDelims : string[] = [" ", "\t", "\r", "\n", "\f", "\v"];
export const whitespaces  : string[] = [" ", "\t", "\v", "\f"];

interface ITokenRes {
  i    : number, // Index past the found token
  token: IToken,
}

interface IPos {
  row: number,
  col: number,
}

export function tokenize(src: string): IToken[] {
  const tokens: IToken[] = [];
  const pos   : IPos     = { row: 0, col: 0 };

  let index = 0;
  while (index < src.length) {
    const res: ITokenRes =
      getEndOfLine       (src, index, pos) ||
      getWhitespace      (src, index, pos) ||
      getPreprocessor    (src, index, pos) ||
      getLineComment     (src, index, pos) ||
      getMultilineComment(src, index, pos) ||
      getCharacter       (src, index, pos) ||
      getString          (src, index, pos) ||
      getBinaryNumber    (src, index, pos) ||
      getHexNumber       (src, index, pos) ||
      getOctalNumber     (src, index, pos) ||
      getNumber          (src, index, pos) ||
      getPunctuator      (src, index, pos) ||
      getWord            (src, index, pos) ||
      getError(src, "Cannot parse token", index, pos);

    tokens.push(res.token);
    index = res.i;
  }

  const eof: IToken = { row: pos.row, col: pos.col, kind: ETokenKind.EOF, val: "" };
  tokens.push(eof);

  return tokens;
}

function getEndOfLine(src: string, i: number, pos: IPos): ITokenRes | null {
  if (src[i] !== "\r" && src[i] !== "\n") return null;

  const token: IToken = { row: pos.row, col: pos.col, kind: ETokenKind.EOL, val: "" };

  if (src[i] === "\r" && src[i+1] === "\n") {
    token.val = "\r\n";
    i += 2;
  } else if (src[i] === "\n"){
    token.val = src[i];
    i++;
  } else {
    return getError(src, "End of Line cannot be CR", i, pos);
  }

  pos.col = 0;
  pos.row++;

  return { i, token };
}

function getWhitespace(src: string, i: number, pos: IPos): ITokenRes | null {
  if (!whitespaces.includes(src[i])) return null;

  const token: IToken = { row: pos.row, col: pos.col, kind: ETokenKind.Whitespace, val: "" };

  while (i < src.length && whitespaces.includes(src[i])) {
    if (src[i] === "\r" || src[i] === "\n") break;

    token.val += src[i];
    pos.col++;
    i++;
  }

  return { i, token };
}

function getPreprocessor(src: string, i: number, pos: IPos): ITokenRes | null {
  const startIndex = i;
  if (src[i] !== "#") return null;
  i++;

  // Parse the directive name
  while (i < src.length && src[i].match(/[a-z]/)) {
    i++;
  }

  const word = src.substring(startIndex, i);

  if (!preprocessors.includes(word)) {
    return getError(src, "Unknown preprocessor directive", i, pos);
  }

  // Collect the rest of the directive, handling line continuations
  let directiveVal = word;
  while (i < src.length) {
    if (src[i] === "\\" && (src[i + 1] === "\n" || (src[i + 1] === "\r" && src[i + 2] === "\n"))) {
      // Line continuation found
      directiveVal += src[i];
      i++;
      if (src[i] === "\r" && src[i + 1] === "\n") {
        directiveVal += "\r\n";
        i += 2;
      } else if (src[i] === "\n") {
        directiveVal += "\n";
        i++;
      }
      pos.row++;
      pos.col = 0;
      continue;
    }
    // End of line (not continued)
    if (src[i] === "\n" || src[i] === "\r") {
      break;
    }
    directiveVal += src[i];
    pos.col++;
    i++;
  }

  const token: IToken = {
    row : pos.row,
    col : pos.col,
    kind: ETokenKind.Preprocessor,
    val : directiveVal,
  };

  pos.col += i - startIndex;

  return { i, token };
}

function getLineComment(src: string, i: number, pos: IPos): ITokenRes | null {
  if (src[i] !== "/" || src[i + 1] !== "/") return null;

  const token: IToken = { row: pos.row, col: pos.col, kind: ETokenKind.LineComment, val: "//" };
  pos.col += 2;
  i += 2;

  while (i < src.length) {
    if (src[i] === "\r" || src[i] === "\n") break;

    token.val += src[i];
    pos.col++;
    i++;
  }

  return { i, token };
}

function getCharacter(src: string, i: number, pos: IPos): ITokenRes | null {
  if (src[i] !== "'") return null;

  const token: IToken = { row: pos.row, col: pos.col, kind: ETokenKind.Character, val: "'" };
  pos.col++;
  i++;

  if (src[i] === "'") {
    return getError(src, "Empty character literal", i, pos);
  }

  // Handle escape sequences
  if (src[i] === "\\") {
    token.val += src[i];
    pos.col++;
    i++;
    if (i >= src.length) {
      return getError(src, "Unclosed character literal", i, pos);
    }
    // Accept any escape character (for simplicity, you can add stricter checks if needed)
    token.val += src[i];
    pos.col++;
    i++;
  } else {
    // Normal single character
    token.val += src[i];
    pos.col++;
    i++;
  }

  if (src[i] !== "'") {
    return getError(src, "Unclosed or multi-character literal", i, pos);
  }

  token.val += src[i];
  pos.col++;
  i++;

  return { i, token };
}

function getString(src: string, i: number, pos: IPos): ITokenRes | null {
  if (src[i] !== "\"") return null;

  const token: IToken = { row: pos.row, col: pos.col, kind: ETokenKind.String, val: "\"" };
  pos.col++;
  i++;

  while (i < src.length) {
    if (src[i] === "\\") {
      // Start of escape sequence
      token.val += src[i];
      pos.col++;
      i++;
      if (i >= src.length) {
        return getError(src, "Unclosed string literal", i, pos);
      }
      // Accept any escape character (for simplicity, you can add stricter checks if needed)
      token.val += src[i];
      pos.col++;
      i++;
      continue;
    }
    if (src[i] === "\"") {
      token.val += src[i];
      break;
    }
    if (src[i] === "\n" || src[i] === "\r") {
      return getError(src, "Unclosed string literal (newline)", i, pos);
    }
    token.val += src[i];
    pos.col++;
    i++;
  }

  if (src[i] !== "\"") {
    return getError(src, "Unclosed string literal", i, pos);
  }

  pos.col++;
  i++;
  return { i, token };
}

function getBinaryNumber(src: string, i: number, pos: IPos): ITokenRes | null {
  if (src[i] !== "0" || (src[i + 1] !== "b" && src[i + 1] !== "B")) return null;

  const token: IToken = {
    row: pos.row,
    col: pos.col,
    kind: ETokenKind.BinNumber,
    val: "0" + src[i + 1],
  };

  pos.col += 2;
  i += 2;

  while (i < src.length) {
    if (src[i] !== "0" && src[i] !== "1") break;

    token.val += src[i];
    pos.col++;
    i++;
  }

  if (!oneCharPuncts.includes(src[i]) && !numberDelims.includes(src[i]) || src[i] === ".") {
    return getError(src, `Wrong number delimiter (${src[i]})`, i+1, pos);
  }

  return { i, token };
}

function getOctalNumber(src: string, i: number, pos: IPos): ITokenRes | null {
  if (src[i] !== "0" || i > src.length - 2) return null;
  i++;
  if (!src[i].match(/[0-7]/)) return null;

  const token: IToken = {
    row : pos.row,
    col : pos.col,
    kind: ETokenKind.OctalNumber,
    val : "0",
  };
  pos.col++;

  while (i < src.length) {
    if (!src[i].match(/[0-7]/)) break;

    token.val += src[i];
    pos.col++;
    i++;
  }

  if (!oneCharPuncts.includes(src[i]) && !numberDelims.includes(src[i]) || src[i] === ".") {
    return getError(src, `Wrong number delimiter (${src[i]})`, i+1, pos);
  }

  return { i, token };
}

function getHexNumber(src: string, i: number, pos: IPos): ITokenRes | null {
  if (src[i] !== "0" || (src[i + 1] !== "x" && src[i + 1] !== "X")) return null;

  const token: IToken = {
    row : pos.row,
    col : pos.col,
    kind: ETokenKind.HexNumber,
    val : "0" + src[i+1],
  };

  pos.col += 2;
  i += 2;

  while (i < src.length) {
    if (!src[i].match(/[0-9a-fA-F]/)) break;

    token.val += src[i];
    pos.col++;
    i++;
  }

  if (!oneCharPuncts.includes(src[i]) && !numberDelims.includes(src[i]) || src[i] === ".") {
    return getError(src, `Wrong number delimiter (${src[i]})`, i+1, pos);
  }

  return { i, token };
}

function getMultilineComment(src: string, i: number, pos: IPos): ITokenRes | null {
  if (src[i] !== "/" || src[i + 1] !== "*") return null;

  const token: IToken = { row: pos.row, col: pos.col, kind: ETokenKind.MultilineComment, val: "/*" };
  pos.col += 2;
  i += 2;

  while (true) {
    if (src[i] === "*" && src[i + 1] === "/") {
      token.val += "*/";
      pos.col += 2;
      i += 2;
      break;
    }

    if (i >= src.length) {
      return getError(src, "Unclosed multiline comment", i, pos);
    }

    if (src[i] === "\n") {
      pos.row += 1;
      pos.col = -1;
    }

    token.val += src[i];
    pos.col++;
    i++;
  }

  return { i, token };
}

function getNumber(src: string, i: number, pos: IPos): ITokenRes | null {
  if (!( (src.charCodeAt(i) >= "0".charCodeAt(0) &&
          src.charCodeAt(i) <= "9".charCodeAt(0)) ||
         (src[i] === "." && src.charCodeAt(i + 1) >= "0".charCodeAt(0) &&
                            src.charCodeAt(i + 1) <= "9".charCodeAt(0)) )) {
    return null;
  }

  const startIndex = i;
  let hasDot = false;
  let hasE   = false;
  while (i < src.length) {
    if (src[i] === ".") {
      if (hasDot) {
        i++;
        return getError(src, "Too many dots in a float", i, pos);
      }
      hasDot = true;
    } else if (src[i] === "e" || src[i] === "E") {
      if (hasE) {
        i++;
        return getError(src, "Too many 'e's in a number", i, pos);
      }

      if (i === src.length - 1) {
        i++;
        return getError(src, "EOF after 'e' in a number", i, pos);
      }
      i++;

      // Allow 2e+3 and 2e-3
      if (src[i] === "+" || src[i] === "-") {
        i++;
      }

      if (src.charCodeAt(i) < "0".charCodeAt(0) || src.charCodeAt(i) > "9".charCodeAt(0)) {
        i++;
        return getError(src, "No digits after 'e' in a number", i, pos);
      }

      hasE = true;
    } else if (src.charCodeAt(i) < "0".charCodeAt(0) ||
               src.charCodeAt(i) > "9".charCodeAt(0)) {
      break;
    }

    i++;
  }

  // Parse number suffixes (u, U, l, L, ul, UL, f, F, etc.)
  const suffixStart = i;
  while (i < src.length) {
    const c = src[i];
    if (c === "u" || c === "U" || c === "l" || c === "L" || c === "f" || c === "F") {
      i++;
    } else {
      break;
    }
  }
  // Only allow valid suffix combinations (optional, for stricter C compliance)

  const len = i - startIndex;
  if (len > 1 && src[startIndex] === "0" &&
      src.charCodeAt(startIndex + 1) >= "0".charCodeAt(0) &&
      src.charCodeAt(startIndex + 1) <= "9".charCodeAt(0)) {
    return getError(src, "Leading zero", i, pos);
  }

  if (!oneCharPuncts.includes(src[i]) && !numberDelims.includes(src[i]) || src[i] === ".") {
    return getError(src, `Wrong number delimiter (${src[i]})`, i+1, pos);
  }

  const token: IToken = {
    row : pos.row,
    col : pos.col,
    kind: hasDot || hasE || src.substring(suffixStart, i).toLowerCase().includes("f")
      ? ETokenKind.FloatNumber
      : ETokenKind.IntNumber,
    val : src.substring(startIndex, i),
  };

  pos.col += i - startIndex;
  return { i, token };
}

function getPunctuator(src: string, i: number, pos: IPos): ITokenRes | null {
  let val = "";

  if (i < src.length - 1) {
    const ps = src[i] + src[i + 1];
    if (twoCharPuncts.includes(ps)) {
      val = ps;
    }
  }

  if (!val && oneCharPuncts.includes(src[i])) {
    val = src[i];
  }

  if (!val) return null;

  const token: IToken = {
    row : pos.row,
    col : pos.col,
    kind: ETokenKind.Punctuator,
    val : val,
  };

  const len = val.length;
  pos.col += len;

  return { i: i + len, token };
}

function getWord(src: string, i: number, pos: IPos): ITokenRes | null {
  const startIndex = i;
  if (!src[i].match(/\w/)) return null;

  while (i < src.length && src[i].match(/[\w\d]/)) {
    i++;
  }

  const word = src.substring(startIndex, i);
  const token: IToken = {
    row : pos.row,
    col : pos.col,
    kind: keywords.includes(word) ? ETokenKind.Keyword : ETokenKind.Word,
    val : word,
  };

  pos.col += i - startIndex;

  return { i, token };
}

function getError(src: string, msg: string, i: number, pos: IPos):  ITokenRes {
  let startIndex: number = i;
  let endIndex  : number = i;
  while (startIndex > 0 && src[startIndex] !== "\n") {
    startIndex--;
  }
  while (endIndex < src.length && src[endIndex] !== "\n") {
    endIndex++;
  }

  console.log();
  const position = Math.max(i - startIndex, 1);
  console.log(src.slice(startIndex, endIndex));
  console.log(" ".repeat(position - 1) + "^");
  if (position > 1) {
    console.log("-".repeat(position - 1) + "+");
  }
  console.log(`${msg}:${pos.row + 1}:${pos.col + 1}`);

  const token: IToken = { row : pos.row, col : pos.col, kind: ETokenKind.Error, val : msg };

  i++; // Skip the error index
  while (i < src.length && !oneCharPuncts.includes(src[i]) && !numberDelims.includes(src[i])) {
    i++;
    pos.col++;
  }

  return { i, token };
}

export function dumpTokens(tokens: IToken[]): void {
  for (const token of tokens) {
    const rowNumTxt = ((token.row + 1).toString() + ",").padEnd(6, " ");
    const colNumTxt = (token.col + 1).toString().padEnd(3, " ");
    const tokenName = ETokenKind[token.kind].padEnd(16, " ");
    const tokenVal  =  token.val.replaceAll("\r", "CR").replaceAll("\n", "CN");
    console.log(`[${rowNumTxt}${colNumTxt}] ${tokenName}: ${tokenVal}`);
  }
}
