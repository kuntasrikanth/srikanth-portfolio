/* ================= Sky extras: a rocket launch, an AI delivery drone, and AI sparkles =================
   A second canvas over the scene. It takes no clicks (the sun and the windmill still get them),
   sleeps while the header is off screen, and stays empty for people who prefer reduced motion. */
(() => {
  const scene = document.getElementById("scene"), fx = document.getElementById("fx");
  if (!scene || !fx || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas"); cv.id = "skyx"; cv.setAttribute("aria-hidden", "true");
  cv.style.pointerEvents = "none"; fx.insertAdjacentElement("afterend", cv);
  const c = cv.getContext("2d"), root = document.documentElement, HZ = .618, TAU = Math.PI * 2;
  let W = 0, H = 0, DPR = 1, run = false, raf = 0, last = 0, T = 0;
  const night = () => root.getAttribute("data-sky") === "night";
  const rand = (a, b) => a + Math.random() * (b - a), clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const eio = x => x < .5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
  function size() { const r = scene.getBoundingClientRect(); DPR = Math.min(devicePixelRatio || 1, 2); W = r.width; H = r.height; cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); }

  /* ---- rocket: lifts off behind the far hills, arcs up and out of the sky, smoke trail behind ---- */
  const ROCKET_EVERY = 19, ROCKET_DUR = 7.5, smoke = [];
  const rocketAt = p => { // position and heading along the flight path, p = 0..1
    const x0 = W * .86, y0 = H * HZ * .96, x1 = W * .64, y1 = -H * .12, e = eio(p);
    const x = x0 + (x1 - x0) * Math.pow(e, 1.6), y = y0 + (y1 - y0) * e;
    const e2 = eio(Math.min(1, p + .01)), nx = x0 + (x1 - x0) * Math.pow(e2, 1.6), ny = y0 + (y1 - y0) * e2;
    return { x, y, a: Math.atan2(ny - y, nx - x) + Math.PI / 2 };
  };
  function drawRocket(x, y, a, s, t) {
    c.save(); c.translate(x, y); c.rotate(a); c.scale(s, s);
    // flame
    const fl = 1 + .25 * Math.sin(t * 40) + .15 * Math.sin(t * 23);
    const g = c.createLinearGradient(0, 10, 0, 10 + 26 * fl); g.addColorStop(0, "rgba(255,250,210,1)"); g.addColorStop(.35, "rgba(255,190,60,.95)"); g.addColorStop(1, "rgba(255,90,20,0)");
    c.fillStyle = g; c.beginPath(); c.moveTo(-4, 10); c.quadraticCurveTo(0, 10 + 30 * fl, 4, 10); c.closePath(); c.fill();
    if (night()) { const gl = c.createRadialGradient(0, 16, 0, 0, 16, 26); gl.addColorStop(0, "rgba(255,170,60,.45)"); gl.addColorStop(1, "rgba(255,170,60,0)"); c.fillStyle = gl; c.beginPath(); c.arc(0, 16, 26, 0, TAU); c.fill(); }
    // fins
    c.fillStyle = "#d8432f"; c.beginPath(); c.moveTo(-5, 4); c.lineTo(-10, 12); c.lineTo(-5, 10); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(5, 4); c.lineTo(10, 12); c.lineTo(5, 10); c.closePath(); c.fill();
    // body and nose
    const b = c.createLinearGradient(-5, 0, 5, 0); b.addColorStop(0, "#c9ced8"); b.addColorStop(.45, "#ffffff"); b.addColorStop(1, "#9aa1ad");
    c.fillStyle = b; c.beginPath(); c.moveTo(0, -16); c.bezierCurveTo(6, -10, 5.5, 2, 5, 10); c.lineTo(-5, 10); c.bezierCurveTo(-5.5, 2, -6, -10, 0, -16); c.fill();
    c.fillStyle = "#d8432f"; c.beginPath(); c.moveTo(0, -16); c.bezierCurveTo(3.4, -12.6, 4.2, -10, 4.3, -8.5); c.lineTo(-4.3, -8.5); c.bezierCurveTo(-4.2, -10, -3.4, -12.6, 0, -16); c.fill();
    c.fillStyle = "#2f6fb0"; c.beginPath(); c.arc(0, -3, 2.1, 0, TAU); c.fill(); c.strokeStyle = "#e8ecf2"; c.lineWidth = .8; c.stroke();
    c.restore();
  }
  function rocket(t, dt) {
    const k = (t % ROCKET_EVERY) - 2, s = clamp(W / 640, .9, 1.9);
    if (k >= 0 && k < ROCKET_DUR) {
      const p = k / ROCKET_DUR, r = rocketAt(p), sc = s * (1 - .45 * p);
      // smoke: thick at lift-off, thinning as it climbs
      const n = p < .12 ? 5 : p < .5 ? 3 : 1;
      for (let i = 0; i < n; i++) smoke.push({ x: r.x - Math.sin(r.a) * -14 * sc + rand(-2, 2), y: r.y + Math.cos(r.a) * 14 * sc + rand(-2, 2), vx: rand(-14, 14) * (p < .12 ? 2.4 : 1), vy: rand(4, 18), r: rand(2, 4) * sc, life: 0, max: rand(1.8, 3.4) });
      drawSmoke(dt); drawRocket(r.x, r.y, r.a, sc, t);
    } else drawSmoke(dt);
  }
  function drawSmoke(dt) {
    const nt = night();
    for (let i = smoke.length - 1; i >= 0; i--) {
      const q = smoke[i]; q.life += dt; if (q.life > q.max) { smoke.splice(i, 1); continue; }
      q.x += q.vx * dt; q.y += q.vy * dt; q.vx *= .985; q.r += 7 * dt;
      const a = (1 - q.life / q.max) * (nt ? .28 : .5);
      c.fillStyle = nt ? `rgba(210,215,235,${a.toFixed(3)})` : `rgba(255,255,255,${a.toFixed(3)})`;
      c.beginPath(); c.arc(q.x, q.y, q.r, 0, TAU); c.fill();
    }
  }

  /* ---- AI delivery drone: crosses the sky carrying a Crazy Clearance parcel ---- */
  const DRONE_EVERY = 23, DRONE_DUR = 12, DRONE_AT = 10;
  function drone(t) {
    const k = ((t - DRONE_AT) % DRONE_EVERY + DRONE_EVERY) % DRONE_EVERY;
    if (t < DRONE_AT || k > DRONE_DUR) return;
    const p = k / DRONE_DUR, s = clamp(W / 720, .85, 1.7);
    const x = -60 + (W + 120) * p, y = H * .2 + Math.sin(t * 2.2) * 6 + Math.sin(p * Math.PI) * H * .05, tilt = .12;
    c.save(); c.translate(x, y); c.rotate(tilt); c.scale(s, s);
    // parcel on a line
    c.strokeStyle = "rgba(60,60,70,.7)"; c.lineWidth = 1; c.beginPath(); c.moveTo(-5, 4); c.lineTo(-4, 15); c.moveTo(5, 4); c.lineTo(4, 15); c.stroke();
    c.fillStyle = "#f2b347"; c.fillRect(-9, 15, 18, 12); c.fillStyle = "#c7832a"; c.fillRect(-9, 15, 18, 2.5); c.fillStyle = "#1d1d1f"; c.fillRect(-1.5, 15, 3, 12);
    // arms and rotors
    c.strokeStyle = "#2a2d34"; c.lineWidth = 2.2; c.beginPath(); c.moveTo(-17, -1); c.lineTo(17, -1); c.stroke();
    for (const sx of [-17, 17]) { c.fillStyle = "rgba(40,44,52,.9)"; c.fillRect(sx - 1.5, -5, 3, 4);
      const w = 9 + 2 * Math.sin(t * 60 + sx); c.fillStyle = night() ? "rgba(200,220,255,.35)" : "rgba(60,70,90,.28)"; c.beginPath(); c.ellipse(sx, -6, w, 1.8, 0, 0, TAU); c.fill(); }
    // body with an AI light
    c.fillStyle = "#1f2229"; c.beginPath(); c.roundRect ? c.roundRect(-8, -5, 16, 9, 4) : c.rect(-8, -5, 16, 9); c.fill();
    const on = Math.sin(t * 6) > 0; c.fillStyle = on ? "#5ee7ff" : "#1b6f80"; c.beginPath(); c.arc(0, -.5, 1.8, 0, TAU); c.fill();
    if (on && night()) { const gl = c.createRadialGradient(0, -.5, 0, 0, -.5, 10); gl.addColorStop(0, "rgba(94,231,255,.5)"); gl.addColorStop(1, "rgba(94,231,255,0)"); c.fillStyle = gl; c.beginPath(); c.arc(0, -.5, 10, 0, TAU); c.fill(); }
    c.font = "700 5px Geist, system-ui, sans-serif"; c.fillStyle = "#fff"; c.textAlign = "center"; c.fillText("AI", 0, 3.4);
    c.restore();
  }

  /* ---- AI sparkles: four-point stars that bloom and fade high in the sky ---- */
  const sparks = []; let nextSpark = 0;
  function sparkles(t, dt) {
    if (t > nextSpark && sparks.length < 6) { sparks.push({ x: rand(.05, .95) * W, y: rand(.05, .42) * H * HZ / .618, life: 0, max: rand(1.4, 2.4), r: rand(4, 9) * clamp(W / 1000, .7, 1.2) }); nextSpark = t + rand(.5, 1.3); }
    const nt = night();
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i]; s.life += dt; if (s.life > s.max) { sparks.splice(i, 1); continue; }
      const p = s.life / s.max, k = Math.sin(p * Math.PI), r = s.r * k;
      c.save(); c.translate(s.x, s.y); c.rotate(p * .8);
      c.fillStyle = nt ? `rgba(170,235,255,${(.9 * k).toFixed(3)})` : `rgba(255,214,90,${(.85 * k).toFixed(3)})`;
      c.beginPath(); c.moveTo(0, -r); c.quadraticCurveTo(r * .18, -r * .18, r, 0); c.quadraticCurveTo(r * .18, r * .18, 0, r); c.quadraticCurveTo(-r * .18, r * .18, -r, 0); c.quadraticCurveTo(-r * .18, -r * .18, 0, -r); c.fill();
      c.restore();
    }
  }

  function frame(now) {
    const dt = Math.min(.05, last ? (now - last) / 1000 : 0); last = now;
    if (window.skyCalm && window.skyCalm()) { raf = run ? requestAnimationFrame(frame) : 0; return; } // still sky (see scene.js)
    T += dt;
    c.setTransform(DPR, 0, 0, DPR, 0, 0); c.clearRect(0, 0, W, H);
    sparkles(T, dt); drone(T); rocket(T, dt);
    raf = run ? requestAnimationFrame(frame) : 0;
  }
  size(); addEventListener("resize", size);
  new IntersectionObserver(es => es.forEach(e => { run = e.isIntersecting; if (run && !raf) { last = 0; raf = requestAnimationFrame(frame); } }), { threshold: .05 }).observe(scene);
  window.skyExtras = { at: t => { T = t; } }; // for testing: jump the timeline
})();
