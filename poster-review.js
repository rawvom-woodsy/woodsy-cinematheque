
const posterReviewState={filter:'missing',page:0,search:'',rows:[],total:0,loading:false};
function posterReviewPanel(){
 return '<section class="section" id="poster-review-panel"><div class="admin-panel"><div class="eyebrow accent-label">POSTER QUALITY CONTROL</div><h2>포스터 검토실</h2><p class="small muted">누락된 포스터와 이미 등록된 포스터를 직접 확인할 수 있어요. 잘못된 이미지에는 오류 표시를 남기고 상세 페이지 EDIT에서 교체하세요.</p><div class="actions"><button class="btn secondary" onclick="posterReviewLoad(\'missing\',0)">미등록</button><button class="btn secondary" onclick="posterReviewLoad(\'saved\',0)">등록된 포스터</button><button class="btn secondary" onclick="posterReviewLoad(\'incorrect\',0)">오류 표시</button><button class="btn secondary" onclick="posterReviewLoad(\'all\',0)">전체</button></div><label class="admin-label">작품 검색<input id="poster-review-search" class="search" placeholder="제목이나 감독명" value="'+escapeAttr(posterReviewState.search)+'" onkeydown="if(event.key===\'Enter\')posterReviewSearch()"></label><div class="actions"><button class="btn secondary" onclick="posterReviewSearch()">검색</button><button class="btn secondary" onclick="posterReviewLoad(posterReviewState.filter,posterReviewState.page)">목록 새로고침</button></div><div id="poster-review-results" class="small muted">검토할 목록을 선택해 주세요.</div></div></section>';
}
async function posterReviewSearch(){posterReviewState.search=document.getElementById('poster-review-search')?.value.trim()||'';await posterReviewLoad(posterReviewState.filter,0)}
async function posterReviewLoad(filter='missing',page=0){
 if(!archiveSignedIn()||!supabaseClient)return toast('로그인이 필요해요.');
 posterReviewState.filter=filter;posterReviewState.page=page;
 const target=document.getElementById('poster-review-results');if(!target)return;
 target.textContent='목록을 불러오는 중…';
 let query=supabaseClient.from('films').select('id,title,year,creator,poster_url,poster_auto_status,poster_auto_note',{count:'exact'});
 if(filter==='missing')query=query.is('poster_url',null);
 if(filter==='saved')query=query.not('poster_url','is',null).neq('poster_auto_status','incorrect');
 if(filter==='incorrect')query=query.eq('poster_auto_status','incorrect');
 if(posterReviewState.search){const term=posterReviewState.search.replace(/[%(),]/g,' ').trim();if(term)query=query.or('title.ilike.%'+term+'%,creator.ilike.%'+term+'%');}
 const {data,count,error}=await query.order('title',{ascending:true}).range(page*36,page*36+35);
 if(error){target.textContent='목록 조회에 실패했어요: '+error.message;return;}
 posterReviewState.rows=data||[];posterReviewState.total=count||0;
 target.innerHTML='<p class="small muted">'+posterReviewState.total+'편 · '+(page+1)+'페이지</p><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:14px">'+posterReviewState.rows.map((f,i)=>'<article style="min-width:0"><div style="aspect-ratio:2/3;background:#dededb;overflow:hidden;display:flex;align-items:center;justify-content:center">'+(f.poster_url?'<img src="'+escapeAttr(f.poster_url)+'" alt="" loading="lazy" style="width:100%;height:100%;object-fit:contain">':'<span class="small muted">NO POSTER</span>')+'</div><div style="padding:8px 0"><strong>'+escapeHtml(f.title)+'</strong><div class="small muted">'+escapeHtml([f.year,f.creator].filter(Boolean).join(' · '))+'</div><div class="small muted">'+escapeHtml(f.poster_auto_status||'미검토')+'</div><div class="actions" style="gap:4px;flex-wrap:wrap"><a class="btn secondary" href="#work/'+f.id+'">상세 / 교체</a>'+(f.poster_url&&f.poster_auto_status!=='incorrect'?'<button class="btn secondary" onclick="posterReviewFlag('+i+')">잘못된 포스터</button>':'')+(f.poster_auto_status==='incorrect'?'<button class="btn secondary" onclick="posterReviewUnflag('+i+')">오류 표시 해제</button>':'')+'</div></div></article>').join('')+'</div><div class="actions"><button class="btn secondary" '+(page===0?'disabled':'onclick="posterReviewLoad(\''+filter+'\','+(page-1)+')"')+'>이전</button><button class="btn secondary" '+((page+1)*36>=posterReviewState.total?'disabled':'onclick="posterReviewLoad(\''+filter+'\','+(page+1)+')"')+'>다음</button></div>';
}
async function posterReviewFlag(i){
 const f=posterReviewState.rows[i];if(!f||!archiveSignedIn())return;
 if(!confirm('이 포스터를 잘못된 이미지로 표시할까요? 기존 이미지는 바로 삭제하지 않아요.'))return;
 const {error}=await supabaseClient.from('films').update({poster_auto_status:'incorrect',poster_auto_note:'Manually flagged incorrect by archive owner'}).eq('id',f.id);
 if(error)return toast('오류 표시 저장 실패: '+error.message);
 toast('잘못된 포스터로 표시했어요.');posterReviewLoad(posterReviewState.filter,posterReviewState.page);
}
async function posterReviewUnflag(i){
 const f=posterReviewState.rows[i];if(!f||!archiveSignedIn())return;
 const {error}=await supabaseClient.from('films').update({poster_auto_status:'saved',poster_auto_note:'Manually reviewed by archive owner'}).eq('id',f.id);
 if(error)return toast('변경에 실패했어요.');
 toast('오류 표시를 해제했어요.');posterReviewLoad(posterReviewState.filter,posterReviewState.page);
}
