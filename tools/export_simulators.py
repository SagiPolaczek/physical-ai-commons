"""Export curated platforms and inverse links into the public simulator catalog."""
from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
catalog=json.loads((ROOT/'dist/data.json').read_text())
source=json.loads((ROOT/'tools/simulation-platforms.json').read_text())
by_id={b['id']:b for b in catalog['benchmarks']}
for row in source['simulators']:
 ids={b['id'] for b in catalog['benchmarks'] if set(row.get('benchmarkTags',[]))&set(b['simulator']['tags'])}
 ids.update(row.get('benchmarkIds',[]))
 assert ids<=set(by_id)
 row['benchmarks']=[{'id':id,'name':by_id[id]['name'],'note':by_id[id]['simulator']['note'],'sources':by_id[id]['simulator']['sources']} for id in sorted(ids)]
(ROOT/'dist/simulators.json').write_text(json.dumps(source,ensure_ascii=False,indent=2)+'\n')
print(f"Exported {len(source['simulators'])} simulation platforms and frameworks.")
