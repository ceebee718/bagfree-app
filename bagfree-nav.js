/* ============================================================================
   BagFree — Shared Left Sidebar
   Drop into any page with ONE line, just before </body>:
       <script src="/bagfree-nav.js" defer></script>
   It injects the sidebar, shifts page content right on desktop, and becomes a
   slide-in drawer on mobile. No dependencies. If supabase-js is already on the
   page and a user is signed in, the city + points personalize automatically.

   ── EDIT NAV LINKS HERE ──  (single source of truth for every page)
   Two hrefs are best-guess until app.jsx confirms them — marked  ⚠ VERIFY.
   ========================================================================== */
(function () {
  if (window.__bfNavLoaded) return;          // guard against double-include
  window.__bfNavLoaded = true;

  var NAV = [
    { label: 'Home',            href: '/',                            icon: 'grid'   },
    { label: 'Plan My Trip',    href: '/plan-my-trip.html',           icon: 'map'    },
    { label: 'Clothing',        href: '/departure-lounge-landing.html', icon: 'hanger' }, // ⚠ VERIFY
    { label: 'Curators',        href: '/curators.html',               icon: 'user'   },
    { label: 'Essentials',      href: '/legacy.html#essentials',      icon: 'bottle' },
    { label: 'Experiences',     href: '/experiences.html',            icon: 'compass'},
    { label: 'Membership',      href: '/membership.html',             icon: 'crown'  },
    { label: 'Rewards',         href: '/legacy.html#rewards',         icon: 'star'   },
    { label: 'Second Journey™', href: '/second-journey.html',         icon: 'sj', sage: true },
    { label: 'Partner',         href: '/partners.html',               icon: 'gift'   }
  ];
  var REWARDS_HREF = '/account.html';        // "View rewards" link at the bottom
  var DEFAULT_CITY = 'Savannah';
  var DEFAULT_POINTS = '2,450';

  /* ── Icons ─────────────────────────────────────────────────────────────── */
  var ICON = {
    grid:   '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
    map:    '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
    hanger: '<path d="M12 6a2 2 0 1 1 1.4 1.9c-.6.2-.9.7-.9 1.3v1L4 16h16l-7.5-5.8"/>',
    user:   '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6"/>',
    bottle: '<path d="M10 3h4v2.5l1 2v12a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 19.5v-12l1-2z"/><path d="M9 11h6"/>',
    compass:'<circle cx="12" cy="12" r="9"/><path d="M15.5 8.5 13 13l-4.5 2.5L11 11z"/>',
    crown:  '<path d="M4 17l-1.5-9 5 4 4.5-7 4.5 7 5-4L20 17z"/><path d="M4 17h16v2H4z"/>',
    star:   '<path d="M12 3l2.6 5.6 6 .6-4.5 4 1.3 6L12 18l-5.4 1.8 1.3-6-4.5-4 6-.6z"/>',
    gift:   '<rect x="4" y="9" width="16" height="11" rx="1"/><path d="M4 13h16M12 9v11M8 9a2.2 2.2 0 1 1 4-2 2.2 2.2 0 1 1 4 2"/>',
    pin:    '<circle cx="12" cy="10.5" r="2.3"/><path d="M12 21s6.5-5 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 16 12 21 12 21z"/>',
    chev:   '<path d="M9 6l6 6-6 6"/>'
  };
  function svg(name, fill) {
    return '<svg class="bfgnav-ic" viewBox="0 0 24 24" fill="' + (fill || 'none') +
           '" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
           (ICON[name] || '') + '</svg>';
  }
  var BIRD = '<img src="/bagfree-logo-web.png" alt="" style="width:130px;max-width:80%;object-fit:contain" aria-hidden="true">';

  /* ── Styles (colors hardcoded so the bar looks identical on every page) ── */
  var css = ''
  + '.bfgnav-sidebar{position:fixed;left:0;top:0;bottom:0;width:240px;z-index:95;background:#0d1a32;'
  +   'border-right:1px solid rgba(253,252,248,0.06);padding:1.6rem 1.1rem;display:flex;flex-direction:column;'
  +   'gap:1.3rem;overflow-y:auto;font-family:"Manrope",-apple-system,BlinkMacSystemFont,sans-serif;'
  +   'transform:translateX(0);transition:transform .28s ease;-webkit-font-smoothing:antialiased}'
  + '.bfgnav-sidebar *{box-sizing:border-box}'
  + '.bfgnav-brand{display:flex;flex-direction:column;align-items:center;padding:.3rem 0 .4rem;margin-bottom:2rem;text-decoration:none}'
  + '.bfgnav-brand-name{font-family:"Cormorant Garamond",Georgia,serif;font-size:1.45rem;font-weight:500;letter-spacing:5px;color:#c9a96e;line-height:1}'
  + '.bfgnav-city{display:flex;align-items:center;gap:.55rem;padding:.6rem .8rem;border-radius:12px;border:1px solid rgba(253,252,248,0.06);background:rgba(255,255,255,0.02);text-decoration:none;transition:all .2s}'
  + '.bfgnav-city:hover{border-color:rgba(201,169,110,0.3);background:rgba(201,169,110,0.06)}'
  + '.bfgnav-city-info{flex:1;min-width:0;display:flex;flex-direction:column;gap:.12rem}'
  + '.bfgnav-city-label{font-size:.55rem;letter-spacing:2.5px;text-transform:uppercase;color:#c9a96e;font-weight:600}'
  + '.bfgnav-city-name{font-size:.88rem;color:#fdfcf8;font-weight:400;display:flex;align-items:center;gap:.35rem}'
  + '.bfgnav-city-name svg{width:11px;height:11px;color:#c9a96e;flex-shrink:0}'
  + '.bfgnav-city-chev{width:14px;height:14px;color:rgba(253,252,248,0.38);flex-shrink:0}'
  + '.bfgnav-nav{display:flex;flex-direction:column;gap:.12rem}'
  + '.bfgnav-item{display:flex;align-items:center;gap:.85rem;padding:.72rem .9rem;border-radius:9px;color:rgba(253,252,248,0.62);'
  +   'font-size:.92rem;font-weight:400;letter-spacing:.2px;text-decoration:none;border:1px solid transparent;transition:all .2s}'
  + '.bfgnav-item:hover{background:rgba(201,169,110,0.05);color:#c9a96e}'
  + '.bfgnav-item.bfgnav-active{background:rgba(201,169,110,0.08);color:#c9a96e;border-color:rgba(201,169,110,0.18)}'
  + '.bfgnav-item .bfgnav-ic{width:18px;height:18px;flex-shrink:0;opacity:.9}'
  + '.bfgnav-item.bfgnav-active .bfgnav-ic{opacity:1}'
  + '.bfgnav-item[data-icon="star"] .bfgnav-ic{fill:#c9a96e;stroke:#c9a96e}'
  + '.bfgnav-item.bfgnav-sage{background:linear-gradient(135deg,#e6cd92,#c9a96e);color:#3a2c12;border-radius:999px;'
  +   'padding:.72rem 1.25rem;font-weight:500;box-shadow:0 4px 14px rgba(201,169,110,0.4),inset 0 1px 0 rgba(255,255,255,0.38)}'
  + '.bfgnav-item.bfgnav-sage:hover{background:linear-gradient(135deg,#f0d8a0,#d4b87a);color:#2a2008;box-shadow:0 7px 20px rgba(201,169,110,0.55),inset 0 1px 0 rgba(255,255,255,0.42)}'
  + '.bfgnav-item.bfgnav-sage .bfgnav-ic{opacity:1}'
  + '.bfgnav-item.bfgnav-sage .bfgnav-ic img,.bfgnav-item.bfgnav-sage .bfgnav-ic svg{filter:brightness(0);opacity:.82;width:18px;height:18px}'
  + '.bfgnav-spacer{flex:1;min-height:.4rem}'
  + '.bfgnav-rewards{background:linear-gradient(165deg,rgba(201,169,110,0.10),rgba(201,169,110,0.02));border:1px solid rgba(201,169,110,0.16);'
  +   'border-radius:12px;padding:1.2rem 1.1rem;display:flex;flex-direction:column;gap:.5rem}'
  + '.bfgnav-rw-label{display:flex;align-items:center;gap:.4rem;font-size:.55rem;letter-spacing:2.5px;text-transform:uppercase;color:#c9a96e;font-weight:600}'
  + '.bfgnav-rw-label svg{width:13px;height:13px}'
  + '.bfgnav-rw-points{font-family:"Cormorant Garamond",Georgia,serif;font-size:2.15rem;color:#fdfcf8;line-height:1.05}'
  + '.bfgnav-rw-sub{font-size:.72rem;color:rgba(253,252,248,0.38)}'
  + '.bfgnav-rw-link{font-size:.58rem;letter-spacing:2px;text-transform:uppercase;font-weight:600;color:#c9a96e;text-decoration:none;'
  +   'border-top:1px solid rgba(253,252,248,0.06);padding-top:.65rem;margin-top:.15rem;display:flex;align-items:center;gap:.35rem}'
  + '.bfgnav-scrim{position:fixed;inset:0;background:rgba(5,10,22,0.55);z-index:94;opacity:0;visibility:hidden;transition:opacity .28s,visibility .28s}'
  + '.bfgnav-burger{position:fixed;top:.85rem;left:.85rem;z-index:96;width:42px;height:42px;border-radius:10px;'
  +   'background:rgba(13,26,50,0.92);border:1px solid rgba(201,169,110,0.25);color:#c9a96e;display:none;'
  +   'align-items:center;justify-content:center;cursor:pointer;backdrop-filter:blur(6px)}'
  + '.bfgnav-burger svg{width:22px;height:22px}'
  + '@media(min-width:981px){body.bfgnav-shift{padding-left:240px!important}}'
  + '@media(max-width:980px){'
  +   '.bfgnav-sidebar{transform:translateX(-100%);box-shadow:0 0 50px rgba(0,0,0,0.5)}'
  +   '.bfgnav-sidebar.bfgnav-open{transform:translateX(0)}'
  +   '.bfgnav-scrim.bfgnav-open{opacity:1;visibility:visible}'
  +   '.bfgnav-burger{display:flex}}'
  + '@media(prefers-reduced-motion:reduce){.bfgnav-sidebar,.bfgnav-scrim{transition:none}}'
  /* Most existing pages ship their own top bar (class "nav", with its own
     ".nav-logo"). Rather than delete it — it often still holds a page-local
     theme toggle — hide just the duplicate logo and slide the bar over so it
     sits beside this sidebar instead of underneath/behind it. */
  + 'body.bfgnav-shift nav.nav .nav-logo{visibility:hidden!important;pointer-events:none!important}'
  + '@media(min-width:981px){body.bfgnav-shift nav.nav{position:fixed!important;top:0!important;left:240px!important;right:0!important}}'
  + '@media(max-width:980px){body.bfgnav-shift nav.nav{left:0!important}}';

  /* ── Active-link detection (file + hash aware, so e.g. legacy.html and
        legacy.html#rewards don't both light up at once) ─────────────────── */
  function parseTarget(href) {
    var hashIdx = href.indexOf('#');
    var file = hashIdx === -1 ? href : href.slice(0, hashIdx);
    var hash = hashIdx === -1 ? '' : href.slice(hashIdx + 1);
    file = file.split('?')[0].replace(/\/+$/, '');
    var seg = file.split('/').pop();
    return { file: seg || '/', hash: hash };
  }
  var here = parseTarget(location.pathname + location.hash);
  var hereFile = here.file;
  var isHome = (hereFile === '/' || hereFile === '' || hereFile === 'index.html');

  /* ── Build markup ──────────────────────────────────────────────────────── */
  function itemHTML(it) {
    var t = parseTarget(it.href);
    var active = it.href === '/' ? isHome : (t.file === hereFile && t.hash === here.hash);
    var icon = it.icon === 'sj'
      ? '<span class="bfgnav-ic"><img src="/images/second-journey-logo.png" alt="" style="width:18px;height:18px;object-fit:contain"></span>'
      : svg(it.icon, it.icon === 'star' ? '#c9a96e' : 'none');
    return '<a class="bfgnav-item' + (it.sage ? ' bfgnav-sage' : '') + (active ? ' bfgnav-active' : '') +
           '" href="' + it.href + '" data-icon="' + it.icon + '"' +
           (active ? ' aria-current="page"' : '') + '>' + icon + '<span>' + it.label + '</span></a>';
  }

  var html = ''
    + '<a class="bfgnav-brand" href="/" aria-label="BagFree home">' + BIRD + '</a>'
    + '<a class="bfgnav-city" href="/plan-my-trip.html">'
    +   '<span class="bfgnav-city-info"><span class="bfgnav-city-label">Current City</span>'
    +     '<span class="bfgnav-city-name">' + svg('pin') + '<span id="bfgnav-city">' + DEFAULT_CITY + '</span></span></span>'
    +   '<span class="bfgnav-city-chev">' + svg('chev') + '</span></a>'
    + '<nav class="bfgnav-nav" aria-label="Primary">' + NAV.map(itemHTML).join('') + '</nav>'
    + '<div class="bfgnav-spacer"></div>'
    + '<div class="bfgnav-rewards">'
    +   '<span class="bfgnav-rw-label">' + svg('crown') + 'BAG Rewards</span>'
    +   '<span class="bfgnav-rw-points" id="bfgnav-points">' + DEFAULT_POINTS + '</span>'
    +   '<span class="bfgnav-rw-sub">Points Available</span>'
    +   '<a class="bfgnav-rw-link" href="' + REWARDS_HREF + '">View Rewards ' + svg('chev') + '</a>'
    + '</div>';

  /* ── Inject ────────────────────────────────────────────────────────────── */
  var style = document.createElement('style');
  style.id = 'bfgnav-nav-style';
  style.textContent = css;
  document.head.appendChild(style);

  var aside = document.createElement('aside');
  aside.className = 'bfgnav-sidebar';
  aside.setAttribute('role', 'navigation');
  aside.innerHTML = html;

  var scrim = document.createElement('div');
  scrim.className = 'bfgnav-scrim';

  var burger = document.createElement('button');
  burger.className = 'bfgnav-burger';
  burger.setAttribute('aria-label', 'Open menu');
  burger.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';

  document.body.insertBefore(aside, document.body.firstChild);
  document.body.appendChild(scrim);
  document.body.appendChild(burger);
  document.body.classList.add('bfgnav-shift');

  function open() { aside.classList.add('bfgnav-open'); scrim.classList.add('bfgnav-open'); }
  function close() { aside.classList.remove('bfgnav-open'); scrim.classList.remove('bfgnav-open'); }
  burger.addEventListener('click', open);
  scrim.addEventListener('click', close);
  aside.addEventListener('click', function (e) { if (e.target.closest('a')) close(); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });

  /* ── Optional personalization (only if supabase-js is already loaded) ───── */
  if (window.supabase && typeof window.supabase.createClient === 'function') {
    try {
      var sb = window.__bfClient || window.supabase.createClient(
        'https://vkctidpaghpdlmleezvq.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrY3RpZHBhZ2hwZGxtbGVlenZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzMjI5MjgsImV4cCI6MjA5MDg5ODkyOH0.wKtG6XD6CwLy3rJDZc4S10-NqNr3fcCXHYOWJt_C628'
      );
      window.__bfClient = sb;
      sb.auth.getSession().then(function (r) {
        var s = r && r.data && r.data.session;
        if (!s) return;
        sb.from('profiles').select('preferred_city,bag_balance').eq('id', s.user.id).single()
          .then(function (p) {
            if (!p || !p.data) return;
            var d = p.data, c = document.getElementById('bfgnav-city'), pts = document.getElementById('bfgnav-points');
            if (c && d.preferred_city) c.textContent = String(d.preferred_city).split(',')[0];
            if (pts && typeof d.bag_balance === 'number') pts.textContent = Math.round(d.bag_balance * 100).toLocaleString();
          });
      });
    } catch (e) { /* stay on defaults */ }
  }
})();
