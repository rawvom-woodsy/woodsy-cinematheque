function appHeader(active){
  const primary=[['#home','HOME'],['#curriculum','CURRICULUM'],['#library','LIBRARY'],['#archive','ARCHIVE']];
  const utilities=[['#notes','NOTES'],['#map','MAP'],['#import','IMPORT'],['#admin','ADMIN']];
  const p=progress(state.selectedMonth);
  const primaryHtml=primary.map(([r,l])=>`<a class="${active===r?'active':''}" href="${r}">${l}</a>`).join('');
  const utilityHtml=utilities.map(([r,l])=>`<a class="${active===r?'active':''}" href="${r}">${l}</a>`).join('');
  return `<div class="topbar"><div class="topbar-inner"><a class="brand" href="#home">Personal Cinematheque <span class="muted">for</span> WOODSY<small>${month().label} · ${p.done}/${p.total}</small></a><div class="nav primary-nav">${primaryHtml}<details class="utility-menu"><summary aria-label="More">•••</summary><div class="utility-popover">${utilityHtml}</div></details></div><button class="mobile-menu-button" onclick="toggleMobileMenu()" aria-label="메뉴 열기" aria-expanded="false"><span></span><span></span><span></span></button></div><div id="mobile-menu" class="mobile-menu">${primaryHtml}<div class="mobile-menu-divider"></div>${utilityHtml}</div></div>`
}
function monthSwitcher(){
  return `<div class="month-switch">${Object.entries(months).map(([id,m])=>`<button class="${state.selectedMonth===id?'active':''}" onclick="setMonth('${id}')">${m.label.replace(' 20',' ’')}</button>`).join('')}</div>`;
}
function progressHtml(mid){
  const p=progress(mid);
  return `<div class="progress-wrap"><div class="progress-meta"><span>CORE PROGRESS</span><span>${p.done} / ${p.total}</span></div><div class="progress"><span style="width:${p.pct}%"></span></div></div>`;
}
function quoteHtml(q){if(!q)return'';const label=quoteLabel(q);return `<blockquote class="direct-quote ${label==="CURATOR'S NOTE"?'curator-quote':''}"><div class="eyebrow quote-kind">${label}</div><strong>“${escapeHtml(q.text||'')}”</strong>${q.original?`<p class="quote-original">${escapeHtml(q.original)}</p>`:''}${q.en?`<p class="quote-en">${escapeHtml(q.en)}</p>`:''}<footer>${escapeHtml(q.source||'')}</footer></blockquote>`}
function workRow(id,i,mid){
  const w=byId[id],done=isDone(mid,id),s=statusFor(w,mid),date=completionDate(mid,id);
  return `<div class="work-row ${done?'is-complete':''}"><button class="row-check ${done?'done':''}" onclick="toggleDone('${mid}','${w.id}')" aria-label="${escapeAttr(w.title)} 완료 토글">${done?'✓':''}</button><div class="index">${String(i+1).padStart(2,'0')}</div><a class="row-thumb-link" href="#work/${w.id}">${thumbHtml(w)}</a><div class="row-copy"><a href="#work/${w.id}"><div class="work-title">${formatTitle(w)}</div></a><div class="work-meta">${w.creator} · ${w.year}${serviceFor(w.id)!=='—'?` · ${escapeHtml(serviceFor(w.id))}`:''}</div><div class="row-submeta"><span class="status-badge ${s==='REVISIT'?'revisit':''}">${s}</span>${date?`<span>${formatDateKo(date)} 완료</span>`:''}</div></div></div>`
}
function suppVisualCard(id,mid){
  const x=byId[id],xed=editorialFor(x.id),added=isAdded(mid,id),done=isDone(mid,id);
  const visual=x.type==='film'?visualHtml(x):supplementaryVisualHtml(x);
  return `<article class="supp-card-modern ${x.type} ${added?'selected':''}">
    <a class="supp-card-visual" href="#work/${x.id}">${visual}</a>
    <div class="supp-card-meta">
      <div class="supp-card-kicker"><span>${x.type==='book'?'READING':x.type.toUpperCase()}</span><span>${x.year||''}</span></div>
      <h3><a href="#work/${x.id}">${formatTitle(x)}</a></h3>
      <div class="work-meta">${escapeHtml(x.creator||'')}${serviceFor(x.id)!=='—'?` · ${escapeHtml(serviceFor(x.id))}`:''}</div>
      ${xed?.logline?`<p class="supp-copy">${escapeHtml(xed.logline)}</p>`:''}
      <div class="supp-card-actions">
        <button class="text-action ${added?'active':''}" onclick="toggleAdded('${mid}','${x.id}')">${added?'MY BRANCH ✓':'MY BRANCH +'}</button>
        <button class="text-action ${done?'active':''}" onclick="toggleDone('${mid}','${x.id}')">${done?'완료 ✓':'완료'}</button>
      </div>
    </div>
  </article>`;
}
function supplementaryEditorial(mid){
  const m=months[mid],series=m.supp.filter(id=>byId[id]?.type==='series'),books=m.supp.filter(id=>byId[id]?.type==='book'),others=m.supp.filter(id=>!['series','book'].includes(byId[id]?.type));
  return `
    ${series.length?`<div class="supp-group"><div class="supp-group-head"><span>SERIES</span><span>${series.length}</span></div><div class="series-shelf">${series.map(id=>suppVisualCard(id,mid)).join('')}</div></div>`:''}
    ${books.length?`<div class="supp-group reading-group"><div class="supp-group-head"><span>READING</span><span>${books.length}</span></div><div class="book-shelf">${books.map(id=>suppVisualCard(id,mid)).join('')}</div></div>`:''}
    ${others.length?`<div class="supp-group"><div class="supp-group-head"><span>EXPLORE</span><span>${others.length}</span></div><div class="series-shelf">${others.map(id=>suppVisualCard(id,mid)).join('')}</div></div>`:''}
  `;
}

function home(){
  const m=month(),p=progress(state.selectedMonth);
  const fallback=m.core.find(id=>!isDone(state.selectedMonth,id))||m.core[0];
  const featureId=(m.featureId&&byId[m.featureId])?m.featureId:fallback;
  const w=byId[featureId],rec=recordFor(w),ed=editorialFor(w.id),unlocked=unlockedConcepts(state.selectedMonth);
  return `${appHeader('#home')}<main class="shell">
    <section class="home-editorial-hero">
      <a class="home-hero-visual" href="#work/${w.id}">${visualHtml(w)}</a>
      <div class="home-program-grid">
        <div>
          <div class="eyebrow accent-label">${m.label} · MONTHLY PROGRAM</div>
          <h1 class="program-title">${displayTitleHtml(m)}</h1>
        </div>
        <div class="home-program-copy">
          <p class="lede">${m.ko}</p>
          <p class="program-note hero-note">${m.note}</p>
          <div class="hero-links"><button class="btn" onclick="navTo('#curriculum')">커리큘럼 보기</button><button class="link-button" onclick="navTo('#map')">MAP →</button></div>
        </div>
      </div>
      <div class="home-program-controls">${monthSwitcher()}${progressHtml(state.selectedMonth)}</div>
    </section>

    <section class="section weekly-editorial">
      <div class="section-head"><div><div class="eyebrow accent-label">THIS WEEK'S TEXT</div><h2>${formatTitle(w)}</h2></div><button class="link-button" onclick="navTo('#work/${w.id}')">상세 보기 →</button></div>
      <div class="weekly-grid">
        <div>
          <p class="feature-meta">${w.originalTitle||''}${w.originalTitle?' · ':''}${w.creator}, ${w.year} · ${escapeHtml(serviceFor(w.id))}</p>
          ${ed?.logline?`<p class="weekly-logline">${escapeHtml(ed.logline)}</p>`:''}
          ${rec?`<div class="library-connection">YOUR LIBRARY CONNECTION${rec.rating?` · ★ ${rec.rating}`:''}</div>`:''}
        </div>
        <div>
          ${ed?.viewingPoints?.length?`<div class="editorial-block compact-editorial"><div class="eyebrow">VIEWING POINTS</div><ol class="viewing-points">${ed.viewingPoints.slice(0,3).map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${escapeHtml(x)}</p></li>`).join('')}</ol></div>`:''}
          ${ed?.keywords?.length?`<div class="keyword-line">${ed.keywords.map(x=>`<span>#${escapeHtml(x)}</span>`).join('')}</div>`:''}
          <div class="actions weekly-actions"><button class="btn ${isDone(state.selectedMonth,w.id)?'secondary':''}" onclick="toggleDone('${state.selectedMonth}','${w.id}')">${isDone(state.selectedMonth,w.id)?'완료 해제':'감상 완료'}</button><button class="btn secondary" onclick="navTo('#work/${w.id}')">노트</button></div>
        </div>
      </div>
    </section>

    <section class="section core-section-modern">
      <div class="section-head"><div><div class="eyebrow accent-label">CORE 8</div><h2>이번 달의 영화</h2></div><button class="link-button" onclick="navTo('#curriculum')">전체 커리큘럼 →</button></div>
      <div class="core-list">${m.core.map((id,i)=>workRow(id,i,state.selectedMonth)).join('')}</div>
    </section>

    <section class="section supplementary-modern">
      <div class="section-head"><div><div class="eyebrow accent-label">SUPPLEMENTARY</div><h2>시리즈와 읽기</h2></div><div class="small muted">선택한 가지 ${m.supp.filter(id=>isAdded(state.selectedMonth,id)).length}</div></div>
      ${supplementaryEditorial(state.selectedMonth)}
    </section>

    <section class="section memo-reward">
      <div><div class="eyebrow accent-label">MONTH NOTE</div><h2>이번 달 메모</h2><textarea id="month-note" placeholder="이번 달에 반복해서 돌아오는 장면, 질문, 감각을 적어두세요.">${escapeHtml(state.monthNotes[state.selectedMonth]||'')}</textarea><div class="actions"><button class="btn" onclick="saveMonthNote()">저장</button></div></div>
      <div><div class="eyebrow accent-label">UNLOCKED</div><h2>열린 개념 ${unlocked.length}</h2><p class="program-note">작품을 완료할수록 이번 달의 개념과 연결이 드러납니다.</p><div class="concept-list">${unlocked.length?unlocked.map(c=>`<span>◆ ${escapeHtml(c)}</span>`).join(''):'<span class="muted">아직 열린 개념이 없습니다.</span>'}</div><div class="actions"><button class="btn secondary" onclick="navTo('#archive')">아카이브 보기</button></div></div>
    </section>
    <footer class="footer">Personal Cinematheque · A monthly cultural curriculum</footer>
  </main>`
}
function curriculum(){
  const m=month();
  return `${appHeader('#curriculum')}<main class="shell">
    <section class="hero program-hero"><div class="eyebrow accent-label">${m.label} · CURRICULUM</div><h1 class="program-title">${displayTitleHtml(m)}</h1><p class="lede">${m.ko}</p>${monthSwitcher()}${progressHtml(state.selectedMonth)}</section>
    <section class="section"><div class="section-head"><div><div class="eyebrow accent-label">CORE 8 · FILMS</div><h2>이번 달의 영화</h2></div></div><div class="core-list">${m.core.map((id,i)=>workRow(id,i,state.selectedMonth)).join('')}</div></section>
    <section class="section supplementary-modern"><div class="section-head"><div><div class="eyebrow accent-label">SUPPLEMENTARY TEXTS</div><h2>분기하는 시리즈와 책</h2></div></div>${supplementaryEditorial(state.selectedMonth)}</section>
  </main>`
}
function libraryPage(){
  const rows=[...library].sort((a,b)=>String(a.title).localeCompare(String(b.title),'ko')).slice(0,600);
  return `${appHeader('#library')}<main class="shell"><section class="hero"><div class="eyebrow accent-label">MASTER LIBRARY</div><h1>기존 감상·독서 기록</h1><p class="lede">월별 커리큘럼과 분리된 영구 라이브러리입니다. 과거 기록과 이번 달의 완료 상태는 서로 독립적으로 유지됩니다.</p></section><section class="section"><div class="toolbar"><input id="lib-q" class="search" placeholder="제목 · 원제 · 감독/저자 검색"><select id="lib-type" class="select"><option value="all">ALL</option><option value="film">FILM</option><option value="series">SERIES</option><option value="book">BOOK</option></select><select id="lib-status" class="select"><option value="all">ALL STATUS</option><option value="watched">WATCHED</option><option value="read">READ</option></select><button class="btn secondary" onclick="navTo('#import')">IMPORT</button></div><div class="small muted"><span id="library-count">${rows.length}</span> records</div><div class="library-list"><div class="library-row header"><div>TITLE</div><div>CREATOR</div><div>YEAR</div><div>RECORD</div></div>${rows.map(r=>{const search=[r.title,r.originalTitle,r.creator].join(' ').toLowerCase();const shown=r.type==='book'?'『'+escapeHtml(r.title)+'』' :'&lt;'+escapeHtml(r.title)+'&gt;';return `<div class="library-row library-item" data-search="${escapeAttr(search)}" data-type="${escapeAttr(r.type||'')}" data-status="${escapeAttr(r.historicalStatus||'')}"><div><a href="#work/${r.canonicalId||r.id}"><strong>${shown}</strong></a><div class="small muted">${escapeHtml(r.originalTitle||'')}</div></div><div>${escapeHtml(r.creator||'—')}</div><div>${r.year||'—'}</div><div>${r.historicalStatus||'—'}${r.rating?` · ★${r.rating}`:''}</div></div>`}).join('')}</div></section></main>`
}
function workPage(id){
  const w=byId[id]||library.find(x=>x.id===id||x.canonicalId===id);if(!w)return notFound();
  const mids=Object.entries(months).filter(([mid,m])=>m.core.includes(id)||m.supp.includes(id)).map(([mid,m])=>({mid,label:m.label,role:m.core.includes(id)?'CORE':(byId[id]?.role||'EXPLORE')}));
  const rec=byId[id]?recordFor(byId[id]):w,note=state.notes[id]||'',ed=editorialFor(id),connections=connectionIds(id);
  const currentMid=mids.find(x=>x.mid===state.selectedMonth)?.mid||mids[0]?.mid;
  const doneDate=currentMid?completionDate(currentMid,id):null;
  const visual=w.type==='film'?visualHtml(w):supplementaryVisualHtml(w);
  return `${appHeader('')}<main class="shell">
    <div class="detail-intro"><button class="backlink" onclick="history.back()">← BACK</button></div>
    <section class="detail-layout">
      ${visual}
      <div class="detail-copy">
        <div class="eyebrow accent-label">${(w.role||'LIBRARY')} · ${(w.type||'work').toUpperCase()}</div>
        <h1>${formatTitle(w)}</h1>
        <p class="detail-original">${w.originalTitle||''}</p>
        ${ed?.logline?`<p class="detail-logline">${escapeHtml(ed.logline)}</p>`:''}
        <dl class="detail-meta"><div><dt>CREATOR</dt><dd>${w.creator||'—'}</dd></div><div><dt>YEAR</dt><dd>${w.year||'—'}</dd></div><div><dt>WHERE</dt><dd>${escapeHtml(serviceFor(id))}</dd></div></dl>
        ${ed?.checked?`<p class="availability-note">시청처 확인 · ${escapeHtml(ed.checked)}</p>`:''}
        ${rec?`<div class="notice">MASTER LIBRARY · ${rec.historicalStatus||'recorded'}${rec.rating?` · ★ ${rec.rating}`:''}</div>`:''}
        ${doneDate?`<p class="completed-date">✓ ${formatDateKo(doneDate)} 완료</p>`:''}
        <div class="actions">${mids.map(x=>`<button class="btn ${isDone(x.mid,id)?'secondary':''}" onclick="toggleDone('${x.mid}','${id}')">${x.label}: ${isDone(x.mid,id)?'완료 해제':'완료 표시'}</button>`).join('')}${currentMid&&!months[currentMid].core.includes(id)?`<button class="btn secondary" onclick="toggleAdded('${currentMid}','${id}')">${isAdded(currentMid,id)?'MY BRANCH에서 제외':'MY BRANCH에 추가'}</button>`:''}</div>
      </div>
    </section>
    ${ed?`<section class="section editorial-detail"><div class="detail-section-grid"><div><div class="eyebrow accent-label">VIEWING POINTS</div><ol class="viewing-points">${(ed.viewingPoints||[]).map((x,i)=>`<li><span>${String(i+1).padStart(2,'0')}</span><p>${escapeHtml(x)}</p></li>`).join('')}</ol><div class="editorial-block"><div class="eyebrow accent-label">KEYWORDS</div><div class="keyword-line">${(ed.keywords||[]).map(x=>`<span>#${escapeHtml(x)}</span>`).join('')}</div></div></div><div>${ed.quote?quoteHtml(ed.quote):''}${ed.references?.length?`<div class="editorial-block"><div class="eyebrow accent-label">REFERENCES</div><ul class="reference-list">${ed.references.map(x=>`<li>${escapeHtml(x)}</li>`).join('')}</ul></div>`:''}${conceptIds(id).length?`<div class="editorial-block"><div class="eyebrow accent-label">UNLOCKS</div><div class="unlock-list">${conceptIds(id).map(c=>`<span>${currentMid&&isDone(currentMid,id)?'◆':'◇'} ${escapeHtml(c)}</span>`).join('')}</div></div>`:''}</div></div></section>`:''}
    ${connections.length?`<section class="section"><div class="section-head"><div><div class="eyebrow accent-label">CONNECTIONS</div><h2>이 작품에서 이어지는 경로</h2></div></div><div class="connections-grid">${connections.map(cid=>{const x=byId[cid];return `<a class="connection-card ${x.type!=='film'?'text-connection':''}" href="#work/${x.id}">${x.type==='film'?thumbHtml(x):''}<strong>${formatTitle(x)}</strong><div class="work-meta">${x.creator} · ${x.year}</div><p class="connection-reason">${escapeHtml(editorialFor(x.id)?.logline||'')}</p></a>`}).join('')}</div></section>`:''}
    <section class="section"><div class="note-single"><div class="eyebrow accent-label">NOTE</div><h2>작품 메모</h2><textarea id="work-note" placeholder="장면, 감각, 질문, 연결을 자유롭게 기록하세요.">${escapeHtml(note)}</textarea>${state.noteUpdated?.[id]?`<div class="small muted note-date">최근 수정 · ${formatDateKo(state.noteUpdated[id])}</div>`:''}<div class="actions"><button class="btn" onclick="saveWorkNote('${id}')">저장</button></div></div></section>
  </main>`
}