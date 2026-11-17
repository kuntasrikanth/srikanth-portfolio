/* Live phone previews (iframes) keep animating even when scrolled away. Tell each one whether it is on screen;
   the page inside slows its animation loop to a crawl while it is not (see the snippet in each embedded page). */
(() => {
  const send = f => { try { f.contentWindow.postMessage({ vis: !!f.__vis }, "*"); } catch (e) {} };
  const io = new IntersectionObserver(es => es.forEach(e => { e.target.__vis = e.isIntersecting; send(e.target); }), { rootMargin: "120px" });
  const add = f => { if (f.__io) return; f.__io = 1; f.__vis = false; io.observe(f); f.addEventListener("load", () => send(f)); };
  document.querySelectorAll("iframe").forEach(add);
  // the homepage copies previews into its thumbnail strip, so watch for new iframes too
  new MutationObserver(ms => ms.forEach(m => m.addedNodes.forEach(n => { if (n.nodeType !== 1) return; if (n.tagName === "IFRAME") add(n); else n.querySelectorAll && n.querySelectorAll("iframe").forEach(add); })))
    .observe(document.body, { childList: true, subtree: true });
})();
