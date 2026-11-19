/* the prism: a small 3D glass prism, turning very slowly (about 3.5 minutes a turn); the rainbow it throws turns and widens with it.
   Drag it to spin it. Click once to turn it into a crystal (and once more to turn it back). Click fast and it charges up:
   white light rises through it with every click, and when it's full it shatters and its spectrum breaks into soft bokeh. */
(() => {
  const el = document.getElementById("prism"), svg = el && el.querySelector("svg"); if (!svg) return;
  const NS = "http://www.w3.org/2000/svg", RMO = matchMedia("(prefers-reduced-motion: reduce)").matches, EASE = "cubic-bezier(.65,0,.35,1)", T2 = Math.PI * 2;
  const PRISM = (() => { const D = 15, T = [[0, -27], [24, 14], [-24, 14]]; return { V: [...T.map(([x, y]) => [x, y, -D]), ...T.map(([x, y]) => [x, y, D])], F: [[0, 1, 2], [3, 4, 5], [0, 3, 4, 1], [1, 4, 5, 2], [2, 5, 3, 0]], spec: true }; })();
  const CRYSTAL = (() => { const V = [[0, -32, 0], [0, 30, 0]], F = []; for (let i = 0; i < 6; i++) { const q = i / 6 * T2; V.push([Math.cos(q) * 19, -3, Math.sin(q) * 19]); }
    for (let i = 0; i < 6; i++) { const m = 2 + i, n = 2 + (i + 1) % 6; F.push([0, m, n], [1, n, m]); } return { V, F, spec: false }; })();
  let mesh = PRISM; window.prismShape = 0;
  const defs = svg.querySelector("defs"); svg.setAttribute("viewBox", "-40 -40 80 80"); svg.replaceChildren(defs);
  const polys = Array.from({ length: 12 }, () => { const p = document.createElementNS(NS, "polygon"); p.setAttribute("stroke-width", "1.2"); p.setAttribute("stroke-linejoin", "round"); return p; });
  const spec = document.createElementNS(NS, "line"); spec.setAttribute("stroke", "url(#pspec)"); spec.setAttribute("stroke-width", "2"); spec.setAttribute("stroke-linecap", "round");
  const BASE = RMO ? 0 : .00003; // rad per ms: one turn in about 3.5 minutes
  let yaw = .55, pitch = -.32, vel = BASE, drag = null, last = performance.now(), tYaw = yaw, tPitch = pitch;
  let charge = 0, lastPump = 0, broken = false, motes = [], shards = null;
  const rot = ([x, y, z], cy, sy, cp, sp) => { const X = x * cy + z * sy, Z1 = -x * sy + z * cy; return [X, y * cp - Z1 * sp, y * sp + Z1 * cp]; };
  const proj = ([X, Y, Z]) => { const s = 150 / (150 + Z); return [X * s, Y * s, Z]; };
  // FLAT: show it as the original flat 2D prism (face-on); the turn and the drag spin it in the page plane instead of in 3D
  const FLAT = true;
  function draw() {
    const Y = FLAT ? 0 : yaw, Pt = FLAT ? 0 : pitch;
    const cy = Math.cos(Y), sy = Math.sin(Y), cp = Math.cos(Pt), sp = Math.sin(Pt);
    svg.style.transform = FLAT ? `rotate(${(yaw * 57.3).toFixed(2)}deg)` : "";
    const R = mesh.V.map(v => rot(v, cy, sy, cp, sp)), P = R.map(proj);
    polys.forEach(p => p.remove());
    if (!broken) mesh.F.map((f, i) => {
      const [a, b, c] = f.map(k => R[k]), u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], w = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      let n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
      const m = f.reduce((s, k) => [s[0] + R[k][0], s[1] + R[k][1], s[2] + R[k][2]], [0, 0, 0]);
      if (n[0] * m[0] + n[1] * m[1] + n[2] * m[2] < 0) n = n.map(v => -v); // point outward
      return { f, i, z: m[2] / f.length, lit: -n[2] / Math.hypot(...n) };
    }).sort((p, q) => q.z - p.z).forEach(({ f, i, lit }) => {
      const pg = polys[i], front = lit > 0; if (FLAT && !front) return;
      pg.setAttribute("points", f.map(k => P[k][0].toFixed(2) + "," + P[k][1].toFixed(2)).join(" "));
      pg.setAttribute("class", front ? "edge body" : "edge body back");
      if (front) pg.setAttribute("fill-opacity", (.22 + .45 * lit).toFixed(2)); else pg.removeAttribute("fill-opacity");
      pg.style.fill = front && charge > .02 ? `rgba(255,255,255,${(.15 + charge * .7).toFixed(2)})` : "";
      svg.appendChild(pg);
    });
    spec.remove();
    if (!broken && mesh.spec) { const near = P[0][2] < P[3][2] ? [1, 2] : [4, 5];
      spec.setAttribute("x1", P[near[0]][0]); spec.setAttribute("y1", P[near[0]][1]); spec.setAttribute("x2", P[near[1]][0]); spec.setAttribute("y2", P[near[1]][1]); svg.appendChild(spec); }
    el.style.filter = charge > .02 ? `drop-shadow(0 0 ${(charge * 16).toFixed(1)}px rgba(255,255,255,${(charge * .9).toFixed(2)}))` : "";
  }
  // white light rising through the prism, a few motes per click
  function stepMotes(dt) {
    motes = motes.filter(m => { m.y -= m.v * dt; m.a = Math.min(1, m.a + dt * .006); if (m.y < -30) { m.c.remove(); return false; }
      m.c.setAttribute("cx", (m.x + Math.sin((m.y + m.ph) * .25) * 1.5).toFixed(2)); m.c.setAttribute("cy", m.y.toFixed(2)); m.c.setAttribute("opacity", (m.a * Math.min(1, (m.y + 30) / 14)).toFixed(2)); svg.appendChild(m.c); return true; });
  }
  function pump() {
    lastPump = performance.now(); charge = Math.min(1, charge + 1 / 7);
    for (let i = 0; i < 6 + charge * 8; i++) { const c = document.createElementNS(NS, "circle"); c.setAttribute("r", (.8 + Math.random() * 1.4).toFixed(2));
      motes.push({ c, x: (Math.random() - .5) * 34, y: 18 + Math.random() * 8, v: .05 + Math.random() * .05, a: 0, ph: Math.random() * 20 }); }
    if (charge >= 1) shatter();
  }
  // full: the prism breaks into its faces, they fly out and fade, the spectrum rolls down the page, then the prism reforms
  function shatter() {
    window.found && found("break");
    broken = true; hideHint();
    const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), P = mesh.V.map(v => proj(rot(v, cy, sy, cp, sp)));
    shards = mesh.F.map(f => { const g = document.createElementNS(NS, "polygon"), pts = f.map(k => P[k]), mx = pts.reduce((s, q) => s + q[0], 0) / pts.length, my = pts.reduce((s, q) => s + q[1], 0) / pts.length;
      g.setAttribute("points", pts.map(q => (q[0] - mx).toFixed(2) + "," + (q[1] - my).toFixed(2)).join(" ")); g.setAttribute("class", "edge body"); g.setAttribute("stroke-width", "1.2"); g.style.fill = "rgba(255,255,255,.8)";
      const d = Math.hypot(mx, my) || 1; svg.appendChild(g);
      return { g, x: mx, y: my, vx: mx / d * (.06 + Math.random() * .05), vy: my / d * (.06 + Math.random() * .05) - .02, r: 0, vr: (Math.random() - .5) * .5, t: 0 }; });
    if (!RMO) bokeh();
    setTimeout(() => { shards.forEach(s => s.g.remove()); shards = null; broken = false; charge = 0;
      svg.animate([{ transform: "scale(0)", opacity: 0 }, { transform: "scale(1)", opacity: 1 }], { duration: 700, easing: EASE }); }, RMO ? 600 : 2600);
  }
  // broken light: the spectrum itself breaks. Its streaks fade out and dissolve into soft bokeh discs along their own paths,
  // in their own colours (some six-sided, some with a faint rainbow rim), plus a few thin shards; then the streaks fade back
  const HUES = ["255,90,70", "255,160,60", "255,220,90", "110,215,130", "80,160,255", "150,110,255"];
  function bokeh() {
    const cv = document.createElement("canvas"), dpr = Math.min(devicePixelRatio || 1, 2), W = innerWidth, H = innerHeight;
    cv.className = "bokeh"; cv.width = W * dpr; cv.height = H * dpr; document.body.appendChild(cv);
    const c = cv.getContext("2d"); c.scale(dpr, dpr);
    const night = document.documentElement.getAttribute("data-sky") === "night", sy0 = scrollY;
    const src = (window.prismStreaks || []).map(s => ({ ...s })), P = [];
    src.forEach(s => { for (let i = 0; i < 9; i++) {
      const u = (Math.random() - .5) * s.L * .9, v = (Math.random() - .5) * s.th * .9, ca = Math.cos(s.ang), sa = Math.sin(s.ang), shard = Math.random() < .14;
      const hue = HUES[Math.max(0, Math.min(5, Math.floor((v / (s.th * .9) + .5) * 6)))];
      P.push({ x: s.x + u * ca - v * sa, y: s.y - sy0 + u * sa + v * ca, dx: (Math.random() - .5) * 60, dy: (Math.random() - .5) * 40 - 20, hue, shard, rot: s.ang + (Math.random() - .5) * .6,
        r: shard ? 4 + Math.random() * 6 : 14 + Math.pow(Math.random(), 1.6) * 70, len: 40 + Math.random() * 90, hex: Math.random() < .4, fringe: Math.random() < .35, a: .35 + Math.random() * .5, ph: Math.random() * T2 }); } });
    const t0 = performance.now(), DUR = 3800;
    (function f(n) {
      const k = (n - t0) / DUR;
      window.prismLightK = k < .1 ? 1 - k / .1 : k > .72 ? (k - .72) / .28 : 0;
      if (k >= 1) { window.prismLightK = null; cv.remove(); return; } requestAnimationFrame(f);
      const env = Math.min(1, k / .1) * (k > .4 ? 1 - (k - .4) / .6 : 1), go = 1 - Math.pow(1 - Math.min(1, k * 1.2), 3), sy = scrollY - sy0;
      c.clearRect(0, 0, W, H); c.globalAlpha = env * (night ? .8 : .9);
      for (const p of P) {
        const x = p.x + p.dx * go, y = p.y + p.dy * go - sy, al = p.a * (.8 + .2 * Math.sin(n * .003 + p.ph)), tint = night ? p.hue : p.hue;
        if (x < -150 || x > W + 150 || y < -150 || y > H + 150) continue;
        c.save(); c.translate(x, y); c.rotate(p.rot);
        if (p.shard) { const g = c.createLinearGradient(-p.len / 2, 0, p.len / 2, 0); g.addColorStop(0, "rgba(255,255,255,0)"); g.addColorStop(.5, `rgba(255,255,255,${.6 * al})`); g.addColorStop(1, "rgba(255,255,255,0)");
          c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, p.len / 2, p.r / 2, 0, 0, T2); c.fill(); c.restore(); continue; }
        const shape = () => { c.beginPath(); if (p.hex) for (let j = 0; j < 6; j++) { const q = j / 6 * T2; c[j ? "lineTo" : "moveTo"](Math.cos(q) * p.r, Math.sin(q) * p.r); } else c.arc(0, 0, p.r, 0, T2); c.closePath(); };
        const g = c.createRadialGradient(0, 0, 0, 0, 0, p.r);
        g.addColorStop(0, `rgba(${tint},${.1 * al})`); g.addColorStop(.7, `rgba(${tint},${.2 * al})`); g.addColorStop(.93, `rgba(255,255,255,${.4 * al})`); g.addColorStop(1, `rgba(${tint},0)`);
        c.fillStyle = g; shape(); c.fill();
        if (p.fringe) { c.lineWidth = 1.6; c.strokeStyle = `rgba(255,110,90,${.25 * al})`; c.translate(1.5, 0); shape(); c.stroke(); c.strokeStyle = `rgba(90,160,255,${.25 * al})`; c.translate(-3, 0); shape(); c.stroke(); }
        c.restore();
      }
    })(t0);
  }
  function stepShards(dt) {
    if (!shards) return;
    shards.forEach(s => { s.t += dt; s.vy += .00012 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.r += s.vr * dt * .02;
      s.g.setAttribute("transform", `translate(${s.x.toFixed(2)} ${s.y.toFixed(2)}) rotate(${(s.r * 57).toFixed(1)})`); s.g.setAttribute("opacity", Math.max(0, 1 - s.t / 900).toFixed(2)); });
  }
  // turns once now, then keeps turning after the page has loaded (or on the first touch), so it never slows the first load
  let live = false;
  function loop(n) {
    if (live) requestAnimationFrame(loop); const dt = Math.min(50, n - last); last = n;
    if (document.hidden) return;
    // dragging: ease toward where the pointer put it (no snapping between pointer events); let go: glide on, then settle back to the slow turn
    if (drag) { const k = 1 - Math.exp(-dt / 70), y0 = yaw; yaw += (tYaw - yaw) * k; pitch += (tPitch - pitch) * k; vel = vel * .8 + (yaw - y0) / Math.max(1, dt) * .2; }
    else { vel += (BASE - vel) * Math.min(1, dt * .0012); yaw += vel * dt; pitch += (-.32 - pitch) * Math.min(1, dt * .0012); }
    if (!broken && charge > 0 && n - lastPump > 1200) charge = Math.max(0, charge - dt * .0005);
    window.prismYaw = yaw; draw(); stepMotes(dt); stepShards(dt);
  }
  loop(last);
  const goLive = () => { if (live) return; live = true; last = performance.now(); requestAnimationFrame(loop); };
  if (document.readyState === "complete") setTimeout(goLive, 200); else addEventListener("load", () => setTimeout(goLive, 200), { once: true });
  ["pointerdown", "keydown", "wheel", "touchstart"].forEach(t => addEventListener(t, goLive, { once: true, passive: true }));
  // one click: swap prism and crystal. Clicks in quick succession: charge up instead
  let clicks = [], single = null;
  function morph() {
    window.found && found("crystal");
    svg.animate([{ transform: "scale(1)" }, { transform: "scale(.55) rotate(25deg)", opacity: .35, offset: .45 }, { transform: "scale(1)" }], { duration: 560, easing: EASE });
    setTimeout(() => { mesh = mesh === PRISM ? CRYSTAL : PRISM; window.prismShape = mesh === CRYSTAL ? 1 : 0; }, 250);
  }
  function click() {
    if (broken) return; const now = performance.now(); clicks = clicks.filter(c => now - c < 650); clicks.push(now);
    if (clicks.length >= 2) { clearTimeout(single); single = null; if (clicks.length === 2) pump(); pump(); }
    else single = setTimeout(() => { single = null; morph(); }, 300);
  }
  el.addEventListener("pointerenter", e => { if (e.pointerType !== "mouse" || broken || !window.showHint) return; const r = el.getBoundingClientRect(); showHint("drag or click me", r.right - 10, r.top + 12, false); });
  el.addEventListener("pointerleave", () => window.hideHint && hideHint());
  el.addEventListener("pointerdown", e => { if (matchMedia("(max-width: 640px)").matches) return; window.hideHint && hideHint(); drag = { x: e.clientX, y: e.clientY, t: e.timeStamp, x0: e.clientX, y0: e.clientY, t0: e.timeStamp }; tYaw = yaw; tPitch = pitch; el.setPointerCapture(e.pointerId); el.classList.add("grabbing"); e.preventDefault(); });
  el.addEventListener("pointermove", e => { if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y, dt = Math.max(1, e.timeStamp - drag.t);
    if (Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) > 6) window.found && found("prism");
    tYaw -= dx * .012; tPitch = Math.max(-1.1, Math.min(1.1, tPitch + dy * .01)); Object.assign(drag, { x: e.clientX, y: e.clientY, t: e.timeStamp }); });
  const end = e => { if (!drag) return; const still = Math.hypot(e.clientX - drag.x0, e.clientY - drag.y0) < 5 && e.timeStamp - drag.t0 < 350;
    drag = null; el.classList.remove("grabbing"); vel = still ? BASE : Math.max(-.02, Math.min(.02, vel)); if (still && e.type === "pointerup") click(); };
  el.addEventListener("pointerup", end); el.addEventListener("pointercancel", end);
})();
