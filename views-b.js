function notesPage(){const entries=Object.entries(state.notes).filter(([,v])=>v&&v.trim());const monthsNotes=Object.entries(state.monthNotes).filter(([,v])=>v&&v.trim());return `${appHeader('#notes')}<main class="shell"><section class="hero"><div class="eyebrow">NOTES</div><h1>관찰과 연결의 기록</h1><p class="lede">빈 메모는 보이지 않습니다. 작품 메모와 월별 메모를 한곳에서 다시 찾습니다.</p></section><section class="section notes-list"><div class="eyebrow">WORK NOTES</div>${entries.length?entries.map(([id,text])=>`<div class="note-item"><a href="#work/${id}"><strong>${formatTitle(byId[id]||library.find(r=>r.id===id)||{title:id,type:'film'})}</strong></a><div class="small muted">${escapeHtml(text).slice(0,180)}</div></div>`).join(''):'<div class="empty">아직 작품 메모가 없습니다.</div>'}</section><section class="section notes-list"><div class="eyebrow">MONTH NOTES</div>${monthsNotes.length?monthsNotes.map(([mid,text])=>`<div class="note-item"><strong>${months[mid]?.label||mid}</strong><div class="small muted">${escapeHtml(text).slice(0,220)}</div></div>`).join(''):'<div class="empty">아직 월별 메모가 없습니다.</div>'}</section></main>`}
function mapPage(){
  const m=month(),core=m.core,supp=m.supp.slice(0,8),nodes=[...core,...supp],p=progress(state.selectedMonth);
  const center={x:430,y:260},pos={};
  const active=id=>isDone(state.selectedMonth,id);
  core.forEach((id,i)=>{const a=(Math.PI*2*i/core.length)-Math.PI/2;pos[id]={x:center.x+185*Math.cos(a),y:center.y+160*Math.sin(a)}});
  supp.forEach((id,i)=>{const a=(Math.PI*2*i/supp.length)-Math.PI/2;pos[id]={x:center.x+330*Math.cos(a),y:center.y+220*Math.sin(a)}});
  const lines=supp.map((id,i)=>{const target=core[i%core.length],on=active(id)&&active(target);return `<line class="${on?'active-line':'locked-line'}" x1="${pos[id].x}" y1="${pos[id].y}" x2="${pos[target].x}" y2="${pos[target].y}"/>`}).join('');
  return `${appHeader('#map')}<main class="shell">
    <section class="hero"><div class="eyebrow accent-label">MAP · ${m.label}</div><h1>관계의 지도</h1><p class="lede">완료한 작품만 활성화됩니다. 아직 보지 않은 작품은 위치만 희미하게 남아 있고, 완료하면 연결선과 노드가 열립니다.</p>${monthSwitcher()}${progressHtml(state.selectedMonth)}</section>
    <section class="section">
      <div class="map-status"><span class="eyebrow accent-label">UNLOCKED NODES</span><strong>${p.done} / ${p.total}</strong></div>
      <div class="mapbox"><div class="map-inner"><svg class="map-lines">${lines}</svg>
        ${nodes.map(id=>{const w=byId[id],pt=pos[id],done=active(id);return `<button class="node ${core.includes(id)?'core':'supplementary'} ${done?'done':'locked'}" style="left:${pt.x}px;top:${pt.y}px" ${done?`onclick="navTo('#work/${id}')"`:'disabled'} aria-label="${escapeAttr(w.title)} ${done?'활성':'잠김'}">${w.title}</button>`}).join('')}
        <div class="node concept ${p.done?'concept-open':'locked'}" style="left:${center.x}px;top:${center.y}px">${p.done?m.ko:'· · ·'}</div>
      </div></div>
      <div class="map-legend"><span><i class="legend-dot done-dot"></i> 완료 / 활성</span><span><i class="legend-dot locked-dot"></i> 미완료 / 잠김</span></div>
    </section>
  </main>`;
}
function archivePage(){return `${appHeader('#archive')}<main class="shell"><section class="hero"><div class="eyebrow">ARCHIVE</div><h1>완료한 경로와 열린 개념</h1><p class="lede">점수나 연속 기록 대신, 한 달의 경로가 완성되었을 때만 조용히 챕터가 열립니다.</p></section><section class="section"><div class="archive-grid">${Object.entries(months).map(([mid,m])=>{const p=progress(mid),u=p.done===p.total;return `<div class="stamp ${u?'unlocked':''}"><div class="eyebrow">${m.label}</div><div class="count">${p.done}/${p.total}</div><strong>${m.title}</strong><p class="small muted">${u?'CHAPTER UNLOCKED':'진행 중'}</p></div>`}).join('')}</div></section><section class="section"><div class="eyebrow">COMPLETED WORKS</div>${Object.entries(months).map(([mid,m])=>`<div class="card"><h3>${m.label}</h3><div class="chips">${m.core.filter(id=>isDone(mid,id)).map(id=>`<a class="chip" href="#work/${id}">${byId[id].title}</a>`).join('')||'<span class="muted small">아직 없음</span>'}</div></div>`).join('')}</section></main>`}
function importPage(){return `${appHeader('#import')}<main class="shell"><section class="hero"><div class="eyebrow">IMPORT / BACKUP</div><h1>MASTER LIBRARY 가져오기</h1><p class="lede">Watchapedia CSV에서는 리뷰와 스포일러를 저장하지 않습니다. 제목·유형·연도·감독·별점·기존 감상 여부만 가져옵니다.</p></section><section class="section"><div class="grid two"><div class="filebox"><h3>Watchapedia CSV</h3><input type="file" id="watcha-file" accept=".csv,text/csv"><p class="small muted">예상 열: ID, URL, Title, Type, Year, Directors, WatchedAt, Rating, Review, Spoiler</p><div class="actions"><button class="btn" onclick="importWatcha()">CSV 가져오기</button></div></div><div class="filebox"><h3>JSON 백업 / 복원</h3><div class="actions"><button class="btn secondary" onclick="exportBackup()">JSON 내보내기</button><label class="btn secondary">JSON 복원<input type="file" id="restore-file" accept="application/json,.json" style="display:none" onchange="restoreBackup(this.files[0])"></label></div></div></div></section><section class="section"><div class="grid two"><div class="filebox"><h3>책 단일 추가</h3><input class="search" id="book-title" placeholder="제목"><input class="search" id="book-author" placeholder="저자"><input class="search" id="book-year" placeholder="연도" inputmode="numeric"><div class="actions"><button class="btn" onclick="addBook()">READ로 추가</button></div></div><div><div class="eyebrow">IMPORT RESULT</div><div id="import-result" class="notice">아직 가져온 파일이 없습니다.</div><div class="actions"><button class="btn secondary" onclick="resetAll()">모든 로컬 기록 초기화</button></div></div></div></section></main>`}

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
