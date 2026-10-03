/* Event handlers for the extended operating UI. */
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-action]');
  if(!el)return;
  const code=el.dataset.action||'';
  let m;
  if(code==='toggleMobileMenu()'){e.preventDefault();return toggleMobileMenu()}
  if((m=code.match(/^toggleAdded\('([^']+)'\s*,\s*'([^']+)'\)$/))){e.preventDefault();return toggleAdded(m[1],m[2])}
});
document.addEventListener('input',e=>{
  if(e.target?.id==='lib-q')filterLibraryRows();
});
document.addEventListener('change',e=>{
  const id=e.target?.id;
  if(id==='lib-type'||id==='lib-status')filterLibraryRows();
  if(id==='watcha-file')previewWatcha();
  if(id==='admin-month-select')adminSelectMonth(e.target.value);
  if(id==='admin-work-select')adminSelectWork(e.target.value);
});
document.addEventListener('click',e=>{
  if(e.target.closest('#mobile-menu a')){document.getElementById('mobile-menu')?.classList.remove('open');document.querySelector('.mobile-menu-button')?.setAttribute('aria-expanded','false')}
});
