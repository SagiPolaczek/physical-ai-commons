"""Export only public-facing benchmark facts, never local cache paths or full paper notes."""
import argparse,json,re
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('research_root',type=Path);args=p.parse_args()
root=args.research_root
out=Path(__file__).resolve().parents[1]/'dist'
def plain(s):
 s=re.sub(r'\[([^\]]+)\]\([^)]+\)',r'\1',s)
 return s.replace('**','').replace('`','')
rows={};category=''
for line in (root/'library/syntheses/physical-ai-benchmark-catalog.md').read_text().splitlines():
 if re.match(r'^## \d+\.',line):category=re.sub(r'^## \d+\. ','',line)
 if re.match(r'^\| [A-O]\d\d ',line):
  c=[x.strip() for x in line.strip('|').split('|')];id=re.match(r'([A-O]\d\d)',c[0])[1]
  rows[id]={'category':category,'setting':plain(c[1]),'boundary':plain(c[2]),'reading':c[3][0]}
pop=json.loads((root/'library/syntheses/physical-ai-benchmark-popularity.data.json').read_text())
benchmarks=[]
for e in pop['entries']:
 paper=e.get('paper') or {};gh=e.get('github') or {};release=e.get('release_milestone') or {}
 benchmarks.append(dict(id=e['id'],name=e['name'],url=e['catalog_source_url'],**rows[e['id']],release=release,paper={k:paper.get(k) for k in ['title','primary_url','citation_count','citation_record_url','citation_retrieved_at','citation_status']},github={k:gh.get(k) for k in ['url','stars','scope','retrieved_at','status']},notes=e.get('notes','')))
raw=json.loads((root/'library/syntheses/robotics-paper-benchmarks.data.json').read_text())['papers']
papers=[]
for e in raw:
 s=e.get('source') or {}
 papers.append({'title':e['title'],'url':s.get('url'),'version':s.get('version'),'reading':e['read-status'],'status':e['status'],'caveat':e.get('caveat',''),'evaluations':[{k:v for k,v in x.items() if k in ['benchmark','name','kind','protocol','locator']} for x in e['entries']]})
assert len(benchmarks)==102 and len(papers)==107 and sum(len(x['evaluations']) for x in papers)==240
embodiments=json.loads((Path(__file__).parent/'embodiments.json').read_text())
assert set(embodiments['entries'])=={b['id'] for b in benchmarks}
for b in benchmarks:b['embodiment']=embodiments['entries'][b['id']]
simulators=json.loads((Path(__file__).parent/'simulators.json').read_text())
assert set(simulators['entries'])=={b['id'] for b in benchmarks}
for b in benchmarks:b['simulator']=simulators['entries'][b['id']]
payload={'simulatorsAsOf':simulators['reviewedAt'],'embodimentsAsOf':embodiments['reviewedAt'],'asOf':'2026-09-28','researchCommit':'ad87113','benchmarks':benchmarks,'papers':papers}
text=json.dumps(payload,ensure_ascii=False,separators=(',',':'))
assert '.wiki-cache' not in text and '/Users/' not in text and '/private/' not in text
(out/'data.json').write_text(text+'\n')
print(f'Exported {len(benchmarks)} resources and {len(papers)} paper notes; {len(text):,} characters.')

# Rebuild inverse links whenever the benchmark catalog is refreshed.
import runpy
runpy.run_path(str(Path(__file__).parent/"export_simulators.py"), run_name="__main__")
