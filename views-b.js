function notesPage(){
  const entries=Object.entries(state.notes).filter(([,v])=>v&&v.trim()).sort((a,b)=>String(state.noteUpdated?.[b[0]]||'').localeCompare(String(state.noteUpdated?.[a[0]]||'')));
  const monthEntries=Object.entries(state.monthNotes).filter(([,v])=>v&&v.trim()).sort((a,b)=>String(state.monthNoteUpdated?.[b[0]]||'').localeCompare(String(state.monthNoteUpdated?.[a[0]]||'')));
  return `${appHeader('#notes')}<main class="shell"><section class="hero"><div class="eyebrow accent-label">NOTES</div><h1>관찰과 연결의 기록</h1><p class="lede">작품을 본 뒤 남긴 문장과 한 달 전체를 돌아보며 남긴 메모를 최근 수정 순으로 모읍니다.</p></section><section class="section notes-list"><div class="section-head"><div><div class="eyebrow accent-label">WORK NOTES</div><h2>작품 메모</h2></div><span class="small muted">${entries.length}</span></div>${entries.length?entries.map(([id,t])=>`<div class="note-item"><div><a href="#work/${id}"><strong>${formatTitle(byId[id]||library.find(r=>r.id===id)||{title:id,type:'film'})}</strong></a>${state.noteUpdated?.[id]?`<div class="small muted">${formatDateKo(state.noteUpdated[id])}</div>`:''}</div><div class="note-preview">${escapeHtml(t).slice(0,240)}</div></div>`).join(''):'<div class="empty">아직 작품 메모가 없습니다.</div>'}</section><section class="section notes-list"><div class="section-head"><div><div class="eyebrow accent-label">MONTH NOTES</div><h2>월별 메모</h2></div><span class="small muted">${monthEntries.length}</span></div>${monthEntries.length?monthEntries.map(([mid,t])=>`<div class="note-item"><div><strong>${months[mid]?.label||mid}</strong>${state.monthNoteUpdated?.[mid]?`<div class="small muted">${formatDateKo(state.monthNoteUpdated[mid])}</div>`:''}</div><div class="note-preview">${escapeHtml(t).slice(0,300)}</div></div>`).join(''):'<div class="empty">아직 월별 메모가 없습니다.</div>'}</section></main>`
}
function mapPage(){
  const m=month(),ids=[...m.core,...m.supp],p=progress(state.selectedMonth),doneIds=ids.filter(id=>isDone(state.selectedMonth,id));
  const center={x:430,y:270},pos={};
  m.core.forEach((id,i)=>{const a=(Math.PI*2*i/m.core.length)-Math.PI/2;pos[id]={x:center.x+190*Math.cos(a),y:center.y+150*Math.sin(a)}});
  m.supp.forEach((id,i)=>{const a=(Math.PI*2*i/m.supp.length)-Math.PI/2;pos[id]={x:center.x+330*Math.cos(a),y:center.y+225*Math.sin(a)}});
  const seen=new Set(),edges=[];
  for(const id of ids){for(const t of connectionIds(id)){if(!ids.includes(t))continue;const k=[id,t].sort().join('|');if(!seen.has(k)){seen.add(k);edges.push([id,t])}}}
  const unlocked=unlockedConcepts(state.selectedMonth);
  return `${appHeader('#map')}<main class="shell">
    <section class="hero program-hero"><div class="eyebrow accent-label">MAP · ${m.label}</div><h1>관계의 지도</h1><p class="lede">처음에는 이름 없는 점만 남아 있습니다. 작품을 완료할수록 제목과 연결선이 드러나며 한 달의 지도가 별자리처럼 완성됩니다.</p>${monthSwitcher()}${progressHtml(state.selectedMonth)}</section>
    <section class="section">
      <div class="map-status"><div><span class="eyebrow accent-label">CONSTELLATION</span><strong>${doneIds.length} / ${ids.length} nodes revealed</strong></div><div class="map-concepts">${unlocked.map(c=>`<span>◆ ${escapeHtml(c)}</span>`).join('')}</div></div>
      <div class="mapbox constellation"><div class="map-inner"><svg class="map-lines">${edges.map(([a,b])=>{const on=isDone(state.selectedMonth,a)&&isDone(state.selectedMonth,b);return `<line class="${on?'active-line':'locked-line'}" x1="${pos[a].x}" y1="${pos[a].y}" x2="${pos[b].x}" y2="${pos[b].y}"/>`}).join('')}</svg>
      ${ids.map(id=>{const w=byId[id],pt=pos[id],done=isDone(state.selectedMonth,id),core=m.core.includes(id);return `<button class="star-node ${core?'core':'supplementary'} ${done?'revealed':'locked'}" style="left:${pt.x}px;top:${pt.y}px" ${done?`onclick="navTo('#work/${id}')"`:'disabled'} aria-label="${escapeAttr(w.title)} ${done?'활성':'잠김'}"><i></i><span>${done?escapeHtml(w.title):''}</span></button>`}).join('')}
      <div class="constellation-center" style="left:${center.x}px;top:${center.y}px"><span>${p.done?escapeHtml(m.ko):'· · ·'}</span></div></div></div>
      <div class="map-legend"><span><i class="legend-dot done-dot"></i>완료하면 제목 공개</span><span>● CORE</span><span>◆ SUPPLEMENTARY</span></div>
    </section>
  </main>`
}
function archivePage(){
  return `${appHeader('#archive')}<main class="shell"><section class="hero"><div class="eyebrow accent-label">ARCHIVE</div><h1>완성된 챕터</h1><p class="lede">한 달이 끝나면 감상한 영화, 선택한 가지, 열린 개념과 메모가 하나의 챕터로 남습니다.</p></section><section class="archive-chapters">${Object.entries(months).map(([mid,m],idx)=>{const p=progress(mid),doneCore=m.core.filter(id=>isDone(mid,id)),branches=m.supp.filter(id=>isAdded(mid,id)),concepts=unlockedConcepts(mid),complete=p.done===p.total;return `<article class="archive-chapter ${complete?'complete':''}"><header><div class="chapter-number">CHAPTER ${String(idx+1).padStart(2,'0')}</div><div class="eyebrow ${complete?'accent-label':''}">${m.label}</div><h2>${m.title}</h2><p>${m.ko}</p><div class="chapter-progress"><strong>${p.done}/${p.total}</strong><span>${complete?'CHAPTER COMPLETE':'IN PROGRESS'}</span></div></header><div class="chapter-body"><section><div class="eyebrow accent-label">WATCHED</div><ol class="archive-work-list">${doneCore.length?doneCore.map(id=>`<li><a href="#work/${id}">${formatTitle(byId[id])}</a><span>${formatDateKo(completionDate(mid,id))}</span></li>`).join(''):'<li class="muted">아직 완료한 핵심 작품이 없습니다.</li>'}</ol></section><section><div class="eyebrow accent-label">MY BRANCHES</div><div class="chapter-branches">${branches.length?branches.map(id=>`<a href="#work/${id}">${formatTitle(byId[id])}</a>`).join(''):'<span class="muted">선택한 보조 텍스트가 없습니다.</span>'}</div></section><section><div class="eyebrow accent-label">UNLOCKED CONCEPTS</div><div class="concept-list">${concepts.length?concepts.map(c=>`<span>◆ ${escapeHtml(c)}</span>`).join(''):'<span class="muted">아직 열린 개념이 없습니다.</span>'}</div></section><section class="chapter-note"><div class="eyebrow accent-label">MONTH NOTE</div><p>${escapeHtml(state.monthNotes[mid]||'아직 월별 메모가 없습니다.')}</p></section></div></article>`}).join('')}</section></main>`
}
function importPage(){return `${appHeader('#import')}<main class="shell"><section class="hero"><div class="eyebrow accent-label">IMPORT / BACKUP</div><h1>MASTER LIBRARY 가져오기</h1><p class="lede">CSV를 선택하면 먼저 구조를 확인하고 예상 추가·매칭 건수를 보여줍니다. 리뷰와 스포일러 본문은 저장하지 않습니다.</p></section><section class="section"><div class="grid two"><div class="filebox"><div class="eyebrow accent-label">WATCHAPEDIA CSV</div><h3>감상 기록 가져오기</h3><input type="file" id="watcha-file" accept=".csv,text/csv"><div id="watcha-preview" class="import-preview">파일을 선택하면 미리보기가 표시됩니다.</div><div class="actions"><button class="btn" onclick="importWatcha()">확인 후 가져오기</button></div></div><div class="filebox"><div class="eyebrow accent-label">BACKUP</div><h3>JSON 내보내기 / 복원</h3><div class="actions"><button class="btn secondary" onclick="exportBackup()">JSON 내보내기</button><label class="btn secondary">JSON 복원<input type="file" id="restore-file" accept="application/json,.json" style="display:none" onchange="restoreBackup(this.files[0])"></label></div></div></div></section><section class="section"><div class="grid two"><div class="filebox"><div class="eyebrow accent-label">ADD A BOOK</div><h3>책 단일 추가</h3><input class="search" id="book-title" placeholder="제목"><input class="search" id="book-author" placeholder="저자"><input class="search" id="book-year" placeholder="연도" inputmode="numeric"><div class="actions"><button class="btn" onclick="addBook()">READ로 추가</button></div></div><div><div class="eyebrow accent-label">IMPORT RESULT</div><div id="import-result" class="notice">아직 가져온 파일이 없습니다.</div><div class="actions"><button class="btn secondary" onclick="resetAll()">모든 로컬 기록 초기화</button></div></div></div></section></main>`}
function adminPage(){
  if(!isAdminUnlocked()){
    return `${appHeader('#admin')}<main class="shell">
      <section class="hero"><div class="eyebrow accent-label">ADMIN MODE</div><h1>관리자 확인</h1><p class="lede">텍스트와 스틸 수정 기능은 간단한 코드 확인 후 열립니다.</p></section>
      <section class="section"><div class="admin-lock"><div class="eyebrow accent-label">ACCESS CODE</div><h2>4자리 코드를 입력하세요</h2><input id="admin-code" class="search admin-code" type="password" inputmode="numeric" maxlength="4" autocomplete="off" aria-label="관리자 코드"><div class="actions"><button class="btn" onclick="adminLogin()">관리자 모드 열기</button></div></div></section>
    </main>`;
  }
  const mid=window._adminMonth||state.selectedMonth;
  const m=months[mid]||month();
  const wid=window._adminWork||m.core[0];
  const w=byId[wid]||works[0];
  const st=stills[wid]||{};
  return `${appHeader('#admin')}<main class="shell">
    <section class="hero"><div class="eyebrow accent-label">ADMIN MODE</div><h1>텍스트와 스틸 직접 수정</h1>
      <p class="lede">여기서 바꾼 내용은 이 브라우저에만 저장됩니다. GitHub 원본 파일은 건드리지 않으며 JSON 백업에 함께 포함됩니다.</p>
      <div class="actions"><button class="btn secondary" onclick="adminLogout()">관리자 모드 잠그기</button></div>
      <div class="notice">월 제목·소제목·프로그램 노트, 작품 제목·원제·감독/저자·연도·역할·스틸 URL과 출처를 직접 수정할 수 있어요.</div>
    </section>
    <section class="section"><div class="grid two">
      <div class="admin-panel"><div class="eyebrow accent-label">MONTH TEXT</div><h2>월별 텍스트</h2>
        <select id="admin-month-select" class="select" onchange="adminSelectMonth(this.value)">
          ${Object.entries(months).map(([id,x])=>`<option value="${id}" ${id===mid?'selected':''}>${x.label}</option>`).join('')}
        </select>
        <label class="admin-label">영문 제목<input id="admin-month-title" class="search" value="${escapeAttr(m.title)}"></label>
        <label class="admin-label">한국어 소제목<input id="admin-month-ko" class="search" value="${escapeAttr(m.ko)}"></label>
        <label class="admin-label">프로그램 노트<textarea id="admin-month-note">${escapeHtml(m.note)}</textarea></label>
        <label class="admin-label">개념 키워드 · 쉼표로 구분<input id="admin-month-concepts" class="search" value="${escapeAttr(m.concepts.join(', '))}"></label>
        <div class="actions"><button class="btn" onclick="saveAdminMonth()">월 텍스트 저장</button></div>
      </div>
      <div class="admin-panel"><div class="eyebrow accent-label">WORK TEXT / STILL</div><h2>작품 정보</h2>
        <select id="admin-work-select" class="select" onchange="adminSelectWork(this.value)">
          ${works.map(x=>`<option value="${x.id}" ${x.id===wid?'selected':''}>${escapeHtml(formatTitle(x))} · ${x.year}</option>`).join('')}
        </select>
        <label class="admin-label">표시 제목<input id="admin-work-title" class="search" value="${escapeAttr(w.title)}"></label>
        <label class="admin-label">원제<input id="admin-work-original" class="search" value="${escapeAttr(w.originalTitle||'')}"></label>
        <label class="admin-label">감독 / 저자<input id="admin-work-creator" class="search" value="${escapeAttr(w.creator||'')}"></label>
        <label class="admin-label">연도<input id="admin-work-year" class="search" inputmode="numeric" value="${w.year||''}"></label>
        <label class="admin-label">역할
          <select id="admin-work-role" class="select">
            ${['CORE','LONG FORM','READING','EXPLORE','CONNECTED'].map(x=>`<option ${x===w.role?'selected':''}>${x}</option>`).join('')}
          </select>
        </label>
        <label class="admin-label">스틸 이미지 URL<input id="admin-still-url" class="search" value="${escapeAttr(st.url||'')}"></label>
        <label class="admin-label">스틸 출처<input id="admin-still-source" class="search" value="${escapeAttr(st.source||'')}"></label>
        <div class="admin-preview">${visualHtml(w)}</div>
        <div class="actions"><button class="btn" onclick="saveAdminWork()">작품 정보 저장</button></div>
      </div>
    </div></section>
    <section class="section"><div class="eyebrow accent-label">RESET OVERRIDES</div><h2>사용자 수정만 초기화</h2>
      <p class="program-note">진행률·메모·MASTER LIBRARY는 유지하고 관리자 모드에서 수정한 텍스트/스틸만 기본값으로 되돌립니다.</p>
      <button class="btn secondary" onclick="resetAdminOverrides()">관리자 수정 초기화</button>
    </section>
  </main>`;
}
function notFound(){return `${appHeader('')}<main class="shell"><section class="hero"><div class="eyebrow">404</div><h1>상영 예정이 없습니다</h1><button class="btn" onclick="navTo('#home')">홈으로</button></section></main>`}
function render(){const r=route();let html;if(r==='#home')html=home();else if(r==='#curriculum')html=curriculum();else if(r==='#library')html=libraryPage();else if(r==='#notes')html=notesPage();else if(r==='#map')html=mapPage();else if(r==='#archive')html=archivePage();else if(r==='#import')html=importPage();else if(r==='#admin')html=adminPage();else if(r.startsWith('#work/'))html=workPage(r.split('/')[1]);else html=notFound();document.getElementById('app').innerHTML=html}
