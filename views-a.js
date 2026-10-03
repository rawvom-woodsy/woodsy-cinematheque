function appHeader(active){
  const tabs=[['#home','HOME'],['#curriculum','CURRICULUM'],['#library','MASTER LIBRARY'],['#notes','NOTES'],['#map','MAP'],['#archive','ARCHIVE'],['#import','IMPORT'],['#admin','ADMIN']];
  return `<div class="topbar"><div class="topbar-inner"><a class="brand" href="#home">Personal Cinematheque <span class="muted">for</span> WOODSY<small>${month().label} · ${progress(state.selectedMonth).done}/${progress(state.selectedMonth).total}</small></a><div class="nav">${tabs.map(([r,l])=>`<a class="${active===r?'active':''}" href="${r}">${l}</a>`).join('')}</div></div><div class="mobile-nav">${tabs.map(([r,l])=>`<a class="${active===r?'active':''}" href="${r}">${l}</a>`).join('')}</div></div>`;
}
function monthSwitcher(){
  return `<div class="month-switch">${Object.entries(months).map(([id,m])=>`<button class="${state.selectedMonth===id?'active':''}" onclick="setMonth('${id}')">${m.label.replace(' 20',' ’')}</button>`).join('')}</div>`;
}
function progressHtml(mid){
  const p=progress(mid);
  return `<div class="progress-wrap"><div class="progress-meta"><span>CORE PROGRESS</span><span>${p.done} / ${p.total}</span></div><div class="progress"><span style="width:${p.pct}%"></span></div></div>`;
}
function workRow(id,i,mid){
  const w=byId[id],done=isDone(mid,id),s=statusFor(w,mid);
  return `<div class="work-row">
    <div class="index">${String(i+1).padStart(2,'0')}</div>
    <a href="#work/${w.id}" aria-label="${escapeAttr(w.title)} 상세">${thumbHtml(w)}</a>
    <div>
      <a href="#work/${w.id}"><div class="work-title">${formatTitle(w)}</div><div class="work-meta">${w.creator} · ${w.year} · ${w.type.toUpperCase()}</div></a>
      <div class="chips"><span class="status-badge ${s==='REVISIT'?'revisit':''}">${s}</span>${w.tags.map(t=>`<span class="chip">${t}</span>`).join('')}</div>
    </div>
    <button class="complete-btn ${done?'done':''}" onclick="toggleDone('${mid}','${w.id}')">${done?'✓ 완료':'완료 표시'}</button>
  </div>`;
}
function home(){
  const m=month(),p=progress(state.selectedMonth),next=m.core.find(id=>!isDone(state.selectedMonth,id))||m.core[0],w=byId[next],rec=recordFor(w);
  return `${appHeader('#home')}<main class="shell">
    <section class="hero">
      <div class="eyebrow">${m.label} · MONTHLY PROGRAM</div>
      <h1>${m.title}</h1>
      <p class="lede">${m.ko}</p>
      ${monthSwitcher()}
      ${progressHtml(state.selectedMonth)}
      <p class="program-note" style="margin-top:28px">${m.note}</p>
    </section>

    <section class="section">
      <div class="section-head"><div><div class="eyebrow">THIS WEEK'S TEXT</div><h2>${w.title}</h2></div><button class="link-button" onclick="navTo('#work/${w.id}')">상세 보기</button></div>
      <div class="feature-grid">
        <a href="#work/${w.id}">${visualHtml(w)}</a>
        <div class="feature-copy">
          <div class="eyebrow">${w.type.toUpperCase()} · ${w.role}</div>
          <h2>${w.title}</h2>
          <p class="feature-meta">${w.originalTitle||''}${w.originalTitle?' · ':''}${w.creator}, ${w.year}</p>
          <div style="margin-top:28px">
            <div class="feature-kv"><span>STATUS</span><strong>${statusFor(w,state.selectedMonth)}</strong></div>
            <div class="feature-kv"><span>MONTH</span><strong>${m.label}</strong></div>
            <div class="feature-kv"><span>ROLE</span><strong>${w.role||'CORE'}</strong></div>
          </div>
          ${rec?`<div class="notice" style="margin-top:22px">YOUR LIBRARY CONNECTION · 기존 라이브러리에 이미 있는 작품입니다${rec.rating?` · ★ ${rec.rating}`:''}. 이번 달 완료 여부는 별도로 기록됩니다.</div>`:''}
          <p class="feature-note">이번 달 프로그램의 다음 핵심 작품입니다. 감상 후 완료 표시를 하면 진행률과 아카이브가 즉시 갱신됩니다.</p>
          <div class="chips">${(w.tags||[]).map(t=>`<span class="chip">${t}</span>`).join('')}</div>
          <div class="actions"><button class="btn ${isDone(state.selectedMonth,w.id)?'secondary':''}" onclick="toggleDone('${state.selectedMonth}','${w.id}')">${isDone(state.selectedMonth,w.id)?'완료 해제':'감상 완료 표시'}</button><button class="btn secondary" onclick="navTo('#work/${w.id}')">노트 작성</button></div>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="section-head"><div><div class="eyebrow">CORE 8 · CHECKLIST</div><h2>이번 달의 경로</h2></div><button class="link-button" onclick="navTo('#curriculum')">전체 커리큘럼</button></div>
      ${m.core.map((id,i)=>workRow(id,i,state.selectedMonth)).join('')}
    </section>

    <section class="section">
      <div class="section-head"><div><div class="eyebrow">BRANCHING TEXTS</div><h2>연결된 읽기의 경로</h2></div></div>
      <div class="grid two">${m.supp.map(id=>{const x=byId[id];return `<div class="card supp-card"><a href="#work/${x.id}">${thumbHtml(x)}</a><div class="eyebrow">${x.role} · ${x.type.toUpperCase()}</div><h3><a href="#work/${x.id}">${formatTitle(x)}</a></h3><div class="work-meta">${x.creator} · ${x.year}</div><div class="chips"><span class="status-badge">${statusFor(x,state.selectedMonth)}</span></div></div>`}).join('')}</div>
    </section>

    <section class="section">
      <div class="grid two">
        <div>
          <div class="eyebrow">MONTH NOTE</div><h2>이번 달 메모</h2>
          <textarea id="month-note" placeholder="이번 달에 반복해서 돌아오는 장면, 질문, 감각을 적어두세요.">${escapeHtml(state.monthNotes[state.selectedMonth]||'')}</textarea>
          <div class="actions"><button class="btn" onclick="saveMonthNote()">저장</button></div>
        </div>
        <div>
          <div class="eyebrow">UNLOCKED</div><h2>현재 열린 개념</h2>
          <p class="program-note">핵심 작품을 완료할수록 이달의 개념이 차례로 열립니다.</p>
          <div class="chips">${m.concepts.map((c,i)=>`<span class="chip">${p.done>i/Math.max(1,m.concepts.length)*p.total?c:'LOCKED'}</span>`).join('')}</div>
          <div class="actions"><button class="btn secondary" onclick="navTo('#archive')">아카이브</button></div>
        </div>
      </div>
    </section>
    <footer class="footer">Personal Cinematheque · browser-local archive · JSON backup available</footer>
  </main>`;
}
function curriculum(){
  const m=month();
  return `${appHeader('#curriculum')}<main class="shell">
    <section class="hero"><div class="eyebrow">${m.label} · CURRICULUM</div><h1>${m.title}</h1><p class="lede">${m.ko}</p>${monthSwitcher()}${progressHtml(state.selectedMonth)}</section>
    <section class="section"><div class="eyebrow">CORE 8 · FILMS</div><div style="margin-top:26px">${m.core.map((id,i)=>workRow(id,i,state.selectedMonth)).join('')}</div></section>
    <section class="section"><div class="section-head"><div><div class="eyebrow">SUPPLEMENTARY TEXTS</div><h2>분기하는 시리즈와 책</h2></div></div><div class="grid two">${m.supp.map(id=>{const w=byId[id];return `<div class="card supp-card"><a href="#work/${w.id}">${thumbHtml(w)}</a><div class="eyebrow">${w.role} · ${w.type.toUpperCase()}</div><h3><a href="#work/${w.id}">${formatTitle(w)}</a></h3><div class="work-meta">${w.creator} · ${w.year}</div><div class="chips"><span class="status-badge">${statusFor(w,state.selectedMonth)}</span></div></div>`}).join('')}</div></section>
  </main>`;
}
function libraryPage(){const q=(document.getElementById('lib-q')?.value||window._libQ||'').toLowerCase();const t=window._libType||'all';const s=window._libStatus||'all';let rows=library.filter(r=>(!q||[r.title,r.originalTitle,r.creator].join(' ').toLowerCase().includes(q))&&(t==='all'||r.type===t)&&(s==='all'||r.historicalStatus===s));rows.sort((a,b)=>String(a.title).localeCompare(String(b.title),'ko'));return `${appHeader('#library')}<main class="shell"><section class="hero"><div class="eyebrow">MASTER LIBRARY</div><h1>기존 감상·독서 기록</h1><p class="lede">월별 커리큘럼과 분리된 영구 라이브러리입니다. 과거에 본 작품이라고 해서 이번 달 완료로 자동 처리되지는 않습니다.</p></section><section class="section"><div class="toolbar"><input id="lib-q" class="search" placeholder="제목 · 원제 · 감독/저자 검색" value="${escapeAttr(window._libQ||'')}" oninput="window._libQ=this.value;render()"><select class="select" onchange="window._libType=this.value;render()"><option value="all">ALL</option><option value="film" ${t==='film'?'selected':''}>FILM</option><option value="series" ${t==='series'?'selected':''}>SERIES</option><option value="book" ${t==='book'?'selected':''}>BOOK</option></select><select class="select" onchange="window._libStatus=this.value;render()"><option value="all">ALL STATUS</option><option value="watched" ${s==='watched'?'selected':''}>WATCHED</option><option value="read" ${s==='read'?'selected':''}>READ</option></select><button class="btn secondary" onclick="navTo('#import')">IMPORT</button></div><div class="small muted">${rows.length.toLocaleString()} records</div><div class="library-list"><div class="library-row header"><div>TITLE</div><div>CREATOR</div><div>YEAR</div><div>RECORD</div></div>${rows.slice(0,300).map(r=>`<div class="library-row"><div><a href="#work/${r.canonicalId||r.id}"><strong>${r.type==='book'?`『${escapeHtml(r.title)}』`:`《${escapeHtml(r.title)}》`}</strong></a><div class="small muted">${escapeHtml(r.originalTitle||'')}</div></div><div>${escapeHtml(r.creator||'—')}</div><div>${r.year||'—'}</div><div>${r.historicalStatus||'—'}${r.rating?` · ★${r.rating}`:''}</div></div>`).join('')}</div>${rows.length>300?`<p class="muted small" style="margin-top:14px">성능을 위해 첫 300건만 표시합니다. 검색/필터로 좁혀보세요.</p>`:''}</section></main>`}
function workPage(id){
  const w=byId[id]||library.find(x=>x.id===id||x.canonicalId===id);if(!w)return notFound();
  const mids=Object.entries(months).filter(([mid,m])=>m.core.includes(id)||m.supp.includes(id)).map(([mid,m])=>({mid,label:m.label,role:m.core.includes(id)?'CORE':(byId[id]?.role||'EXPLORE')}));
  const rec=byId[id]?recordFor(byId[id]):w;const note=state.notes[id]||'';
  const connected=byId[id]?Object.values(byId).filter(x=>x.id!==id&&Object.values(months).some(m=>(m.core.includes(id)||m.supp.includes(id))&&(m.core.includes(x.id)||m.supp.includes(x.id)))).slice(0,3):[];
  return `${appHeader('')}<main class="shell">
    <div class="detail-intro"><button class="backlink" onclick="history.back()">← BACK</button></div>
    <section class="detail-layout">
      ${visualHtml(w)}
      <div class="detail-copy">
        <div class="eyebrow">${(w.role||'LIBRARY')} · ${(w.type||'work').toUpperCase()}</div>
        <h1>${w.title||''}</h1>
        <p class="detail-original">${w.originalTitle||''}</p>
        <div class="detail-meta">
          <div><dt>CREATOR</dt><dd>${w.creator||'—'}</dd></div>
          <div><dt>YEAR</dt><dd>${w.year||'—'}</dd></div>
          <div><dt>YOUR RECORD</dt><dd>${rec?.historicalStatus||'none'}${rec?.rating?` · ★ ${rec.rating}`:''}</dd></div>
        </div>
        ${mids.length?`<div style="margin-top:26px">${mids.map(x=>`<div class="feature-kv"><span>${x.label}</span><strong>${x.role} · ${statusFor(byId[id]||w,x.mid)}</strong></div>`).join('')}</div>`:''}
        <div class="actions">${mids.map(x=>`<button class="btn ${isDone(x.mid,id)?'secondary':''}" onclick="toggleDone('${x.mid}','${id}')">${x.label}: ${isDone(x.mid,id)?'완료 해제':'완료 표시'}</button>`).join('')}</div>
      </div>
    </section>

    <section class="section">
      <div class="detail-section-grid">
        <div><div class="eyebrow">NOTE</div><h2>작품 메모</h2><textarea id="work-note" placeholder="장면, 감각, 질문, 연결을 자유롭게 기록하세요.">${escapeHtml(note)}</textarea><div class="actions"><button class="btn" onclick="saveWorkNote('${id}')">저장</button></div></div>
        <div><div class="eyebrow">CURRICULUM CONNECTION</div><h2>이 작품이 놓인 자리</h2>${mids.length?mids.map(x=>`<div class="card"><div class="eyebrow">${x.role}</div><strong>${x.label}</strong><p class="program-note" style="margin-top:8px">${months[x.mid]?.title||''}</p></div>`).join(''):'<p class="program-note">현재 월별 커리큘럼에는 직접 배정되어 있지 않습니다.</p>'}</div>
      </div>
    </section>

    ${connected.length?`<section class="section"><div class="section-head"><div><div class="eyebrow">CONNECTIONS</div><h2>같은 프로그램의 작품</h2></div></div><div class="connections-grid">${connected.map(x=>`<a class="connection-card" href="#work/${x.id}">${thumbHtml(x)}<strong>${formatTitle(x)}</strong><div class="work-meta">${x.creator} · ${x.year}</div></a>`).join('')}</div></section>`:''}
  </main>`;
}