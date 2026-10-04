const BOOKS_KEY=`${STORAGE_NS}-books-v1`;
let books=(()=>{try{const saved=JSON.parse(localStorage.getItem(BOOKS_KEY)||'[]');const local=Array.isArray(saved)?saved:[];const seed=Array.isArray(window.BOOK_SEED)?window.BOOK_SEED:[];const map=new Map(seed.map(x=>[x.id,x]));local.forEach(x=>{if(x&&x.id)map.set(x.id,{...(map.get(x.id)||{}),...x})});return [...map.values()]}catch{return Array.isArray(window.BOOK_SEED)?structuredClone(window.BOOK_SEED):[]}})();
function saveBooks(){try{localStorage.setItem(BOOKS_KEY,JSON.stringify(books))}catch(e){toast('책 기록을 저장하지 못했어요.')}}
function bookById(id){return books.find(x=>x.id===id)}
function importBooksData(items){
  const map=new Map(books.map(x=>[x.id,x]));
  (items||[]).forEach(x=>{if(x&&x.id)map.set(x.id,{...(map.get(x.id)||{}),...x})});
  books=[...map.values()];saveBooks();return books.length;
}
async function importBooksJson(file){
  if(!file)return;
  try{const d=JSON.parse(await file.text());const items=Array.isArray(d)?d:d.books;if(!Array.isArray(items))throw new Error();importBooksData(items);toast('독서 기록을 가져왔어요.');render()}catch{toast('읽을 수 있는 Books JSON이 아니에요.')}
}
function booksPage(){
  const rows=[...books].sort((a,b)=>String(a.title).localeCompare(String(b.title),'ko'));
  return `${appHeader('#books')}<main class="shell"><section class="hero"><div class="eyebrow accent-label">PERSONAL READING ARCHIVE</div><h1>Books</h1><p class="lede">읽은 책, 읽는 중인 책, 읽을 책과 별점·인용문을 한곳에 보관합니다. 기존 영화 기록과 별도의 저장 키를 사용하므로 기존 데이터는 건드리지 않습니다.</p></section><section class="section"><div class="toolbar"><input id="book-q" class="search" placeholder="책 제목 · 작가 검색" oninput="filterBooks()"><select id="book-status" class="select" onchange="filterBooks()"><option value="">모든 상태</option><option>완독</option><option>읽는 중</option><option>읽을 것</option></select></div><div id="books-list" class="library-list">${bookRows(rows)}</div></section></main>`;
}
function bookRows(rows){return `<div class="library-row header"><span>책</span><span>작가</span><span>상태</span><span>별점</span></div>`+rows.map(x=>`<a class="library-row" href="#book/${encodeURIComponent(x.id)}"><span><strong>${escapeHtml(x.title)}</strong><small class="muted">${escapeHtml([x.category,x.subcategory].filter(Boolean).join(' · '))}</small></span><span>${escapeHtml(x.author||'—')}</span><span>${escapeHtml(x.status||'—')}</span><span>${x.rating?'★ '+x.rating:'—'}</span></a>`).join('')}
function filterBooks(){const q=(document.getElementById('book-q')?.value||'').toLowerCase(),s=document.getElementById('book-status')?.value||'';const rows=books.filter(x=>(!s||x.status===s)&&(!q||((x.title||'')+' '+(x.author||'')).toLowerCase().includes(q)));const el=document.getElementById('books-list');if(el)el.innerHTML=bookRows(rows)}
function bookInline(s){
  return escapeHtml(s||'')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/__(.+?)__/g,'<strong>$1</strong>')
    .replace(/\*([^*\n]+?)\*/g,'<em>$1</em>')
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}
function renderBookMarkdown(md){
  const lines=String(md||'').replace(/\r\n?/g,'\n').split('\n');
  let out=[],para=[],list=null,quote=[];
  const flushPara=()=>{if(para.length){out.push('<p>'+bookInline(para.join(' '))+'</p>');para=[]}};
  const flushList=()=>{if(list){out.push('<'+list.type+'>'+list.items.map(x=>'<li>'+bookInline(x)+'</li>').join('')+'</'+list.type+'>');list=null}};
  const flushQuote=()=>{if(quote.length){out.push('<blockquote class="book-quote">'+quote.map(x=>'<p>'+bookInline(x)+'</p>').join('')+'</blockquote>');quote=[]}};
  const flush=()=>{flushPara();flushList();flushQuote()};
  for(const raw of lines){
    const s=raw.trim();
    if(!s){flush();continue}
    let m;
    if((m=s.match(/^(#{1,4})\s+(.+)$/))){flush();const n=Math.min(4,m[1].length+1);out.push('<h'+n+'>'+bookInline(m[2])+'</h'+n+'>');continue}
    if((m=s.match(/^>\s?(.*)$/))){flushPara();flushList();quote.push(m[1]);continue}
    if((m=s.match(/^[-*+]\s+(.+)$/))){flushPara();flushQuote();if(!list||list.type!=='ul'){flushList();list={type:'ul',items:[]}}list.items.push(m[1]);continue}
    if((m=s.match(/^\d+[.)]\s+(.+)$/))){flushPara();flushQuote();if(!list||list.type!=='ol'){flushList();list={type:'ol',items:[]}}list.items.push(m[1]);continue}
    flushList();flushQuote();para.push(s);
  }
  flush();
  return out.join('');
}
function bookPage(id){const x=bookById(decodeURIComponent(id));if(!x)return notFound();const note=escapeHtml(x.notes||'').replace(/\n/g,'<br>');return `${appHeader('#books')}<main class="shell"><section class="detail-intro"><a class="backlink" href="#books">← BOOKS</a></section><section class="detail-layout"><div class="detail-copy"><div class="eyebrow accent-label">${escapeHtml([x.category,x.subcategory].filter(Boolean).join(' · ')||'BOOK')}</div><h1>${escapeHtml(x.title)}</h1><p class="detail-original">${escapeHtml(x.author||'')}</p><dl class="detail-meta"><div><dt>Status</dt><dd>${escapeHtml(x.status||'—')}</dd></div><div><dt>Rating</dt><dd>${x.rating?'★ '+x.rating:'—'}</dd></div><div><dt>Source</dt><dd>${escapeHtml(x.source||'')}</dd></div></dl></div><div><div class="eyebrow accent-label">QUOTES & NOTES</div><div class="book-notes">${note||'<span class="muted">저장된 인용문이 없습니다.</span>'}</div></div></section></main>`}
