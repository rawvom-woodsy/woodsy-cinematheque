const SUPABASE_URL='https://jbsjjmmlqzxsuxgvvnfq.supabase.co';
const SUPABASE_PUBLISHABLE_KEY='sb_publishable_fCFNPFfNZ28XTcOCjnngIA_jxlSLfmi';
let supabaseClient=null,archiveUser=null;
const privateMemoCache={};
function archiveSignedIn(){return !!archiveUser}
async function initSupabase(){
  if(!window.supabase?.createClient)return;
  supabaseClient=window.supabase.createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY);
  const {data}=await supabaseClient.auth.getUser();archiveUser=data?.user||null;
  supabaseClient.auth.onAuthStateChange((_e,s)=>{archiveUser=s?.user||null;setTimeout(render,0)});
  await loadCloudArchive();
}
async function fetchAllRows(table,columns,order='title'){
  const pageSize=1000,rows=[];
  for(let from=0;;from+=pageSize){
    const {data,error}=await supabaseClient.from(table).select(columns).order(order).range(from,from+pageSize-1);
    if(error)return {data:rows,error};
    rows.push(...(data||[]));
    if(!data||data.length<pageSize)break;
  }
  return {data:rows,error:null};
}
async function loadCloudArchive(){
  if(!supabaseClient)return;
  const [fr,br]=await Promise.all([
    fetchAllRows('films','id,title,original_title,type,year,creator,rating,review,status,poster_url,still_url,image_source,source,source_url,tags'),
    fetchAllRows('books','id,title,author,status,rating,category,subcategory,review,cover_url,source,tags')
  ]);
  if(!fr.error&&fr.data?.length)library=fr.data.map(x=>({id:x.id,title:x.title,originalTitle:x.original_title||'',type:x.type,year:x.year,creator:x.creator||'',rating:x.rating,review:x.review||'',historicalStatus:x.status||'watched',posterUrl:x.poster_url||'',stillUrl:x.still_url||'',imageSource:x.image_source||'',source:x.source||'',sourceUrl:x.source_url||'',tags:x.tags||[]}));
  if(!br.error&&br.data?.length)books=br.data.map(x=>({id:x.id,title:x.title,author:x.author||'',status:x.status||'',rating:x.rating,category:x.category||'',subcategory:x.subcategory||'',review:x.review||'',cover_url:x.cover_url||'',coverUrl:x.cover_url||'',source:x.source||'',tags:x.tags||[]}));
  render();
}
async function archiveLogin(){
  if(!supabaseClient)return toast('Supabase 연결을 불러오는 중이에요.');
  const email=(document.getElementById('archive-email')?.value||'').trim(),password=document.getElementById('archive-password')?.value||'';
  if(!email||!password)return toast('이메일과 비밀번호를 입력해줘.');
  const {error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error)return toast('로그인하지 못했어요. 이메일과 비밀번호를 확인해줘.');
  toast('ADMIN MODE로 로그인했어요.');render();
}
async function archiveLogout(){if(supabaseClient)await supabaseClient.auth.signOut();Object.keys(privateMemoCache).forEach(k=>delete privateMemoCache[k]);render()}
function archiveLoginPanel(){
  if(archiveSignedIn())return '<div class="archive-auth-status"><span>ADMIN MODE</span><button class="btn secondary" onclick="archiveLogout()">LOG OUT</button></div>';
  return '<div class="admin-lock"><div class="eyebrow accent-label">ADMIN LOGIN</div><h2>개인 아카이브 편집</h2><input id="archive-email" class="search" type="email" autocomplete="username" placeholder="Email"><input id="archive-password" class="search" type="password" autocomplete="current-password" placeholder="Password"><div class="actions"><button class="btn" onclick="archiveLogin()">LOG IN</button></div></div>';
}
async function loadPrivateMemo(itemType,itemId){
  if(!archiveSignedIn()||!supabaseClient)return '';
  const k=itemType+':'+itemId;if(k in privateMemoCache)return privateMemoCache[k];
  const {data,error}=await supabaseClient.from('private_memos').select('memo').eq('item_type',itemType).eq('item_id',itemId).maybeSingle();
  if(error)return '';privateMemoCache[k]=data?.memo||'';return privateMemoCache[k];
}
async function hydratePrivateMemo(itemType,itemId){
  if(!archiveSignedIn())return;const el=document.getElementById('private-memo');if(el)el.value=await loadPrivateMemo(itemType,itemId);
}
async function savePrivateMemo(itemType,itemId){
  if(!archiveSignedIn()||!supabaseClient)return toast('ADMIN 로그인이 필요해요.');
  const memo=document.getElementById('private-memo')?.value||'';
  const {error}=await supabaseClient.from('private_memos').upsert({item_type:itemType,item_id:itemId,memo},{onConflict:'item_type,item_id'});
  if(error)return toast('비공개 메모를 저장하지 못했어요.');
  privateMemoCache[itemType+':'+itemId]=memo;toast('비공개 메모를 저장했어요.');
}
async function saveFilmArchive(id){
  if(!archiveSignedIn()||!supabaseClient)return toast('ADMIN 로그인이 필요해요.');
  const rating=parseFloat(document.getElementById('archive-rating')?.value)||null,review=document.getElementById('archive-review')?.value||'';
  const {data,error}=await supabaseClient.from('films').update({rating,review}).eq('id',id).select().single();
  if(error)return toast('기록을 저장하지 못했어요.');
  const x=library.find(v=>v.id===id);if(x){x.rating=data.rating;x.review=data.review||''}toast('별점과 공개 리뷰를 저장했어요.');render();
}
async function saveBookArchive(id){
  if(!archiveSignedIn()||!supabaseClient)return toast('ADMIN 로그인이 필요해요.');
  const rating=parseFloat(document.getElementById('archive-rating')?.value)||null,review=document.getElementById('archive-review')?.value||'';
  const {data,error}=await supabaseClient.from('books').update({rating,review}).eq('id',id).select().single();
  if(error)return toast('책 기록을 저장하지 못했어요.');
  const x=books.find(v=>v.id===id);if(x){x.rating=data.rating;x.review=data.review||''}toast('별점과 공개 리뷰를 저장했어요.');render();
}
function openArchiveEditor(itemType,itemId){if(!archiveSignedIn())return;window._archiveEdit=itemType+':'+itemId;render()}
function closeArchiveEditor(){window._archiveEdit='';render()}
function archiveRecordSection(x,itemType){
  const review=escapeHtml(x.review||'').replace(/\n/g,'<br>');
  const editing=archiveSignedIn()&&window._archiveEdit===itemType+':'+x.id;
  const editButton=archiveSignedIn()?'<button class="archive-edit-trigger" onclick="openArchiveEditor(\''+itemType+'\',\''+escapeAttr(x.id)+'\')">EDIT</button>':'';
  const publicView='<section class="section archive-record"><div class="archive-record-head"><div class="eyebrow accent-label">MY RATING</div>'+editButton+'</div><div class="archive-rating-display">'+(x.rating?'★ '+escapeHtml(x.rating):'—')+'</div><div class="eyebrow accent-label archive-review-label">REVIEW</div><div class="archive-review-public">'+(review||'<span class="muted">아직 공개 리뷰가 없습니다.</span>')+'</div></section>';
  if(!editing)return publicView;
  setTimeout(()=>hydratePrivateMemo(itemType,x.id),0);
  const options=['','0.5','1','1.5','2','2.5','3','3.5','4','4.5','5'].map(v=>'<option value="'+v+'" '+(String(x.rating||'')===v?'selected':'')+'>'+(v?'★ '+v:'—')+'</option>').join('');
  const saveFn=itemType==='book'?'saveBookArchive':'saveFilmArchive';
  return publicView+'<section class="section archive-editor"><div class="archive-editor-head"><div><div class="eyebrow accent-label">EDIT RECORD</div><h2>별점과 리뷰 수정</h2></div><button class="archive-edit-close" onclick="closeArchiveEditor()">CLOSE</button></div><div class="admin-grid"><label class="admin-label">RATING<select id="archive-rating" class="select">'+options+'</select></label></div><label class="admin-label">PUBLIC REVIEW<textarea id="archive-review">'+escapeHtml(x.review||'')+'</textarea></label><div class="actions"><button class="btn" onclick="'+saveFn+"('"+escapeAttr(x.id)+"')"+'">SAVE REVIEW</button></div><div class="private-memo-box"><div class="eyebrow accent-label">PRIVATE MEMO</div><p class="small muted">로그인한 본인에게만 보입니다.</p><textarea id="private-memo"></textarea><div class="actions"><button class="btn secondary" onclick="savePrivateMemo(\''+itemType+'\',\''+escapeAttr(x.id)+'\')">SAVE MEMO</button></div></div></section>';
}
