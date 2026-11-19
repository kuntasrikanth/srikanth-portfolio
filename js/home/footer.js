/* ================= Footer: the desk, the flip book, the CV ================= */
// fill these in: empty values show "coming soon" instead of opening a link
const CONTACT = { email: "kuntasrikanth00@gmail.com", github: "https://github.com/kuntasrikanth", linkedin: "https://www.linkedin.com/in/srikanthkunta", youtube: "https://www.youtube.com/@copy_the_facts_telugu" };
(() => {
  const toastEl = document.getElementById("ftoast"); let tt;
  const toast = m => { toastEl.textContent = m; toastEl.classList.add("on"); clearTimeout(tt); tt = setTimeout(() => toastEl.classList.remove("on"), 2200); };
  document.querySelectorAll("[data-show]").forEach(el => { const v = CONTACT[el.dataset.show]; if (v) el.textContent = el.dataset.show === "x" ? "@" + v.replace(/^@/, "") : v; });
  document.querySelectorAll("[data-contact]").forEach(el => el.addEventListener("click", () => {
    const k = el.dataset.contact, v = CONTACT[k];
    if (el.tagName === "A") return; // real links (LinkedIn, YouTube, GitHub) open on their own
    if (!v) { toast("Coming soon"); return; }
    if (k === "email") { openMail(); return; }
    const url = k === "x" ? "https://x.com/" + v.replace(/^@/, "") : v;
    open(url, "_blank", "noopener");
  }));

  // the polaroid: Copy The Facts, a ringed planet in a starry sky, drawn here so no photo is needed
  const drawSpace = (c, W, H) => {
    const g = c.createLinearGradient(0, 0, W * .3, H); g.addColorStop(0, "#0b1030"); g.addColorStop(.6, "#241a52"); g.addColorStop(1, "#3b1d5e");
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 140; i++) { const r = rnd() * 1.3 + .2; c.globalAlpha = .35 + rnd() * .65; c.fillStyle = "#fff"; c.beginPath(); c.arc(rnd() * W, rnd() * H, r * W / 300, 0, 7); c.fill(); }
    c.globalAlpha = 1;
    const neb = c.createRadialGradient(W * .2, H * .25, 0, W * .2, H * .25, W * .6); neb.addColorStop(0, "rgba(255,120,170,.28)"); neb.addColorStop(1, "rgba(255,120,170,0)");
    c.fillStyle = neb; c.fillRect(0, 0, W, H);
    const px = W * .62, py = H * .4, pr = W * .2;
    const ring = (front) => { c.save(); c.translate(px, py); c.rotate(-.38); c.beginPath(); c.ellipse(0, 0, pr * 1.85, pr * .42, 0, front ? 0 : Math.PI, front ? Math.PI : TAU2); c.strokeStyle = "rgba(255,214,160,.85)"; c.lineWidth = W * .018; c.stroke(); c.restore(); };
    ring(false);
    const pg = c.createRadialGradient(px - pr * .4, py - pr * .45, pr * .1, px, py, pr); pg.addColorStop(0, "#ffd9a8"); pg.addColorStop(.55, "#f08a4b"); pg.addColorStop(1, "#8d3b2a");
    c.fillStyle = pg; c.beginPath(); c.arc(px, py, pr, 0, TAU2); c.fill();
    c.save(); c.beginPath(); c.arc(px, py, pr, 0, TAU2); c.clip(); c.strokeStyle = "rgba(120,40,25,.35)"; c.lineWidth = W * .012;
    for (let k = -2; k <= 2; k++) { c.beginPath(); c.ellipse(px, py + k * pr * .32, pr * 1.1, pr * .12, -.12, 0, TAU2); c.stroke(); } c.restore();
    ring(true);
    c.fillStyle = "#cfd6e6"; c.beginPath(); c.arc(W * .2, H * .2, W * .035, 0, TAU2); c.fill();
    const bx = W * .12, by = H * .66, bw = W * .3, bh = bw * .7;
    c.fillStyle = "#ff0033"; c.beginPath(); c.roundRect ? c.roundRect(bx, by, bw, bh, bh * .28) : c.rect(bx, by, bw, bh); c.fill();
    c.fillStyle = "#fff"; c.beginPath(); c.moveTo(bx + bw * .4, by + bh * .27); c.lineTo(bx + bw * .4, by + bh * .73); c.lineTo(bx + bw * .68, by + bh * .5); c.closePath(); c.fill();
  };
  const TAU2 = Math.PI * 2;
  const pc = document.getElementById("polaC");
  drawSpace(pc.getContext("2d"), 300, 380);
  // the channel card: the same art, and a card with the numbers
  const art = (w, h, f) => { const cv = document.createElement("canvas"); cv.width = w; cv.height = h; f(cv.getContext("2d"), w, h); return cv.toDataURL("image/png"); };
  const drawStats = (c, W, H) => {
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, "#ff2a4f"); g.addColorStop(1, "#b0002a"); c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.fillStyle = "#fff"; c.textAlign = "center";
    c.font = `italic ${W * .3}px "Instrument Serif", Georgia, serif`; c.fillText("4,460+", W / 2, H * .5);
    c.font = `500 ${W * .06}px "Geist Mono", ui-monospace, monospace`; c.fillText("SUBSCRIBERS", W / 2, H * .62);
    c.font = `italic ${W * .12}px "Instrument Serif", Georgia, serif`; c.fillText("1.2M+ views", W / 2, H * .76);
    c.globalAlpha = .8; c.font = `${W * .05}px "Geist", system-ui, sans-serif`; c.fillText("grown organically · no budget", W / 2, H * .86);
  };
  const paintCh = () => { document.getElementById("chFront").src = art(480, 600, drawSpace); document.getElementById("chBack").src = art(480, 600, drawStats); };
  paintCh(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(paintCh);

  // rooms: open, close, blur behind
  let lastFocus = null;
  const openRoom = r => { navRoom = r.id === "cvRoom" ? "resume" : r.id === "bookRoom" ? "about" : null; navSpy(); lastFocus = document.activeElement; r.hidden = false; requestAnimationFrame(() => r.classList.add("on")); document.documentElement.style.overflow = "hidden"; r.querySelector(".x").focus(); };
  const closeRoom = r => { r.querySelectorAll("video").forEach(v => v.pause()); navRoom = null; navSpy(); r.classList.remove("on"); document.documentElement.style.overflow = ""; setTimeout(() => { r.hidden = true; }, 350); lastFocus && lastFocus.focus(); };
  document.querySelectorAll(".room").forEach(r => {
    r.addEventListener("click", e => { if (e.target.closest("[data-close]") || !e.target.closest(".leaf, .ctl, .cvsheet, .chcard, .letter")) closeRoom(r); });
  });
  addEventListener("keydown", e => {
    const r = document.querySelector(".room.on"); if (!r) return;
    if (e.key === "Escape") closeRoom(r);
    if (r.id === "bookRoom" && e.key === "ArrowRight") turn(1);
    if (r.id === "bookRoom" && e.key === "ArrowLeft") turn(-1);
  });

  // the thesis: every face is a page; leaves hold two faces (front on the right, back on the left once turned)
  const crest = `<svg class="crest" viewBox="0 0 80 96" aria-hidden="true"><path d="M8 6h64v40c0 24-18 38-32 46C26 84 8 70 8 46z" fill="none" stroke="currentColor" stroke-width="2.2"/><path d="M14 12h52v34c0 20-15 32-26 39C29 78 14 66 14 46z" fill="none" stroke="currentColor" stroke-width=".9"/><g fill="none" stroke="currentColor" stroke-width="1.5"><ellipse cx="40" cy="44" rx="20" ry="7.5"/><ellipse cx="40" cy="44" rx="20" ry="7.5" transform="rotate(60 40 44)"/><ellipse cx="40" cy="44" rx="20" ry="7.5" transform="rotate(-60 40 44)"/></g><circle cx="40" cy="44" r="3" fill="currentColor"/></svg>`;
  const hd = (l, r) => `<div class="run"><span>${l}</span><span>${r}</span></div>`;
  const sc = h => `<div class="scr" aria-hidden="true">${h}</div>`;
  const ch = (n, t) => `<div class="chap"><span>Chapter ${n}</span><b>${n}</b></div><h5>${t}</h5><div class="crule"></div>`;
  // the AI UGC workflow, drawn as a pipeline: script, video, voice, edit, post
  const PIPE = (() => {
    const steps = [["script", "Claude"], ["video", "Kling AI"], ["voice", "Fish Audio"], ["edit", "DaVinci"], ["post", "3 accounts"]];
    let g = "";
    steps.forEach(([a, b], i) => {
      const x = 14 + i * 116;
      g += `<path class="ln" d="M${x} 26h92v44h-92z"/><text x="${x + 46}" y="54" text-anchor="middle">${a}</text><text x="${x + 46}" y="98" text-anchor="middle" style="font-size:15px">${b}</text>`;
      if (i < steps.length - 1) g += `<path class="ph" d="M${x + 96} 48h16M${x + 106} 43l6 5-6 5"/>`;
    });
    return `<figure class="feyn" aria-label="The AI video workflow"><svg viewBox="0 0 600 120" aria-hidden="true">${g}</svg></figure>`;
  })();
  // margin sketches, one per page, drawn from what the page says
  const fig = (w, vb, body, css = "") => `<figure class="sketch" style="width:${w}%;${css}" aria-hidden="true"><svg viewBox="${vb}">${body}</svg></figure>`;
  const SK = {
    // ch 2: the walk home, 8 km a day to save 10 rupees
    walk: fig(66, "0 0 300 110", `<path d="M30 70C80 40 120 95 170 62S250 40 272 58"/><path d="M22 70h16M26 70v-14l4-6 4 6v14"/><path d="M262 58h20M266 58v-12h12v12"/><circle cx="100" cy="74" r="1.6"/><circle cx="120" cy="80" r="1.6"/><circle cx="140" cy="76" r="1.6"/><text x="10" y="100">centre</text><text x="250" y="88">home</text><text x="120" y="40">8 km, ₹10 (9p) saved</text>`),
    // ch 3: the group, 15 people to 500
    group: fig(66, "0 0 300 130", `<path class="ax" d="M14 120H292M14 120V8"/><path d="M20 114Q120 112 170 70T280 16"/><circle cx="24" cy="114" r="2.6"/><circle cx="180" cy="62" r="2.6"/><circle cx="280" cy="16" r="2.6"/><text x="30" y="106">15</text><text x="186" y="58">500</text><text x="236" y="16" text-anchor="end">700</text><text x="290" y="130" text-anchor="end">members</text>`),
    // ch 6: the channel, a play button and a ringed planet
    channel: fig(62, "0 0 300 130", `<path d="M40 40h70a14 14 0 0 1 14 14v34a14 14 0 0 1-14 14H40a14 14 0 0 1-14-14V54a14 14 0 0 1 14-14z"/><path d="M66 56v30l24-15z"/><g transform="translate(212 64)"><circle class="o" r="26"/><ellipse rx="48" ry="11" transform="rotate(-18)"/></g><circle cx="168" cy="22" r="2.4"/><circle cx="276" cy="112" r="2"/><circle cx="150" cy="104" r="1.6"/><text x="60" y="126">Copy The Facts Telugu</text>`),
    // ch 8: two colleagues, one hello
    abid: fig(60, "0 0 300 110", `<path d="M60 25H270M60 85H270"/><path class="ph" d="M150 25q-8 5 0 10t0 10t0 10t0 10t0 10t0 10"/><circle cx="150" cy="25" r="2.6"/><circle cx="150" cy="85" r="2.6"/><text x="6" y="30">me</text><text x="6" y="90">Abid</text><text x="164" y="60">referral</text>`),
    // ch 10: twenty units, split in two
    split: fig(66, "0 0 300 120", `<path d="M20 30h260v40H20z"/><path d="M150 26v48"/><g>${Array.from({ length: 10 }, (_, i) => `<circle cx="${32 + i * 12}" cy="50" r="3.2"/>`).join("")}${Array.from({ length: 10 }, (_, i) => `<circle cx="${162 + i * 12}" cy="50" r="3.2"/>`).join("")}</g><text x="85" y="100" text-anchor="middle">shop</text><text x="215" y="100" text-anchor="middle">followers</text>`),
    // ch 11: the climb, from fifty rupees a day to manager
    curve: fig(72, "0 0 300 132", `<path class="ax" d="M14 122H292M14 122V8"/><path d="M20 112Q80 108 120 88T200 55T275 18"/><circle cx="40" cy="111" r="2.6"/><circle cx="120" cy="88" r="2.6"/><circle cx="200" cy="55" r="2.6"/><circle cx="275" cy="18" r="2.6"/><text x="48" y="104">₹50 (43p) a day</text><text x="114" y="80" text-anchor="end">WhatsApp group</text><text x="194" y="47" text-anchor="end">the UK</text><text x="268" y="14" text-anchor="end">executive</text><text x="290" y="131" text-anchor="end">time</text>`),
    // closing: you and me, exchanging a hello
    hello: fig(60, "0 0 300 110", `<path d="M40 25H270M40 85H270"/><path class="ph" d="M150 25q-8 5 0 10t0 10t0 10t0 10t0 10t0 10"/><circle cx="150" cy="25" r="2.6"/><circle cx="150" cy="85" r="2.6"/><text x="6" y="30">me</text><text x="6" y="90">you</text><text x="164" y="60">hello</text>`)
  };
  const T = "From Medak<br>to the Midlands", SUB = "Villages, WhatsApp groups, space videos and a clearance store";
  // every face is a page; the last leaf carries the closing page with the back cover behind it
  const FACES = [
    { c: "cover", h: `<div class="frame">${crest}<div class="ct">${T}</div><div class="cs">${SUB}</div><div class="cr"></div><div class="ca">SRIKANTH</div><div class="cd">Social Media &amp; eCommerce Marketing Executive · MMXXVI</div></div>` },
    { c: "endp", h: `<div class="plate"><small>EX LIBRIS</small><b>Srikanth</b><small>Social Media &amp; eCommerce Marketing Executive</small></div>` },
    { c: "titlep", h: `${crest}<div class="tt">${T}</div><div class="ts">${SUB}</div><div class="tb">by</div><div class="ta">Srikanth Kunta</div><div class="tm">I started out earning 50 rupees a day (about 43p) and walking home to save 10 (about 9p). I'm still learning, and grateful to everyone who helped me along the way.</div><div class="tu">Medak · Birmingham<br>2026</div>` },
    { h: `${hd("Chapter 1", "Where I started")}${ch(1, "Where I started")}<p class="drop">In 2020 I was studying Intermediate at GJC Shankarampet (R), in Medak, Telangana. My brother helped me get a job at a local MeeSeva and online services centre, run by Koduri Naresh Goud and Koduri Ranjith Goud.</p><p>People from nearby villages came for passports, land records, scholarships, PAN and Aadhaar cards, certificates and voter IDs. Naresh and Ranjith were patient with me and taught me a lot.</p>${sc("collect → print → bind → submit")}` },
    { h: `${hd("Chapter 2", "Fifty rupees a day")}${ch(2, "Fifty rupees a day")}<p>At first I collected documents. Then I ran the printers, and later I submitted applications online myself. On busy days we had 50 to 70 customers.</p><p>I earned 50 rupees a day, about 43p. An auto home cost 10 rupees (9p), so I walked, about 8 km there and back. In June 2022 I passed Intermediate with 815 out of 1000.</p>${SK.walk}` },
    { h: `${hd("Chapter 3", "My first business")}${ch(3, "My first business")}<p>In August 2022 I started a B.Com in Computer Applications. I helped friends with scholarship applications, then made a WhatsApp group for students, and began posting job notifications too.</p><p>In three months it grew from 15 people to around 500. I worked 5pm to 1am and 6am to 8am, on a hard chair with a pillow, my laptop on the bed.</p>${SK.group}` },
    { h: `${hd("Chapter 4", "Taking a chance")}${ch(4, "Taking a chance")}<p>I messaged Shivani Pallela, a well-known YouTube teacher for B.Com, BBA and BA students, and she promoted my service for free. Centres charged 100 to 150 rupees (87p to £1.30) and students travelled 10 to 15 km. I charged 80 (70p), and nobody travelled.</p><p>Through her Telegram page I earned 400 to 600 rupees a day (£3.50 to £5.20), and bought my family a fridge for 17,000 rupees (about £148).</p>${sc("₹80 (70p), no travel &nbsp;&gt;&nbsp; ₹150 (£1.30) + 15 km")}` },
    { h: `${hd("Chapter 5", "One simple idea")}${ch(5, "One simple idea")}<p>On results day the website kept crashing, and village internet is slow. I asked Shivani to pin my comment offering to check results for free.</p><p>In one hour I got 100 to 150 messages and checked results for more than 80 students. The group grew from 500 to 700. One simple, useful idea can change things.</p>${sc("roll number + date of birth → result")}` },
    { h: `${hd("Chapter 6", "Copy The Facts Telugu")}${ch(6, "Copy The Facts Telugu")}<p>In 2023 I started Copy The Facts Telugu, a channel about space, technology and the universe. I wrote scripts on my laptop and recorded voiceovers on my phone.</p><p>My first videos weren't good, and even my family didn't believe in it. I taught myself CapCut and kept going. It grew to more than 4,400 subscribers and 1.2 million views.</p>${SK.channel}` },
    { h: `${hd("Chapter 7", "Teaching, then the UK")}${ch(7, "Teaching, then the UK")}<p>In 2024 I joined Digital Equity, a non-profit, as a Facilitator Intern, and spent a year teaching 9th class students to use the internet and stay safe online.</p><p>In September 2025 I came to the UK for an MSc in Business Analytics at The University of Law, Birmingham. In November I started sorting products part-time at DX Freight in Willenhall.</p>${sc("ŷ = β₀ + β₁x + ε")}` },
    { h: `${hd("Chapter 8", "A friend called Abid")}${ch(8, "A friend called Abid")}<p>I came alone, and my English wasn't strong, but I made myself talk to people. That's how I met Abid, a colleague from Afghanistan, who helped me with my English and taught me about life here.</p><p>When he got a job at DropThePriceUK Limited, which trades as Crazy Clearance, he referred me. On 18 May 2026 I joined in customer service.</p>${SK.abid}` },
    { h: `${hd("Chapter 9", "Ideas nobody asked for")}${ch(9, "Ideas nobody asked for")}<p>Our channel had 132,000 followers and 85 million reel views, but almost no sales came from it. Nobody asked me to, but I audited the website: product names in capitals, no Google description, no reviews, no blog. I proposed an AI agent for unanswered comments, and made an in-store announcement with Fish Audio.</p><p>The owner turned it down. I didn't give up.</p>${sc("audit · agent · announcement")}` },
    { h: `${hd("Chapter 10", "The reserve stock idea")}${ch(10, "The reserve stock idea")}<p>Out of 20 units, sell 10 in the shop and keep 10 for followers. To claim one, share our post to your story and send a screenshot. Bookings open on Fridays, 10 a week; you collect between 9:00 and 9:30 on Saturday.</p><p>More shares, more reach, no ad spend. Two weeks later the owner said yes, and I was promoted.</p>${SK.split}` },
    { h: `${hd("Chapter 11", "What came next")}${ch(11, "What came next")}<p>I rebuilt our Google Maps listings, brought 3D product models to Shopify, and built the AI agent: a reply bot for our DMs and comments.</p><p>Since September 2026 I've been Social Media &amp; eCommerce Marketing Executive, running our Shopify store too. I built Follow &amp; Save pages for Tipton and Oldham, and a review card for our 500+ weekly parcels. My placement started on 12 October, at 30 hours a week.</p>${SK.curve}` },
    { h: `${hd("Closing", "")}${ch(12, "Say hello")}<p>What I enjoy most is helping a business grow with today's technology and a few smart ideas, the way the reserve stock idea did.</p><p>If you'd like to work together, pick a card on the desk. The envelope is for email, the stamp for LinkedIn, the ticket for my YouTube channel.</p>${sc("hook → hold → payoff")}${SK.hello}<div class="colo">Birmingham, 2026.</div>` },
    { c: "cover back", h: `<div class="frame"><div class="cd" style="margin-top:auto">Srikanth · Social Media &amp; eCommerce Marketing Executive</div></div>` }
  ];
  const book = document.getElementById("book"), nL = FACES.length / 2;
  const face = (f, side) => `<div class="face ${side}${f.c ? " " + f.c : ""}">${f.h}</div>`;
  // the page block: a few sheets stacked under each side, more on the side that holds more pages
  const stk = side => { const s = document.createElement("div"); s.className = "stk " + side; for (let i = 0; i < 6; i++) s.appendChild(document.createElement("i")); book.appendChild(s); return s; };
  const stL = stk("l"), stR = stk("r");
  for (let i = 0; i < nL; i++) {
    const lf = document.createElement("div"); lf.className = "leaf"; lf.style.zIndex = nL - i;
    lf.innerHTML = face(FACES[i * 2], "a") + face(FACES[i * 2 + 1], "b");
    lf.addEventListener("click", () => turn(lf.classList.contains("flip") ? -1 : 1));
    book.appendChild(lf);
  }
  const leaves = [...book.querySelectorAll(".leaf")]; let at = 0;
  const ONE = matchMedia("(max-width:700px)").matches, one = () => ONE, N = () => ONE ? leaves.length : nL;
  const stacks = () => {
    const k = one() ? 0 : 1, l = Math.round(6 * at / nL), r = 6 - l;
    [...stL.children].forEach((e, i) => e.style.opacity = k && i < l && at > 0 ? 1 : 0);
    [...stR.children].forEach((e, i) => e.style.opacity = i < (one() ? 6 - Math.round(6 * at / N()) : r) && at < N() ? 1 : 0);
  };
  const label = () => {
    const n = document.getElementById("bkNo");
    if (one()) n.textContent = at === 0 ? "cover" : `page ${at} of ${N() - 1}`;
    else n.textContent = at === 0 ? "cover" : at === nL ? "back" : `pages ${at * 2 - 1}–${at * 2}`;
    document.getElementById("bkPrev").disabled = at === 0; document.getElementById("bkNext").disabled = at >= N() - (one() ? 1 : 0);
    stacks();
  };
  function turn(d) {
    const to = Math.max(0, Math.min(N() - (one() ? 1 : 0), at + d)); if (to === at) return;
    if (d > 0) { const lf = leaves[at]; lf.classList.add("flip"); lf.style.zIndex = 100 + at; }
    else { const lf = leaves[to]; lf.classList.remove("flip"); setTimeout(() => { lf.style.zIndex = N() - to; }, 450); }
    at = to; book.classList.toggle("closed", at === 0); book.classList.toggle("ended", !one() && at === nL); label();
  }
  // phones: one face per page, so the backs ride along as extra fronts
  if (one()) {
    leaves.forEach(l => l.remove()); leaves.length = 0;
    FACES.slice(0, -1).forEach((f, i) => { const lf = document.createElement("div"); lf.className = "leaf"; lf.style.zIndex = 50 - i; lf.innerHTML = face(f, "a"); lf.addEventListener("click", () => turn(1)); book.appendChild(lf); leaves.push(lf); });
  }
  // every opening starts from the front cover
  const resetBook = () => {
    leaves.forEach((lf, i) => { lf.style.transition = "none"; lf.classList.remove("flip"); lf.style.zIndex = N() - i; });
    book.style.transition = "none"; at = 0; book.classList.add("closed"); book.classList.remove("ended"); label();
    void book.offsetWidth; leaves.forEach(lf => lf.style.transition = ""); book.style.transition = "";
  };
  document.getElementById("bkPrev").addEventListener("click", () => turn(-1));
  document.getElementById("bkNext").addEventListener("click", () => turn(1));
  label();
  let opening; const openBook = () => { resetBook(); openRoom(document.getElementById("bookRoom"));
    // then the cover swings open to the title page, like picking up a real book
    clearTimeout(opening); opening = setTimeout(() => { turn(1); if (ONE) opening = setTimeout(() => turn(1), 950); }, 600); };
  const openCV = () => openRoom(document.getElementById("cvRoom"));
  // the letter: write a note, then it opens in the visitor's mail app, addressed and ready to send
  const mailRoom = document.getElementById("mailRoom"), ltMsg = document.getElementById("ltMsg"), ltName = document.getElementById("ltName");
  document.getElementById("ltTo").textContent = CONTACT.email;
  function openMail() { openRoom(mailRoom); setTimeout(() => ltMsg.focus(), 360); }
  document.getElementById("ltCopy").addEventListener("click", () => navigator.clipboard?.writeText(CONTACT.email).then(() => toast("Email copied"), () => toast(CONTACT.email)));
  document.getElementById("letter").addEventListener("submit", e => {
    e.preventDefault();
    const msg = ltMsg.value.trim(), name = ltName.value.trim(); if (!msg) { ltMsg.focus(); return; }
    const subject = "Hello from " + (name || "your portfolio"), body = "Dear Srikanth,\n\n" + msg + (name ? "\n\nYours,\n" + name : "");
    location.href = "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    toast("Opening your mail app"); closeRoom(mailRoom);
  });
  // the channel card: the windmill and the desk polaroid both open it
  let chUrl = CONTACT.youtube;
  const chPics = document.getElementById("chPics"), STILL = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const openCh = (url = CONTACT.youtube) => { chUrl = url; document.getElementById("chGo").href = url; openRoom(document.getElementById("chRoom")); };
  // tap either polaroid to swap them, with a fluid move: each one glides, scales and turns from its old place to its new one (FLIP)
  chPics.addEventListener("click", e => {
    if (!e.target.closest(".ph")) return;
    const cards = [...chPics.children], box = c => ({ x: c.offsetLeft + c.offsetWidth / 2, y: c.offsetTop + c.offsetHeight / 2, w: c.offsetWidth }), rot = c => c.classList.contains("front") ? -3 : 6;
    const first = cards.map(c => ({ ...box(c), r: rot(c) }));
    if (!STILL) cards.forEach(c => c.style.transition = "none"); // a CSS transition would override the move below
    cards.forEach(c => { c.classList.toggle("front"); c.classList.toggle("back"); });
    if (STILL) return;
    cards.forEach((c, i) => {
      const f = first[i], l = box(c), dx = f.x - l.x, dy = f.y - l.y, s = f.w / l.w, up = c.classList.contains("front");
      c.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${s}) rotate(${f.r}deg)` },
        { transform: `translate(${dx * .4}px, ${dy * .4 - (up ? 18 : -6)}px) scale(${s + (1 - s) * .6 + (up ? .03 : 0)}) rotate(${(f.r + rot(c)) / 2 + (up ? -2 : 2)}deg)`, offset: .55 },
        { transform: `rotate(${rot(c)}deg)` }
      ], { duration: 720, easing: "cubic-bezier(.22,.8,.24,1)" }).onfinish = () => { c.style.transition = ""; };
    });
  });
  window.openChannel = openCh;
  // the AI ads room: the workflow motion graphic beside the finished ad, restarted from the top each time
  const ugcRoom = document.getElementById("ugcRoom");
  const openUgc = () => { openRoom(ugcRoom); const el = ugcRoom.querySelector("[data-ugc-motion]"), M = window.ugcMotion; if (!el || !M) return;
    if (!M.has(el) && window.UGCMotion) M.set(el, window.UGCMotion.mount(el)); const m = M.get(el); if (m) m.restart(); };
  document.querySelectorAll('[data-open="ugc"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); openUgc(); }));
  document.getElementById("openCh").addEventListener("click", () => openCh(CONTACT.youtube));
  document.getElementById("openAbout").addEventListener("click", openBook);
  // the nav's About and Resume open the same papers
  // go to the desk first, so people see where the thesis and the CV live, then open them
  const toDesk = (open, el) => { const d = document.getElementById(el), r = d.getBoundingClientRect();
    const far = Math.abs(r.top + r.height / 2 - innerHeight / 2) > 40;
    d.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    setTimeout(() => { d.classList.add("pick"); setTimeout(() => { d.classList.remove("pick"); open(); }, 260); }, far ? 750 : 0); };
  document.querySelectorAll('a[href="#about"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); toDesk(openBook, "openAbout"); }));
  document.querySelectorAll('.nav a[href="#resume"]').forEach(a => a.addEventListener("click", e => { e.preventDefault(); toDesk(openCV, "openCV"); }));
})();
