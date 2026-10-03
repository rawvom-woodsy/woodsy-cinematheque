const stills = {
  'hiroshima': {url:'https://assets.eyefilm.nl/images/production/still_Hiroshima-mon-amour-Alain-Resnais-FR-1959.jpg', source:'Eye Filmmuseum'},
  'asako': {url:'https://images-prod.anothermag.com/1000/azure/another-prod/410/7/417568.jpeg', source:'AnOther'},
  'personal-shopper': {url:'https://image.tmdb.org/t/p/w1280/gtYG3ae617HxmUKklnd9itcxa5G.jpg', fallback:'https://www.viennale.at/assets/styles/is_archive_landscape_big/public/2016/movie/V16personal03.jpg?itok=rrdXWGHp', source:'TMDB / Viennale'},
  'atlantics': {url:'https://idsb.tmgrup.com.tr/ly/uploads/images/2020/04/28/32829.jpg', source:'Daily Sabah'},
  'holy-motors': {url:'https://cdn.infooggi.it/images/uploads/public/5b9/f9e/72e/5b9f9e72e9acd311508284.jpg/webp', source:'InfoOggi'},
  'perfect-days': {url:'https://cineuropa.org/imgCache/2023/05/26/1685106393232_0620x0413_0x18x1000x666_1685106555083.jpg', source:'Cineuropa'},
  'the-master': {url:'https://fr.web.img2.acsta.net/r_1280_720/medias/nmedia/18/90/81/61/20204388.jpg', source:'AlloCiné'},
  'ending-things': {url:'https://www.irishtimes.com/resizer/v2/SCUNWIWYLJB565G52PI4EYS5PQ.jpg?auth=22ec12cec282f9182007d63d43d1d8cc105c89a350bb90f9165178b0d3a7193b&height=1600&smart=true&width=1600', source:'The Irish Times'},
  'passing': {url:'https://cdn.theasc.com/_1200x630_crop_center-center_82_none/Passing_Sc-71_Irene-and-Clare-on-the-Stoop-Reverse-Angle_CR.jpg?mtime=1627492605', source:'American Society of Cinematographers'},
  'priscilla': {url:'https://assets.vogue.com/photos/64d4e7ebd9567128b7130aee/2%3A3/w_690%2Ch_1035%2Cc_limit/Priscilla_DSC_0171-5-V3.jpg', source:'Vogue'},
  'return-seoul': {url:'https://arc-anglerfish-washpost-prod-washpost.s3.amazonaws.com/public/R4X3ISQA25AGXPD7NYF652LYJ4.jpg', source:'The Washington Post'},
  '45-years': {url:'https://d1nslcd7m2225b.cloudfront.net/Pictures/1024x536/6/9/6/1212696_45%2BYears.jpg', source:'Screen Daily'},
  'lost-daughter': {url:'https://media.newyorker.com/photos/61d35354e75264a7841ed6be/1%3A1/w_1706%2Ch_1706%2Cc_limit/Brody-Lost-Daughter.jpg', source:'The New Yorker'},
  'private-life': {url:'https://www.theringer.com/_next/image?dpl=e632e274e7d9c4d1643dbcb47d7a5ede0a7bee04&q=75&url=https%3A%2F%2Fwp.theringer.com%2Fwp-content%2Fuploads%2F2024%2F11%2FPaul-Giamatti-and-Kathryn-Hahn-in-%E2%80%98Private-Life-1-scaled.jpg&w=3840', source:'The Ringer'},
  'things-to-come': {url:'https://arc-anglerfish-arc2-prod-bostonglobe.s3.amazonaws.com/public/QDJ2UOFYCQI6NMNVCFXAKCNVOE.jpg', source:'The Boston Globe'},
  'columbus': {url:'https://cdn.smartfacts.ru/190511/kolumbus_1.jpg', source:'Smartfacts'},
  'taste-things': {url:'https://www.wiscassetnewspaper.com/sites/default/files/2024/03/field/image/TASTEOFTHINGSstill5.jpg', source:'Wiscasset Newspaper'},
  'a-separation': {url:'https://www.moma.org/d/assets/W1siZiIsIjIwMTgvMDgvMTcvMjRxY3d4YmR1ZV9BX1NlcGFyYXRpb25fMi5qcGciXSxbInAiLCJjb252ZXJ0IiwiLXF1YWxpdHkgOTAgLXJlc2l6ZSAyMDAweDIwMDBcdTAwM2UiXV0/A-Separation_2.jpg?sha=a4e4afc52ec1ac1d', source:'MoMA'},
  'after-love': {url:'https://m.media-amazon.com/images/M/MV5BNmY3NWY5MzMtZTcwOS00NzQ4LTk4NWUtY2ZkOWZjNDJkMTkyXkEyXkFqcGc%40._V1_.jpg', source:'IMDb'},
  'the-father': {url:'https://images.squarespace-cdn.com/content/v1/60455d6a513f6b5c4dccdb4c/1617885389957-4FG1ILAO7JXBKWLMZ1H2/Father%2C%2BThe%2B%282%29.jpeg', source:'Film Review Daily'},
  'petite-maman': {url:'https://images.mubicdn.net/images/artworks/496851/cache-496851-1669399505/images-original.png', source:'MUBI'},
  'paterson': {url:'https://www.m24.ru/b/d/nBkSUhL2jVMkm8eyPqzZvc62gYT28pj20yPFnuWR9mOBdDebBizCnTY8qdJf6ReJ58vU9meMMok3Ee2nhSR6ISeO9G1N_wjJ%3DyzkIlmlpLyNaLiwxwZW4Hw.jpg', source:'M24'},
  'ghost-story': {url:'https://i.blogs.es/3240f4/a-ghost-story-press/650_1200.jpeg', source:'Espinof'},
  'memoria': {url:'https://statcdn.fandango.com/MPX/image/NBCU_Fandango/350/343/thumb_5119DD1D-FA19-46EC-BAC2-7BB45B29157D.jpg', source:'Fandango'},
  'wrestler': {url:'https://images.ladepeche.fr/api/v1/images/view/5c2f54a73e454652524251bf/large-fit/image.jpg', source:'La Dépêche'},
  'neon-demon': {url:'https://s.yimg.com/ny/api/res/1.2/vEPpSWvwwWmUwqVMa4pojw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTI0MDA7aD0xNjAyO2NmPXdlYnA-/https%3A/66.media.tumblr.com/946ac1daa83ac729406c8a74385a12e7/tumblr_inline_o9jbw4qa961uozwcw_1280.jpg', source:'Yahoo'},
  'black-swan': {url:'https://imgix.bustle.com/uploads/image/2025/12/1/391e8a4e/black-swan_a895305a.jpg?crop=faces&fit=crop&fm=jpg&h=630&w=1200', source:'Inverse'},
  'piano-teacher': {url:'https://image.tmdb.org/t/p/w780/f3QlognjrlLlJVHDJb1f0yLQxTL.jpg', fallback:'https://ilarge.lisimg.com/image/7604811/1118full-the-piano-teacher-screenshot.jpg', source:'TMDB / Listal'},
  'shame': {url:'https://images.squarespace-cdn.com/content/v1/6657277c35d79556a7079211/1730362801565-RWKA6PUL0MRZRPI9FBSE/09%2B%28895%29.jpg', source:'FilmSpice'},
  'different-man': {url:'https://austin.culturemap.com/media-library/renate-reinsve-and-sebastian-stan-in-a-different-man.jpg?coordinates=350%2C0%2C0%2C0&height=1200&id=53750363&width=1200', source:'CultureMap'},
  'saint-maud': {url:'https://bostonglobe-prod.cdn.arcpublishing.com/resizer/v2/IQIQ33BI2TS5AFNGUCVWQ6Z4VI.jpg?auth=4d2940e8a3030eafcc4a61094baaf79de3bf87b6b05aeef99cf0ad3e478efaa8&width=1440', source:'The Boston Globe'},
  'titane': {url:'https://live-production.wcms.abc-cdn.net.au/3fee3d886577f563bf04088192aed7cd?cropH=2000&cropW=3000&height=575&impolicy=wcms_crop_resize&width=862&xPos=607&yPos=0', source:'ABC'}

};
Object.entries(admin?.stills||{}).forEach(([id,o])=>{stills[id]={...(stills[id]||{}),...o}});
function proxyStillUrl(raw){
  if(!raw) return '';
  return 'https://images.weserv.nl/?url='+encodeURIComponent(raw)+'&w=1400&fit=cover&output=jpg&q=88';
}
function visualImageError(img){
  const fallback=img.dataset.fallback||'';
  if(fallback){
    img.dataset.fallback='';
    img.src=fallback;
    return;
  }
  const parent=img.parentElement;
  if(parent){
    const layer=parent.querySelector('.fallback-layer');
    if(layer) layer.style.display='flex';
  }
  img.remove();
}
function thumbImageError(img){
  const fallback=img.dataset.fallback||'';
  if(fallback){
    img.dataset.fallback='';
    img.src=fallback;
    return;
  }
  img.remove();
}
function visualHtml(w){
  const s=stills[w?.id];
  if(!s){
    return `<div class="visual visual-fallback">
      <div class="visual-top"><span class="eyebrow" style="color:rgba(255,255,255,.7)">${String(w?.type||'work').toUpperCase()} · ${w?.year||''}</span><span class="glyph">${escapeHtml(String((w?.year||'').toString().slice(-2)||'•'))}</span></div>
      <div><div class="big">${escapeHtml(w?.title||'')}</div><div class="small" style="margin-top:10px;color:rgba(255,255,255,.65)">TYPOGRAPHIC VISUAL</div></div>
    </div>`;
  }
  const primary=proxyStillUrl(s.url);
  const direct=s.url||'';
  return `<div class="visual visual-still">
    <div class="fallback-layer" style="display:none"><div class="visual-top"><span class="eyebrow">${String(w?.type||'work').toUpperCase()} · ${w?.year||''}</span><span class="glyph">${escapeHtml(String((w?.year||'').toString().slice(-2)||'•'))}</span></div><div class="big">${escapeHtml(w?.title||'')}</div></div>
    <img src="${primary}" data-fallback="${escapeAttr(direct)}" alt="${escapeAttr(w.title)} film still" loading="eager" onerror="visualImageError(this)">
    <div class="still-credit">STILL · ${escapeHtml(s.source)}</div>
  </div>`;
}
function thumbHtml(w){
  const s=stills[w?.id];
  if(s){
    const primary=proxyStillUrl(s.url);
    const direct=s.url||'';
    return `<div class="work-thumb"><div class="work-thumb-fallback"><span>${escapeHtml(w?.title||'')}</span></div><img src="${primary}" data-fallback="${escapeAttr(direct)}" alt="" loading="lazy" onerror="thumbImageError(this)"></div>`;
  }
  return `<div class="work-thumb"><div class="work-thumb-fallback"><span>${escapeHtml(w?.title||'')}</span></div></div>`;
}
