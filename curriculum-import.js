/* CINEMATHEQUE IMPORT PACKAGE v2 */
function cinemaPackageRaw(){return (document.getElementById('cinema-package')?.value||'').trim();}

function parseCinemaPackage(raw=cinemaPackageRaw()){
  if(!raw)return {error:'패키지를 먼저 붙여넣어 주세요.'};
  let pkg;
  try{pkg=JSON.parse(raw)}catch{return {error:'JSON 형식을 읽을 수 없습니다. 코드 블록 안의 { ... } 부분만 붙여넣어 주세요.'}}
  const m=pkg.month;
  if(!m||typeof m!=='object')return {error:'month 객체가 없습니다.'};
  const mid=String(m.id||m.monthId||'').trim();
  if(!/^\d{4}-\d{2}$/.test(mid))return {error:'month.id는 2027-02 같은 YYYY-MM 형식이어야 합니다.'};
  const incoming=Array.isArray(pkg.works)?pkg.works:[];
  const incomingMap=new Map();
  for(const w of incoming){
    if(!w||typeof w!=='object')continue;
    const id=String(w.id||'').trim();
    if(!id)return {error:'works 안의 모든 작품에는 고유한 id가 필요합니다.'};
    incomingMap.set(id,w);
  }
  const core=[...(m.core||m.coreIds||[])].map(String);
  const supp=[...(m.supp||m.supplementary||m.supplementaryIds||[])].map(String);
  if(!core.length)return {error:'month.core에 최소 한 작품이 필요합니다.'};
  const all=[...core,...supp];
  const missing=all.filter(id=>!byId[id]&&!incomingMap.has(id));
  if(missing.length)return {error:'월 프로그램에 있지만 works에도 기존 데이터에도 없는 ID가 있습니다: '+missing.join(', ')};
  for(const [id,w] of incomingMap){
    if(!byId[id]&&!String(w.title||'').trim())return {error:'신규 작품 '+id+'에 title이 없습니다.'};
    if(!byId[id]&&!String(w.type||'').trim())return {error:'신규 작품 '+id+'에 type이 없습니다.'};
  }
  const newWorks=[...incomingMap.keys()].filter(id=>!byId[id]);
  const reused=all.filter(id=>!!byId[id]);
  const updated=[...incomingMap.keys()].filter(id=>!!byId[id]);
  const concepts=new Set([...(m.concepts||[])]);
  incoming.forEach(w=>(w.concepts||w.editorial?.concepts||pkg.curation?.[w.id]?.concepts||[]).forEach(c=>concepts.add(c)));
  const connections=incoming.reduce((n,w)=>n+((w.connections||w.editorial?.connections||pkg.curation?.[w.id]?.connections||[]).length||0),0);
  return {pkg,month:m,mid,incoming,core,supp,newWorks,reused,updated,concepts:[...concepts],connections,exists:!!months[mid]};
}

function cinemaPackagePreviewHtml(plan){
  if(plan.error)return '<strong>확인 필요</strong><br>'+escapeHtml(plan.error);
  const m=plan.month;
  return '<strong>'+escapeHtml(m.label||plan.mid)+' · '+escapeHtml(m.title||'새 프로그램')+'</strong>'+
    '<div class="package-stats">'+
      '<span><b>'+(plan.exists?'UPDATE':'NEW')+'</b> MONTH</span>'+
      '<span><b>'+plan.core.length+'</b> CORE</span>'+
      '<span><b>'+plan.supp.length+'</b> SUPPLEMENTARY</span>'+
      '<span><b>'+plan.newWorks.length+'</b> NEW WORKS</span>'+
      '<span><b>'+plan.reused.length+'</b> REUSED</span>'+
      '<span><b>'+plan.concepts.length+'</b> CONCEPTS</span>'+
      '<span><b>'+plan.connections+'</b> CONNECTIONS</span>'+
    '</div>'+
    (plan.updated.length?'<p class="small muted">기존 작품 정보 업데이트: '+plan.updated.map(escapeHtml).join(', ')+'</p>':'')+
    '<p class="small muted">반영 후 '+escapeHtml(plan.mid)+'가 현재 월로 열립니다. 기존 완료 기록과 메모는 작품 ID 기준으로 유지됩니다.</p>';
}
function previewCinemathequePackage(){
  const box=document.getElementById('cinema-package-result');if(!box)return;
  const plan=parseCinemaPackage();
  box.innerHTML=cinemaPackagePreviewHtml(plan);
  box.classList.toggle('error',!!plan.error);
  return plan;
}
