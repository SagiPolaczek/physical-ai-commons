# Physical AI Commons: agent instructions

## Scope and presentation

This is a standalone static website repository. Keep `README.md` short and reader-facing: purpose, website links and how people can contribute. Put maintenance instructions here.

The public interface consists of two separate tables: benchmarks and simulators. Preserve the quiet table layout, search, combined filters, sortable columns, source details and links between catalogs. Do not add logos, promotional sections or implementation details to the visitor experience unless requested.

## Repository and publication

- Work on `main` for catalog, website and documentation maintenance.
- At session start, inspect the branch, status, upstream and active worktrees. Fetch `origin`; pull with `--ff-only` when the checkout is clean. Preserve unrelated changes and never auto-stash or discard them.
- `origin` is `SagiPolaczek/physical-ai-commons` on GitHub. The optional `previous-host` remote is historical; GitHub Pages is the primary host.
- Commit only the requested, validated changes and push completed work to `origin/main` under the user's standing synchronization authorization. Never force-push. Preserve upstream work if integration is needed.
- `.github/workflows/pages.yml` checks the catalogs and publishes `dist/` through GitHub Pages on pushes to `main`. After website changes, check the workflow result and the affected public behavior before claiming deployment succeeded. Report the commit and push outcome.
- Do not restore the former hosting manifest or publish to the former host unless the user requests it.

## Files and data flow

| File | Purpose |
|---|---|
| `dist/index.html`, `dist/app.js` | Benchmark table |
| `dist/simulators.html`, `dist/simulator-table.js` | Separate simulator table |
| `dist/style.css` | Shared presentation |
| `dist/data.json` | Exported benchmark facts and public paper-to-benchmark mappings |
| `tools/embodiments.json` | Curated benchmark embodiment labels |
| `tools/simulators.json` | Curated benchmark-to-simulator mappings |
| `tools/simulation-platforms.json` | Curated simulator facts, sources and popularity metrics |
| `tools/export_simulators.py` | Exports `dist/simulators.json` and rebuilds inverse benchmark links |
| `tools/export_research.py` | Refreshes the public benchmark dataset from a supplied research repository, then rebuilds simulator links |
| `tools/check_site.py` | Catalog consistency and static-file checks |

The site can publish the committed snapshot without access to the research repository. Do not require private research paths, notes or credentials in deployment. Keep asset URLs, navigation and data requests relative so the GitHub Pages repository subpath works.

## Evidence and popularity

- Use primary papers, official documentation and official repositories for factual updates. Retain source URLs, relevant versions, scope and retrieval dates.
- Keep unknown values explicit. A missing citation count or star count is `null`, not zero. Missing values must sort last in both directions.
- Citation counts refer to the selected paper; GitHub stars refer to the linked repository. Identify shared papers, monorepos, example repositories and software-only references in row details. Do not substitute a related paper's count for a missing software citation count.
- Release dates are documented public milestones, sometimes paper submissions. Preserve date precision and explain the milestone instead of inferring the first software release from repository creation.
- Embodiment and simulator labels must preserve task, track and edition boundaries. Distinguish physical robots, abstract effectors, deformable objects and soft robots. Distinguish frameworks from simulation platforms and physics engines.
- Engine-to-benchmark links derive from curated tags. Framework links use reviewed explicit benchmark IDs. Do not infer compatibility or usage merely from related projects.
- Popularity and label dates are snapshots; update visible dates only after reviewing or retrieving the corresponding facts. This catalog is not exhaustive.

## Maintenance and checks

After changing simulator facts or benchmark mappings:

```sh
python3 tools/export_simulators.py
```

When an authorized benchmark refresh has a supplied research source:

```sh
python3 tools/export_research.py /path/to/research
```

For catalog or website changes:

```sh
python3 tools/check_site.py
node --check dist/app.js
node --check dist/simulator-table.js
git diff --check
```

For documentation-only changes, inspect the rendered structure and run `git diff --check`; additional website tests are unnecessary. Do not add tests that only mirror the implementation.

For UI changes, check affected sorting, combined filters, missing values, empty-state reset, row details and navigation. Serve `dist/` with a static HTTP server when a local preview is needed. No dependency installation or build step is required. Catalog validators check structure and consistency, not scientific truth.
