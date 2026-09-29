'use strict';
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const safe=s=>{try{const u=new URL(s);return ['http:','https:'].includes(u.protocol)?u.href:null;}catch{return null;}};
const link=(url,label,cls='')=>safe(url)?`<a class="${cls}" href="${esc(safe(url))}" target="_blank" rel="noopener">${esc(label)}</a>`:esc(label);
const normalize=s=>String(s).normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const format=n=>typeof n==='number'?n.toLocaleString('en-US'):'—';
const date=s=>s?String(s).split('T')[0]:'Not recorded';
let benchmarks=[],sortKey='stars',direction='desc',expanded=new Set();
const value=(b,key)=>key==='stars'?b.github.stars:key==='citations'?b.paper.citation_count:key==='release'?b.release.date||null:b[key];
function compare(a,b){
 const x=value(a,sortKey),y=value(b,sortKey);
 if(x==null&&y!=null)return 1;if(y==null&&x!=null)return -1;
 let diff=0;
 if(x!=null&&y!=null)diff=typeof x==='number'?x-y:String(x).localeCompare(String(y),'en',{numeric:true,sensitivity:'base'});
 return diff?(direction==='asc'?diff:-diff):a.name.localeCompare(b.name,'en',{sensitivity:'base'});
}
function details(b){const r=b.release,p=b.paper,g=b.github;return `<tr class="detail-row" id="detail-${b.id}"><td colspan="6"><div class="detail-grid"><div><h2>What it tests</h2><p>${esc(b.setting)}</p><h2>Embodiment</h2><p>${esc(b.embodiment.tags.join(" · "))}<br><span class="detail-small">${esc(b.embodiment.note)} ${link(b.embodiment.source_url,"Source ↗")}</span></p><h2>Comparison boundary</h2><p>${esc(b.boundary)}</p><div class="detail-links">${link(b.url,'Benchmark source ↗')}${link(p.primary_url,'Paper ↗')}${link(g.url,'Repository ↗')}<a href="#benchmark-${b.id}">Link to this entry</a></div></div><div><h2>Release milestone</h2><p>${esc(r.date||'Unavailable')} · ${esc(r.basis||'Not recorded')}<br>${esc(r.note||'')}</p><h2>Popularity context</h2><p>${esc(b.notes||'')}<br>Repository scope: ${esc(g.scope||'Not recorded')}</p><div class="detail-small">Citations retrieved: ${esc(date(p.citation_retrieved_at))} · Stars retrieved: ${esc(date(g.retrieved_at))}<br>Reading coverage: ${b.reading==='P'?'Targeted protocol review':'Definition-level discovery'} · ID ${b.id}</div></div></div></td></tr>`;}
function render(){
 const q=normalize($('query').value.trim()),c=$('category').value,e=$('embodiment').value;
 const rows=benchmarks.filter(b=>(!c||b.category===c)&&(!e||b.embodiment.tags.includes(e))&&(!q||normalize([b.name,b.category,b.setting,b.boundary,...b.embodiment.tags].join(' ')).includes(q))).sort(compare);
 $('results').innerHTML=rows.length?rows.map(b=>`<tr id="benchmark-${b.id}" class="benchmark-row ${expanded.has(b.id)?'expanded':''}"><td>${link(b.url,b.name,'name')}</td><td>${esc(b.category)}</td><td class="date">${link(b.release.source_url,b.release.date||'—')}</td><td class="numeric">${typeof b.paper.citation_count==='number'?link(b.paper.citation_record_url,format(b.paper.citation_count)):'<span class="missing" aria-label="Citations unavailable">—</span>'}</td><td class="numeric">${typeof b.github.stars==='number'?link(b.github.url,format(b.github.stars)):'<span class="missing" aria-label="Stars unavailable">—</span>'}</td><td><button class="detail-button" type="button" data-detail="${b.id}" aria-expanded="${expanded.has(b.id)}" ${expanded.has(b.id)?`aria-controls="detail-${b.id}"`:''} aria-label="${expanded.has(b.id)?'Hide':'Show'} details for ${esc(b.name)}"><svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true"><path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></button></td></tr>${expanded.has(b.id)?details(b):''}`).join(''):'<tr><td colspan="6" class="empty"><p>No matching benchmarks.</p><button type="button" id="clear">Clear filters</button></td></tr>';
 const labels={stars:'GitHub stars',citations:'citations',release:'release date',name:'name',category:'capability'};
 $('result-count').textContent=`${rows.length} of ${benchmarks.length} resources · ${labels[sortKey]}, ${direction==='desc'?(sortKey==='release'?'newest first':sortKey==='name'||sortKey==='category'?'Z–A':'high to low'):(sortKey==='release'?'oldest first':sortKey==='name'||sortKey==='category'?'A–Z':'low to high')}`;
 document.querySelectorAll('th[data-key]').forEach(th=>{const active=th.dataset.key===sortKey;th.setAttribute('aria-sort',active?(direction==='asc'?'ascending':'descending'):'none');th.querySelector('span').textContent=active?(direction==='asc'?'↑':'↓'):'↕';});
 $('clear')?.addEventListener('click',()=>{$('query').value='';$('category').value='';$('embodiment').value='';render();$('query').focus();});
}
function deepLink(){const m=location.hash.match(/^#benchmark-([A-O]\d\d)$/);if(!m||!benchmarks.some(b=>b.id===m[1]))return;$('query').value='';$('category').value='';$('embodiment').value='';expanded.add(m[1]);render();$('benchmark-'+m[1]).scrollIntoView({block:'center'});}
async function init(){try{const r=await fetch('data.json');if(!r.ok)throw Error();const d=await r.json();benchmarks=d.benchmarks;
 $('category').innerHTML='<option value="">All capabilities</option>'+[...new Set(benchmarks.map(b=>b.category))].sort().map(c=>`<option>${esc(c)}</option>`).join('');
 $('embodiment').innerHTML='<option value="">All embodiments</option>'+[...new Set(benchmarks.flatMap(b=>b.embodiment.tags))].sort((a,b)=>a==='Not specified'?1:b==='Not specified'?-1:a.localeCompare(b)).map(e=>`<option value="${esc(e)}">${esc(e)} (${benchmarks.filter(b=>b.embodiment.tags.includes(e)).length})</option>`).join('');
 $('embodiment').addEventListener('change',render);
 $('filters').addEventListener('submit',e=>e.preventDefault());$('query').addEventListener('input',render);$('category').addEventListener('change',render);
 document.querySelectorAll('[data-sort]').forEach(button=>button.addEventListener('click',()=>{const k=button.dataset.sort;direction=k===sortKey?(direction==='asc'?'desc':'asc'):(['name','category'].includes(k)?'asc':'desc');sortKey=k;render();}));
 $('results').addEventListener('click',e=>{const button=e.target.closest('[data-detail]');if(!button)return;const id=button.dataset.detail;expanded.has(id)?expanded.delete(id):expanded.add(id);render();document.querySelector(`[data-detail="${id}"]`).focus({preventScroll:true});});
 render();deepLink();window.addEventListener('hashchange',deepLink);
 }catch{$('result-count').textContent='The benchmark data could not load.';$('results').innerHTML='<tr><td colspan="6" class="empty">Reload the page to try again.</td></tr>';}}
init();
