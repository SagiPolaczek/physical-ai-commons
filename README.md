# Physical AI Benchmarks and Simulators

A public, table-only catalog of 102 benchmark resources across 15 capability groups. Snapshot: September 28, 2026.

Click column headings to sort by name, capability, embodiment, simulator, release milestone, selected-paper citations or repository stars. Repeated clicks reverse the order. Missing values sort last in either direction. Search, capability embodiment and simulator filters combine with sorting. Row details retain source links, evaluation boundaries and popularity context.

Run `python3 tools/export_research.py /path/to/research` to refresh the scoped public dataset. Review snapshot dates before publishing. The existing dataset also retains the source paper-to-benchmark mappings for future maintenance; the benchmark interface displays the existing benchmark table.

Serve `dist/` with a static HTTP server. No dependencies, accounts or analytics. Sites publication is configured in `.openai/hosting.json`.

Embodiment labels are curated in `tools/embodiments.json` and retained by the export. Entries may have multiple labels; unknown classifications are explicit. These describe the documented resource scope, not robot compatibility for every task or score. Labels reviewed September 29, 2026.

Simulator labels are curated in `tools/simulators.json` and retained by the export. They identify the simulator platform, with frameworks, versions and track boundaries in the details. Several platforms can apply to different implementations of one resource. For offline resources, a simulator tag can describe source-trajectory generation; optional development simulators are identified explicitly. Physical-only resources, offline resources without an interactive simulator, and unverified engines have separate labels. Reviewed September 30, 2026.

## Separate simulator table

`dist/simulators.html` is an independent sortable table, accessible through the Benchmarks / Simulators navigation. It contains the 15 named simulator platforms from the benchmark catalog and four explicitly used learning frameworks. This is not an exhaustive robotics simulator catalog.

Columns cover name/type, capabilities, documented embodiments, physics backend, public release milestone, selected-paper citations, repository stars, and benchmark uses in this catalog. Search and type, embodiment and backend filters combine. Citation counts come from Semantic Scholar; star counts come from the GitHub repository API, retrieved September 30, 2026. Software-only references have unavailable paper citation counts. Details explain reference/repository scope and link to the benchmark rows.

Curated source facts and metric provenance live in `tools/simulation-platforms.json`. Run `python3 tools/export_simulators.py` after editing those facts or changing the benchmark catalog. `export_research.py` also rebuilds inverse links automatically. Framework-to-benchmark links are explicit reviewed IDs; engine links derive from the existing simulator tags. Run `python3 tools/check_site.py`, `node --check dist/app.js`, `node --check dist/simulator-table.js` and `git diff --check` before publishing.
