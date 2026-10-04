(function(){
  function convert(root=document){
    if(!root.querySelectorAll) return;
    root.querySelectorAll('[onclick]').forEach(el=>{
      if(!el.dataset.action) el.dataset.action=el.getAttribute('onclick')||'';
      el.removeAttribute('onclick');
    });
    root.querySelectorAll('[onchange]').forEach(el=>{
      if(!el.dataset.change) el.dataset.change=el.getAttribute('onchange')||'';
      el.removeAttribute('onchange');
    });
    root.querySelectorAll('[oninput]').forEach(el=>{
      if(!el.dataset.input) el.dataset.input=el.getAttribute('oninput')||'';
      el.removeAttribute('oninput');
    });
  }

  function dispatchAction(code, el){
    let m;
    if((m=code.match(/^navTo\('([^']+)'\)$/))) return navTo(m[1]);
    if((m=code.match(/^setMonth\('([^']+)'\)$/))) return setMonth(m[1]);
    if((m=code.match(/^toggleDone\('([^']+)'\s*,\s*'([^']+)'\)$/))) return toggleDone(m[1],m[2]);
    if((m=code.match(/^saveWorkNote\('([^']+)'\)$/))) return saveWorkNote(m[1]);
    if(code==='saveMonthNote()') return saveMonthNote();
    if(code==='importWatcha()') return importWatcha();
    if(code==='exportBackup()') return exportBackup();
    if(code==='addBook()') return addBook();
    if(code==='resetAll()') return resetAll();
    if(code==='saveAdminMonth()') return saveAdminMonth();
    if(code==='saveAdminWork()') return saveAdminWork();
    if(code==='resetAdminOverrides()') return resetAdminOverrides();
    if(code==='adminLogin()') return adminLogin();
    if(code==='adminLogout()') return adminLogout();
    if(code==='archiveLogin()') return archiveLogin();
    if(code==='archiveLogout()') return archiveLogout();
    if(code==='closeArchiveEditor()') return closeArchiveEditor();
    if((m=code.match(/^openArchiveEditor\('([^']+)'\s*,\s*'([^']+)'\)$/))) return openArchiveEditor(m[1],m[2]);
    if((m=code.match(/^saveFilmArchive\('([^']+)'\)$/))) return saveFilmArchive(m[1]);\n    if((m=code.match(/^uploadFilmPoster\('([^']+)'\)$/))) return uploadFilmPoster(m[1]);\n    if((m=code.match(/^importFilmPosterUrl\('([^']+)'\)$/))) return importFilmPosterUrl(m[1]);
    if(code==='runPosterBatch01()') return runPosterBatch01();
    if(code==='runPosterBatch02()') return runPosterBatch02();
    if((m=code.match(/^saveBookArchive\('([^']+)'\)$/))) return saveBookArchive(m[1]);
    if((m=code.match(/^savePrivateMemo\('([^']+)'\s*,\s*'([^']+)'\)$/))) return savePrivateMemo(m[1],m[2]);
    if(code==='history.back()') return history.back();
  }

  document.addEventListener('click',e=>{
    const el=e.target.closest('[data-action]');
    if(!el) return;
    e.preventDefault();
    dispatchAction(el.dataset.action||'',el);
  });

  document.addEventListener('input',e=>{
    const el=e.target.closest('[data-input]');
    if(!el) return;
    if(el.id==='lib-q'){window._libQ=el.value;filterFilmLibrary();return;}\n    if(el.id==='book-q'){filterBooks();return;}
  });

  document.addEventListener('keydown',e=>{
    if(e.key==='Enter' && e.target && (e.target.id==='lib-q'||e.target.id==='book-q')){\n      e.preventDefault();\n      if(e.target.id==='lib-q')filterFilmLibrary();else filterBooks();\n      return;\n    }\n    if(e.key==='Enter' && e.target && (e.target.id==='admin-code'||e.target.id==='archive-password')){
      e.preventDefault();
      adminLogin();
    }
  });

  document.addEventListener('change',e=>{
    const el=e.target.closest('[data-change]');
    if(!el) return;
    const code=el.dataset.change||'';
    if(el.id==='lib-type'||code.includes('filterFilmLibrary')){window._libType=el.value;filterFilmLibrary();return;}\n    if(el.id==='book-status'||code.includes('filterBooks')){filterBooks();return;}\n    if(code.includes('_libType')){window._libType=el.value;render();return;}
    if(code.includes('_libStatus')){window._libStatus=el.value;render();return;}
    if(code.startsWith('restoreBackup(')){restoreBackup(el.files?.[0]);return;}
    if(code.startsWith('adminSelectMonth(')){adminSelectMonth(el.value);return;}
    if(code.startsWith('adminSelectWork(')){adminSelectWork(el.value);return;}
  });

  const app=document.getElementById('app');
  if(app){
    convert(app);
    new MutationObserver(()=>convert(app)).observe(app,{childList:true,subtree:true});
  }
})();
