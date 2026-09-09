(() => {
  const pages = [...document.querySelectorAll('.lesson-pane')];
  const links = [...document.querySelectorAll('.lesson-link')];
  const sidebar = document.getElementById('sidebar');
  const shade = document.getElementById('mobile-shade');
  const menuButton = document.getElementById('open-menu');
  const closeButton = document.getElementById('close-menu');
  const fullscreenButton = document.getElementById('fullscreen-button');
  const viewStatus = document.getElementById('view-status');
  const copyButton = document.getElementById('copy-button');
  const copyLabel = document.getElementById('copy-label');
  const copyStatus = document.getElementById('copy-status');
  const media = window.matchMedia('(max-width: 959px)');
  let menuOpen = false;
  let fullscreenMode = false;
  let fullscreenPending = false;
  let copyFeedbackTimer;

  function copyWithSelection(markdown) {
    const focused = document.activeElement;
    const selection = window.getSelection();
    const ranges = selection ? Array.from({ length: selection.rangeCount }, (_, index) => selection.getRangeAt(index).cloneRange()) : [];
    const field = document.createElement('textarea');
    field.value = markdown;
    field.readOnly = true;
    field.className = 'clipboard-field';
    field.setAttribute('aria-label', 'Markdown da página atual');
    document.body.append(field);
    try {
      field.focus({ preventScroll: true });
      field.select();
      if (!document.execCommand('copy')) throw new Error('Cópia indisponível.');
    } finally {
      field.remove();
      focused?.focus({ preventScroll: true });
      if (selection) {
        selection.removeAllRanges();
        ranges.forEach(range => selection.addRange(range));
      }
    }
  }

  async function copyPageMarkdown() {
    if (copyButton.disabled) return;
    const page = pages.find(item => !item.hidden);
    const markdown = JSON.parse(page.querySelector('.lesson-markdown').textContent);
    const focused = document.activeElement;
    clearTimeout(copyFeedbackTimer);
    copyStatus.textContent = '';
    copyStatus.removeAttribute('data-error');
    copyButton.disabled = true;
    copyLabel.textContent = 'Copiando…';
    try {
      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(markdown);
        } catch {
          copyWithSelection(markdown);
        }
      } else {
        copyWithSelection(markdown);
      }
      copyLabel.textContent = 'Copiado!';
      copyStatus.textContent = `Página copiada em Markdown (${page.dataset.label}). Anotações originais incluídas.`;
    } catch {
      copyLabel.textContent = 'Tentar novamente';
      copyStatus.dataset.error = 'true';
      copyStatus.textContent = 'Não foi possível copiar. Verifique a permissão de cópia do navegador e tente novamente.';
    } finally {
      copyButton.disabled = false;
      if (focused === copyButton && document.activeElement === document.body) copyButton.focus({ preventScroll: true });
      copyFeedbackTimer = setTimeout(() => {
        copyLabel.textContent = 'Copiar Markdown';
        copyStatus.textContent = '';
      }, 5000);
    }
  }

  function updateBreadcrumb() {
    const page = pages.find(item => !item.hidden);
    document.getElementById('breadcrumb').textContent = fullscreenMode
      ? page.dataset.label + ' · ' + page.dataset.title
      : page.dataset.group;
  }

  function setMenu(open, restoreFocus = false) {
    const drawer = media.matches || fullscreenMode;
    menuOpen = open && drawer;
    sidebar.classList.toggle('is-open', menuOpen);
    shade.hidden = !menuOpen;
    menuButton.setAttribute('aria-expanded', String(menuOpen));
    sidebar.inert = drawer && !menuOpen;
    document.querySelector('.workspace').inert = menuOpen;
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    if (menuOpen) closeButton.focus();
    else if (restoreFocus && drawer) menuButton.focus();
  }

  function setFullscreenMode(active, restoreFocus = false) {
    fullscreenMode = active;
    document.documentElement.classList.toggle('is-fullscreen', active);
    fullscreenButton.setAttribute('aria-pressed', String(active));
    fullscreenButton.setAttribute('aria-label', active ? 'Sair da tela cheia' : 'Entrar em tela cheia');
    fullscreenButton.title = active ? 'Sair da tela cheia (Esc)' : 'Entrar em tela cheia';
    document.getElementById('fullscreen-label').textContent = active ? 'Sair da tela cheia' : 'Tela cheia';
    fullscreenButton.querySelector('.fullscreen-enter').hidden = active;
    fullscreenButton.querySelector('.fullscreen-exit').hidden = !active;
    fullscreenButton.querySelector('.fullscreen-hint').hidden = !active;
    updateBreadcrumb();
    setMenu(false);
    if (restoreFocus) fullscreenButton.focus({ preventScroll: true });
  }

  async function toggleFullscreen() {
    if (fullscreenPending) return;
    fullscreenPending = true;
    fullscreenButton.disabled = true;
    try {
      if (fullscreenMode) {
        if (document.fullscreenElement) await document.exitFullscreen();
        setFullscreenMode(false);
        viewStatus.textContent = 'Visualização normal restaurada.';
      } else {
        setFullscreenMode(true);
        // Keep the expanded layout available in browsers that cannot enter fullscreen.
        if (document.fullscreenEnabled && document.documentElement.requestFullscreen) {
          try {
            await document.documentElement.requestFullscreen();
          } catch {
            // The browser may deny fullscreen; the reading layout still works.
          }
        }
        viewStatus.textContent = document.fullscreenElement
          ? 'Tela cheia ativada. Pressione Esc para sair.'
          : 'Visualização ampliada ativada nesta janela. Use o botão Sair da tela cheia ou pressione Esc para voltar.';
      }
    } catch {
      viewStatus.textContent = 'Não foi possível sair da tela cheia. Pressione Esc para sair.';
    } finally {
      fullscreenPending = false;
      fullscreenButton.disabled = false;
      fullscreenButton.focus({ preventScroll: true });
    }
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
    updateBreadcrumb();
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
    if (event.key === 'Escape') {
      if (menuOpen) { event.preventDefault(); setMenu(false, true); }
      else if (fullscreenMode) { event.preventDefault(); void toggleFullscreen(); }
      return;
    }
    if (!menuOpen) return;
    if (event.key === 'Tab') {
      const focusable = [...sidebar.querySelectorAll('a[href], button')].filter(item => item.getClientRects().length);
      const first = focusable[0], last = focusable.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  fullscreenButton.addEventListener('click', toggleFullscreen);
  copyButton.addEventListener('click', copyPageMarkdown);
  document.addEventListener('fullscreenchange', () => {
    const active = Boolean(document.fullscreenElement);
    setFullscreenMode(active, !active);
    if (!active) viewStatus.textContent = 'Visualização normal restaurada.';
  });
  media.addEventListener('change', () => setMenu(false));
  window.addEventListener('hashchange', () => showPage());
  document.getElementById('print-button').addEventListener('click', () => window.print());
  showPage(true);
  fullscreenButton.hidden = false;
  copyButton.hidden = false;
})();
