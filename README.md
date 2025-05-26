# Tokenizer for C-like language

**tokenizer-c-like** gets a source code as a string and produces an array of tokens.

## Usage:

```ts
import { tokenize, dumpTokens, ETokenKind } from "tokenizer-c-like";

// Tokenize
const tokens = tokenize(sourceCode);

// Check for  error
if (tokens.some((token) => token.kind === ETokenKind.Error)) {
  return;
}

// Dump tokens:
dumpTokens(tokens);
```

## Token types:

  `BinNumber`, `Character`, `EOF`, `EOL`, `Error`, `FloatNumber`, `HexNumber`, `IntNumber`, `Keyword`, `LineComment`, `MultilineComment`, `OctalNumber`, `Preprocessor`, `Punctuator`, `String`, `Whitespace`, `Word`

## Token interface:

```ts
export interface IToken {
	row : number;
	col : number;
	kind: ETokenKind;
	val : string;
}
```

## Error reporting

**tokenizer-c-like** does not stop when encountering an error. It produces an Error token instead.

When parsing  `for (int i = 0; i @ 3; i++) {`, it will produce an error token for the `@` character.

```text
    for (int i = 0; i @ 3; i++) {
                      ^
----------------------+
Cannot parse token:1:23
```

## Dump tokens:

Source code:
```c
    for (int i = 0; i < 3; i++) {
        /* ... */
    }
```

Example:
```ts
// Tokenize
const tokens = tokenize(sourceCode);

// Dump tokens:
dumpTokens(tokens);
```

Output:
```text
[1,    1  ] Whitespace      :
[1,    5  ] Keyword         : for
[1,    8  ] Whitespace      :
[1,    9  ] Punctuator      : (
[1,    10 ] Keyword         : int
[1,    13 ] Whitespace      :
[1,    14 ] Word            : i
[1,    15 ] Whitespace      :
[1,    16 ] Punctuator      : =
[1,    17 ] Whitespace      :
[1,    18 ] IntNumber       : 0
[1,    19 ] Punctuator      : ;
[1,    20 ] Whitespace      :
[1,    21 ] Word            : i
[1,    22 ] Whitespace      :
[1,    23 ] Punctuator      : <
[1,    24 ] Whitespace      :
[1,    25 ] IntNumber       : 3
[1,    26 ] Punctuator      : ;
[1,    27 ] Whitespace      :
[1,    28 ] Word            : i
[1,    29 ] Punctuator      : ++
[1,    31 ] Punctuator      : )
[1,    32 ] Whitespace      :
[1,    33 ] Punctuator      : {
[1,    34 ] EOL             : CN
[2,    1  ] Whitespace      :
[2,    9  ] MultilineComment: /* ... */
[2,    18 ] EOL             : CN
[3,    1  ] Whitespace      :
[3,    5  ] Punctuator      : }
[3,    6  ] EOL             : CN
[4,    1  ] EOF             :
```
