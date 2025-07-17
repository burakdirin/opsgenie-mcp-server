#!/usr/bin/env node
import { runCLI } from "./cli/index.js";

async function main() {
  await runCLI();
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});