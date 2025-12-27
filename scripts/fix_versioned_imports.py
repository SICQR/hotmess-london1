#!/usr/bin/env python3
"""Fix version-pinned import specifiers like "pkg@1.2.3".

This repo contains some UI components with import paths that include exact
package versions (likely copied from an online sandbox). Node/Vite/TS module
resolution does not support that syntax.

This script rewrites:
- from "pkg@1.2.3"  -> from "pkg"
- from '@scope/pkg@1.2.3' -> from '@scope/pkg'
- import("pkg@1.2.3") -> import("pkg")

It only edits files under apps/main/src/components/ui by default.
"""

from __future__ import annotations

import re
from pathlib import Path


FROM_RE = re.compile(r"(from\s+[\"'])([^\"']+?)@[0-9][^\"']*([\"'])")
DYN_IMPORT_RE = re.compile(r"(import\(\s*[\"'])([^\"']+?)@[0-9][^\"']*([\"']\s*\))")


def rewrite_text(text: str) -> str:
    text = FROM_RE.sub(r"\1\2\3", text)
    text = DYN_IMPORT_RE.sub(r"\1\2\3", text)
    return text


def main() -> int:
    root = Path("apps/main/src/components/ui")
    if not root.exists():
        raise SystemExit(f"Missing expected directory: {root}")

    changed_files = 0
    for path in root.rglob("*"):
        if path.suffix not in {".ts", ".tsx"}:
            continue

        original = path.read_text(encoding="utf-8")
        updated = rewrite_text(original)
        if updated != original:
            path.write_text(updated, encoding="utf-8")
            changed_files += 1

    print(f"Updated {changed_files} files under {root}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
