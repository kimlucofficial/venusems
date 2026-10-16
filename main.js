/* =========================================================
   Venus EMS — hiệu ứng, trình chiếu, thư viện nội quy, tra cứu
   Nội dung nằm trong data.js
   ========================================================= */
(function(){
  var $ = function(id){ return document.getElementById(id); };
  var $$ = function(s, r){ return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var esc = function(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); };
  var strip = function(h){ var d = document.createElement('div'); d.innerHTML = h; return d.textContent; };
  var pad = function(n){ return (n < 10 ? '0' : '') + n; };
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia && matchMedia('(hover: hover) and (pointer: fine)').matches;

  var I = {
    amb: '<path d="M3 15V8h10v7M13 10h4l3 3v2h-7"/><circle cx="7" cy="16.5" r="2"/><circle cx="16.5" cy="16.5" r="2"/><path d="M8 9.5v4M6 11.5h4"/>',
    kit: '<rect x="3" y="7" width="18" height="12" rx="3"/><path d="M9 7V5h6v2M12 10v6M9 13h6"/>',
    hand: '<path d="M12 20s-7-4.3-7-9.2C5 8.4 6.8 7 8.7 7c1.4 0 2.6.8 3.3 1.8.7-1 1.9-1.8 3.3-1.8 1.9 0 3.7 1.4 3.7 3.8 0 4.9-7 9.2-7 9.2z"/><path d="M8 13h2.5l1-2 2 4 1-2H16"/>',
    phone: '<rect x="7" y="3" width="10" height="18" rx="3"/><path d="M10 7h4M11 17h2"/><path d="M3.5 8.5a6 6 0 0 0 0 7M20.5 8.5a6 6 0 0 1 0 7"/>',
    bed: '<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-7v5"/><circle cx="7" cy="11" r="2"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    star: '<path d="M12 3l2.6 5.6 6 .7-4.5 4.1 1.2 6L12 16.4 6.7 19.4l1.2-6L3.4 9.3l6-.7z"/>',
    heart: '<path d="M12 20s-7-4.3-7-9.2C5 8.4 6.8 7 8.7 7c1.4 0 2.6.8 3.3 1.8.7-1 1.9-1.8 3.3-1.8 1.9 0 3.7 1.4 3.7 3.8 0 4.9-7 9.2-7 9.2z"/>',
    doc: '<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    book: '<path d="M4 5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2z"/><path d="M4 19V5M9 7h6"/>',
    search: '<circle cx="10.5" cy="10.5" r="6"/><path d="M15 15l5 5"/>'
  };
  var icon = function(k, sw){ return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(sw||1.9)+'" stroke-linecap="round" stroke-linejoin="round">'+I[k]+'</svg>'; };
  var arrowR = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8h10M9 4l4 4-4 4"/></svg>';
  var arrowL = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8H3M7 4L3 8l4 4"/></svg>';
  var crossP = '<path d="M9 2h6v7h7v6h-7v7H9v-7H2V9h7z"/>';
  var heartP = '<path d="M12 21s-8-4.9-8-10.6C4 7.5 6.2 5.5 8.7 5.5c1.5 0 2.7.8 3.3 1.9.6-1.1 1.8-1.9 3.3-1.9 2.5 0 4.7 2 4.7 4.9C20 16.1 12 21 12 21z"/>';
  var totalRules = DATA.rules.reduce(function(s, c){ return s + c.items.length; }, 0);

  var deck = $('deck'), slides = $$('.slide', deck), ids = slides.map(function(s){ return s.dataset.id; });
  var cur = -1, lock = false, gateOpen = true;
  function idx(t){ if (typeof t === 'number') return t; var n = parseInt(t, 10); return isNaN(n) ? ids.indexOf(t) : n; }

  /* =================== Họa tiết SVG =================== */
  function scallop(n, R, r, C){
    var d = '';
    for (var i = 0; i <= n*2; i++){
      var a = i/(n*2)*Math.PI*2 - Math.PI/2, rr = i%2 ? r : R;
      d += (i ? 'Q' : 'M');
      if (i){ var am = (i-.5)/(n*2)*Math.PI*2 - Math.PI/2, rm = i%2 ? R+10 : r-4; d += (C+rm*Math.cos(am)).toFixed(1)+' '+(C+rm*Math.sin(am)).toFixed(1)+' '; }
      d += (C+rr*Math.cos(a)).toFixed(1)+' '+(C+rr*Math.sin(a)).toFixed(1)+' ';
    }
    return d + 'Z';
  }
  var scal = '<path d="'+scallop(28,236,222,250)+'" fill="#ffe3e6" stroke="#3b0d18" stroke-width="3"/><circle cx="250" cy="250" r="196" fill="#fff" stroke="#3b0d18" stroke-width="3"/><circle cx="250" cy="250" r="182" fill="none" stroke="#ef3346" stroke-width="3" stroke-dasharray="2 12" stroke-linecap="round"/>';
  $('gScal').innerHTML = scal;
  $('scallop').innerHTML = '<svg viewBox="0 0 500 500">' + scal + '</svg>';
  (function(){
    var u = function(svg){ return 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")'; };
    $('awning').style.backgroundImage = u('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 56 42" width="56" height="42"><path d="M0 0H28V28A14 14 0 0 1 0 28Z" fill="#ef3346"/><path d="M28 0H56V28A14 14 0 0 1 28 28Z" fill="#fffaf8"/><path d="M5 9H11V26H5Z" fill="#fff" fill-opacity=".25"/><path d="M0 28A14 14 0 0 0 28 28A14 14 0 0 0 56 28" fill="none" stroke="#3b0d18" stroke-width="2.5"/></svg>');
    var m = 22, C = 75, R = 72, r = 64, d = '';
    for (var j = 0; j <= m; j++){
      var b = j/m*Math.PI*2, bm = (j-.5)/m*Math.PI*2;
      if (!j) d += 'M'+(C+r*Math.cos(b)).toFixed(1)+' '+(C+r*Math.sin(b)).toFixed(1);
      else d += 'Q'+(C+R*Math.cos(bm)).toFixed(1)+' '+(C+R*Math.sin(bm)).toFixed(1)+' '+(C+r*Math.cos(b)).toFixed(1)+' '+(C+r*Math.sin(b)).toFixed(1);
    }
    $('emRing').innerHTML = '<svg viewBox="0 0 150 150"><path d="'+d+'Z" fill="#fff" stroke="#3b0d18" stroke-width="3"/><circle cx="75" cy="75" r="55" fill="#ffe3e6" stroke="#ef3346" stroke-width="2" stroke-dasharray="1.5 6" stroke-linecap="round"/></svg>';
  })();
  var bgItems = [];
  (function(){
    var shapes = [crossP, heartP, crossP, heartP, crossP, crossP, heartP, crossP];
    var pos = [[6,22,42],[90,18,34],[14,72,30],[84,64,46],[48,88,26],[70,36,22],[30,40,20],[94,90,30]];
    $('bgfx').innerHTML = pos.map(function(p, i){
      return '<i style="left:'+p[0]+'%;top:'+p[1]+'%;width:'+p[2]+'px;height:'+p[2]+'px"><svg viewBox="0 0 24 24" fill="currentColor" style="--t:'+(10+i*2)+'s;animation-delay:-'+i+'s">'+shapes[i]+'</svg></i>';
    }).join('');
    bgItems = $$('#bgfx i').map(function(el, i){ return { el: el, z: 10 + (i % 4) * 12 }; });
  })();

  /* =================== Điều hướng =================== */
  var navItems = slides.map(function(s, i){ return { i: i, t: s.dataset.t }; });
  var half = Math.ceil(navItems.length / 2);
  function sign(n, k){ return '<a class="hang" style="--i:'+k+'" data-to="'+n.i+'"><span><b></b><em>'+esc(n.t)+'</em></span></a>'; }
  $('navL').innerHTML = navItems.slice(0, half).map(function(n, k){ return sign(n, k); }).join('');
  $('navR').innerHTML = navItems.slice(half).map(function(n, k){ return sign(n, k + half + 1); }).join('');
  $('msList').innerHTML = navItems.map(function(n){ return '<a data-to="'+n.i+'"><b>'+pad(n.i+1)+'</b>'+esc(n.t)+'</a>'; }).join('');
  $('dots').innerHTML = navItems.map(function(n){ return '<a data-to="'+n.i+'"><span>'+esc(n.t)+'</span><b>'+pad(n.i+1)+'</b><i></i></a>'; }).join('');
  $('flinks').innerHTML = navItems.map(function(n){ return '<a data-to="'+n.i+'">'+esc(n.t)+'</a>'; }).join('');
  $('mOpen').addEventListener('click', function(){ this.classList.toggle('on'); $('msheet').classList.toggle('open'); });
  function closeSheet(){ $('mOpen').classList.remove('on'); $('msheet').classList.remove('open'); }

  /* =================== Cổng vào =================== */
  $('gCards').innerHTML = [
    { to: 'noiquy', t: 'Nội quy', s: totalRules + ' điều', i: 'doc' },
    { to: 'capbac', t: 'Cấp bậc', s: DATA.ranks.length + ' cấp', i: 'star' },
    { to: 'cuuho', t: 'Cứu hộ', s: DATA.flow.length + ' bước', i: 'amb' }
  ].map(function(c, i){
    return '<button class="g-card" type="button" data-gate="'+c.to+'"><span class="gi">'+icon(c.i, 2)+'</span><span><em>'+pad(i+1)+'</em><b>'+c.t+'</b><small>'+c.s+'</small></span></button>';
  }).join('');

  /* =================== 01 Trang chủ =================== */
  $('heroLead').textContent = DATA.introText;
  $('heroChips').innerHTML = DATA.values.map(function(v){ return '<span class="chip">'+esc(v)+'</span>'; }).join('');
  var stripItems = [
    { to: 'gioithieu', t: 'Giới thiệu', s: 'Ba nhiệm vụ cốt lõi' },
    { to: 'capbac', t: 'Cấp bậc', s: 'Từ Recruit đến Chief' },
    { to: 'noiquy', t: 'Nội quy', s: totalRules + ' điều trong ' + DATA.rules.length + ' chương' },
    { to: 'cuuho', t: 'Cứu hộ', s: DATA.flow.length + ' bước · ' + DATA.codes.length + ' mức phân loại' },
    { to: 'tuyendung', t: 'Tuyển dụng', s: 'Gia nhập Venus EMS' }
  ];
  $('strip').className = 'strip rv';
  $('strip').innerHTML = stripItems.map(function(x, k){
    return '<a data-to="'+x.to+'" style="--k:'+k+'"><span class="arrow">'+arrowR+'</span><em>'+pad(ids.indexOf(x.to)+1)+'</em><b>'+x.t+'</b><small>'+esc(x.s)+'</small></a>';
  }).join('');
  var tk = DATA.ticker.map(function(t){ return esc(t) + '<svg viewBox="0 0 24 24" fill="currentColor" stroke="#3b0d18" stroke-width="1.6">'+crossP+'</svg>'; }).join('');
  $('ticker').innerHTML = '<span>'+tk+tk+'</span><span>'+tk+tk+'</span>';

  /* =================== 02 Giới thiệu =================== */
  $('bento').innerHTML =
    '<div class="card b-about rv"><div class="wm"><img src="logo.webp" alt=""></div><div class="eyebrow"><b>EMS</b>Về chúng tôi</div>'+
    '<p>'+esc(DATA.introText).replace('Venus EMS', '<b>Venus EMS</b>').replace('24/7', '<b>24/7</b>')+'</p>'+
    '<div class="chips">'+DATA.values.map(function(v){ return '<span class="chip">'+esc(v)+'</span>'; }).join('')+'</div></div>'+
    DATA.intro.map(function(c, i){
      return '<div class="card svc s'+(i+1)+' rv tilt" id="svc'+i+'"><div class="row"><div class="ico">'+icon(c.i, 1.8)+'</div><span class="n">'+pad(i+1)+'</span></div><h3>'+esc(c.t)+'</h3><p>'+esc(c.d)+'</p></div>';
    }).join('')+
    '<div class="card b-clock rv"><span class="dial"></span><span class="hand"></span><div><div class="big">24/7</div><small>Luôn sẵn sàng</small></div></div>'+
    '<div class="card vow rv"><div class="q">“</div><p>'+esc(DATA.vow)+'<small>— '+esc(DATA.vowBy)+'</small></p><div class="sig"><img src="logo.webp" alt=""></div></div>';

  /* =================== 03 Cấp bậc =================== */
  function crossSvg(boss){
    return '<svg viewBox="0 0 84 84"><circle cx="42" cy="42" r="38" fill="'+(boss?'#ef3346':'#ffe3e6')+'" stroke="#3b0d18" stroke-width="2.5"/>'+
      '<path d="M34 18h16v16h16v16H50v16H34V50H18V34h16z" fill="'+(boss?'#fff':'#ef3346')+'" stroke="#3b0d18" stroke-width="2.5" stroke-linejoin="round"/>'+
      (boss ? '<path d="M28 10l5 6 9-9 9 9 5-6-2 10H30z" fill="#ffe08a" stroke="#3b0d18" stroke-width="2.2" stroke-linejoin="round" transform="translate(0,-8)"/>' : '')+'</svg>';
  }
  var R0 = DATA.ranks[0], RN = DATA.ranks[DATA.ranks.length - 1];
  $('rkMeta').innerHTML = '<span class="pill"><b>'+DATA.ranks.length+'</b> cấp bậc</span><span class="pill">Từ <b>'+esc(R0.n)+'</b> đến <b>'+esc(RN.n)+'</b></span>';
  $('rkStage').innerHTML = '<div class="rk-ghost" id="rkGhost">0</div><div class="rk-top"><span class="rk-pill" id="rkPill"></span><span class="rk-of">/ Cấp '+RN.g+'</span></div>'+
    '<div class="rk-body" id="rkBody"></div><div><div class="meter" id="rkMeter">'+DATA.ranks.map(function(r, k){ return '<i style="--k:'+k+'"></i>'; }).join('')+'</div>'+
    '<div class="meter-l"><span>'+esc(R0.n)+'</span><span>'+esc(RN.n)+'</span></div></div>';
  var rkList = $('rkList');
  rkList.innerHTML = DATA.ranks.map(function(r, i){
    return '<button class="rk-row" type="button" data-i="'+i+'"><span class="lvl">'+r.g+'</span><span><h4>'+esc(r.n)+'</h4><small>'+esc(r.vn)+'</small></span>'+
      '<svg class="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3l5 5-5 5"/></svg><i class="timer"></i></button>';
  }).join('');
  var rkCur = -1, rkTimer = null, RK_DUR = 5000;
  function setRank(i){
    if (i === rkCur) return; rkCur = i;
    var r = DATA.ranks[i], body = $('rkBody');
    $('rkPill').textContent = 'Cấp ' + r.g; $('rkGhost').textContent = r.g;
    $('rkStage').classList.toggle('boss', !!r.boss);
    body.classList.remove('rk-swap'); void body.offsetWidth;
    body.innerHTML = '<div class="cross">'+crossSvg(r.boss)+'</div><div><h3>'+esc(r.n)+'</h3><div class="vn">'+esc(r.vn)+'</div><p>'+esc(r.p)+'</p></div>';
    body.classList.add('rk-swap');
    $$('#rkMeter i').forEach(function(m, k){ m.classList.toggle('on', k <= i); });
    $$('.rk-row', rkList).forEach(function(b, k){ b.classList.remove('on'); if (k === i){ void b.offsetWidth; b.classList.add('on'); } });
  }
  function rkAuto(){
    clearInterval(rkTimer);
    rkList.style.setProperty('--dur', RK_DUR + 'ms');
    if (REDUCED) return;
    rkTimer = setInterval(function(){
      if (!rkList.classList.contains('paused') && ids[cur] === 'capbac') setRank((rkCur + 1) % DATA.ranks.length);
    }, RK_DUR);
  }
  $$('.rk-row', rkList).forEach(function(b){ b.addEventListener('click', function(){ setRank(+b.dataset.i); rkAuto(); }); });
  [rkList, $('rkStage')].forEach(function(el){
    el.addEventListener('mouseenter', function(){ rkList.classList.add('paused'); });
    el.addEventListener('mouseleave', function(){ rkList.classList.remove('paused'); });
  });
  $('crit').innerHTML = DATA.criteria.map(function(c, i){
    return '<div class="card cr rv tilt"><div class="ci">'+icon(c.i, 2)+'</div><div><small>Tiêu chí '+pad(i+1)+'</small><h4>'+esc(c.t)+'</h4></div></div>';
  }).join('');

  /* =================== 04 Nội quy — thư viện =================== */
  var ruleNo = [], n0 = 0;
  DATA.rules.forEach(function(ch){ ruleNo.push(n0); n0 += ch.items.length; });
  $('lawMeta').innerHTML = '<span class="pill"><b>'+DATA.rules.length+'</b> chương</span><span class="pill"><b>'+totalRules+'</b> điều</span>';
  $('libNav').innerHTML = '<h4>'+icon('book', 2.2)+'Mục lục</h4><ol>'+DATA.rules.map(function(ch, i){
    return '<li><a data-law="'+i+'"><b>'+pad(i+1)+'</b><span>'+esc(ch.t)+'</span><small>'+ch.items.length+' điều</small></a></li>';
  }).join('')+'</ol><div class="lib-tip"><button type="button" data-search>'+icon('search', 2.4).replace('<svg ', '<svg width="16" height="16" ')+'Tra cứu nhanh</button><kbd>Ctrl K</kbd></div>';
  var lawCur = -1;
  function openLaw(i, focusK){
    var ch = DATA.rules[i], rd = $('reader'), body;
    if (i !== lawCur){
      lawCur = i;
      if (ch.scale){
        body = '<div class="sev">'+ch.items.map(function(t, k){
          var bars = ''; for (var b = 0; b < 3; b++) bars += '<i class="'+(b <= k ? 'on' : '')+'"></i>';
          var lv = ch.levels && ch.levels[k] ? ' · ' + esc(ch.levels[k]) : '';
          return '<div class="card sev-card v'+(k+1)+'" style="--k:'+k+'" data-k="'+k+'"><div class="lv"><span>Điều '+pad(ruleNo[i]+k+1)+lv+'</span><div class="bars">'+bars+'</div></div><p>'+t+'</p></div>';
        }).join('')+'<div class="sev-arrow"></div></div>';
      } else {
        body = '<div class="rules">'+ch.items.map(function(t, k){
          return '<div class="card rule" style="--k:'+k+'" data-k="'+k+'"><div class="no"><small>ĐIỀU</small><b>'+pad(ruleNo[i]+k+1)+'</b></div><p>'+t+'</p></div>';
        }).join('')+'</div>';
      }
      var prev = i > 0 ? DATA.rules[i-1] : null, next = i < DATA.rules.length - 1 ? DATA.rules[i+1] : null;
      rd.classList.remove('rd-swap'); void rd.offsetWidth;
      rd.innerHTML = '<div class="rd-head'+(i % 2 ? ' alt' : '')+'"><div class="num">'+pad(i+1)+'</div><div><small>Chương '+pad(i+1)+' · '+ch.items.length+' điều</small><h3>'+esc(ch.t)+'</h3>'+(ch.d ? '<p>'+esc(ch.d)+'</p>' : '')+'</div></div>'+
        body+
        '<div class="rd-nav"><button class="btn white sm" type="button" data-law="'+(i-1)+'"'+(prev?'':' disabled')+'><span class="ic" style="margin:0 0 0 -12px">'+arrowL+'</span><span class="lbl">'+(prev?esc(prev.t):'')+'</span></button>'+
        '<button class="btn sm" type="button" data-law="'+(i+1)+'"'+(next?'':' disabled')+'><span class="lbl">'+(next?esc(next.t):'')+'</span><span class="ic">'+arrowR+'</span></button></div>';
      rd.classList.add('rd-swap');
      $$('#libNav a').forEach(function(a, k){ a.classList.toggle('on', k === i); });
    }
    if (focusK != null){
      setTimeout(function(){
        var el = rd.querySelector('[data-k="'+focusK+'"]'); if (!el) return;
        el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
        el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
      }, 120);
    }
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-law]'); if (!a || a.disabled) return;
    e.preventDefault();
    var i = +a.dataset.law; if (i < 0 || i >= DATA.rules.length) return;
    openLaw(i);
    if (a.closest('.rd-nav')){ var top = $('libNav').getBoundingClientRect().top - slides[cur].getBoundingClientRect().top + slides[cur].scrollTop - 20; slides[cur].scrollTo({ top: top, behavior: 'smooth' }); }
  });
  openLaw(0);

  /* =================== 05 Cứu hộ =================== */
  $('tl').innerHTML = '<div class="tl-track"><i></i></div><div class="tl-amb"><svg viewBox="0 0 64 40"><rect class="siren" x="16" y="2" width="10" height="6" rx="2" fill="#ef3346" stroke="#3b0d18" stroke-width="2"/>'+
    '<path d="M4 30V10h36v20zM40 16h10l8 8v6H40z" fill="#fff" stroke="#3b0d18" stroke-width="2.5" stroke-linejoin="round"/><path d="M19 14v10M14 19h10" stroke="#ef3346" stroke-width="3.5"/>'+
    '<path d="M44 18h5l5 5h-10z" fill="#9be7d3" stroke="#3b0d18" stroke-width="2"/><circle cx="14" cy="31" r="5" fill="#3b0d18"/><circle cx="48" cy="31" r="5" fill="#3b0d18"/></svg></div>'+
    '<div class="tl-steps">'+DATA.flow.map(function(s, i){
      return '<div class="tl-step" style="--k:'+i+'"><div class="dot">'+icon(s.i, 1.9)+'<span>'+(i+1)+'</span></div><div class="card box tilt" id="flow'+i+'"><small>BƯỚC '+pad(i+1)+'</small><h3>'+esc(s.t)+'</h3><p>'+esc(s.d)+'</p></div></div>';
    }).join('')+'</div>';
  var seg = [[0,30],[40,30],[48,30],[54,12],[62,46],[70,4],[78,40],[84,30],[140,30],[146,22],[152,36],[158,30],[200,30]], ecg = '';
  for (var rep = 0; rep < 4; rep++) seg.forEach(function(p, k){ ecg += (rep === 0 && k === 0 ? 'M' : 'L') + (p[0] + rep*200) + ' ' + p[1]; });
  $('triage').innerHTML = DATA.codes.map(function(c, i){
    return '<div class="card tri '+c.k+' rv tilt" id="code'+i+'" style="--spd:'+c.spd+'"><div class="pr"><span>Ưu tiên '+pad(i+1)+'</span><b>'+(i+1)+'</b></div><h3>'+esc(c.c)+'</h3><p>'+esc(c.d)+'</p>'+
      '<div class="mon"><svg viewBox="0 0 800 50" preserveAspectRatio="none"><path d="'+ecg+'"/></svg></div></div>';
  }).join('');

  /* =================== 06 Tuyển dụng =================== */
  $('joinText').textContent = DATA.joinText;
  $$('.discord').forEach(function(a){ a.href = DATA.discord; });
  $('path').innerHTML = DATA.join.map(function(s, i){
    return '<div class="card pstep rv tilt"><span class="pn">'+pad(i+1)+'</span><h3>'+esc(s.t)+'</h3><p>'+esc(s.d)+'</p></div>';
  }).join('');

  /* =================== Tách chữ =================== */
  (function(){
    var k = 0;
    (function chars(node){
      Array.prototype.slice.call(node.childNodes).forEach(function(n){
        if (n.nodeType === 3){
          var f = document.createDocumentFragment();
          n.textContent.split('').forEach(function(c){ var s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--k', k++); s.textContent = c; f.appendChild(s); });
          n.parentNode.replaceChild(f, n);
        } else if (n.nodeType === 1) chars(n);
      });
    })($('heroTitle'));
    $$('.split').forEach(function(h){
      var w = 0;
      (function walk(node){
        Array.prototype.slice.call(node.childNodes).forEach(function(n){
          if (n.nodeType === 3){
            var f = document.createDocumentFragment();
            n.textContent.split(/(\s+)/).forEach(function(part){
              if (!part) return;
              if (/^\s+$/.test(part)){ f.appendChild(document.createTextNode(' ')); return; }
              var o = document.createElement('span'); o.className = 'w';
              var i = document.createElement('i'); i.style.setProperty('--k', w++); i.textContent = part;
              o.appendChild(i); f.appendChild(o);
            });
            n.parentNode.replaceChild(f, n);
          } else if (n.nodeType === 1) walk(n);
        });
      })(h);
    });
  })();
  $$('.tilt').forEach(function(c){ var g = document.createElement('span'); g.className = 'glare'; c.appendChild(g); });

  /* =================== Xuất hiện =================== */
  var io = null;
  function reveal(el, d){
    el.style.setProperty('--d', d + 's');
    el.classList.add('in');
    var done = function(e){ if (e.target !== el || e.propertyName !== 'transform') return; el.classList.add('done'); el.removeEventListener('transitionend', done); };
    el.addEventListener('transitionend', done);
    setTimeout(function(){ el.classList.add('done'); }, 1800 + d * 1000);
  }
  if ('IntersectionObserver' in window){
    io = new IntersectionObserver(function(entries){
      var vis = entries.filter(function(e){ return e.isIntersecting; }).map(function(e){ return e.target; });
      vis.sort(function(a, b){ return a.compareDocumentPosition(b) & 4 ? -1 : 1; });
      vis.forEach(function(el, i){ io.unobserve(el); reveal(el, Math.min(i * 0.08, 0.6)); });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  }
  function arm(scope){
    $$('.rv', scope).forEach(function(el){
      el.classList.remove('in', 'done'); el.style.transform = ''; el.style.removeProperty('--d');
      if (io) io.observe(el); else reveal(el, 0);
    });
  }

  /* =================== Trình chiếu =================== */
  var wipe = $('wipe'), progEl = $('prog');
  function update(){
    var id = ids[cur];
    $$('[data-to]').forEach(function(a){ if (!a.closest('.nav') && !a.closest('.dots') && !a.closest('.msheet')) return; a.classList.toggle('on', idx(a.dataset.to) === cur); });
    $('dCnt').innerHTML = '<b class="flip">'+pad(cur+1)+'</b>/ '+pad(slides.length);
    $('dHint').classList.toggle('off', cur === slides.length - 1);
    prog();
    if (id === 'capbac'){ rkCur = -1; setRank(0); rkAuto(); } else clearInterval(rkTimer);
  }
  function prog(){ var s = slides[cur], m = s.scrollHeight - s.clientHeight, k = m > 0 ? s.scrollTop / m : 1; progEl.style.transform = 'scaleX(' + ((cur + k) / slides.length) + ')'; }
  function swapTo(i, keep){
    slides.forEach(function(s, k){ s.classList.toggle('on', k === i); });
    if (!keep) slides[i].scrollTop = 0;
    cur = i; arm(slides[i]); update();
  }
  function show(t, opt){
    opt = opt || {};
    var i = idx(t);
    if (i < 0 || i >= slides.length || lock) return false;
    closeSheet();
    if (i === cur){ if (opt.after) opt.after(); else slides[cur].scrollTo({ top: 0, behavior: 'smooth' }); return true; }
    if (cur < 0 || REDUCED){ swapTo(i); if (opt.after) setTimeout(opt.after, 200); return true; }
    lock = true;
    $('wipeTxt').textContent = slides[i].dataset.t; $('wipeNo').textContent = pad(i + 1) + ' / ' + pad(slides.length);
    wipe.classList.remove('run', 'up'); void wipe.offsetWidth;
    wipe.classList.add('run'); if (i < cur) wipe.classList.add('up');
    setTimeout(function(){ swapTo(i); if (opt.after) setTimeout(opt.after, 350); }, 520);
    setTimeout(function(){ wipe.classList.remove('run', 'up'); lock = false; }, 1150);
    return true;
  }
  document.addEventListener('click', function(e){
    var a = e.target.closest && e.target.closest('[data-to]'); if (!a) return;
    e.preventDefault(); show(a.dataset.to);
  });
  function atBottom(s){ return s.scrollTop + s.clientHeight >= s.scrollHeight - 3; }
  function atTop(s){ return s.scrollTop <= 2; }
  var acc = 0, accT = 0, scrollT = 0;
  slides.forEach(function(s){
    s.addEventListener('scroll', function(){
      if (s !== slides[cur]) return;
      scrollT = Date.now(); prog();
      var w = s.querySelector('.wmk'); if (w) w.style.transform = 'translateX(' + (-s.scrollTop * .18) + 'px)';
    }, { passive: true });
  });
  deck.addEventListener('wheel', function(e){
    if (gateOpen || lock){ e.preventDefault(); return; }
    var s = slides[cur], d = e.deltaY, now = Date.now();
    if (now - accT > 260) acc = 0;
    accT = now;
    if ((d > 0 && atBottom(s)) || (d < 0 && atTop(s))){
      e.preventDefault();
      if (now - scrollT < 380) return;
      acc += d;
      if (acc > 110){ acc = 0; show(cur + 1); }
      else if (acc < -110){ acc = 0; show(cur - 1); }
    } else acc = 0;
  }, { passive: false });
  var ty = 0, tTop = false, tBot = false;
  deck.addEventListener('touchstart', function(e){ var s = slides[cur]; ty = e.touches[0].clientY; tTop = atTop(s); tBot = atBottom(s); }, { passive: true });
  deck.addEventListener('touchend', function(e){
    if (gateOpen || lock) return;
    var dy = ty - e.changedTouches[0].clientY; if (Math.abs(dy) < 70) return;
    if (dy > 0 && tBot) show(cur + 1);
    else if (dy < 0 && tTop) show(cur - 1);
  }, { passive: true });
  document.addEventListener('keydown', function(e){
    if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')){ e.preventDefault(); if (!gateOpen) openS(); return; }
    if (gateOpen){ if (e.key === 'Enter'){ e.preventDefault(); enter(0); } return; }
    if (sov.classList.contains('open')) return;
    if (e.target.closest && e.target.closest('input,textarea')) return;
    if (e.key === '/' ){ e.preventDefault(); openS(); return; }
    var s = slides[cur];
    switch (e.key){
      case 'ArrowDown': e.preventDefault(); if (atBottom(s)) show(cur + 1); else s.scrollBy({ top: 140, behavior: 'smooth' }); break;
      case 'ArrowUp': e.preventDefault(); if (atTop(s)) show(cur - 1); else s.scrollBy({ top: -140, behavior: 'smooth' }); break;
      case 'PageDown': case ' ': e.preventDefault(); if (atBottom(s)) show(cur + 1); else s.scrollBy({ top: s.clientHeight * .85, behavior: 'smooth' }); break;
      case 'PageUp': e.preventDefault(); if (atTop(s)) show(cur - 1); else s.scrollBy({ top: -s.clientHeight * .85, behavior: 'smooth' }); break;
      case 'ArrowRight': show(cur + 1); break;
      case 'ArrowLeft': show(cur - 1); break;
      case 'Home': e.preventDefault(); show(0); break;
      case 'End': e.preventDefault(); show(slides.length - 1); break;
    }
  });

  /* Gợn sóng khi bấm nút */
  document.addEventListener('pointerdown', function(e){
    var b = e.target.closest && e.target.closest('.btn'); if (!b) return;
    var r = b.getBoundingClientRect(), sz = Math.max(r.width, r.height), sp = document.createElement('span');
    sp.className = 'rip'; sp.style.width = sp.style.height = sz + 'px';
    sp.style.left = (e.clientX - r.left - sz/2) + 'px'; sp.style.top = (e.clientY - r.top - sz/2) + 'px';
    b.appendChild(sp); setTimeout(function(){ sp.remove(); }, 750);
  });

  /* =================== Tra cứu =================== */
  var sov = $('sov'), sQ = $('sQ'), sRes = $('sRes'), sMeta = $('sMeta'), sSel = 0, sList = [];
  function norm(s){ return s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D').toLowerCase(); }
  var IDX = [];
  DATA.rules.forEach(function(ch, i){
    ch.items.forEach(function(t, k){
      IDX.push({ b: 'Điều<br>' + pad(ruleNo[i]+k+1), c: 'Nội quy · ' + ch.t, t: strip(t), go: function(){ show('noiquy', { after: function(){ openLaw(i, k); } }); } });
    });
  });
  DATA.ranks.forEach(function(r, i){
    IDX.push({ b: 'Cấp<br>' + r.g, c: 'Cấp bậc', t: r.n + ' — ' + r.vn + '. ' + r.p, go: function(){ show('capbac', { after: function(){ setRank(i); rkAuto(); var el = $('rkStage'); el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash'); } }); } });
  });
  DATA.flow.forEach(function(f, i){
    IDX.push({ b: 'Bước<br>' + (i+1), c: 'Quy trình cứu hộ', t: f.t + ' — ' + f.d, go: function(){ show('cuuho', { after: function(){ focusEl('flow' + i); } }); } });
  });
  DATA.codes.forEach(function(c, i){
    IDX.push({ b: c.c, c: 'Phân loại bệnh nhân', t: 'Mã ' + c.c + ' — ' + c.d, go: function(){ show('cuuho', { after: function(){ focusEl('code' + i); } }); } });
  });
  DATA.intro.forEach(function(c, i){
    IDX.push({ b: pad(i+1), c: 'Giới thiệu', t: c.t + ' — ' + c.d, go: function(){ show('gioithieu', { after: function(){ focusEl('svc' + i); } }); } });
  });
  IDX.forEach(function(x){
    var n = '', map = [];
    for (var j = 0; j < x.t.length; j++){ var c = norm(x.t[j]); for (var m = 0; m < c.length; m++){ n += c[m]; map.push(j); } }
    x.n = n; x.map = map;
  });
  function focusEl(id){
    var el = $(id); if (!el) return;
    el.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'center' });
    el.classList.remove('flash'); void el.offsetWidth; el.classList.add('flash');
  }
  function hl(x, q){
    var p = x.n.indexOf(q);
    if (p < 0 || !q) return esc(x.t);
    var a = x.map[p], b = x.map[p + q.length - 1] + 1;
    return esc(x.t.slice(0, a)) + '<mark>' + esc(x.t.slice(a, b)) + '</mark>' + esc(x.t.slice(b));
  }
  function runS(){
    var q = norm(sQ.value.trim());
    sList = q ? IDX.filter(function(x){ return x.n.indexOf(q) > -1; }) : IDX.slice(0, 6);
    sSel = 0;
    sMeta.textContent = q ? (sList.length ? sList.length + ' kết quả' : 'Không có kết quả') : 'Gợi ý · Gõ không dấu cũng tìm được.';
    sRes.innerHTML = sList.length ? sList.map(function(x, i){
      return '<button class="sr'+(i === 0 ? ' on' : '')+'" type="button" data-i="'+i+'"><b>'+x.b+'</b><span>'+esc(x.c)+'</span><p>'+hl(x, q)+'</p></button>';
    }).join('') : '<div class="sempty">Thử từ khoá khác, ví dụ: đồng phục, bộ đàm, giáng cấp.</div>';
  }
  function selS(i){
    var it = $$('.sr', sRes); if (!it.length) return;
    sSel = (i + it.length) % it.length;
    it.forEach(function(b, k){ b.classList.toggle('on', k === sSel); });
    it[sSel].scrollIntoView({ block: 'nearest' });
  }
  function goS(i){ var x = sList[i]; if (!x) return; closeS(); setTimeout(x.go, 150); }
  function openS(){ closeSheet(); sov.classList.add('open'); runS(); setTimeout(function(){ sQ.focus(); sQ.select(); }, 60); }
  function closeS(){ sov.classList.remove('open'); sQ.blur(); }
  $('sOpen').addEventListener('click', openS);
  document.addEventListener('click', function(e){ if (e.target.closest && e.target.closest('[data-search]')) openS(); });
  $('sClose').addEventListener('click', closeS);
  sov.addEventListener('click', function(e){ if (e.target === sov) closeS(); });
  sQ.addEventListener('input', runS);
  sQ.addEventListener('keydown', function(e){
    if (e.key === 'ArrowDown'){ e.preventDefault(); selS(sSel + 1); }
    else if (e.key === 'ArrowUp'){ e.preventDefault(); selS(sSel - 1); }
    else if (e.key === 'Enter'){ e.preventDefault(); goS(sSel); }
    else if (e.key === 'Escape'){ e.preventDefault(); closeS(); }
  });
  sRes.addEventListener('click', function(e){ var b = e.target.closest('.sr'); if (b) goS(+b.dataset.i); });
  sRes.addEventListener('mousemove', function(e){ var b = e.target.closest('.sr'); if (b && +b.dataset.i !== sSel) selS(+b.dataset.i); });

  /* =================== Cổng vào =================== */
  function enter(target){
    if (!gateOpen) return;
    gateOpen = false;
    $('gate').classList.add('out');
    document.body.classList.add('ready');
    swapTo(idx(target || 0));
    setTimeout(function(){ var g = $('gate'); if (g) g.remove(); }, 1200);
  }
  $('gGo').addEventListener('click', function(){ enter(0); });
  $$('[data-gate]').forEach(function(b){ b.addEventListener('click', function(){ enter(b.dataset.gate); }); });

  /* =================== Hiệu ứng chuột =================== */
  if (FINE && !REDUCED){
    document.body.classList.add('has-cur');
    var c = $('cur'), ring = $('cring'), mx = innerWidth/2, my = innerHeight/2, rx = mx, ry = my, px = 0, py = 0, spx = 0, spy = 0;
    var layers = $$('#badge .lay');
    window.addEventListener('pointermove', function(e){
      mx = e.clientX; my = e.clientY; px = mx / innerWidth - .5; py = my / innerHeight - .5;
      c.style.transform = 'translate(' + mx + 'px,' + my + 'px)';
    }, { passive: true });
    document.addEventListener('pointerdown', function(){ ring.classList.add('down'); });
    document.addEventListener('pointerup', function(){ ring.classList.remove('down'); });
    document.addEventListener('mouseover', function(e){ ring.classList.toggle('hov', !!(e.target.closest && e.target.closest('a,button,.btn'))); });
    (function loop(){
      rx += (mx - rx) * .18; ry += (my - ry) * .18; spx += (px - spx) * .08; spy += (py - spy) * .08;
      ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
      if (cur === 0) layers.forEach(function(l){ var z = +l.dataset.depth; l.style.transform = 'translate(' + (spx * z) + 'px,' + (spy * z) + 'px)'; });
      bgItems.forEach(function(b){ b.el.style.transform = 'translate(' + (-spx * b.z) + 'px,' + (-spy * b.z) + 'px)'; });
      requestAnimationFrame(loop);
    })();
    $$('[data-mag]').forEach(function(m){
      m.addEventListener('pointermove', function(e){
        var r = m.getBoundingClientRect();
        m.style.setProperty('--mx', ((e.clientX - r.left - r.width/2) * .28) + 'px');
        m.style.setProperty('--my', ((e.clientY - r.top - r.height/2) * .35) + 'px');
      });
      m.addEventListener('pointerleave', function(){ m.style.setProperty('--mx', '0px'); m.style.setProperty('--my', '0px'); });
    });
    $$('.tilt').forEach(function(card){
      card.addEventListener('pointermove', function(e){
        if (card.classList.contains('rv') && !card.classList.contains('done')) return;
        var r = card.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        card.style.transition = 'transform .35s cubic-bezier(.2,.9,.2,1)';
        card.style.transform = 'perspective(900px) rotateX(' + ((.5 - y) * 10) + 'deg) rotateY(' + ((x - .5) * 12) + 'deg) translateY(-6px)';
        card.style.setProperty('--gx', (x * 100) + '%'); card.style.setProperty('--gy', (y * 100) + '%');
      });
      card.addEventListener('pointerleave', function(){ card.style.transform = ''; });
    });
  }
})();
