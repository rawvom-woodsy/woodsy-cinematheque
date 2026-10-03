const APP_KEY='woodsy-cinematheque-v3';
const LIB_KEY='woodsy-cinematheque-library-v3';
const ADMIN_KEY='woodsy-cinematheque-admin-v1';
const DEFAULT_STATE={selectedMonth:'2026-10',completed:{},notes:{},monthNotes:{},added:{},noteUpdated:{},monthNoteUpdated:{}};
const seedLibrary=[
  {id:'book-convenience-store-woman',title:'편의점 인간',originalTitle:'コンビニ人間',type:'book',year:2016,creator:'무라타 사야카',rating:null,historicalStatus:'read',source:'manual',sourceUrl:'',tags:['existing-read']},
  {id:'book-face-of-another',title:'타인의 얼굴',originalTitle:'他人の顔',type:'book',year:1964,creator:'아베 고보',rating:null,historicalStatus:'read',source:'manual',sourceUrl:'',tags:['existing-read']}
];
const months={
'2026-10':{label:'OCTOBER 2026',title:'WHEN A FILM CHANGES ITS MIND',ko:'현실이 어느 순간 다른 감각으로 열리는 영화들',note:'익숙한 현실이 기억, 욕망, 상실, 정체성에 의해 다른 감각으로 열리는 순간을 따라간다. 장르와 시간, 공간의 규칙이 서서히 변하는 영화들을 한 달의 경로로 묶는다.',concepts:['ABSENCE','DOUBLENESS','REPETITION','UNSTABLE PERCEPTION','BODY / PERFORMANCE','GHOSTLINESS'],core:['hiroshima','asako','personal-shopper','atlantics','holy-motors','perfect-days','the-master','ending-things'],supp:['first-love','duras-hiroshima','ripley','maiko']},
'2026-11':{label:'NOVEMBER 2026',title:'THE LIFE I COULD HAVE LIVED',ko:'내가 살 수도 있었던 삶',note:'현재의 삶 옆에 다른 이름으로 살았을 삶, 다른 사람과 함께했을 삶, 떠나지 않았다면 이어졌을 삶, 부모가 되었거나 되지 않았을 삶이 희미하게 남아 있다. 11월에는 선택하지 않은 삶이 현재에 어떤 흔적으로 남는가를 본다.',concepts:['UNLIVED LIFE','PASSING','CHOICE','MEMORY','FAMILY POSSIBILITY'],core:['passing','priscilla','return-seoul','45-years','lost-daughter','private-life','things-to-come','columbus'],supp:['unorthodox','one-day','pachinko','lessons-chemistry','book-passing','territory-light','lowland','years']},
'2026-12':{label:'DECEMBER 2026',title:'THE HOUSE REMEMBERS',ko:'집은 기억한다',note:'생활하는 집에서 시작해 흔들리는 집, 떠난 사람이 남은 집, 기억이 불안정해진 집, 시간을 품은 집으로 이동한다. 감정이 설명되지 않고 공간과 소리, 반복되는 행위 속에 저장되는 영화들을 본다.',concepts:['HOME','PLACE MEMORY','REPETITION','LOSS','SOUND / SPACE'],core:['taste-things','a-separation','after-love','the-father','petite-maman','paterson','ghost-story','memoria'],supp:['hill-house','maid','archive81','housekeeping','austerlitz','memory-police','poetics-space']},
'2027-01':{label:'JANUARY 2027',title:'PERFORMING A SELF',ko:'나라는 역할을 연기하기',note:'직업, 외모, 성별, 욕망, 사회가 요구하는 정상성. 사람이 자기 자신이라고 믿는 것이 얼마나 많은 연기와 반복으로 만들어지는지를 신체와 퍼포먼스를 통해 본다.',concepts:['PERFORMANCE','MASK','DISCIPLINE','GAZE','TRANSFORMATION'],core:['wrestler','neon-demon','black-swan','piano-teacher','shame','different-man','saint-maud','titane'],supp:['severance','ripley','mask-girl','goffman','argonauts','piano-player-book','confessions-mask','book-convenience-store-woman','book-face-of-another']}
};
const W=(id,title,originalTitle,type,creator,year,role='CORE',tags=[])=>({id,title,originalTitle,type,creator,year,role,tags});
const works=[
W('hiroshima','히로시마 내 사랑','Hiroshima mon amour','film','Alain Resnais',1959),W('asako','아사코','寝ても覚めても','film','Ryusuke Hamaguchi',2018),W('personal-shopper','퍼스널 쇼퍼','Personal Shopper','film','Olivier Assayas',2016),W('atlantics','애틀랜틱스','Atlantique','film','Mati Diop',2019),W('holy-motors','홀리 모터스','Holy Motors','film','Leos Carax',2012),W('perfect-days','퍼펙트 데이즈','Perfect Days','film','Wim Wenders',2023),W('the-master','마스터','The Master','film','Paul Thomas Anderson',2012),W('ending-things','이제 그만 끝낼까 해',"I'm Thinking of Ending Things",'film','Charlie Kaufman',2020),
W('first-love','퍼스트 러브 하츠코이','First Love','series','Kanchiku Yuri',2022,'EXPLORE'),W('duras-hiroshima','히로시마 내 사랑','Hiroshima mon amour','book','Marguerite Duras',1960,'READING'),W('ripley','리플리: 더 시리즈','Ripley','series','Steven Zaillian',2024,'EXPLORE'),W('maiko','마이코네 행복한 밥상','The Makanai','series','Hirokazu Kore-eda',2023,'EXPLORE'),
W('passing','패싱','Passing','film','Rebecca Hall',2021),W('priscilla','프리실라','Priscilla','film','Sofia Coppola',2023),W('return-seoul','리턴 투 서울','Return to Seoul','film','Davy Chou',2022),W('45-years','45년 후','45 Years','film','Andrew Haigh',2015),W('lost-daughter','로스트 도터','The Lost Daughter','film','Maggie Gyllenhaal',2021),W('private-life','프라이빗 라이프','Private Life','film','Tamara Jenkins',2018),W('things-to-come','다가오는 것들','Things to Come','film','Mia Hansen-Løve',2016),W('columbus','콜럼버스','Columbus','film','Kogonada',2017),
W('unorthodox','그리고 베를린에서','Unorthodox','series','Anna Winger / Alexa Karolinski',2020,'LONG FORM'),W('one-day','원 데이','One Day','series','Nicole Taylor',2024,'LONG FORM'),W('pachinko','파친코','Pachinko','series','Soo Hugh',2022,'EXPLORE'),W('lessons-chemistry','레슨 인 케미스트리','Lessons in Chemistry','series','Lee Eisenberg',2023,'EXPLORE'),W('book-passing','패싱','Passing','book','Nella Larsen',1929,'READING'),W('territory-light','빛의 영역','Territory of Light','book','쓰시마 유코',1979,'READING'),W('lowland','저지대','The Lowland','book','Jhumpa Lahiri',2013,'READING'),W('years','세월','Les Années','book','Annie Ernaux',2008,'READING'),
W('taste-things','프렌치 수프','The Taste of Things','film','Trần Anh Hùng',2023),W('a-separation','씨민과 나데르의 별거','A Separation','film','Asghar Farhadi',2011),W('after-love','사랑 후의 두 여자','After Love','film','Aleem Khan',2020),W('the-father','더 파더','The Father','film','Florian Zeller',2020),W('petite-maman','쁘띠 마망','Petite Maman','film','Céline Sciamma',2021),W('paterson','패터슨','Paterson','film','Jim Jarmusch',2016),W('ghost-story','고스트 스토리','A Ghost Story','film','David Lowery',2017),W('memoria','메모리아','Memoria','film','Apichatpong Weerasethakul',2021),
W('hill-house','힐 하우스의 유령','The Haunting of Hill House','series','Mike Flanagan',2018,'LONG FORM'),W('maid','조용한 희망','Maid','series','Molly Smith Metzler',2021,'EXPLORE'),W('archive81','아카이브 81','Archive 81','series','Rebecca Sonnenshine',2022,'EXPLORE'),W('housekeeping','하우스키핑','Housekeeping','book','Marilynne Robinson',1980,'READING'),W('austerlitz','아우스터리츠','Austerlitz','book','W. G. Sebald',2001,'READING'),W('memory-police','은밀한 결정','The Memory Police','book','Yoko Ogawa',1994,'READING'),W('poetics-space','공간의 시학','La Poétique de l’espace','book','Gaston Bachelard',1958,'READING'),
W('wrestler','더 레슬러','The Wrestler','film','Darren Aronofsky',2008),W('neon-demon','네온 데몬','The Neon Demon','film','Nicolas Winding Refn',2016),W('black-swan','블랙 스완','Black Swan','film','Darren Aronofsky',2010),W('piano-teacher','피아니스트','La Pianiste','film','Michael Haneke',2001),W('shame','셰임','Shame','film','Steve McQueen',2011),W('different-man','어 디퍼런트 맨','A Different Man','film','Aaron Schimberg',2024),W('saint-maud','세인트 모드','Saint Maud','film','Rose Glass',2019),W('titane','티탄','Titane','film','Julia Ducournau',2021),
W('severance','세브란스: 단절','Severance','series','Dan Erickson',2022,'LONG FORM'),W('mask-girl','마스크걸','Mask Girl','series','Kim Yong-hoon',2023,'EXPLORE'),W('goffman','자아 연출의 사회학','The Presentation of Self in Everyday Life','book','Erving Goffman',1956,'READING'),W('argonauts','아르고호의 선원들','The Argonauts','book','Maggie Nelson',2015,'READING'),W('piano-player-book','피아노 치는 여자','Die Klavierspielerin','book','Elfriede Jelinek',1983,'READING'),W('confessions-mask','가면의 고백','仮面の告白','book','Yukio Mishima',1949,'READING'),
...seedLibrary.map(x=>W(x.id,x.title,x.originalTitle,x.type,x.creator,x.year,'CONNECTED'))
];

const editorial={
  "hiroshima": {
    "logline": "히로시마에서 만난 두 사람이 서로의 기억을 번갈아 발음하는 동안, 영화는 증언과 사랑을 같은 문장 안에 둔다.",
    "viewingPoints": [
      "대사가 이미지를 설명하지 않고, 이미지와 다른 시간대를 말한다는 점에 주의할 것.",
      "느베르의 삽입 쇼트가 등장하는 위치 — 현재 장면의 어떤 단어 뒤에 끼어드는지.",
      "'너는 히로시마에서 아무것도 보지 못했다'라는 부정문이 영화 전체의 방법론이 되는 과정."
    ],
    "keywords": [
      "기억",
      "증언",
      "반복되는 부정",
      "도시와 신체"
    ],
    "quote": {
      "text": "너는 히로시마에서 아무것도 보지 못했다. 아무것도.",
      "en": "You saw nothing in Hiroshima. Nothing.",
      "source": "Marguerite Duras, 시나리오 서두"
    },
    "references": [
      "Marguerite Duras, 『히로시마 내 사랑』 (시나리오)",
      "Alain Resnais, 〈밤과 안개〉 (1956)"
    ]
  },
  "asako": {
    "logline": "사라진 첫사랑과 똑같은 얼굴의 남자가 나타난다. 하마구치는 이 우연을 설명하지 않고 그대로 살게 한다.",
    "viewingPoints": [
      "같은 배우의 두 인물이 다른 방식으로 호명되는 장면들.",
      "일상적 리액션 연기가 멜로드라마적 사건을 중화시키는 리듬.",
      "강물과 홍수 — 되돌릴 수 없음이 풍경으로 등장하는 지점."
    ],
    "keywords": [
      "분신",
      "첫사랑",
      "우연",
      "되돌릴 수 없음"
    ],
    "quote": {
      "text": "최악이야. 그런데 아름답네.",
      "en": "You're the worst. But it's beautiful.",
      "source": "영화 후반, 강가 장면"
    },
    "references": [
      "시바사키 도모카, 『꿈에서도 깨어서도』",
      "하마구치 류스케, 〈해피 아워〉 (2015)"
    ]
  },
  "personal-shopper": {
    "logline": "타인의 옷을 사는 일을 하는 영매가, 죽은 쌍둥이의 신호를 기다린다. 유령은 결국 문자 메시지의 형식으로 도착한다.",
    "viewingPoints": [
      "스마트폰 대화 시퀀스가 어떻게 서스펜스의 주요 매체가 되는지.",
      "남의 옷을 입어 보는 장면에서 신체와 소유의 경계.",
      "마지막 대답 — 누가 말하고 있는가에 대한 결론을 영화가 미루는 방식."
    ],
    "keywords": [
      "유령",
      "쌍둥이",
      "소비와 신체",
      "기다림"
    ],
    "quote": {
      "text": "거기 있는 게 너야? 아니면 그냥 나야?",
      "en": "Is that you? Or is it just me?",
      "source": "영화 마지막 장면"
    },
    "references": [
      "Olivier Assayas, 〈클라우즈 오브 실스 마리아〉 (2014)",
      "Hilma af Klint 관련 자료"
    ]
  },
  "atlantics": {
    "logline": "바다로 떠난 청년들이 돌아오지 않는다. 다카르에 남은 연인에게 그들은 다른 형식으로 되돌아온다.",
    "viewingPoints": [
      "노동과 임금이라는 현실이 초자연적 장르로 번역되는 전환점.",
      "미완성 타워 — 미래가 공사 중인 채 방치된 상태의 이미지.",
      "밤의 조명과 전기 — 유령이 켜고 끄는 사회적 인프라."
    ],
    "keywords": [
      "이주",
      "바다",
      "빙의",
      "미완성"
    ],
    "quote": {
      "text": "그들은 돌아왔다. 다만 우리가 아는 몸으로는 아니었다.",
      "en": "They came back. Just not in bodies we knew.",
      "source": "프로그램 노트"
    },
    "references": [
      "Mati Diop, 〈Atlantiques〉 (2009, 단편)",
      "Djibril Diop Mambéty, 〈투키 부키〉 (1973)"
    ]
  },
  "holy-motors": {
    "logline": "리무진을 타고 하루 동안 아홉 개의 삶을 연기하는 남자. 카메라가 사라진 시대의 배우에 관한 우화.",
    "viewingPoints": [
      "리무진 내부 = 분장실 = 영화사(史) 그 자체라는 삼중 구조.",
      "각 '약속' 사이의 이행 장면에서 피로가 축적되는 방식.",
      "아코디언 인터미션 — 서사를 멈추고 리듬만 남기는 선택."
    ],
    "keywords": [
      "연기",
      "변신",
      "영화의 죽음",
      "하루"
    ],
    "quote": {
      "text": "행위의 아름다움이요. 보는 사람이 없어도 남아 있는 것.",
      "en": "The beauty of the act. Even when no one's watching.",
      "source": "리무진 안의 대화"
    },
    "references": [
      "Leos Carax, 〈퐁네프의 연인들〉 (1991)",
      "Georges Franju 관련 자료"
    ]
  },
  "perfect-days": {
    "logline": "도쿄의 공공 화장실을 청소하는 남자의 반복되는 하루. 같은 동작 속에서 빛이 매일 조금씩 달라진다.",
    "viewingPoints": [
      "아침 루틴의 반복 — 몇 번째 반복에서 차이가 감지되는지 세어볼 것.",
      "코모레비(나뭇잎 사이 햇빛)의 흑백 삽입 쇼트가 놓이는 위치.",
      "마지막 얼굴 — 하나의 감정으로 환원되지 않는 표정에 머무는 시간."
    ],
    "keywords": [
      "루틴",
      "빛",
      "고독",
      "충분함"
    ],
    "quote": {
      "text": "다음은 다음이고, 지금은 지금이야.",
      "en": "Next time is next time. Now is now.",
      "source": "강가의 대화"
    },
    "references": [
      "幸田文 관련 산문",
      "Wim Wenders, 〈도쿄가〉 (1985)"
    ]
  },
  "the-master": {
    "logline": "전쟁에서 돌아온 남자가 새로운 교의를 만든 자를 만난다. 치유의 언어가 지배의 언어로 미끄러지는 과정.",
    "viewingPoints": [
      "프로세싱 장면의 롱테이크 — 질문이 반복될 때 발생하는 생리적 압력.",
      "바다와 모래 여자 — 시작과 끝이 같은 이미지로 닫히는 구조.",
      "두 사람의 관계를 사제·연인·주인·동물 중 어떤 틀로도 고정하지 못하게 만드는 장면들."
    ],
    "keywords": [
      "교의",
      "지배",
      "전후",
      "충동"
    ],
    "quote": {
      "text": "주인이 없는 삶을 찾았다면, 꼭 알려주게.",
      "en": "If you find a way to live without a master, let me know.",
      "source": "마지막 만남"
    },
    "references": [
      "John Steinbeck 관련 자료",
      "PTA, 〈데어 윌 비 블러드〉 (2007)"
    ]
  },
  "ending-things": {
    "logline": "남자친구의 부모를 만나러 가는 눈길 위의 드라이브. 이름과 직업, 나이가 문장마다 바뀌기 시작한다.",
    "viewingPoints": [
      "차 안 대화의 인용 — 누가 말하는 문장인지 출처가 미끄러지는 지점.",
      "집 안에서 부모의 나이가 장면마다 재배열되는 편집 규칙.",
      "학교 시퀀스 — 서사가 완전히 다른 장르로 교체되는 문턱."
    ],
    "keywords": [
      "의식의 흐름",
      "인용",
      "노년",
      "눈"
    ],
    "quote": {
      "text": "모든 것은 다른 사람의 머릿속에서 더 오래 산다.",
      "en": "Everything lives longer in somebody else's mind.",
      "source": "프로그램 노트"
    },
    "references": [
      "Iain Reid, 『I'm Thinking of Ending Things』",
      "Charlie Kaufman, 〈시네도키, 뉴욕〉 (2008)"
    ]
  },
  "first-love": {
    "logline": "기억을 잃은 쪽과 기억을 안고 사는 쪽. 〈아사코〉의 '같은 얼굴, 다른 시간'을 시리즈의 길이로 늘려 놓은 작품.",
    "viewingPoints": [
      "눈(雪)과 비행기 — 시간대 전환의 고정 신호를 추적해볼 것.",
      "같은 노래가 다른 나이에 다시 들릴 때의 의미 변화."
    ],
    "keywords": [
      "기억상실",
      "첫사랑",
      "두 시간대"
    ],
    "quote": {
      "text": "그 노래를 다시 들으면, 그때의 내가 먼저 대답한다.",
      "en": "When I hear that song again, the person I was then answers first.",
      "source": "프로그램 노트"
    },
    "references": [
      "宇多田ヒカル, 「First Love」"
    ]
  },
  "duras-hiroshima": {
    "logline": "영화의 대사 이전에 존재했던 텍스트. 지시문과 시가 구분되지 않는 문장들이 레네의 이미지보다 먼저 기억을 구성한다.",
    "viewingPoints": [
      "시나리오 부록의 '느베르 노트'를 영화의 삽입 쇼트와 대조해 읽을 것.",
      "반복되는 '아무것도'의 문장 구조를 필사해볼 것."
    ],
    "keywords": [
      "시나리오",
      "반복",
      "증언 불가능성"
    ],
    "quote": {
      "text": "나는 모든 것을 보았다. 모든 것을.",
      "en": "I saw everything. Everything.",
      "source": "Duras, 시나리오"
    },
    "references": [
      "Marguerite Duras, 『모데라토 칸타빌레』"
    ]
  },
  "ripley": {
    "logline": "타인의 이름으로 사는 법. 흑백의 이탈리아에서 수행되는 자아가 점점 더 정교한 노동이 되어간다.",
    "viewingPoints": [
      "계단과 복도 — 신분이 교체되는 공간의 기하학.",
      "서류, 서명, 타자기 — 정체성이 사무 작업으로 만들어지는 과정."
    ],
    "keywords": [
      "사칭",
      "흑백",
      "수행",
      "계단"
    ],
    "quote": {
      "text": "이름을 바꾸는 데 필요한 것은 용기가 아니라 서류다.",
      "en": "Changing your name takes paperwork, not courage.",
      "source": "프로그램 노트"
    },
    "references": [
      "Patricia Highsmith, 『재능 있는 리플리 씨』"
    ]
  },
  "maiko": {
    "logline": "교토의 오키야에서 매일 밥을 짓는 아이. 〈퍼펙트 데이즈〉의 반복을 공동체의 규모로 확장한 이야기.",
    "viewingPoints": [
      "하루의 조리 과정이 수련과 동일한 형식으로 다뤄지는 방식.",
      "계절 재료 — 시간의 경과를 식탁으로만 표시하는 선택."
    ],
    "keywords": [
      "반복",
      "식사",
      "수련",
      "공동체"
    ],
    "quote": {
      "text": "같은 국을 백 번 끓이면 백 번째의 손이 달라진다.",
      "en": "If you make the same soup a hundred times, your hands are different the hundredth time.",
      "source": "프로그램 노트"
    },
    "references": [
      "小山愛子, 『마이코네 행복한 밥상』 (만화)"
    ]
  }
};
function editorialFor(id){return editorial[id]||null}
const byId=Object.fromEntries(works.map(w=>[w.id,w]));
let state=loadJson(APP_KEY,DEFAULT_STATE);let library=mergeSeed(loadJson(LIB_KEY,seedLibrary));
let admin=loadJson(ADMIN_KEY,{months:{},works:{},stills:{}});
Object.entries(admin.months||{}).forEach(([id,o])=>{if(months[id])Object.assign(months[id],o)});
Object.entries(admin.works||{}).forEach(([id,o])=>{if(byId[id])Object.assign(byId[id],o)});
function loadJson(k,fallback){try{const v=JSON.parse(localStorage.getItem(k));return v?{...fallback,...v}:structuredClone(fallback)}catch{return structuredClone(fallback)}}
function mergeSeed(items){const arr=Array.isArray(items)?items:[];for(const s of seedLibrary){if(!arr.some(x=>x.id===s.id))arr.push({...s});}return arr}
function save(){try{localStorage.setItem(APP_KEY,JSON.stringify(state));localStorage.setItem(LIB_KEY,JSON.stringify(library));}catch(e){toast('브라우저 저장 공간이 부족하거나 차단되어 있습니다. 현재 세션에서는 계속 사용할 수 있어요.')}}
function saveAdmin(){try{localStorage.setItem(ADMIN_KEY,JSON.stringify(admin));}catch(e){toast('관리자 수정 내용을 저장하지 못했어요.')}}
function formatTitle(w){if(!w)return'';return w.type==='book'?`『${w.title}』`:w.type==='article'?`「${w.title}」`:`<${w.title}>`}
function month(){return months[state.selectedMonth]||months['2026-10']}
function compKey(mid,wid){return `${mid}:${wid}`}
function isDone(mid,wid){return !!state.completed[compKey(mid,wid)]}
function toggleDone(mid,wid){const k=compKey(mid,wid);if(state.completed[k])delete state.completed[k];else state.completed[k]=new Date().toISOString();save();render()}
function recordFor(w){const norm=normalize(w.title);return library.find(r=>r.canonicalId===w.id)||library.find(r=>normalize(r.title)===norm && Number(r.year||0)===Number(w.year||0) && r.type===w.type)}
function normalize(s){return String(s||'').toLowerCase().replace(/[《》『』「」<>:：・,.!?'"\-\s]/g,'')}
function statusFor(w,mid){const r=recordFor(w);const inMonth=months[mid]&&(months[mid].core.includes(w.id)||months[mid].supp.includes(w.id));if(r&&inMonth)return 'REVISIT';if(r)return r.historicalStatus==='read'?'ALREADY READ':'ALREADY WATCHED';if(w.role==='CONNECTED')return 'CONNECTED';return 'NEW'}
function progress(mid){const ids=months[mid].core;const d=ids.filter(id=>isDone(mid,id)).length;return {done:d,total:ids.length,pct:Math.round(d/ids.length*100)}}
function setMonth(mid){state.selectedMonth=mid;save();render()}
function navTo(route){location.hash=route}
function route(){return location.hash||'#home'}
