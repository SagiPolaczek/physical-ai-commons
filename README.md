# Physical AI — Field Atlas

A community-facing, static research site. Evidence and popularity snapshot: September 28, 2026.

## Contents

- Six source-linked findings and a capability framework.
- 102 benchmark resources across 15 groups, including release milestones, selected-paper citations, repository stars, and comparison boundaries.
- 107 paper notes with 240 evaluation mappings and explicit reading status.
- Proposed deployment measures and source-audit limitations.

The assessment is analyst interpretation. Author-reported results are not independently replicated. The catalog is not exhaustive, and related editions are not independent benchmark distributions.

## Update

Run `python3 tools/export_research.py /path/to/research` against the research repository to refresh the scoped, public-facing data. Review the assessment and its snapshot dates separately before publishing. The export excludes full paper notes, local cache paths and unrelated repository content.

Serve `dist/` with any static HTTP server. There are no package dependencies, accounts, analytics or server-side data stores. Sites publication is configured in `.openai/hosting.json`.
