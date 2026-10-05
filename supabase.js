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
  if(typeof loadConnections==='function')await loadConnections();
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
    fetchAllRows('films','id,title,original_title,type,year,creator,rating,review,status,poster_url,still_url,image_source,crop_position,source,source_url,tags'),
    fetchAllRows('books','id,title,author,status,rating,category,subcategory,review,cover_url,source,tags')
  ]);
  if(!fr.error&&fr.data?.length)library=fr.data.map(x=>({id:x.id,title:x.title,originalTitle:x.original_title||'',type:x.type,year:x.year,creator:x.creator||'',rating:x.rating,review:x.review||'',historicalStatus:x.status||'watched',posterUrl:x.poster_url||'',stillUrl:x.still_url||'',imageSource:x.image_source||'',cropPosition:x.crop_position||'center',source:x.source||'',sourceUrl:x.source_url||'',tags:x.tags||[]}));
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
  if(archiveSignedIn())return '<div class="archive-auth-status"><span>ADMIN MODE</span><div class="actions"><button id="poster-batch-01" class="btn" onclick="runPosterBatch01()">ARCHIVE POSTERS · BATCH 01</button><button class="btn secondary" onclick="archiveLogout()">LOG OUT</button></div><div id="poster-batch-status" class="small muted"></div></div>';
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
const POSTER_BATCH_01=[
  {id:'watcha:mWyaqgk',title:'챌린저스',url:'https://www.impawards.com/2024/posters/challengers.jpg'},
  {id:'watcha:mdMR0yl',title:'바텀스',url:'https://www.impawards.com/2023/posters/bottoms.jpg'},
  {id:'watcha:m5x110a',title:'로봇 드림',url:'https://www.impawards.com/intl/misc/2023/posters/robot_dreams.jpg'},
  {id:'watcha:m5ekm1K',title:'파벨만스',url:'https://www.impawards.com/2022/posters/fabelmans.jpg'},
  {id:'watcha:mWvqk9E',title:'바빌론',url:'https://www.impawards.com/2022/posters/babylon.jpg'},
  {id:'watcha:mOVP2rN',title:'파워 오브 도그',url:'https://www.impawards.com/2021/posters/power_of_the_dog_ver5.jpg'},
  {id:'watcha:m5aVG6j',title:'로마',url:'https://www.impawards.com/intl/mexico/2018/posters/roma.jpg'},
  {id:'watcha:mdEwrjm',title:'서스페리아',url:'https://www.impawards.com/2018/posters/suspiria_ver26.jpg'}
];
const POSTER_BATCH_02=[
 {id:'watcha:mO079w7',title:'에브리씽 에브리웨어 올 앳 원스',url:'https://www.impawards.com/2022/posters/everything_everywhere_all_at_once_ver2.jpg'},
 {id:'watcha:md6l8JX',title:'사랑할 땐 누구나 최악이 된다',url:'https://www.impawards.com/intl/norway/2021/posters/verdens_verste_menneske_ver3.jpg'},
 {id:'watcha:mOPVojY',title:'퍼스트 카우',url:'https://www.impawards.com/2020/posters/first_cow.jpg'},
 {id:'watcha:m5agBNG',title:'두 교황',url:'https://www.impawards.com/2019/posters/two_popes.jpg'},
 {id:'watcha:mWyJKlY',title:'메리 포핀스 리턴즈',url:'https://www.impawards.com/2018/posters/mary_poppins_returns_ver7.jpg'},
 {id:'watcha:mOgBjN9',title:'카메라를 멈추면 안 돼!',url:'https://www.impawards.com/intl/japan/2017/posters/kamera_o_tomeru_na.jpg'},
 {id:'watcha:m5XMArN',title:'바닷마을 다이어리',url:'https://www.impawards.com/intl/japan/2015/posters/umimachi_diary.jpg'}
];
async function invokePosterImport(p,timeoutMs=20000){
  try{
    const call=supabaseClient.functions.invoke('import-film-poster',{body:{filmId:p.id,imageUrl:p.url}});
    const timeout=new Promise(resolve=>setTimeout(()=>resolve({__timeout:true}),timeoutMs));
    const result=await Promise.race([call,timeout]);
    if(result?.__timeout)return {ok:false,error:'timeout'};
    const {data,error}=result;
    return {ok:!error&&!!data?.ok,data,error};
  }catch(error){return {ok:false,error}}
}
async function runPosterBatch(batch,label){
 if(!archiveSignedIn()||!supabaseClient)return toast('ADMIN 로그인이 필요해요.');
 const btn=document.getElementById('poster-batch-'+label),status=document.getElementById('poster-batch-status');
 if(btn)btn.disabled=true;
 let ok=0,failed=[];
 for(let n=0;n<batch.length;n++){
  const p=batch[n];if(status)status.textContent=(n+1)+' / '+batch.length+' · '+p.title;
  const r=await invokePosterImport(p);
  if(r.ok){ok++;const x=library.find(v=>v.id===p.id);if(x){x.posterUrl=r.data.film.poster_url;x.imageSource=r.data.film.image_source}}
  else failed.push(p.title);
 }
 if(status)status.textContent='BATCH '+label+' 완료 '+ok+'편'+(failed.length?' · 실패 '+failed.length+'편: '+failed.join(', '):'');
 if(btn)btn.disabled=false;toast(ok+'편의 포스터를 아카이브에 저장했어요.');render();
}
async function runPosterBatch02(){return runPosterBatch(POSTER_BATCH_02,'02')}
const POSTER_BATCH_03=[
 {id:'watcha:m5NngLE',title:'6번 칸',url:'https://www.impawards.com/intl/finland/2021/posters/hytti_nro_6.jpg'},
 {id:'watcha:mOlwgNe',title:'파비안느에 관한 진실',url:'https://www.impawards.com/intl/france/2019/posters/la_verite.jpg'},
 {id:'watcha:mO2Mo6N',title:'태풍이 지나가고',url:'https://www.impawards.com/intl/japan/2016/posters/umi_yori_mo_mada_fukaku_ver3.jpg'}
];
async function runPosterBatch03(){return runPosterBatch(POSTER_BATCH_03,'03')}

async function runPosterBatch01(){
  if(!archiveSignedIn()||!supabaseClient)return toast('ADMIN 로그인이 필요해요.');
  const btn=document.getElementById('poster-batch-01'),status=document.getElementById('poster-batch-status');
  if(btn)btn.disabled=true;
  let ok=0,failed=[];
  for(let n=0;n<POSTER_BATCH_01.length;n++){
    const p=POSTER_BATCH_01[n];
    if(status)status.textContent=(n+1)+' / '+POSTER_BATCH_01.length+' · '+p.title;
    const {data,error}=await supabaseClient.functions.invoke('import-film-poster',{body:{filmId:p.id,imageUrl:p.url}});
    if(!error&&data?.ok){
      ok++;
      const x=library.find(v=>v.id===p.id);if(x){x.posterUrl=data.film.poster_url;x.imageSource=data.film.image_source}
    }else failed.push(p.title);
  }
  if(status)status.textContent='완료 '+ok+'편'+(failed.length?' · 실패 '+failed.length+'편: '+failed.join(', '):'');
  if(btn)btn.disabled=false;
  toast(ok+'편의 포스터를 아카이브에 저장했어요.');
  render();
}
async function importFilmPosterUrl(id){
  if(!archiveSignedIn()||!supabaseClient)return toast('ADMIN 로그인이 필요해요.');
  const imageUrl=(document.getElementById('archive-poster-url')?.value||'').trim();
  if(!imageUrl)return toast('포스터 원본 URL을 입력해주세요.');
  let parsed;try{parsed=new URL(imageUrl)}catch{return toast('올바른 URL을 입력해주세요.')}
  if(!/^https?:$/.test(parsed.protocol))return toast('http/https URL만 사용할 수 있어요.');
  toast('포스터를 아카이브로 가져오는 중이에요…');
  const {data,error}=await supabaseClient.functions.invoke('import-film-poster',{body:{filmId:id,imageUrl}});
  if(error||!data?.ok)return toast('포스터 가져오기에 실패했어요.');
  const x=library.find(v=>v.id===id);if(x){x.posterUrl=data.film.poster_url;x.imageSource=data.film.image_source}
  toast('포스터를 아카이브에 저장했어요.');render();
}
async function uploadFilmPoster(id){
  if(!archiveSignedIn()||!supabaseClient)return toast('ADMIN 로그인이 필요해요.');
  const input=document.getElementById('archive-poster-file'),file=input?.files?.[0];
  if(!file)return toast('포스터 이미지 파일을 선택해주세요.');
  if(!/^image\/(jpeg|png|webp)$/.test(file.type))return toast('JPG, PNG, WEBP 이미지만 업로드할 수 있어요.');
  if(file.size>10*1024*1024)return toast('포스터 파일은 10MB 이하로 올려주세요.');
  const ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace('jpeg','jpg');
  const safeId=String(id).replace(/[^a-zA-Z0-9_-]/g,'_');
  const path=safeId+'.'+ext;
  const {error:uploadError}=await supabaseClient.storage.from('film-posters').upload(path,file,{upsert:true,contentType:file.type,cacheControl:'3600'});
  if(uploadError)return toast('포스터 업로드에 실패했어요.');
  const {data:urlData}=supabaseClient.storage.from('film-posters').getPublicUrl(path);
  const url=urlData?.publicUrl;
  if(!url)return toast('포스터 주소를 만들지 못했어요.');
  const {data,error}=await supabaseClient.from('films').update({poster_url:url,image_source:'WOODSY ARCHIVE / Supabase Storage'}).eq('id',id).select().single();
  if(error)return toast('포스터 정보를 저장하지 못했어요.');
  const x=library.find(v=>v.id===id);if(x){x.posterUrl=data.poster_url||url;x.imageSource=data.image_source||'WOODSY ARCHIVE / Supabase Storage'}
  toast('포스터를 저장했어요.');render();
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
  const posterEditor=itemType==='film'?'<div class="private-memo-box"><div class="eyebrow accent-label">POSTER</div><p class="small muted">원본 이미지 URL을 가져오거나 파일을 직접 올리면, 우리 Supabase Storage에 영구 보관합니다.</p><label class="admin-label">IMPORT FROM URL<input id="archive-poster-url" class="input" type="url" placeholder="https://…"></label><div class="actions"><button class="btn" onclick="importFilmPosterUrl(\''+escapeAttr(x.id)+'\')">IMPORT TO ARCHIVE</button></div><div class="poster-upload-divider">OR UPLOAD FILE</div><input id="archive-poster-file" type="file" accept="image/jpeg,image/png,image/webp"><div class="actions"><button class="btn secondary" onclick="uploadFilmPoster(\''+escapeAttr(x.id)+'\')">UPLOAD POSTER</button></div></div>':'';
  return publicView+'<section class="section archive-editor"><div class="archive-editor-head"><div><div class="eyebrow accent-label">EDIT RECORD</div><h2>별점과 리뷰 수정</h2></div><button class="archive-edit-close" onclick="closeArchiveEditor()">CLOSE</button></div><div class="admin-grid"><label class="admin-label">RATING<select id="archive-rating" class="select">'+options+'</select></label></div><label class="admin-label">PUBLIC REVIEW<textarea id="archive-review">'+escapeHtml(x.review||'')+'</textarea></label><div class="actions"><button class="btn" onclick="'+saveFn+"('"+escapeAttr(x.id)+"')"+'">SAVE REVIEW</button></div><div class="private-memo-box"><div class="eyebrow accent-label">PRIVATE MEMO</div><p class="small muted">로그인한 본인에게만 보입니다.</p><textarea id="private-memo"></textarea><div class="actions"><button class="btn secondary" onclick="savePrivateMemo(\''+itemType+'\',\''+escapeAttr(x.id)+'\')">SAVE MEMO</button></div></div>'+posterEditor+'</section>';
}
