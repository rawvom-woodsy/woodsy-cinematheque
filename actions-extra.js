/* Operational enhancements loaded after the base actions. */
function toggleMobileMenu(){
  const menu=document.getElementById('mobile-menu'),btn=document.querySelector('.mobile-menu-button');
  if(!menu)return;
  const open=menu.classList.toggle('open');
  btn?.setAttribute('aria-expanded',open?'true':'false');
}

function linesFrom(id){return (document.getElementById(id)?.value||'').split(/\r?\n/).map(x=>x.trim()).filter(Boolean)}
function commaFrom(id){return (document.getElementById(id)?.value||'').split(',').map(x=>x.trim()).filter(Boolean)}

saveAdminMonth=function(){
  const mid=document.getElementById('admin-month-select').value;
  const title=document.getElementById('admin-month-title').value.trim();
  const lines=document.getElementById('admin-month-lines').value.split('|').map(x=>x.trim()).filter(Boolean);
  const o={title,titleLines:lines.length?lines:[title],ko:document.getElementById('admin-month-ko').value.trim(),featureId:document.getElementById('admin-month-feature').value,note:document.getElementById('admin-month-note').value,concepts:commaFrom('admin-month-concepts')};
  admin.months=admin.months||{};admin.months[mid]=o;Object.assign(months[mid],o);saveAdmin();toast('월 프로그램을 저장했어요.');render()
};

saveAdminWork=function(){
  const id=document.getElementById('admin-work-select').value,w=byId[id];if(!w)return;
  admin.works=admin.works||{};admin.editorial=admin.editorial||{};admin.curation=admin.curation||{};admin.stills=admin.stills||{};
  const basic={title:document.getElementById('admin-work-title').value.trim(),originalTitle:document.getElementById('admin-work-original').value.trim(),creator:document.getElementById('admin-work-creator').value.trim(),year:parseInt(document.getElementById('admin-work-year').value)||w.year,role:document.getElementById('admin-work-role').value};
  admin.works[id]=basic;Object.assign(w,basic);
  const curation={service:document.getElementById('admin-work-service').value.trim(),checked:document.getElementById('admin-work-checked').value.trim(),connections:commaFrom('admin-work-connections'),concepts:commaFrom('admin-work-concepts'),focal:document.getElementById('admin-still-position').value.trim()||'50% 50%'};
  admin.curation[id]=curation;Object.assign(w,curation);
  const qt=document.getElementById('admin-quote-text').value.trim();
  admin.editorial[id]={logline:document.getElementById('admin-work-logline').value.trim(),viewingPoints:linesFrom('admin-work-points'),keywords:commaFrom('admin-work-keywords'),references:linesFrom('admin-work-references'),connections:curation.connections,concepts:curation.concepts,service:curation.service,checked:curation.checked,focal:curation.focal,quote:qt?{kind:document.getElementById('admin-quote-kind').value,text:qt,original:document.getElementById('admin-quote-original').value.trim(),en:document.getElementById('admin-quote-en').value.trim(),source:document.getElementById('admin-quote-source').value.trim()}:null};
  const so={visualType:document.getElementById('admin-visual-type')?.value||((w.type==='book')?'cover':'still'),url:document.getElementById('admin-still-url').value.trim(),source:document.getElementById('admin-still-source').value.trim(),position:curation.focal};
  admin.stills[id]=so;stills[id]={...(stills[id]||{}),...so};
  saveAdmin();toast('작품 큐레이션을 저장했어요.');render()
};

saveMonthNote=function(){
  state.monthNotes[state.selectedMonth]=document.getElementById('month-note').value;
  state.monthNoteUpdated=state.monthNoteUpdated||{};state.monthNoteUpdated[state.selectedMonth]=new Date().toISOString();
  save();toast('월별 메모를 저장했어요.')
};
saveWorkNote=function(id){
  state.notes[id]=document.getElementById('work-note').value;
  state.noteUpdated=state.noteUpdated||{};state.noteUpdated[id]=new Date().toISOString();
  save();toast('작품 메모를 저장했어요.');render()
};

function filterLibraryRows(){
  const q=(document.getElementById('lib-q')?.value||'').trim().toLowerCase(),type=document.getElementById('lib-type')?.value||'all',status=document.getElementById('lib-status')?.value||'all';
  let count=0;
  document.querySelectorAll('.library-item').forEach(row=>{const show=(!q||(row.dataset.search||'').includes(q))&&(type==='all'||row.dataset.type===type)&&(status==='all'||row.dataset.status===status);row.hidden=!show;if(show)count++});
  const el=document.getElementById('library-count');if(el)el.textContent=String(count)
}

function watchaPlan(text){
  const rows=parseCSV(text);if(rows.length<2)return {error:'CSV 내용을 읽지 못했어요.'};
  const head=rows[0].map(x=>x.trim()),idx=n=>head.findIndex(h=>h.toLowerCase()===n.toLowerCase());
  const ix={id:idx('ID'),url:idx('URL'),title:idx('Title'),type:idx('Type'),year:idx('Year'),directors:idx('Directors'),rating:idx('Rating')};
  if(ix.title<0||ix.type<0)return {error:'필수 열 Title / Type을 찾지 못했습니다.',head};
  let valid=0,match=0,skip=0;
  for(const r of rows.slice(1)){const title=(r[ix.title]||'').trim(),rawType=(r[ix.type]||'').trim().toUpperCase(),type=rawType==='MOVIE'?'film':rawType==='TV'?'series':null;if(!title||!type){skip++;continue}valid++;const year=ix.year>=0?(parseInt(r[ix.year])||null):null;if(works.some(w=>normalize(w.title)===normalize(title)&&w.type===type&&(!year||w.year===year)))match++}
  return {rows,head,ix,valid,match,skip}
}
async function previewWatcha(){
  const box=document.getElementById('watcha-preview'),f=document.getElementById('watcha-file')?.files?.[0];if(!box||!f)return;
  const plan=watchaPlan(await f.text());
  if(plan.error){box.innerHTML='<strong>확인 필요</strong><br>'+escapeHtml(plan.error);box.classList.add('error');return}
  box.classList.remove('error');box.innerHTML='<strong>'+plan.valid.toLocaleString()+'건 인식</strong><br>커리큘럼 작품과 '+plan.match.toLocaleString()+'건 연결 예상 · '+plan.skip.toLocaleString()+'건 건너뜀'
}
importWatcha=async function(){
  const f=document.getElementById('watcha-file')?.files?.[0];if(!f)return toast('CSV 파일을 선택해줘.');
  const plan=watchaPlan(await f.text());if(plan.error)return toast(plan.error);
  const {rows,ix}=plan;let added=0,matched=0,skipped=0,errors=0;
  for(const r of rows.slice(1)){try{const title=(r[ix.title]||'').trim();if(!title){skipped++;continue}const rawType=(r[ix.type]||'').trim().toUpperCase(),type=rawType==='MOVIE'?'film':rawType==='TV'?'series':null;if(!type){skipped++;continue}const year=ix.year>=0?(parseInt(r[ix.year])||null):null,ext=ix.id>=0?(r[ix.id]||'').trim():'';const key='watcha:'+(ext||normalize(title)+'-'+(year||''));const canonical=works.find(w=>normalize(w.title)===normalize(title)&&w.type===type&&(!year||w.year===year));const existing=library.find(x=>x.id===key)||(canonical&&library.find(x=>x.canonicalId===canonical.id));const obj={id:key,canonicalId:canonical?.id||existing?.canonicalId,title,originalTitle:'',type,year,creator:ix.directors>=0?(r[ix.directors]||'').trim():'',rating:ix.rating>=0?(parseFloat(r[ix.rating])||null):null,historicalStatus:'watched',source:'Watchapedia',sourceUrl:ix.url>=0?(r[ix.url]||'').trim():'',tags:[]};if(existing){Object.assign(existing,obj);matched++}else{library.push(obj);added++}}catch{errors++}}
  save();const out=document.getElementById('import-result');if(out)out.textContent='추가 '+added.toLocaleString()+' · 매칭 '+matched.toLocaleString()+' · 건너뜀 '+skipped.toLocaleString()+' · 오류 '+errors.toLocaleString()
};

/* Reset manual editor overrides without deleting imported curriculum packages. */
resetAdminOverrides=function(){
  if(!confirm('관리자에서 직접 수정한 내용만 기본값으로 되돌릴까요? 가져온 커리큘럼은 유지됩니다.'))return;
  admin={
    months:{},works:{},stills:{},editorial:{},curation:{},
    importedMonths:admin.importedMonths||{},
    importedWorks:admin.importedWorks||{},
    importedCuration:admin.importedCuration||{},
    importedEditorial:admin.importedEditorial||{},
    importedStills:admin.importedStills||{}
  };
  saveAdmin();location.reload();
};
