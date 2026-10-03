/* Shared site preset. The same app can run as a personal cinematheque or a separate film-club page. */
(function(){
  const preset=window.CINEMA_SITE_PRESET||'personal';
  const presets={
    personal:{
      id:'personal',
      mode:'personal',
      storageNamespace:'woodsy-cinematheque',
      brandName:'Personal Cinematheque',
      brandJoiner:'for',
      brandOwner:'WOODSY',
      title:'Personal Cinematheque for WOODSY',
      footer:'Personal Cinematheque · A monthly cultural curriculum',
      defaultMonth:'2026-10',
      includeSeedCurriculum:true,
      includeSeedLibrary:true,
      emptyEyebrow:'PERSONAL CINEMATHEQUE',
      emptyTitle:'새 커리큘럼을 기다리는 중',
      emptyText:'IMPORT에서 새로운 프로그램 패키지를 불러오면 이 화면이 자동으로 채워집니다.'
    },
    club:{
      id:'film-club',
      mode:'club',
      storageNamespace:'woodsy-film-club',
      brandName:'Film Club',
      brandJoiner:'by',
      brandOwner:'WOODSY',
      title:'Film Club by WOODSY',
      footer:'Film Club · Screening & discussion curriculum',
      defaultMonth:'__empty__',
      includeSeedCurriculum:false,
      includeSeedLibrary:false,
      emptyEyebrow:'FILM CLUB',
      emptyTitle:'첫 프로그램을 불러오세요',
      emptyText:'개인 시네마테크와 분리된 빈 공간입니다. IMPORT에서 모임용 커리큘럼 패키지를 붙여넣으면 별도의 아카이브가 시작됩니다.'
    }
  };
  window.SITE_CONFIG={...presets.personal,...(presets[preset]||{}),...(window.CINEMA_SITE_OVERRIDE||{})};
  document.title=window.SITE_CONFIG.title;
})();