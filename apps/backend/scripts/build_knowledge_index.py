#!/usr/bin/env python3
"""One-time build of the local FAISS knowledge index from grounding/irdai/.

Usage:
    OPENAI_API_KEY=... python scripts/build_knowledge_index.py

Re-run whenever a grounding source or the manifest changes.
"""

import os
import sys


def main() -> None:
    if not os.environ.get("OPENAI_API_KEY"):
        sys.exit("Set OPENAI_API_KEY to build embeddings.")

    from openai import OpenAI

    from aayu.grounding import INDEX_DIR, build_index

    build_index(OpenAI())
    print(f"Index written to {INDEX_DIR}")


if __name__ == "__main__":
    main()
