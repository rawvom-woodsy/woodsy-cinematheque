const FIXED_BOOK_COVERS={
'19호실로 가다':'https://image.yes24.com/goods/61960706/XL',
'8월에 만나요':'https://image.yes24.com/goods/125300464/XL',
'경아':'https://image.yes24.com/goods/125101743/XL',
'귀신들의 땅':'https://image.yes24.com/goods/124347648/XL',
'그해 봄의 불확실성':'https://image.yes24.com/goods/141694971/XL',
'글쓰기에 대하여':'https://image.yes24.com/goods/97559677/XL',
'나의 사랑 매기':'https://image.yes24.com/goods/67105823/XL',
'너의 유토피아':'https://image.yes24.com/goods/141267375/XL',
'눈먼 암살자1':'https://image.yes24.com/goods/53024708/XL',
'단 한 사람':'https://image.yes24.com/goods/122544941/XL',
'도시와 그 불확실한 벽':'https://image.yes24.com/goods/122090075/XL',
'디어 라이프':'https://image.yes24.com/goods/11252909/XL',
'등대로':'https://image.yes24.com/goods/12081423/XL',
'마법소녀 은퇴합니다':'https://image.yes24.com/goods/108801812/XL',
'사랑과 결함':'https://image.yes24.com/goods/129433560/XL',
'사랑의 기술':'https://image.yes24.com/goods/110257/XL',
'스톤 매트리스':'https://image.yes24.com/goods/126820751/XL',
'싯다르타':'https://image.yes24.com/goods/257435/XL',
'천문학자는 별을 보지 않는다':'https://image.yes24.com/goods/97587008/XL'
};
const BOOKS_KEY=`${STORAGE_NS}-books-v1`;
let books=(()=>{try{const saved=JSON.parse(localStorage.getItem(BOOKS_KEY)||'[]');const local=Array.isArray(saved)?saved:[];const seed=Array.isArray(window.BOOK_SEED)?window.BOOK_SEED:[];const map=new Map(seed.map(x=>[x.id,x]));local.forEach(x=>{if(x&&x.id)map.set(x.id,{...(map.get(x.id)||{}),...x})});return [...map.values()]}catch{return Array.isArray(window.BOOK_SEED)?structuredClone(window.BOOK_SEED):[]}})();
function saveBooks(){try{localStorage.setItem(BOOKS_KEY,JSON.stringify(books))}catch(e){toast('책 기록을 저장하지 못했어요.')}}
(function migrateLibraryBooks(){
  if(typeof library==='undefined'||!Array.isArray(library))return;
  const old=library.filter(x=>x&&x.type==='book');if(!old.length)return;
  const norm=s=>String(s||'').replace(/[\s『』「」:,·]/g,'').toLowerCase();
  old.forEach(x=>{const hit=books.find(b=>norm(b.title)===norm(x.title));if(hit){if(!hit.rating&&x.rating)hit.rating=x.rating;if(!hit.author&&x.creator)hit.author=x.creator}else books.push({id:'library:'+x.id,title:x.title||'',author:x.creator||'',status:x.historicalStatus==='read'?'완독':'읽을 것',rating:x.rating||null,category:'',subcategory:'',notes:'',source:x.source||'Library'})});
  library=library.filter(x=>!x||x.type!=='book');saveBooks();save();
})();
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
function bookCoverMarkup(x,cls=''){const url=x.cover_url||FIXED_BOOK_COVERS[x.title]||bookCoverCache[x.id]||'';return '<div class="book-cover '+cls+'" data-book-cover="'+escapeHtml(x.id)+'">'+(url?'<img src="'+escapeHtml(url)+'" alt="'+escapeHtml(x.title)+' 표지" loading="lazy">':coverPlaceholder(x.title))+'</div>'}
async function findBookCover(x){if(!x)return '';if(FIXED_BOOK_COVERS[x.title])return FIXED_BOOK_COVERS[x.title];if(bookCoverCache[x.id]!==undefined)return bookCoverCache[x.id]||'';try{const q='intitle:'+x.title+(x.author?' inauthor:'+x.author:'');const r=await fetch('https://www.googleapis.com/books/v1/volumes?q='+encodeURIComponent(q)+'&maxResults=5&printType=books');const d=await r.json(),norm=s=>String(s||'').replace(/[\s『』「」:,·]/g,'').toLowerCase();const hit=(d.items||[]).find(it=>norm(it.volumeInfo?.title)===norm(x.title)&&(!x.author||(it.volumeInfo?.authors||[]).some(a=>norm(a).includes(norm(x.author).split(',')[0]))))||(d.items||[])[0];let url=hit?.volumeInfo?.imageLinks?.thumbnail||hit?.volumeInfo?.imageLinks?.smallThumbnail||'';if(url)url=url.replace(/^http:/,'https:').replace('&edge=curl','').replace('zoom=1','zoom=2');bookCoverCache[x.id]=url;saveBookCoverCache();return url}catch{bookCoverCache[x.id]='';saveBookCoverCache();return ''}}
async function hydrateBookCovers(scope=document){const nodes=[...scope.querySelectorAll('[data-book-cover]')].filter(n=>!n.querySelector('img'));for(const node of nodes.slice(0,24)){const x=bookById(node.dataset.bookCover);if(!x)continue;const url=await findBookCover(x);if(url)node.innerHTML='<img src="'+escapeHtml(url)+'" alt="'+escapeHtml(x.title)+' 표지" loading="lazy">'}}
function booksPage(){
  const rows=[...books].sort((a,b)=>String(a.title).localeCompare(String(b.title),'ko'));
  return `${appHeader('#books')}<main class="shell"><section class="hero archive-hero"><div class="eyebrow accent-label">PERSONAL ARCHIVE</div><h1>BOOKS</h1><p class="lede">개인 책 기록 아카이브. 별점과 인용, 간단한 감상을 기록합니다. 아직 읽는 중인 책도 흔적을 남깁니다.</p></section><section class="section archive-section"><div class="toolbar archive-toolbar"><input id="book-q" class="search" placeholder="책 제목 · 작가 검색" oninput="filterBooks()"><select id="book-status" class="select" onchange="filterBooks()"><option value="">ALL</option><option>완독</option><option>읽는 중</option><option>읽을 것</option></select></div><div class="archive-count"><span id="books-count">${rows.length}</span> BOOKS</div><div id="books-list">${bookRows(rows)}</div></section></main>`;
}
function bookRows(rows){setTimeout(()=>hydrateBookCovers(),0);return '<div class="book-grid">'+rows.map(x=>'<a class="book-card" href="#book/'+encodeURIComponent(x.id)+'">'+bookCoverMarkup(x,'book-cover-list')+'<div class="book-card-copy"><strong>'+escapeHtml(x.title)+'</strong><span>'+escapeHtml(x.author||'—')+'</span><small>'+escapeHtml([x.status,x.rating?'★ '+x.rating:''].filter(Boolean).join(' · '))+'</small></div></a>').join('')+'</div>'}
function filterBooks(){const q=(document.getElementById('book-q')?.value||'').trim().toLowerCase(),s=document.getElementById('book-status')?.value||'';const rows=books.filter(x=>(!s||x.status===s)&&(!q||((x.title||'')+' '+(x.author||'')).toLowerCase().includes(q)));const el=document.getElementById('books-list');if(el){el.innerHTML=bookRows(rows);hydrateBookCovers(el)}const count=document.getElementById('books-count');if(count)count.textContent=rows.length}
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
