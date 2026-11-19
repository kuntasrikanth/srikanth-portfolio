/* things to try: the checklist that ticks off as you find each playful bit (kept for this session only) */
(() => {
  const ITEMS = [["sun", "Drag the sun or moon"], ["daynight", "Switch day / night"], ["season", "Change the season"], ["sky", "Tap the sky"], ["birds", "Scatter the birds"],
    ["plane", "Fly a plane"], ["boat", "Sail a boat"], ["sat", "Steer a satellite"], ["mill", "Spin the windmill"], ["apple", "Drop an apple"], ["stars", "Read the stars"],
    ["prism", "Spin the prism"], ["crystal", "Make a crystal"], ["break", "Break the prism"], ["blossom", "Shake the blossoms"]];
  const ss = { get() { try { return JSON.parse(sessionStorage.getItem("finds") || "[]"); } catch (e) { return []; } }, set(v) { try { sessionStorage.setItem("finds", JSON.stringify(v)); } catch (e) {} } };
  const got = new Set(ss.get()), C = 2 * Math.PI * 7;
  const box = document.createElement("div"); box.className = "finds"; box.dataset.open = "false";
  const ZIG = "4.7,12.6 7,10.8 9.4,12.8 12,10.6 14.6,12.8 17,10.8 19.3,12.6";
  const SHELL = '<path class="shell" d="M12 2.6C7.6 2.6 4.6 9 4.6 14a7.4 7.4 0 0 0 14.8 0C19.4 9 16.4 2.6 12 2.6z"/><path class="band" d="M5.4 16.6c4.4 1.6 8.8 1.6 13.2 0"/><circle class="dot" cx="9" cy="7.6" r="1"/><circle class="dot" cx="15.2" cy="8.4" r=".8"/><circle class="dot" cx="12.4" cy="19.6" r=".9"/>';
  box.innerHTML = `<button class="egg glass" type="button" aria-expanded="false" aria-controls="findPanel" aria-label="Easter eggs">
      <svg class="ring" viewBox="0 0 54 54" aria-hidden="true"><circle class="bg" cx="27" cy="27" r="25"/><circle class="fg" cx="27" cy="27" r="25" stroke-dasharray="${2 * Math.PI * 25}" stroke-dashoffset="${2 * Math.PI * 25}"/></svg>
      <svg viewBox="0 0 24 24" aria-hidden="true"><defs><clipPath id="eggTop"><polygon points="0,0 24,0 24,12.6 ${ZIG.split(" ").reverse().join(" ")} 0,12.6"/></clipPath><clipPath id="eggBot"><polygon points="0,24 24,24 24,12.6 ${ZIG.split(" ").reverse().join(" ")} 0,12.6"/></clipPath></defs>
        <g class="chick"><circle cx="12" cy="12.4" r="3.6" fill="#ffd93d" stroke="currentColor" stroke-width=".9"/><circle cx="11" cy="11.8" r=".5" fill="currentColor"/><circle cx="13.2" cy="11.8" r=".5" fill="currentColor"/><path d="M11.6 13.1l.5.7.5-.7z" fill="#ff9f43"/></g>
        <g class="bot" clip-path="url(#eggBot)">${SHELL}</g><g class="top" clip-path="url(#eggTop)">${SHELL}</g>
        <polyline class="crack" points="${ZIG}"/></svg>
      <span class="n"></span></button>
    <div class="panel glass" id="findPanel" role="region" aria-label="Easter eggs found">
      <div class="ph"><b>Easter eggs</b><span></span></div>
      <ol>${ITEMS.map(([id, l]) => `<li data-id="${id}" tabindex="0"><i aria-hidden="true"></i><span></span></li>`).join("")}</ol>
      <button class="hint" type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z"/></svg>Show all<em>Hint</em></button>
    </div>`;
  document.body.appendChild(box);
  const head = box.querySelector(".egg"), count = head.querySelector(".n"), ring = head.querySelector(".ring .fg"), crack = head.querySelector(".crack"), tally = box.querySelector(".ph span");
  const RC = 2 * Math.PI * 25, CL = crack.getTotalLength(), LABEL = Object.fromEntries(ITEMS);
  crack.style.strokeDasharray = CL;
  const seen = new Set();
  // unfound items stay scrambled: shifting block glyphs, the same length as the real text, until tapped or hinted
  const GLY = "▖▗▘▙▚▛▜▝▞▟▓▒░";
  const scramble = () => box.querySelectorAll("li:not(.done):not(.seen) span").forEach(sp => { const n = LABEL[sp.parentNode.dataset.id].length;
    sp.textContent = Array.from({ length: n }, (_, k) => LABEL[sp.parentNode.dataset.id][k] === " " ? " " : GLY[Math.random() * GLY.length | 0]).join(""); });
  let scrT = 0; const scrLoop = on => { clearInterval(scrT); if (on && !matchMedia("(prefers-reduced-motion: reduce)").matches) scrT = setInterval(scramble, 140); };
  const render = () => { box.querySelectorAll("li").forEach(li => { const id = li.dataset.id, d = got.has(id), show = d || seen.has(id), sp = li.firstElementChild.nextElementSibling;
      li.classList.toggle("done", d); li.classList.toggle("seen", show);
      if (show) { sp.className = ""; sp.textContent = LABEL[id]; } else sp.className = "scr";
      li.setAttribute("aria-label", show ? LABEL[id] + (d ? ", found" : ", not found yet") : "Hidden. Tap to reveal"); });
    scramble();
    const k = got.size / ITEMS.length;
    count.textContent = `${got.size}/${ITEMS.length}`; tally.textContent = got.size === ITEMS.length ? "all found ✨" : `${got.size} of ${ITEMS.length}`;
    ring.setAttribute("stroke-dashoffset", (RC * (1 - k)).toFixed(2)); crack.style.strokeDashoffset = CL * (1 - k);
    box.classList.toggle("hatched", got.size === ITEMS.length);
    box.classList.toggle("allseen", ITEMS.every(([id]) => got.has(id) || seen.has(id)));
    head.setAttribute("aria-label", `Easter eggs: ${got.size} of ${ITEMS.length} found`); };
  const reveal = (li, ids) => { ids.forEach(id => seen.add(id)); render(); (li ? [li] : box.querySelectorAll("li.seen:not(.done)")).forEach(x => { x.classList.remove("reveal"); void x.offsetWidth; x.classList.add("reveal"); }); };
  box.querySelector("ol").addEventListener("click", e => { const li = e.target.closest("li"); if (li && !li.classList.contains("seen")) reveal(li, [li.dataset.id]); });
  box.querySelector("ol").addEventListener("keydown", e => { const li = e.target.closest("li"); if (li && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); if (!li.classList.contains("seen")) reveal(li, [li.dataset.id]); } });
  box.querySelector(".hint").addEventListener("click", () => reveal(null, ITEMS.map(([id]) => id)));
  // the open panel covers the right end of the sun/moon arc: when the sun or moon is under it and the mouse
  // reaches for it, the panel fades and lets clicks through so it can be grabbed; reach for the list and it comes back
  const panel = box.querySelector(".panel"); let yT = 0, px = -1e4, py = -1e4;
  addEventListener("pointermove", e => { if (e.pointerType === "mouse") { px = e.clientX; py = e.clientY; } }, { passive: true });
  const yieldCheck = () => { const s = window.sunSpot && window.sunSpot(), r = panel.getBoundingClientRect(), m = 56;
    const under = !!s && s[0] > r.left - m && s[0] < r.right + m && s[1] > r.top - m && s[1] < r.bottom + m;
    box.classList.toggle("yield", under && Math.hypot(px - s[0], py - s[1]) < 80); };
  const setOpen = o => { box.dataset.open = String(o); head.setAttribute("aria-expanded", String(o)); scrLoop(o);
    clearInterval(yT); if (o) { yieldCheck(); yT = setInterval(yieldCheck, 120); } else box.classList.remove("yield"); };
  // every few seconds, while the egg is on screen (the visitor is on the homepage hero) and not everything is found yet,
  // a light trail circles it and a sheen crosses it, so people see it does something
  let shT = 0;
  const shine = () => { if (box.dataset.open === "true" || box.classList.contains("away") || got.size === ITEMS.length) return;
    box.classList.remove("shine"); void box.offsetWidth; box.classList.add("shine"); clearTimeout(shT); shT = setTimeout(() => box.classList.remove("shine"), 1900); };
  if (!matchMedia("(prefers-reduced-motion: reduce)").matches) { setTimeout(shine, 2500); setInterval(shine, 9000); }
  // once everything is found, tapping the hatched egg replays the celebration
  head.addEventListener("click", () => { if (got.size === ITEMS.length && !document.querySelector(".cele")) celebrate(); setOpen(box.dataset.open !== "true"); });
  // a click below the prism means they've moved on: close the list (clicks in the sky keep it open while they play)
  document.addEventListener("pointerdown", e => { if (box.dataset.open !== "true" || box.contains(e.target)) return;
    const pr = document.getElementById("prism"); if (pr && e.clientY > pr.getBoundingClientRect().bottom) setOpen(false); });
  addEventListener("keydown", e => { if (e.key === "Escape" && box.dataset.open === "true") { setOpen(false); head.focus(); } });
  // only around the illustration: hide once the hero has scrolled away
  const hero = document.getElementById("top"), away = () => { const gone = hero.getBoundingClientRect().bottom < 60; box.classList.toggle("away", gone); if (gone) setOpen(false); };
  addEventListener("scroll", away, { passive: true }); away();
  window.found = id => {
    if (got.has(id) || !ITEMS.some(([k]) => k === id)) return; got.add(id); ss.set([...got]);
    if (got.size === ITEMS.length) box.classList.remove("hatched"); render();
    const li = box.querySelector(`li[data-id="${id}"]`); li.classList.remove("new", "reveal"); void li.offsetWidth; li.classList.add("new", "reveal");
    box.classList.remove("bump"); void box.offsetWidth; box.classList.add("bump");
    if (got.size === ITEMS.length) setTimeout(celebrate, 900); // after the shell splits
  };
  window.celebrate = () => celebrate(); // preview it any time: celebrate() in the console, or open the page with #celebrate
  if (location.hash === "#celebrate") setTimeout(() => celebrate(), 1200);
  function celebrate() {
    const note = document.createElement("div"); note.className = "cele glass"; note.setAttribute("role", "status");
    note.innerHTML = `<b>All ${ITEMS.length} found ✨</b><small>You've played with everything up here. Thanks for exploring.</small>`;
    document.body.appendChild(note); requestAnimationFrame(() => note.classList.add("on"));
    setTimeout(() => { note.classList.remove("on"); setTimeout(() => note.remove(), 700); }, 3800);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const cv = document.createElement("canvas"), dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
    cv.className = "cele-c"; cv.width = W * dpr; cv.height = H * dpr; document.body.appendChild(cv);
    const c = cv.getContext("2d"); c.scale(dpr, dpr);
    const COL = ["#ff6b6b", "#ffb347", "#ffd93d", "#6bcb77", "#4d96ff", "#9b72ff", "#ffffff"];
    const P = Array.from({ length: W < 640 ? 70 : 110 }, () => ({ x: Math.random() * W, y: -20 - Math.random() * H * .3, vx: (Math.random() - .5) * .06, vy: .09 + Math.random() * .12,
      w: 5 + Math.random() * 5, h: 3 + Math.random() * 4, round: Math.random() < .3, col: COL[Math.floor(Math.random() * COL.length)], rot: Math.random() * 6.3, vr: (Math.random() - .5) * .008, ph: Math.random() * 6.3 }));
    const t0 = performance.now(), DUR = 4200; let last = t0;
    (function f(n) {
      const k = (n - t0) / DUR, dt = Math.min(40, n - last); last = n; if (k >= 1) { cv.remove(); return; } requestAnimationFrame(f);
      c.clearRect(0, 0, W, H); c.globalAlpha = .9 * (k > .7 ? 1 - (k - .7) / .3 : 1);
      for (const p of P) { p.x += (p.vx + Math.sin(n * .002 + p.ph) * .03) * dt; p.y += p.vy * dt; p.rot += p.vr * dt;
        c.save(); c.translate(p.x, p.y); c.rotate(p.rot); c.scale(1, Math.abs(Math.cos(n * .004 + p.ph)) * .8 + .2); c.fillStyle = p.col;
        if (p.round) { c.beginPath(); c.arc(0, 0, p.h * .7, 0, 6.3); c.fill(); } else c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); c.restore(); }
    })(t0);
  }
  render();
})();
