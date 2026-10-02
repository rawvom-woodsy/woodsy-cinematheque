const stills = {
  'hiroshima': {url:'https://assets.eyefilm.nl/images/production/still_Hiroshima-mon-amour-Alain-Resnais-FR-1959.jpg', source:'Eye Filmmuseum'},
  'asako': {url:'https://images-prod.anothermag.com/1000/azure/another-prod/410/7/417568.jpeg', source:'AnOther'},
  'personal-shopper': {url:'https://static.independent.co.uk/s3fs-public/thumbnails/image/2017/03/15/13/kristen-stewart.jpg?fit=crop&height=900&width=1200', source:'The Independent'},
  'atlantics': {url:'https://idsb.tmgrup.com.tr/ly/uploads/images/2020/04/28/32829.jpg', source:'Daily Sabah'},
  'holy-motors': {url:'https://cdn.infooggi.it/images/uploads/public/5b9/f9e/72e/5b9f9e72e9acd311508284.jpg/webp', source:'InfoOggi'},
  'perfect-days': {url:'https://cineuropa.org/imgCache/2023/05/26/1685106393232_0620x0413_0x18x1000x666_1685106555083.jpg', source:'Cineuropa'},
  'the-master': {url:'https://nofilmschool.com/media-library/00004.jpg?coordinates=204%2C0%2C334%2C0&height=1500&id=34079887&width=2000', source:'No Film School'},
  'ending-things': {url:'https://www.irishtimes.com/resizer/v2/SCUNWIWYLJB565G52PI4EYS5PQ.jpg?auth=22ec12cec282f9182007d63d43d1d8cc105c89a350bb90f9165178b0d3a7193b&height=1600&smart=true&width=1600', source:'The Irish Times'}
};
function visualHtml(w){
  const s=stills[w?.id];
  if(!s) return `<div class="visual"><div><div class="eyebrow" style="color:#ddd">${String(w?.type||'work').toUpperCase()} · ${w?.year||''}</div><div class="big">${escapeHtml(w?.title||'')}</div><div class="small still-credit">TYPOGRAPHIC FALLBACK</div></div></div>`;
  return `<div class="visual visual-still"><img src="${s.url}" alt="${escapeAttr(w.title)} film still" referrerpolicy="no-referrer"><div class="visual-overlay"><div class="eyebrow" style="color:#eee">${String(w.type||'work').toUpperCase()} · ${w.year||''}</div><div class="big">${escapeHtml(w.title)}</div><div class="small still-credit">STILL · ${escapeHtml(s.source)}</div></div></div>`;
}
