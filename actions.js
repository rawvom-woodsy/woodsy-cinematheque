
function adminSelectMonth(v){window._adminMonth=v;window._adminWork=(months[v]?.core||[])[0]||works[0]?.id;render()}
function adminSelectWork(v){window._adminWork=v;render()}
function saveAdminMonth(){
  const mid=document.getElementById('admin-month-select').value;
  const o={
    title:document.getElementById('admin-month-title').value.trim(),
    ko:document.getElementById('admin-month-ko').value.trim(),
    note:document.getElementById('admin-month-note').value,
    concepts:document.getElementById('admin-month-concepts').value.split(',').map(x=>x.trim()).filter(Boolean)
  };
  admin.months[mid]=o;Object.assign(months[mid],o);saveAdmin();toast('월별 텍스트를 저장했어요.');render()
}
function saveAdminWork(){
  const id=document.getElementById('admin-work-select').value,w=byId[id];if(!w)return;
  const o={
    title:document.getElementById('admin-work-title').value.trim(),
    originalTitle:document.getElementById('admin-work-original').value.trim(),
    creator:document.getElementById('admin-work-creator').value.trim(),
    year:parseInt(document.getElementById('admin-work-year').value)||w.year,
    role:document.getElementById('admin-work-role').value
  };
  admin.works[id]=o;Object.assign(w,o);
  const so={url:document.getElementById('admin-still-url').value.trim(),source:document.getElementById('admin-still-source').value.trim()};
  admin.stills[id]=so;stills[id]={...(stills[id]||{}),...so};
  saveAdmin();toast('작품 정보와 스틸 설정을 저장했어요.');render()
}
function resetAdminOverrides(){
  if(!confirm('관리자 모드에서 수정한 텍스트와 스틸만 기본값으로 되돌릴까요?'))return;
  localStorage.removeItem(ADMIN_KEY);location.reload()
}

function saveMonthNote(){state.monthNotes[state.selectedMonth]=document.getElementById('month-note').value;save();toast('월별 메모를 저장했어요.')}
function saveWorkNote(id){state.notes[id]=document.getElementById('work-note').value;save();toast('작품 메모를 저장했어요.')}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function escapeAttr(s){return escapeHtml(s).replace(/`/g,'&#96;')}
function toast(msg){alert(msg)}
function parseCSV(text){const rows=[];let row=[],cell='',q=false;for(let i=0;i<text.length;i++){const c=text[i],n=text[i+1];if(c==='"'&&q&&n==='"'){cell+='"';i++;continue}if(c==='"'){q=!q;continue}if(c===','&&!q){row.push(cell);cell='';continue}if((c==='\n'||c==='\r')&&!q){if(c==='\r'&&n==='\n')i++;row.push(cell);cell='';if(row.some(x=>x!==''))rows.push(row);row=[];continue}cell+=c}if(cell||row.length){row.push(cell);rows.push(row)}return rows}
async function importWatcha(){const f=document.getElementById('watcha-file').files[0];if(!f)return toast('CSV 파일을 선택해줘.');const rows=parseCSV(await f.text());if(rows.length<2)return toast('CSV 내용을 읽지 못했어요.');const head=rows[0].map(x=>x.trim());const idx=n=>head.findIndex(h=>h.toLowerCase()===n.toLowerCase());const ix={id:idx('ID'),url:idx('URL'),title:idx('Title'),type:idx('Type'),year:idx('Year'),directors:idx('Directors'),rating:idx('Rating')};let added=0,matched=0,skipped=0,errors=0;for(const r of rows.slice(1)){try{const title=(r[ix.title]||'').trim();if(!title){skipped++;continue}const rawType=(r[ix.type]||'').trim().toUpperCase();const type=rawType==='MOVIE'?'film':rawType==='TV'?'series':null;if(!type){skipped++;continue}const year=parseInt(r[ix.year])||null;const ext=(r[ix.id]||'').trim();const key=`watcha:${ext||normalize(title)+'-'+(year||'')}`;const canonical=works.find(w=>normalize(w.title)===normalize(title)&&w.type===type&&(!year||w.year===year));const existing=library.find(x=>x.id===key)||(canonical&&library.find(x=>x.canonicalId===canonical.id));const obj={id:key,canonicalId:canonical?.id||existing?.canonicalId,title,originalTitle:'',type,year,creator:(r[ix.directors]||'').trim(),rating:parseFloat(r[ix.rating])||null,historicalStatus:'watched',source:'Watchapedia',sourceUrl:(r[ix.url]||'').trim(),tags:[]};if(existing){Object.assign(existing,obj);matched++}else{library.push(obj);added++}}catch{errors++}}save();document.getElementById('import-result').textContent=`추가 ${added.toLocaleString()} · 매칭 ${matched.toLocaleString()} · 건너뜀 ${skipped.toLocaleString()} · 오류 ${errors.toLocaleString()}`;}
function addBook(){const title=document.getElementById('book-title').value.trim(),creator=document.getElementById('book-author').value.trim(),year=parseInt(document.getElementById('book-year').value)||null;if(!title)return toast('책 제목을 입력해줘.');const id=`manual-book:${normalize(title)}:${year||''}`;if(!library.some(x=>x.id===id))library.push({id,title,originalTitle:'',type:'book',year,creator,rating:null,historicalStatus:'read',source:'manual',sourceUrl:'',tags:[]});save();toast('MASTER LIBRARY에 추가했어요.');render()}
function exportBackup(){const blob=new Blob([JSON.stringify({app:'Personal Cinematheque for WOODSY',version:4,exportedAt:new Date().toISOString(),state,library,admin},null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`woodsy-cinematheque-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500)}
async function restoreBackup(file){if(!file)return;try{const d=JSON.parse(await file.text());if(!d.state||!Array.isArray(d.library))throw new Error();state={...DEFAULT_STATE,...d.state};library=mergeSeed(d.library);admin=d.admin||{months:{},works:{},stills:{}};save();saveAdmin();toast('백업을 복원했어요.');location.reload()}catch{toast('복원할 수 있는 백업 파일이 아니에요.')}}
function resetAll(){if(!confirm('모든 진행률, 메모, 가져온 라이브러리를 초기화할까요?'))return;state=structuredClone(DEFAULT_STATE);library=mergeSeed([]);save();render()}
window.addEventListener('hashchange',render);
if(!location.hash)location.hash='#home';render();
