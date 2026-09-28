'use strict';
const $ = (id) => document.getElementById(id);
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safeUrl = (value) => { try { const u = new URL(value); return ['https:','http:'].includes(u.protocol) ? u.href : null; } catch { return null; } };
const link = (url,label) => safeUrl(url) ? `<a href="${esc(safeUrl(url))}" target="_blank" rel="noopener">${esc(label)} ↗</a>` : '';
const normalized = (s) => String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/π/g,'pi').replace(/[−–—]/g,'-');
const number = (n) => typeof n === 'number' ? n.toLocaleString('en-US') : 'Unavailable';
const day = (s) => s ? String(s).split('T')[0] : 'Not recorded';
const pageSize = 12;
let data, benchmarkPage = 1, paperPage = 1;
const readingLabel = s => ({complete:'Complete note',partial:'Partial note','legacy-unreviewed':'Not yet audited'}[s] || s);
function benchmarkMatches() {
 const query=normalized($('benchmark-query').value.trim()), category=$('category').value;
 return data.benchmarks.filter(b => (!category || b.category===category) && (!query || normalized([b.name,b.id,b.category,b.setting,b.boundary].join(' ')).includes(query)));
}
function paperMatches() {
 const query=normalized($('paper-query').value.trim());
 return data.papers.filter(p=>!query || normalized([p.title,...p.evaluations.map(e=>[e.name,e.protocol,e.kind].join(' '))].join(' ')).includes(query));
}
function benchmarkCard(b) {
 const p=b.paper,g=b.github,r=b.release;
 return `<details class="benchmark" id="benchmark-${esc(b.id)}"><summary><span class="benchmark-name"><span class="chevron" aria-hidden="true">+</span>${esc(b.name)}</span><span class="benchmark-category">${esc(b.category)}</span><span class="numeric"><span class="mobile-label">Release milestone</span>${esc(r.date||'Unavailable')}</span><span class="numeric"><span class="mobile-label">Citations</span>${number(p.citation_count)}</span><span class="numeric"><span class="mobile-label">GitHub stars</span>${number(g.stars)}</span></summary><div class="benchmark-body"><div><h4>What it tests</h4><p>${esc(b.setting)}</p><h4>Comparison boundary</h4><p>${esc(b.boundary)}</p><div class="links">${link(b.url,'Primary benchmark source')}<a href="#benchmark-${esc(b.id)}">Link to this entry</a></div></div><div><h4>Release & popularity</h4><p><b>${esc(r.date||'Unavailable')}</b> · ${esc(r.basis||'Milestone basis not recorded')}<br>${link(r.source_url,'Date source')}</p><p>${esc(p.title||'Selected paper not identified')}<br>${link(p.citation_record_url,'Citation record')}${p.primary_url?' · '+link(p.primary_url,'Paper'):''}</p><p>${link(g.url,'GitHub repository') || 'Repository not identified'}<br>Repository scope: ${esc(g.scope||'Not recorded')}</p>${b.notes?`<p>${esc(b.notes)}</p>`:''}<div class="detail-meta">Citation count retrieved: ${esc(day(p.citation_retrieved_at))}<br>Star count retrieved: ${esc(day(g.retrieved_at))}<br>Reading coverage: ${b.reading==='P'?'Targeted protocol review':'Definition-level discovery'}<br>${esc(r.note||'')}<br>Catalog ID: ${esc(b.id)}</div></div></div></details>`;
}
function paperCard(p,i) {
 const kinds=[...new Set(p.evaluations.map(e=>e.kind))];
 return `<details class="paper" id="paper-row-${i}"><summary><span class="paper-name"><span class="chevron" aria-hidden="true">+</span>${esc(p.title)}</span><span class="paper-tags"><span class="badge ${p.reading==='complete'?'complete':p.reading==='partial'?'partial':''}">${esc(readingLabel(p.reading))}</span><span class="paper-count">${p.evaluations.length} evaluation${p.evaluations.length===1?'':'s'}</span></span></summary><div class="paper-body"><div class="links">${link(p.url,'Primary paper source') || '<span>Primary source URL not recorded in this note.</span>'}${p.version?` <span class="locator"> · ${esc(p.version)}</span>`:''}</div><p>${kinds.map(k=>`<span class="badge">${esc(k==='real'?'Physical robot':k==='simulation'?'Simulation':k)}</span>`).join('')}</p>${p.caveat?`<p class="paper-caveat">${esc(p.caveat)}</p>`:''}${p.evaluations.length?p.evaluations.map(e=>`<div class="evaluation"><h4>${esc(e.name)}</h4><p>${esc(e.protocol||'Protocol not recorded.')}</p><span class="locator">Source locator: ${esc(e.locator||'Not recorded')}</span></div>`).join(''):`<p>${p.status==='no-new-evaluation'?'No new evaluation is recorded for this paper.':'No evaluation mapping is recorded; this does not establish that the paper has no experiments.'}</p>`}</div></details>`;
}
function renderBenchmarks() {
 const matches=benchmarkMatches(),pages=Math.max(1,Math.ceil(matches.length/pageSize));benchmarkPage=Math.max(1,Math.min(benchmarkPage,pages));
 $('benchmark-results').innerHTML=matches.length?matches.slice((benchmarkPage-1)*pageSize,benchmarkPage*pageSize).map(benchmarkCard).join(''):'<div class="empty"><h3>No matching benchmarks</h3><p>Try a broader term or choose all capability groups.</p><button type="button" id="reset-benchmarks">Clear filters</button></div>';
 $('benchmark-count').textContent=`${matches.length} of ${data.benchmarks.length} resources${matches.length?` · showing ${(benchmarkPage-1)*pageSize+1}–${Math.min(benchmarkPage*pageSize,matches.length)}`:''}`;
 $('benchmark-page').textContent=`Page ${benchmarkPage} of ${pages}`;$('benchmark-prev').disabled=benchmarkPage===1;$('benchmark-next').disabled=benchmarkPage===pages;
 $('reset-benchmarks')?.addEventListener('click',()=>{$('benchmark-query').value='';$('category').value='';benchmarkPage=1;renderBenchmarks();$('benchmark-query').focus();});
}
function renderPapers() {
 const matches=paperMatches(),pages=Math.max(1,Math.ceil(matches.length/pageSize));paperPage=Math.max(1,Math.min(paperPage,pages));
 $('paper-results').innerHTML=matches.length?matches.slice((paperPage-1)*pageSize,paperPage*pageSize).map((p,i)=>paperCard(p,(paperPage-1)*pageSize+i)).join(''):'<div class="empty"><h3>No matching paper notes</h3><p>This is a selected library. Absence is not evidence that a paper does not exist.</p><button type="button" id="reset-papers">Clear search</button></div>';
 $('paper-count').textContent=`${matches.length} of ${data.papers.length} paper notes${matches.length?` · showing ${(paperPage-1)*pageSize+1}–${Math.min(paperPage*pageSize,matches.length)}`:''}`;
 $('paper-page').textContent=`Page ${paperPage} of ${pages}`;$('paper-prev').disabled=paperPage===1;$('paper-next').disabled=paperPage===pages;
 $('reset-papers')?.addEventListener('click',()=>{$('paper-query').value='';paperPage=1;renderPapers();$('paper-query').focus();});
}
function openLinkedBenchmark() {
 const m=location.hash.match(/^#benchmark-([A-O]\d\d)$/);if(!m||!data)return;
 const index=data.benchmarks.findIndex(b=>b.id===m[1]);if(index<0)return;
 $('benchmark-query').value='';$('category').value='';benchmarkPage=Math.floor(index/pageSize)+1;renderBenchmarks();
 const el=$('benchmark-'+m[1]);el.open=true;el.scrollIntoView({block:'start'});
}
async function init() {
 try {
  const response=await fetch('data.json');if(!response.ok)throw new Error('Catalog unavailable');data=await response.json();
  if(!Array.isArray(data.benchmarks)||!Array.isArray(data.papers))throw new Error('Invalid catalog');
  $('category').innerHTML='<option value="">All capability groups</option>'+[...new Set(data.benchmarks.map(b=>b.category))].map(c=>`<option>${esc(c)}</option>`).join('');
  for(const id of ['benchmark-form','paper-form'])$(id).addEventListener('submit',e=>e.preventDefault());
  $('benchmark-query').addEventListener('input',()=>{benchmarkPage=1;renderBenchmarks();});$('category').addEventListener('change',()=>{benchmarkPage=1;renderBenchmarks();});
  $('paper-query').addEventListener('input',()=>{paperPage=1;renderPapers();});
  for(const [id,delta,kind] of [['benchmark-prev',-1,'benchmark'],['benchmark-next',1,'benchmark'],['paper-prev',-1,'paper'],['paper-next',1,'paper']])$(id).addEventListener('click',()=>{if(kind==='benchmark'){benchmarkPage+=delta;renderBenchmarks();}else{paperPage+=delta;renderPapers();}$(kind==='benchmark'?'benchmarks':'papers').scrollIntoView({block:'start'});});
  renderBenchmarks();renderPapers();openLinkedBenchmark();window.addEventListener('hashchange',openLinkedBenchmark);
 } catch(error) {
  for(const prefix of ['benchmark','paper']){$(prefix+'-count').textContent='The index could not load.';$(prefix+'-results').innerHTML='<p class="error">The research index is temporarily unavailable. Reload the page to try again. The assessment and source links above remain available.</p>';$(prefix+'-prev').disabled=true;$(prefix+'-next').disabled=true;}
 }
}
init();
