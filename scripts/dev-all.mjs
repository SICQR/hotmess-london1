#!/usr/bin/env node
import { spawn } from "node:child_process";

const isWin = process.platform === "win32";
const shell = true;

function run(cmd, args, name) {
  const p = spawn(cmd, args, { stdio: "inherit", shell });
  p.on("exit", (code) => {
    if (code && code !== 0) process.exit(code);
  });
  return p;
}

console.log("HOTMESS dev-all: starting beacon-backend (3001) + web (5173)");

// beacon backend
run("pnpm", ["-C", "beacon-backend", "dev"], "beacon-backend");
// web
run("pnpm", ["dev"], "web");
