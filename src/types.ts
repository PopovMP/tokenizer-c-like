export enum ETokenKind {
  BinNumber,
  Character,
  EOF,
  EOL,
  Error,
  FloatNumber,
  HexNumber,
  IntNumber,
  Keyword,
  LineComment,
  MultilineComment,
  OctalNumber,
  Preprocessor,
  Punctuator,
  String,
  Whitespace,
  Word,
}

export interface IToken {
  row : number,
  col : number,
  kind: ETokenKind,
  val : string,
}
