let connectionThemes=[],connectionEdges=[];
async function loadConnections(){
  if(!supabaseClient)return;
  const [tr,cr]=await Promise.all([
    supabaseClient.from('themes').select('id,slug,name,name_en,description,sort_order').order('sort_order'),
    supabaseClient.from('connections').select('id,from_type,from_id,to_type,to_id,theme_id,note,created_at').order('created_at',{ascending:false})
  ]);
  if(!tr.error)connectionThemes=tr.data||[];
  if(!cr.error)connectionEdges=cr.data||[];
}
function connectionItem(type,id){
  if(type==='book'){const x=bookById(id);return x?{...x,type:'book',creator:x.author||''}:null}
  if(type==='curriculum'){const m=months[id];return m?{id,type,title:m.title,creator:m.label,year:String(id).slice(0,4)}:null}
  if(type==='film'||type==='series'){const x=library.find(v=>v.id===id||v.canonicalId===id)||byId[id];return x?{...x,type:x.type||type}:null}
  return null;
}
function connectionHref(type,id){return type==='book'?'#book/'+encodeURIComponent(id):type==='curriculum'?'#curriculum':'#work/'+id}
function connectionLabel(type,id){const x=connectionItem(type,id);if(!x)return id;return type==='book'?'『'+x.title+'』':type==='curriculum'?x.title:'<'+x.title+'>'}
function connectionsFor(type,id){return connectionEdges.filter(c=>(c.from_type===type&&c.from_id===id)||(c.to_type===type&&c.to_id===id))}
function connectionOther(c,type,id){return c.from_type===type&&c.from_id===id?{type:c.to_type,id:c.to_id}:{type:c.from_type,id:c.from_id}}
function connectionTheme(id){return connectionThemes.find(t=>String(t.id)===String(id))}
function connectionCard(c,baseType,baseId){
 const o=connectionOther(c,baseType,baseId),x=connectionItem(o.type,o.id),t=connectionTheme(c.theme_id);if(!x)return '';
 return '<a class="connection-entry" href="'+connectionHref(o.type,o.id)+'"><div class="connection-entry-top"><span>'+escapeHtml(t?.name_en||t?.name||'CONNECTION')+'</span><small>'+escapeHtml(o.type.toUpperCase())+'</small></div><h3>'+escapeHtml(connectionLabel(o.type,o.id))+'</h3>'+(c.note?'<p>'+escapeHtml(c.note)+'</p>':'')+'</a>';
}
function itemTypeForConnection(x){return x?.type==='book'?'book':x?.type==='series'?'series':'film'}
function itemConnectionsSection(type,id){
 const cs=connectionsFor(type,id);
 return '<section class="section item-connections"><div class="section-head"><div><div class="eyebrow accent-label">CONNECTIONS</div><h2>이 기록에서 이어지는 경로</h2></div>'+(archiveSignedIn()?'<button class="archive-edit-trigger" onclick="openConnectionComposer(\''+type+'\',\''+String(id).replace(/'/g,"\\'")+'\')">+ CONNECT</button>':'')+'</div>'+(cs.length?'<div class="connection-entry-grid">'+cs.map(c=>connectionCard(c,type,id)).join('')+'</div>':'<p class="muted connection-empty">아직 직접 만든 연결이 없습니다.</p>')+'<div id="connection-composer"></div></section>';
}
function connectionsPage(){
 const counts=new Map(connectionThemes.map(t=>[t.id,connectionEdges.filter(c=>String(c.theme_id)===String(t.id)).length]));
 const recent=connectionEdges.slice(0,8);
 return appHeader('#connections')+'<main class="shell"><section class="hero connections-hero"><div class="eyebrow accent-label">CONNECTIONS</div><h1>생각이 이어지는 방식</h1><p class="lede">영화와 책, 커리큘럼 사이에 내가 발견한 관계를 기록합니다. 무엇이 비슷한지가 아니라 왜 서로를 떠올렸는지를 남기는 개인적인 지도입니다.</p></section><section class="section connection-themes"><div class="section-head"><div><div class="eyebrow accent-label">EXPLORE</div><h2>주제로 들어가기</h2></div><span class="small muted">'+connectionEdges.length+' CONNECTIONS</span></div><div class="theme-cloud">'+connectionThemes.map(t=>'<a class="theme-tile" href="#connections/'+t.slug+'"><span>'+escapeHtml(t.name_en||'THEME')+'</span><strong>'+escapeHtml(t.name)+'</strong><small>'+counts.get(t.id)+' CONNECTIONS</small></a>').join('')+'</div></section><section class="section"><div class="section-head"><div><div class="eyebrow accent-label">RECENT CONNECTIONS</div><h2>최근에 이어진 것들</h2></div></div>'+(recent.length?'<div class="recent-connections">'+recent.map(c=>{const a=connectionLabel(c.from_type,c.from_id),b=connectionLabel(c.to_type,c.to_id),t=connectionTheme(c.theme_id);return '<article><div class="eyebrow">'+escapeHtml(t?.name_en||'CONNECTION')+'</div><h3>'+escapeHtml(a)+' <span>×</span> '+escapeHtml(b)+'</h3>'+(c.note?'<p>'+escapeHtml(c.note)+'</p>':'')+'</article>'}).join('')+'</div>':'<div class="empty connection-empty">첫 연결을 만들면 이곳에서 시간순으로 다시 만날 수 있습니다.</div>')+'</section></main>';
}
function connectionThemePage(slug){
 const t=connectionThemes.find(x=>x.slug===slug);if(!t)return notFound();const cs=connectionEdges.filter(c=>String(c.theme_id)===String(t.id));
 return appHeader('#connections')+'<main class="shell"><section class="hero connections-hero"><a class="backlink" href="#connections">← CONNECTIONS</a><div class="eyebrow accent-label">'+escapeHtml(t.name_en||'THEME')+'</div><h1>'+escapeHtml(t.name)+'</h1><p class="lede">'+escapeHtml(t.description||'이 주제를 통해 서로 다른 기록이 만나는 지점을 모읍니다.')+'</p></section><section class="section">'+(cs.length?'<div class="theme-connection-list">'+cs.map(c=>'<article><div class="connection-pair"><a href="'+connectionHref(c.from_type,c.from_id)+'">'+escapeHtml(connectionLabel(c.from_type,c.from_id))+'</a><span>×</span><a href="'+connectionHref(c.to_type,c.to_id)+'">'+escapeHtml(connectionLabel(c.to_type,c.to_id))+'</a></div>'+(c.note?'<p>'+escapeHtml(c.note)+'</p>':'')+'</article>').join('')+'</div>':'<div class="empty">아직 이 주제로 만든 연결이 없습니다.</div>')+'</section></main>';
}
function connectionOptions(exType,exId){
 const arr=[];
 library.filter(x=>x.type!=='book').forEach(x=>arr.push({type:x.type==='series'?'series':'film',id:x.id,label:'<'+x.title+'> · '+(x.year||'')}));
 books.forEach(x=>arr.push({type:'book',id:x.id,label:'『'+x.title+'』 · '+(x.author||'')}));
 Object.entries(months).forEach(([id,m])=>arr.push({type:'curriculum',id,label:m.label+' · '+m.title}));
 return arr.filter(x=>!(x.type===exType&&x.id===exId)).sort((a,b)=>a.label.localeCompare(b.label,'ko')).map(x=>'<option value="'+escapeAttr(x.type+'|'+x.id)+'">'+escapeHtml(x.label)+'</option>').join('');
}
function openConnectionComposer(type,id){
 const el=document.getElementById('connection-composer');if(!el)return;
 el.innerHTML='<div class="connection-composer"><div class="eyebrow accent-label">NEW CONNECTION</div><label class="admin-label">연결할 기록<select id="connection-target" class="select">'+connectionOptions(type,id)+'</select></label><label class="admin-label">주제<select id="connection-theme" class="select">'+connectionThemes.map(t=>'<option value="'+t.id+'">'+escapeHtml(t.name)+' · '+escapeHtml(t.name_en||'')+'</option>').join('')+'</select></label><label class="admin-label">왜 연결되는가<textarea id="connection-note" placeholder="두 기록 사이에서 발견한 관계를 한두 문장으로 남겨보세요."></textarea></label><div class="actions"><button class="btn" onclick="saveConnection(\''+type+'\',\''+String(id).replace(/'/g,"\\'")+'\')">SAVE CONNECTION</button></div></div>';
}
async function saveConnection(type,id){
 if(!archiveSignedIn()||!supabaseClient)return toast('ADMIN 로그인이 필요해요.');
 const raw=document.getElementById('connection-target')?.value||'',p=raw.indexOf('|');if(p<1)return toast('연결할 기록을 선택해줘.');
 const toType=raw.slice(0,p),toId=raw.slice(p+1),themeId=Number(document.getElementById('connection-theme')?.value),note=(document.getElementById('connection-note')?.value||'').trim();
 const {error}=await supabaseClient.from('connections').insert({from_type:type,from_id:id,to_type:toType,to_id:toId,theme_id:themeId,note});
 if(error)return toast('연결을 저장하지 못했어요.');
 await loadConnections();toast('새 연결을 저장했어요.');render();
}
(function installConnections(){
 const oldWork=workPage;workPage=function(id){const html=oldWork(id),w=byId[id]||library.find(x=>x.id===id||x.canonicalId===id);if(!w)return html;const type=itemTypeForConnection(w);return html.replace('</main>',itemConnectionsSection(type,w.id)+'</main>')};
 const oldBook=bookPage;bookPage=function(id){const decoded=decodeURIComponent(id),html=oldBook(id);return html.replace('</main>',itemConnectionsSection('book',decoded)+'</main>')};
 const oldRender=render;render=function(){const r=route();if(r==='#connections'){document.getElementById('app').innerHTML=connectionsPage();return}if(r.startsWith('#connections/')){document.getElementById('app').innerHTML=connectionThemePage(r.split('/')[1]);return}return oldRender()};
})();