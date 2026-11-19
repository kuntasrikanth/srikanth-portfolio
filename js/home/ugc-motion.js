/* ================= AI UGC workflow: a 40-second motion graphic of the 10-step process =================
   Drawn in the DOM at 1080×1920 and scaled to fit its box. Every frame is a pure function of time, so the same code
   plays live on the page and renders frame by frame to video.
   UGCMotion.mount(el, { auto, base }) → { render(t), restart(), duration } */
(() => {
  const W = 1080, H = 1920, DUR = 40;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const span = (t, a, b) => clamp((t - a) / (b - a));
  const eo = x => 1 - Math.pow(1 - clamp(x), 3);
  const eio = x => { x = clamp(x); return x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  const back = x => { x = clamp(x); const c = 1.70158; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const tf = (el, o, y = 0, s = 1, x = 0, r = 0) => { if (!el) return; el.style.opacity = o; el.style.transform = `translate(${x}px,${y}px) scale(${s}) rotate(${r}deg)`; };
  const up = (el, t, at, d = .45, dy = 70) => { const p = eo(span(t, at, at + d)); tf(el, p, (1 - p) * dy); return p; };
  const pop = (el, t, at, d = .4) => { const p = span(t, at, at + d); tf(el, clamp(p * 3), 0, .4 + .6 * back(p)); return p; };

  const CSS = `
.mg{position:relative;width:100%;aspect-ratio:9/16;overflow:hidden;background:#0d0d0f;border-radius:inherit;isolation:isolate}
.mg *{box-sizing:border-box}
.mg-stage{position:absolute;left:0;top:0;width:${W}px;height:${H}px;transform-origin:0 0;color:#fff;font-family:"Geist",system-ui,-apple-system,"Segoe UI",sans-serif;overflow:hidden}
.mg-bg{position:absolute;inset:-200px;background:repeating-linear-gradient(-32deg,rgba(255,212,0,.05) 0 60px,transparent 60px 150px),radial-gradient(900px 700px at 80% 10%,rgba(255,106,0,.28),transparent 70%),radial-gradient(800px 800px at 10% 95%,rgba(255,212,0,.16),transparent 70%),#0d0d0f}
.mg-grain{position:absolute;inset:0;opacity:.08;background-image:radial-gradient(rgba(255,255,255,.6) 1px,transparent 1px);background-size:6px 6px}
.mg-top{position:absolute;left:72px;right:72px;top:70px;display:flex;justify-content:space-between;align-items:center;font:600 30px/1 "Geist Mono",ui-monospace,monospace;letter-spacing:.14em;color:rgba(255,255,255,.7);text-transform:uppercase}
.mg-top b{color:#0d0d0f;background:#ffd400;padding:12px 18px;border-radius:12px;font-family:"Geist",system-ui,sans-serif;font-weight:400;font-size:38px;letter-spacing:.02em}
.mg-sc{position:absolute;inset:0;opacity:0;visibility:hidden}
.mg .hd{font-family:"Geist",system-ui,sans-serif;font-weight:400;text-transform:uppercase;line-height:.98;letter-spacing:.005em}
.mg .y{color:#ffd400}.mg .o{color:#ff6a00}
.mg .k{font:600 34px/1 "Geist Mono",ui-monospace,monospace;letter-spacing:.18em;text-transform:uppercase;color:#ffd400}
.mg .ab{position:absolute;left:72px;right:72px}
.mg .big{font-size:106px}.mg .mid{font-size:70px}
.mg .sub{font-size:44px;line-height:1.3;color:rgba(255,255,255,.82);font-weight:500}
.mg .nos{display:flex;flex-wrap:wrap;gap:22px}
.mg .nos span{position:relative;font:600 46px/1 "Geist",sans-serif;padding:22px 30px;border-radius:999px;border:3px solid rgba(255,255,255,.35)}
.mg .nos span i{position:absolute;left:18px;right:18px;top:50%;height:6px;margin-top:-3px;background:#ff6a00;border-radius:3px;transform-origin:left;transform:scaleX(0)}
.mg .num{position:absolute;left:66px;top:170px;font-family:"Geist",system-ui,sans-serif;font-size:300px;line-height:1;color:#ffd400}
.mg .of{position:absolute;left:72px;top:480px;font:600 36px/1 "Geist Mono",monospace;letter-spacing:.14em;color:rgba(255,255,255,.55)}
.mg .ttl{position:absolute;left:72px;right:72px;top:560px;font-size:82px}
.mg .st .sub{position:absolute;left:72px;right:72px;top:700px}
.mg .ill{position:absolute;left:72px;right:72px;top:900px;height:820px}
.mg .mg-card{position:absolute;background:#fff;color:#14161a;border-radius:36px;box-shadow:0 40px 80px rgba(0,0,0,.45)}
.mg .ph{position:absolute;border-radius:34px;overflow:hidden;background:#222;box-shadow:0 40px 80px rgba(0,0,0,.5);border:6px solid #1c1c1f}
.mg .ph img{display:block;width:100%;height:100%;object-fit:cover}
.mg .tag{position:absolute;font:700 32px/1 "Geist",sans-serif;padding:18px 24px;border-radius:16px;background:#ffd400;color:#0d0d0f;white-space:nowrap}
.mg .tag.dark{background:#0d0d0f;color:#fff;border:3px solid rgba(255,255,255,.25)}
.mg .tick{display:inline-grid;place-items:center;width:58px;height:58px;border-radius:50%;background:#2fbf71;color:#fff;font:800 36px/1 "Geist",sans-serif;flex:none}
.mg .row{display:flex;align-items:center;gap:24px;font:600 44px/1.1 "Geist",sans-serif}
.mg .pill{display:inline-flex;align-items:center;gap:14px;padding:20px 30px;border-radius:999px;font:700 40px/1 "Geist",sans-serif;background:rgba(255,255,255,.1);border:3px solid rgba(255,255,255,.25)}
.mg .rail{position:absolute;left:72px;right:72px;bottom:96px;display:flex;gap:12px}
.mg .rail i{flex:1;height:12px;border-radius:6px;background:rgba(255,255,255,.18);overflow:hidden}
.mg .rail i b{display:block;height:100%;width:0;background:#ffd400}
.mg .scan{position:absolute;left:0;right:0;height:8px;background:#ffd400;box-shadow:0 0 40px 10px rgba(255,212,0,.6)}
.mg .wave{position:absolute;left:0;right:0;top:300px;height:300px;display:flex;align-items:center;gap:14px}
.mg .wave i{flex:1;border-radius:10px;background:linear-gradient(#ffd400,#ff6a00)}
.mg .tl{position:absolute;left:0;right:0;top:120px;background:#1b1c21;border-radius:30px;padding:36px;border:3px solid rgba(255,255,255,.12)}
.mg .trk{position:relative;height:110px;margin:18px 0 0 110px;border-radius:14px;background:rgba(255,255,255,.06)}
.mg .trk::before{content:attr(data-l);position:absolute;left:-104px;top:34px;font:600 34px/1 "Geist Mono",monospace;color:rgba(255,255,255,.55)}
.mg .mg-clip{position:absolute;top:8px;bottom:8px;border-radius:12px;display:flex;align-items:center;padding:0 20px;font:700 30px/1 "Geist",sans-serif;color:#0d0d0f;overflow:hidden;white-space:nowrap}
.mg .head{position:absolute;top:-20px;bottom:-20px;width:6px;background:#ff3b30;border-radius:3px}
.mg .bar{height:44px;border-radius:22px;background:rgba(255,255,255,.12);overflow:hidden}
.mg .bar b{display:block;height:100%;width:0;background:linear-gradient(90deg,#ffd400,#ff6a00)}
.mg .logo{font-family:"Geist",system-ui,sans-serif;font-size:150px;line-height:.9;color:#ffd400;transform:skewX(-8deg);text-shadow:10px 10px 0 #ff6a00}
.mg .typo{position:relative;height:150px}
.mg .typo span{position:absolute;left:0;top:0;font-family:"Geist",system-ui,sans-serif;font-size:88px;line-height:1;white-space:nowrap}
.mg .typo .bad{color:#ff5a4f;text-decoration:underline wavy #ff5a4f;text-decoration-thickness:6px;text-underline-offset:18px}
.mg .typo .good{color:#2fdd86}
.mg .chk .row{font-size:56px;margin-top:34px}
.mg .hd,.mg .num,.mg .logo,.mg .typo span,.mg-top b{font-weight:800;letter-spacing:-.025em}
`;
  let styled = false;
  const injectCSS = () => { if (styled) return; styled = true; const s = document.createElement("style"); s.textContent = CSS; document.head.appendChild(s); };

  const STEPS = [
    ["Product prep", "Real price, RRP and features from the listing. Nothing invented."],
    ["Story", "Clip 1 is the problem. Clip 2 is the product fixing it."],
    ["Kling 4.0 setup", "1080p, 10 seconds, 9:16."],
    ["Clip 1", "Our own character: a cartoon face in a real-looking world."],
    ["Check it", "Anything off? Redo it before moving on."],
    ["Clip 2", "Starts from the last frame, so the story flows."],
    ["Check the product", "It has to look exactly like the real thing."],
    ["Voice", "Our founder's cloned voice, warm and British."],
    ["Edit", "DaVinci Resolve: music, features, and the price with the RRP crossed out."],
    ["Export & post", "Export in 4K and post."]
  ];
  const S0 = 0, S1 = 3.8, ST = 6.2, SD = 2.4, SG = ST + SD * 10, SS = SG + 4, SE = SS + 2.6;

  function build(base) {
    const FILES = { character: ["ai-ad-character", "AI ad still: our cartoon character in a desert tent"],
      problem: ["ai-ad-tangled-cables", "AI ad still: the character untangling charging cables"],
      worried: ["ai-ad-worried-character", "AI ad still: the character looking worried"],
      product: ["ai-ad-3-in-1-charger", "AI ad still: the 3-in-1 magnetic wireless charger"],
      listing: ["ai-ad-shopify-listing", "AI ad still: the charger's real listing on crazyclearance.uk"] };
    const img = n => `<img src="${base}${FILES[n][0]}.webp" alt="${FILES[n][1]}" width="540" height="960" decoding="async">`;
    const step = (i, ill) => `<div class="mg-sc st" data-s="${i}"><div class="num">${String(i + 1).padStart(2, "0")}</div><div class="of">STEP ${i + 1} OF 10</div><div class="hd ttl">${STEPS[i][0]}</div><div class="sub">${STEPS[i][1]}</div><div class="ill">${ill}</div></div>`;
    return `<div class="mg-stage"><div class="mg-bg"></div><div class="mg-grain"></div>
<div class="mg-top"><b>CRAZY CLEARANCE</b><span>AI video · workflow</span></div>
<div class="mg-sc" data-s="hook"><div class="ab k" style="top:430px">No camera needed</div>
  <div class="ab hd big" style="top:520px" data-a="l1">One product<br>listing.</div>
  <div class="ab hd big y" style="top:860px" data-a="l2">A 30-second ad.</div>
  <div class="ab nos" style="top:1240px"><span data-a="n0">No camera<i></i></span><span data-a="n1">No studio<i></i></span><span data-a="n2">No actors<i></i></span></div></div>
<div class="mg-sc" data-s="proc"><div class="ab hd mid" style="top:560px" data-a="p1">AI on its own<br>doesn't make<br>a good ad.</div>
  <div class="ab hd big y" style="top:1020px" data-a="p2">A process<br>does.</div>
  <div class="ab k" style="top:1420px" data-a="p3">Here's our 10-step workflow ↓</div></div>
${step(0, `<div class="mg-card" data-a="card" style="left:60px;right:60px;top:0;height:780px;padding:40px">
  <div style="display:flex;gap:36px;align-items:center"><div class="ph" style="position:relative;width:250px;height:250px;border:0;box-shadow:none;border-radius:24px">${img("product")}</div>
  <div><div style="font:700 26px/1 'Geist Mono',monospace;letter-spacing:.12em;color:#888">LISTING</div><div style="font:700 50px/1.1 'Geist',sans-serif;margin-top:16px">3-in-1 magnetic<br>wireless charger</div></div></div>
  <div style="margin-top:56px;display:grid;gap:34px">
   <div class="row" data-a="r0"><span class="tick">✓</span>Real price</div>
   <div class="row" data-a="r1"><span class="tick">✓</span><span>RRP <s style="color:#c5221f;text-decoration-thickness:5px">crossed out</s></span></div>
   <div class="row" data-a="r2"><span class="tick">✓</span>Features from the listing</div></div></div>
  <div class="tag" data-a="stamp" style="right:30px;top:690px;transform-origin:center">NOTHING INVENTED</div>`)}
${step(1, `<div class="ph" data-a="c1" style="left:20px;top:40px;width:400px;height:711px">${img("problem")}</div><div class="tag dark" data-a="t1" style="left:40px;top:0">CLIP 1 · THE PROBLEM</div>
  <svg data-a="ar" viewBox="0 0 80 40" style="position:absolute;left:428px;top:360px;width:80px;height:40px"><path d="M4 20h64M50 6l16 14-16 14" fill="none" stroke="#ffd400" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></svg>
  <div class="ph" data-a="c2" style="right:20px;top:40px;width:400px;height:711px">${img("product")}</div><div class="tag" data-a="t2" style="right:40px;top:0">CLIP 2 · THE FIX</div>`)}
${step(2, `<div class="mg-card" style="left:40px;right:40px;top:20px;padding:46px;background:#17181d;color:#fff;border:3px solid rgba(255,255,255,.12)" data-a="panel">
  <div style="display:flex;justify-content:space-between;align-items:center;font:700 44px/1 'Geist',sans-serif"><span>Kling 4.0</span><span class="tag" style="position:static">GENERATE</span></div>
  ${[["Resolution", "1080p"], ["Duration", "10 s"], ["Aspect ratio", "9:16"]].map(([a, b], k) => `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:52px;font:500 44px/1 'Geist',sans-serif" data-a="k${k}"><span style="color:rgba(255,255,255,.7)">${a}</span><span class="pill" data-a="kp${k}" style="font-family:'Geist Mono',monospace">${b}</span></div>`).join("")}</div>`)}
${step(3, `<div class="ph" data-a="f" style="left:208px;top:0;width:420px;height:747px">${img("character")}</div>
  <div class="tag" data-a="t1" style="left:0;top:120px">OUR OWN CHARACTER</div><div class="tag dark" data-a="t2" style="right:0;top:560px">REAL-LOOKING WORLD</div>`)}
${step(4, `<div class="ph" style="left:208px;top:0;width:420px;height:747px">${img("worried")}<div class="scan" data-a="scan"></div></div>
  <div class="tag" data-a="ok" style="left:150px;top:640px;font-size:44px;padding:24px 34px;background:#2fbf71;color:#fff">✓ LOOKS RIGHT</div>
  <div class="tag dark" data-a="redo" style="right:0;top:80px">↺ REDO IF NOT</div>`)}
${step(5, `<div class="ph" data-a="a" style="left:20px;top:40px;width:400px;height:711px">${img("worried")}</div><div class="tag dark" data-a="ta" style="left:40px;top:0">LAST FRAME</div>
  <div class="ph" data-a="b" style="right:20px;top:40px;width:400px;height:711px">${img("product")}</div><div class="tag" data-a="tb" style="right:40px;top:0">CLIP 2 STARTS HERE</div>`)}
${step(6, `<div class="ph" data-a="a" style="left:20px;top:40px;width:400px;height:711px">${img("product")}</div><div class="tag dark" style="left:40px;top:0" data-a="ta">AI CLIP</div>
  <div class="ph" data-a="b" style="right:20px;top:40px;width:400px;height:711px;background:#eee">${img("listing")}</div><div class="tag dark" style="right:40px;top:0" data-a="tb">REAL LISTING</div>
  <div class="tag" data-a="eq" style="left:322px;top:600px;font-size:48px;padding:26px 36px;background:#2fbf71;color:#fff">✓ EXACT MATCH</div>`)}
${step(7, `<div class="hd y" style="position:absolute;left:0;right:0;top:40px;text-align:center;font-size:150px" data-a="mic">🎙</div><div class="wave">${"<i></i>".repeat(30)}</div>
  <div style="position:absolute;left:0;right:0;top:680px;display:flex;justify-content:center;gap:22px"><span class="pill" data-a="w0">Warm</span><span class="pill" data-a="w1">British</span><span class="pill" data-a="w2">Founder's voice</span></div>`)}
${step(8, `<div class="tl" data-a="tl"><div style="display:flex;justify-content:space-between;font:700 38px/1 'Geist',sans-serif"><span>DaVinci Resolve</span><span style="font-family:'Geist Mono',monospace;color:#ffd400" data-a="tc">00:00</span></div>
  <div class="trk" data-l="T1"><div class="mg-clip" data-a="x0" style="left:2%;width:44%;background:#ffd400">Features</div><div class="mg-clip" data-a="x1" style="left:50%;width:46%;background:#fff">£ price · <s style="margin-left:10px;color:#c5221f">RRP</s></div></div>
  <div class="trk" data-l="V1"><div class="mg-clip" style="left:2%;width:46%;background:#7ab8ff">Clip 1</div><div class="mg-clip" style="left:50%;width:46%;background:#9be29b">Clip 2</div></div>
  <div class="trk" data-l="A1"><div class="mg-clip" data-a="x2" style="left:2%;width:94%;background:linear-gradient(90deg,#ff9a3c,#ff6a00)">Voice + music</div></div>
  <div class="head" data-a="ph" style="left:110px"></div></div>`)}
${step(9, `<div class="mg-card" style="left:40px;right:40px;top:40px;padding:50px;background:#17181d;color:#fff;border:3px solid rgba(255,255,255,.12)">
  <div style="display:flex;justify-content:space-between;align-items:center;font:700 46px/1 'Geist',sans-serif"><span>Export</span><span class="tag" style="position:static">4K · 2160 × 3840</span></div>
  <div class="bar" style="margin-top:56px"><b data-a="bar"></b></div><div style="margin-top:22px;font:600 38px/1 'Geist Mono',monospace;color:rgba(255,255,255,.7)" data-a="pct">0%</div></div>
  <div style="position:absolute;left:40px;right:40px;top:480px;display:flex;justify-content:space-between;gap:18px">${["Instagram", "Facebook", "TikTok"].map((n, k) => `<span class="pill" data-a="pl${k}" style="flex:1;justify-content:center">${n}</span>`).join("")}</div>
  <div class="hd y" data-a="posted" style="position:absolute;left:0;right:0;top:640px;text-align:center;font-size:92px">POSTED ✓</div>`)}
<div class="mg-sc" data-s="gold"><div class="ab k" style="top:430px" data-a="g0">Our golden rule</div>
  <div class="ab hd big" style="top:520px" data-a="g1">AI tells<br>the story.</div>
  <div class="ab hd big y" style="top:840px" data-a="g2">The facts<br>stay real.</div>
  <div class="ab chk" style="top:1180px"><div class="row" data-a="c0"><span class="tick">✓</span>Real products</div><div class="row" data-a="c1"><span class="tick">✓</span>Real prices</div><div class="row" data-a="c2"><span class="tick">✓</span>No made-up claims</div></div></div>
<div class="mg-sc" data-s="spell"><div class="ab hd mid" style="top:520px" data-a="s1">Price and text<br>go in at the edit.</div>
  <div class="ab typo" style="top:920px"><span class="bad" data-a="bad">CRAZY CLAERANCE</span><span class="good" data-a="good">CRAZY CLEARANCE</span></div>
  <div class="ab sub" style="top:1160px;font-size:58px" data-a="s2">Because AI still can't spell. 😅</div></div>
<div class="mg-sc" data-s="end"><div class="ab logo" style="top:470px" data-a="e1">CRAZY<br>CLEARANCE</div>
  <div class="ab sub" style="top:960px;font-size:54px" data-a="e2">3 new channels, built only for AI video ads</div>
  <div class="ab" style="top:1140px;display:flex;gap:18px;flex-wrap:wrap" data-a="e3"><span class="pill">Instagram</span><span class="pill">Facebook</span><span class="pill">TikTok</span></div>
  <div class="ab hd y" style="top:1380px;font-size:70px" data-a="e4">crazyclearance.uk</div></div>
<div class="rail">${"<i><b></b></i>".repeat(10)}</div></div>`;
  }

  function mount(el, opts = {}) {
    injectCSS();
    const base = opts.base || "work/ugc/";
    el.classList.add("mg"); el.innerHTML = build(base);
    const stage = el.querySelector(".mg-stage");
    const sc = {}; el.querySelectorAll(".mg-sc").forEach(s => sc[s.dataset.s] = s);
    const A = (s, n) => sc[s].querySelector(`[data-a="${n}"]`);
    const rail = [...el.querySelectorAll(".rail i b")], railBox = el.querySelector(".rail");
    const waves = [...sc[7].querySelectorAll(".wave i")];
    const fit = () => { const w = el.clientWidth || W; stage.style.transform = `scale(${w / W})`; };
    fit(); if (window.ResizeObserver) new ResizeObserver(fit).observe(el);

    const show = (s, t, a, b) => {
      const on = t >= a && t < b, o = on ? Math.min(span(t, a, a + .3), 1 - span(t, b - .3, b)) : 0;
      s.style.visibility = on ? "visible" : "hidden"; s.style.opacity = o; return on ? t - a : -1;
    };
    const UPD = [
      // 1 product prep
      (s, q) => { up(s.querySelector('[data-a="card"]'), q, .1, .5, 120); ["r0", "r1", "r2"].forEach((n, k) => up(s.querySelector(`[data-a="${n}"]`), q, .55 + k * .3, .35, 30)); const st = s.querySelector('[data-a="stamp"]'), p = span(q, 1.55, 1.9); tf(st, clamp(p * 3), 0, 2.2 - 1.2 * back(p), 0, -6); },
      // 2 story
      (s, q) => { const a = eo(span(q, .1, .6)), b = eo(span(q, .7, 1.2)); tf(s.querySelector('[data-a="c1"]'), a, 0, 1, -(1 - a) * 200, -3 * a); tf(s.querySelector('[data-a="t1"]'), a, (1 - a) * 30); up(s.querySelector('[data-a="ar"]'), q, .55, .35, 0); tf(s.querySelector('[data-a="c2"]'), b, 0, 1, (1 - b) * 200, 3 * b); tf(s.querySelector('[data-a="t2"]'), b, (1 - b) * 30); },
      // 3 kling
      (s, q) => { up(s.querySelector('[data-a="panel"]'), q, .1, .5, 100); for (let k = 0; k < 3; k++) { up(s.querySelector(`[data-a="k${k}"]`), q, .45 + k * .3, .3, 30); const p = s.querySelector(`[data-a="kp${k}"]`), on = q > .75 + k * .3; p.style.background = on ? "#ffd400" : ""; p.style.color = on ? "#0d0d0f" : ""; p.style.borderColor = on ? "#ffd400" : ""; } },
      // 4 clip 1
      (s, q) => { const f = s.querySelector('[data-a="f"]'), p = eo(span(q, .05, .6)); tf(f, p, (1 - p) * 120, .92 + .08 * p); f.querySelector("img").style.transform = `scale(${1.04 + q * .05})`; up(s.querySelector('[data-a="t1"]'), q, .6, .35, 30); up(s.querySelector('[data-a="t2"]'), q, .9, .35, 30); },
      // 5 check it
      (s, q) => { const sn = s.querySelector('[data-a="scan"]'), p = eio(span(q, .1, 1.3)); sn.style.top = (p * 100) + "%"; sn.style.opacity = q < 1.4 ? 1 : 0; pop(s.querySelector('[data-a="ok"]'), q, 1.4); up(s.querySelector('[data-a="redo"]'), q, .5, .35, 20); },
      // 6 clip 2
      (s, q) => { up(s.querySelector('[data-a="a"]'), q, .05, .4, 40); up(s.querySelector('[data-a="ta"]'), q, .2, .3, 20); const b = eo(span(q, .6, 1.2)); tf(s.querySelector('[data-a="b"]'), b, 0, .8 + .2 * b, -(1 - b) * 440); up(s.querySelector('[data-a="tb"]'), q, 1.1, .3, 20); },
      // 7 check product
      (s, q) => { const a = eo(span(q, .05, .45)), b = eo(span(q, .35, .8)); tf(s.querySelector('[data-a="a"]'), a, 0, 1, -(1 - a) * 160); tf(s.querySelector('[data-a="b"]'), b, 0, 1, (1 - b) * 160); up(s.querySelector('[data-a="ta"]'), q, .3, .3, 20); up(s.querySelector('[data-a="tb"]'), q, .5, .3, 20); pop(s.querySelector('[data-a="eq"]'), q, 1.2); },
      // 8 voice
      (s, q) => { pop(s.querySelector('[data-a="mic"]'), q, .05); const on = eo(span(q, .2, .6)); waves.forEach((w, k) => { const h = 20 + 260 * on * (.35 + .65 * Math.abs(Math.sin(q * 7 + k * .55) * Math.cos(q * 3.1 + k * .23))); w.style.height = h + "px"; }); for (let k = 0; k < 3; k++) up(s.querySelector(`[data-a="w${k}"]`), q, .7 + k * .25, .3, 30); },
      // 9 edit
      (s, q) => { up(s.querySelector('[data-a="tl"]'), q, .05, .45, 80); for (let k = 0; k < 3; k++) { const p = eo(span(q, .4 + k * .25, .75 + k * .25)), x = s.querySelector(`[data-a="x${k}"]`); x.style.opacity = p; x.style.transform = `scaleX(${p})`; x.style.transformOrigin = "left"; } const p = eio(span(q, .3, 2.2)), ph = s.querySelector('[data-a="ph"]'); ph.style.left = `calc(110px + 36px + ${p} * (100% - 182px))`; s.querySelector('[data-a="tc"]').textContent = "00:" + String(Math.round(p * 20)).padStart(2, "0"); },
      // 10 export
      (s, q) => { const p = eio(span(q, .15, 1.3)); s.querySelector('[data-a="bar"]').style.width = (p * 100) + "%"; s.querySelector('[data-a="pct"]').textContent = Math.round(p * 100) + "%"; for (let k = 0; k < 3; k++) { const e = s.querySelector(`[data-a="pl${k}"]`), on = q > 1.35 + k * .15; up(e, q, .2, .3, 20); e.style.background = on ? "#ffd400" : ""; e.style.color = on ? "#0d0d0f" : ""; e.style.borderColor = on ? "#ffd400" : ""; } pop(s.querySelector('[data-a="posted"]'), q, 1.85); }
    ];
    function render(t) {
      t = ((t % DUR) + DUR) % DUR;
      let q = show(sc.hook, t, S0, S1);
      if (q >= 0) { up(A("hook", "l1"), q, .15, .5); up(A("hook", "l2"), q, .85, .5); for (let k = 0; k < 3; k++) { const n = A("hook", "n" + k); up(n, q, 1.6 + k * .3, .35, 30); n.querySelector("i").style.transform = `scaleX(${eo(span(q, 2.6 + k * .2, 2.9 + k * .2))})`; } }
      q = show(sc.proc, t, S1, ST);
      if (q >= 0) { up(A("proc", "p1"), q, .1, .5); const p = span(q, .9, 1.35); tf(A("proc", "p2"), clamp(p * 3), 0, .6 + .4 * back(p)); up(A("proc", "p3"), q, 1.5, .4, 20); }
      for (let i = 0; i < 10; i++) { const qq = show(sc[i], t, ST + SD * i, ST + SD * (i + 1)); if (qq >= 0) { tf(sc[i].querySelector(".num"), 1, 0, 1, (1 - eo(span(qq, 0, .4))) * -80); UPD[i](sc[i], qq); } }
      const inSteps = t >= ST && t < SG; railBox.style.opacity = inSteps ? Math.min(span(t, ST, ST + .3), 1 - span(t, SG - .3, SG)) : 0;
      if (inSteps) rail.forEach((b, i) => b.style.width = (clamp((t - ST - SD * i) / SD) * 100) + "%");
      q = show(sc.gold, t, SG, SS);
      if (q >= 0) { up(A("gold", "g0"), q, .05, .35, 20); up(A("gold", "g1"), q, .2, .45); up(A("gold", "g2"), q, .8, .45); for (let k = 0; k < 3; k++) up(A("gold", "c" + k), q, 1.5 + k * .35, .35, 30); }
      q = show(sc.spell, t, SS, SE);
      if (q >= 0) { up(A("spell", "s1"), q, .05, .45); const bd = A("spell", "bad"), gd = A("spell", "good"), f = span(q, 1.2, 1.5); up(bd, q, .5, .3, 20); bd.style.opacity = Math.min(+bd.style.opacity, 1 - f); tf(gd, f, (1 - f) * -20); up(A("spell", "s2"), q, 1.55, .35, 20); }
      q = show(sc.end, t, SE, DUR + .01);
      if (q >= 0) { const p = span(q, .05, .55); tf(A("end", "e1"), clamp(p * 3), 0, .7 + .3 * back(p)); up(A("end", "e2"), q, .6, .4, 30); up(A("end", "e3"), q, .9, .4, 30); up(A("end", "e4"), q, 1.2, .4, 30); }
    }
    let raf = 0, t0 = 0, visible = false, paused = false;
    const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const loop = now => { if (!t0) t0 = now; render((now - t0) / 1000); raf = requestAnimationFrame(loop); };
    const play = () => { if (raf || RM || paused) return; raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const api = {
      duration: DUR, render,
      restart() { t0 = 0; stop(); if (visible) play(); else render(0); },
      play() { paused = false; if (visible) play(); }, pause() { paused = true; stop(); }
    };
    render(RM ? SG + 3 : 0.9);
    if (opts.auto !== false && "IntersectionObserver" in window) new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; visible ? play() : stop(); }), { threshold: .2 }).observe(el);
    return api;
  }
  window.UGCMotion = { mount, duration: DUR };

  // on the page: every [data-ugc-motion] box gets its own copy; proof videos play while on screen
  const boot = () => {
    const mounted = new Map();
    // each copy is built (and its stills fetched) only when it comes near the screen; the pop-up's copy when it opens
    const boxes = [...document.querySelectorAll("#grid [data-ugc-motion], .room [data-ugc-motion]")];
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !mounted.has(e.target)) { mounted.set(e.target, mount(e.target)); io.unobserve(e.target); } }), { rootMargin: "400px 0px" });
      boxes.forEach(el => io.observe(el));
    } else boxes.forEach(el => mounted.set(el, mount(el)));
    window.ugcMotion = mounted;
    const vids = [...document.querySelectorAll("#grid .ugc-proof video")];
    if (vids.length && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const io = new IntersectionObserver(es => es.forEach(e => { e.isIntersecting && !e.target.closest(".gone") ? e.target.play().catch(() => {}) : e.target.pause(); }), { threshold: .2 });
      vids.forEach(v => io.observe(v));
    }
  };
  if (!window.UGC_MOTION_MANUAL) document.readyState === "loading" ? document.addEventListener("DOMContentLoaded", boot) : boot();
})();
