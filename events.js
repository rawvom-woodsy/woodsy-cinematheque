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
    if(el.id==='lib-q'){window._libQ=el.value;render();}
  });

  document.addEventListener('change',e=>{
    const el=e.target.closest('[data-change]');
    if(!el) return;
    const code=el.dataset.change||'';
    if(code.includes('_libType')){window._libType=el.value;render();return;}
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
