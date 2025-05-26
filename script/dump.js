import { argv } from "node:process";
import console from "node:console";
import { readFileSync } from "node:fs";

import { tokenize, dumpTokens, ETokenKind } from "../dist/index.mjs";

const filePath = argv[2];

if (!filePath) {
  console.log("Usage: node ./script/dump.js file.c");
  process.exit(1);
}

const src = readFileSync(filePath, { encoding: "utf8" });

const tokens = tokenize(src);

if (!tokens.some((token) => token.kind === ETokenKind.Error)) {
  dumpTokens(tokens);
}
