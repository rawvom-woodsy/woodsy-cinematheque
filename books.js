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

const BOOK_COVERS_KEY=STORAGE_NS+'-book-covers-v1';
let bookCoverCache=(()=>{try{return JSON.parse(localStorage.getItem(BOOK_COVERS_KEY)||'{}')||{}}catch{return {}}})();
function saveBookCoverCache(){try{localStorage.setItem(BOOK_COVERS_KEY,JSON.stringify(bookCoverCache))}catch{}}
function bookInline(s){return escapeHtml(s||'').replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>').replace(/__(.+?)__/g,'<strong>$1</strong>').replace(/\*([^*\n]+?)\*/g,'<em>$1</em>').replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,'<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')}
function renderBookMarkdown(md){const lines=String(md||'').replace(/\r\n?/g,'\n').split('\n');let out=[],para=[],list=null,quote=[];const fp=()=>{if(para.length){out.push('<p>'+bookInline(para.join(' '))+'</p>');para=[]}},fl=()=>{if(list){out.push('<'+list.type+'>'+list.items.map(x=>'<li>'+bookInline(x)+'</li>').join('')+'</'+list.type+'>');list=null}},fq=()=>{if(quote.length){out.push('<blockquote class="book-quote">'+quote.map(x=>'<p>'+bookInline(x)+'</p>').join('')+'</blockquote>');quote=[]}},flush=()=>{fp();fl();fq()};for(const raw of lines){const s=raw.trim();if(!s){flush();continue}let m;if((m=s.match(/^(#{1,4})\s+(.+)$/))){flush();const n=Math.min(5,m[1].length+1);out.push('<h'+n+'>'+bookInline(m[2])+'</h'+n+'>');continue}if((m=s.match(/^>\s?(.*)$/))){fp();fl();quote.push(m[1]);continue}if((m=s.match(/^[-*+]\s+(.+)$/))){fp();fq();if(!list||list.type!=='ul'){fl();list={type:'ul',items:[]}}list.items.push(m[1]);continue}if((m=s.match(/^\d+[.)]\s+(.+)$/))){fp();fq();if(!list||list.type!=='ol'){fl();list={type:'ol',items:[]}}list.items.push(m[1]);continue}fl();fq();para.push(s)}flush();return out.join('')}
function coverPlaceholder(title){return '<div class="book-cover-placeholder"><span>'+escapeHtml(title||'BOOK')+'</span></div>'}
function bookCoverMarkup(x,cls=''){const url=x.cover_url||bookCoverCache[x.id]||'';return '<div class="book-cover '+cls+'" data-book-cover="'+escapeHtml(x.id)+'">'+(url?'<img src="'+escapeHtml(url)+'" alt="'+escapeHtml(x.title)+' 표지" loading="lazy">':coverPlaceholder(x.title))+'</div>'}
async function findBookCover(x){if(!x||bookCoverCache[x.id]!==undefined)return bookCoverCache[x.id]||'';try{const q='intitle:'+x.title+(x.author?' inauthor:'+x.author:'');const r=await fetch('https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(q)+'&maxResults=5&printType=books');const d=await r.json(),norm=s=>String(s||'').replace(/[\s『』「」:,·]/g,'').toLowerCase();const hit=(d.items||[]).find(it=>norm(it.volumeInfo?.title)===norm(x.title)&&(!x.author||(it.volumeInfo?.authors||[]).some(a=>norm(a).includes(norm(x.author).split(',')[0]))))||(d.items||[])[0];let url=hit?.volumeInfo?.imageLinks?.thumbnail||hit?.volumeInfo?.imageLinks?.smallThumbnail||'';if(url)url=url.replace(/^http:/,'https:').replace('&edge=curl','').replace('zoom=1','zoom=2');bookCoverCache[x.id]=url;saveBookCoverCache();return url}catch{bookCoverCache[x.id]='';saveBookCoverCache();return ''}}
async function hydrateBookCovers(scope=document){const nodes=[...scope.querySelectorAll('[data-book-cover]')].filter(n=>!n.querySelector('img'));for(const node of nodes.slice(0,24)){const x=bookById(node.dataset.bookCover);if(!x)continue;const url=await findBookCover(x);if(url)node.innerHTML='<img src="'+escapeHtml(url)+'" alt="'+escapeHtml(x.title)+' 표지" loading="lazy">'}}
function booksPage(){
  const rows=[...books].sort((a,b)=>String(a.title).localeCompare(String(b.title),'ko'));
  return `${appHeader('#books')}<main class="shell"><section class="hero"><div class="eyebrow accent-label">PERSONAL READING ARCHIVE</div><h1>Books</h1><p class="lede">읽은 책, 읽는 중인 책, 읽을 책과 별점·인용문을 한곳에 보관합니다. 기존 영화 기록과 별도의 저장 키를 사용하므로 기존 데이터는 건드리지 않습니다.</p></section><section class="section"><div class="toolbar"><input id="book-q" class="search" placeholder="책 제목 · 작가 검색" oninput="filterBooks()"><select id="book-status" class="select" onchange="filterBooks()"><option value="">모든 상태</option><option>완독</option><option>읽는 중</option><option>읽을 것</option></select></div><div id="books-list" class="library-list">${bookRows(rows)}</div></section></main>`;
}
function bookRows(rows){setTimeout(()=>hydrateBookCovers(),0);return '<div class="book-grid">'+rows.map(x=>'<a class="book-card" href="#book/'+encodeURIComponent(x.id)+'">'+bookCoverMarkup(x,'book-cover-list')+'<div class="book-card-copy"><strong>'+escapeHtml(x.title)+'</strong><span>'+escapeHtml(x.author||'—')+'</span><small>'+escapeHtml([x.status,x.rating?'★ '+x.rating:''].filter(Boolean).join(' · '))+'</small></div></a>').join('')+'</div>'}
function filterBooks(){const q=(document.getElementById('book-q')?.value||'').toLowerCase(),s=document.getElementById('book-status')?.value||'';const rows=books.filter(x=>(!s||x.status===s)&&(!q||((x.title||'')+' '+(x.author||'')).toLowerCase().includes(q)));const el=document.getElementById('books-list');if(el){el.innerHTML=bookRows(rows);hydrateBookCovers(el)}}
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
function bookPage(id){const x=bookById(decodeURIComponent(id));if(!x)return notFound();setTimeout(()=>hydrateBookCovers(),0);const note=renderBookMarkdown(x.notes||'');return `${appHeader('#books')}<main class="shell"><section class="detail-intro"><a class="backlink" href="#books">← BOOKS</a></section><section class="book-detail-hero"><div>${bookCoverMarkup(x,'book-cover-detail')}</div><div class="detail-copy"><div class="eyebrow accent-label">${escapeHtml([x.category,x.subcategory].filter(Boolean).join(' · ')||'BOOK')}</div><h1>${escapeHtml(x.title)}</h1><p class="detail-original">${escapeHtml(x.author||'')}</p><dl class="detail-meta"><div><dt>Status</dt><dd>${escapeHtml(x.status||'—')}</dd></div><div><dt>Rating</dt><dd>${x.rating?'★ '+x.rating:'—'}</dd></div><div><dt>Source</dt><dd>${escapeHtml(x.source||'')}</dd></div></dl></div></section><section class="book-reading-section"><div class="eyebrow accent-label">QUOTES & NOTES</div><div class="book-notes">${note||'<span class="muted">저장된 인용문이 없습니다.</span>'}</div></section></main>`}
