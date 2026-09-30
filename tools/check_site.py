from pathlib import Path
from html.parser import HTMLParser
import json,re
root=Path(__file__).resolve().parents[1]
class Page(HTMLParser):
 def __init__(self):super().__init__();self.ids=[];self.links=[];self.assets=[];self.sections=0
 def handle_starttag(self,tag,attrs):
  d=dict(attrs)
  if 'id'in d:self.ids.append(d['id'])
  if tag=='section':self.sections+=1
  if tag=='a' and 'href'in d:self.links.append(d['href'])
  if tag in ['script','link']:self.assets.append(d.get('src') or d.get('href',''))
p=Page();p.feed((root/'dist/index.html').read_text())
assert len(p.ids)==len(set(p.ids)), 'Duplicate document IDs'
for link in p.links:
 if link.startswith('#') and len(link)>1:assert link[1:] in p.ids,link
for asset in p.assets:
 if not asset.startswith(('http','data:')):assert (root/'dist'/asset).is_file(),asset
raw=(root/'dist/data.json').read_text();d=json.loads(raw)
assert len(d['benchmarks'])==102 and len(d['papers'])==107
assert len({b['id'] for b in d['benchmarks']})==102
assert len({b['category'] for b in d['benchmarks']})==15
assert sum(len(p['evaluations']) for p in d['papers'])==240
for term in ['.wiki-cache','/Users/','/private/','source_repository_credential']:assert term not in raw,term
for b in d['benchmarks']:
 assert b['url'].startswith(('http://','https://'))
 for n in [b['paper']['citation_count'],b['github']['stars']]:assert n is None or isinstance(n,int)
assert 'simulator' in p.ids
sim=json.loads((root/'tools/simulators.json').read_text())
assert set(sim['entries'])=={b['id'] for b in d['benchmarks']}
assert d['simulatorsAsOf']==sim['reviewedAt']
for b in d['benchmarks']:
 s=b['simulator'];assert s==sim['entries'][b['id']]
 assert s['tags'] and len(s['tags'])==len(set(s['tags']))
 assert s['note'] and s['sources']
 assert s['status'] in ['verified','unknown']
 assert (s['tags']==['Not verified'])==(s['status']=='unknown')
 for source in s['sources']:
  assert source['url'].startswith('https://') and source['locator']
print('PASS: catalog counts, missing-value types, internal anchors, local assets, and scoped public data.')
# The separate simulator view must keep sources and inverse links consistent.
platforms=json.loads((root/'dist/simulators.json').read_text())
assert len(platforms['simulators'])==19
assert len({s['id'] for s in platforms['simulators']})==19
special={'Offline / no simulator','Real-world only','Not verified'}
assert {t for s in platforms['simulators'] for t in s['benchmarkTags']}=={t for b in d['benchmarks'] for t in b['simulator']['tags'] if t not in special}
by_id={b['id']:b for b in d['benchmarks']}
for s in platforms['simulators']:
 assert s['description'] and s['embodiments'] and s['backends'] and s['sources']
 assert s['release']['date'] and s['release']['source_url'] and s['release']['basis']
 assert s['github']['scope'] and s['github']['retrieved_at']
 assert isinstance(s['github']['stars'],int) and s['github']['stars']>=0
 assert s['paper']['citations'] is None or isinstance(s['paper']['citations'],int)
 expected={b['id'] for b in d['benchmarks'] if set(s['benchmarkTags'])&set(b['simulator']['tags'])}|set(s['benchmarkIds'])
 assert {b['id'] for b in s['benchmarks']}==expected
 assert len(s['benchmarks'])==len(expected)
 for b in s['benchmarks']:
  assert b['name']==by_id[b['id']]['name'] and b['sources']==by_id[b['id']]['simulator']['sources']
 for u in [s['url'],s['release']['source_url'],s['github']['url']]+[x['url'] for x in s['sources']]:assert u.startswith('https://'),u
sp=Page();sp.feed((root/'dist/simulators.html').read_text())
assert len(sp.ids)==len(set(sp.ids))
for asset in sp.assets:
 if not asset.startswith(('http','data:')):assert(root/'dist'/asset).is_file(),asset
for url in sp.links:
 if not url.startswith(('http','data:','#')):assert(root/'dist'/url).exists(),url
print('PASS: separate simulator page, all named platform coverage, metric provenance and exact inverse benchmark mappings.')
