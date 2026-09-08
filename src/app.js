(() => {
  const pages = [...document.querySelectorAll('.lesson-pane')];
  const links = [...document.querySelectorAll('.lesson-link')];
  const sidebar = document.getElementById('sidebar');
  const shade = document.getElementById('mobile-shade');
  const menuButton = document.getElementById('open-menu');
  const closeButton = document.getElementById('close-menu');
  const media = window.matchMedia('(max-width: 959px)');
  let menuOpen = false;

  function setMenu(open, restoreFocus = false) {
    menuOpen = open && media.matches;
    sidebar.classList.toggle('is-open', menuOpen);
    shade.hidden = !menuOpen;
    menuButton.setAttribute('aria-expanded', String(menuOpen));
    sidebar.inert = media.matches && !menuOpen;
    document.querySelector('.workspace').inert = menuOpen;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) closeButton.focus();
    else if (restoreFocus && media.matches) menuButton.focus();
  }

  function showPage(initial = false) {
    let hash;
    try { hash = decodeURIComponent(location.hash.slice(1)); } catch { hash = ''; }
    const anchor = hash ? document.getElementById(hash) : null;
    const page = anchor?.closest('.lesson-pane') || pages[0];
    const changed = page.hidden;
    pages.forEach(item => { item.hidden = item !== page; });
    links.forEach(link => {
      if (link.hash === '#' + page.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.getElementById('breadcrumb').textContent = page.dataset.group;
    document.title = page.dataset.title + ' — English Notes';
    document.getElementById('reading-status').textContent = page.dataset.label + ': ' + page.dataset.title;
    setMenu(false);
    if (!initial && (changed || !anchor || anchor === page)) {
      page.querySelector('h1').focus({ preventScroll: true });
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    if (anchor && anchor !== page) {
      const details = anchor.closest('details');
      if (details) details.open = true;
      requestAnimationFrame(() => anchor.scrollIntoView({ block: 'start' }));
    }
  }

  menuButton.addEventListener('click', () => setMenu(true));
  closeButton.addEventListener('click', () => setMenu(false, true));
  shade.addEventListener('click', () => setMenu(false, true));
  sidebar.addEventListener('click', event => {
    const link = event.target.closest('a');
    if (link && link.hash === location.hash) {
      setMenu(false);
      document.querySelector('.lesson-pane:not([hidden]) h1').focus({ preventScroll: true });
    }
  });
  document.addEventListener('keydown', event => {
    if (!menuOpen) return;
    if (event.key === 'Escape') { event.preventDefault(); setMenu(false, true); }
    if (event.key === 'Tab') {
      const focusable = [...sidebar.querySelectorAll('a[href], button')].filter(item => item.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  media.addEventListener('change', () => setMenu(false));
  window.addEventListener('hashchange', () => showPage());
  document.getElementById('print-button').addEventListener('click', () => window.print());
  showPage(true);
})();
