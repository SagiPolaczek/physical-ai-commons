# Physical AI Benchmarks

A public, table-only catalog of 102 benchmark resources across 15 capability groups. Snapshot: September 28, 2026.

Click column headings to sort by name, capability, embodiment, release milestone, selected-paper citations or repository stars. Repeated clicks reverse the order. Missing values sort last in either direction. Search, capability and embodiment filters combine with sorting. Row details retain source links, evaluation boundaries and popularity context.

Run `python3 tools/export_research.py /path/to/research` to refresh the scoped public dataset. Review snapshot dates before publishing. The existing dataset also retains the source paper-to-benchmark mappings for future maintenance; the interface displays only the benchmark table.

Serve `dist/` with a static HTTP server. No dependencies, accounts or analytics. Sites publication is configured in `.openai/hosting.json`.

Embodiment labels are curated in `tools/embodiments.json` and retained by the export. Entries may have multiple labels; unknown classifications are explicit. These describe the documented resource scope, not robot compatibility for every task or score. Labels reviewed September 29, 2026.
