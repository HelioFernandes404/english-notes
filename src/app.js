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
      if (searchDialog.open) return;
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

  // Search: MiniSearch index built in the browser from the section data inlined at build time.
  const searchDialog = document.getElementById('search-dialog');
  const searchButton = document.getElementById('search-button');
  const searchInput = document.getElementById('search-input');
  const searchList = document.getElementById('search-results');
  const searchHint = document.getElementById('search-hint');
  const chips = [...document.querySelectorAll('.search-chip')];
  const searchHelp = 'Dicas: "frase exata", -excluir, tag:verbos. Setas e Enter para navegar.';
  let searchIndex, searchDocs, searchScope = 'all', activeResult = -1, searchTimer;
  const fold = value => value.replace(/[^\u0000-\u007f]/g, char => char.normalize('NFD')[0]).toLowerCase();
  const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const escapeRegex = value => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  function ensureIndex() {
    if (searchIndex) return;
    searchDocs = JSON.parse(document.getElementById('search-data').textContent);
    searchIndex = new MiniSearch({
      fields: ['heading', 'text', 'title', 'tags'],
      storeFields: ['lesson', 'label', 'title', 'group', 'tags', 'target', 'heading', 'text', 'original'],
      processTerm: fold,
      searchOptions: { boost: { heading: 3, title: 2, tags: 2 }, prefix: true, fuzzy: term => term.length > 4 ? 0.2 : false, combineWith: 'AND' },
    });
    searchIndex.addAll(searchDocs);
  }

  function parseQuery(raw) {
    const query = { terms: [], phrases: [], excluded: [], tags: [] };
    for (const match of raw.matchAll(/(-?)"([^"]+)"|(-?)(\S+)/g)) {
      const negative = Boolean(match[1] || match[3]), phrase = match[2], word = match[4];
      if (phrase) (negative ? query.excluded : query.phrases).push(fold(phrase));
      else if (negative && word) query.excluded.push(fold(word));
      else if (/^tag:/i.test(word)) { if (word.length > 4) query.tags.push(fold(word.slice(4))); }
      else query.terms.push(word);
    }
    query.terms.push(...query.phrases);
    return query;
  }

  function runSearch(raw) {
    ensureIndex();
    const query = parseQuery(raw);
    const text = query.terms.join(' ');
    let results;
    if (text.trim()) {
      results = searchIndex.search(text);
    } else if (query.tags.length) {
      results = searchDocs.filter(doc => doc.heading === '' && !doc.original).map(doc => ({ ...doc, terms: [], score: 0 }));
    } else return [];
    return results.filter(result => {
      if (searchScope === 'review' && result.original) return false;
      if (searchScope === 'notes' && !result.original) return false;
      const haystack = fold(result.heading + ' ' + result.text);
      const tags = fold(result.tags);
      return query.phrases.every(phrase => haystack.includes(phrase))
        && query.excluded.every(term => !haystack.includes(term))
        && query.tags.every(tag => tags.includes(tag));
    }).map(result => Object.assign(result, { queryTerms: [...new Set([...(result.terms || []), ...query.phrases])] }));
  }

  function highlight(value, terms) {
    if (!terms.length) return escapeHtml(value);
    const folded = fold(value);
    const pattern = new RegExp('(?<![a-z0-9])(' + terms.sort((a, b) => b.length - a.length).map(escapeRegex).join('|') + ')', 'g');
    let out = '', last = 0;
    for (const match of folded.matchAll(pattern)) {
      out += escapeHtml(value.slice(last, match.index)) + '<mark>' + escapeHtml(value.slice(match.index, match.index + match[0].length)) + '</mark>';
      last = match.index + match[0].length;
    }
    return out + escapeHtml(value.slice(last));
  }

  function snippet(result) {
    const text = result.text;
    const pattern = result.queryTerms.length ? new RegExp('(?<![a-z0-9])(' + result.queryTerms.map(escapeRegex).join('|') + ')') : null;
    const at = pattern ? fold(text).search(pattern) : -1;
    const start = Math.max(0, at < 0 ? 0 : at - 50);
    const piece = text.slice(start, start + 160).trim();
    return highlight((start > 0 ? '… ' : '') + piece + (start + 160 < text.length ? ' …' : ''), result.queryTerms);
  }

  function setActive(index) {
    const items = [...searchList.children];
    activeResult = items.length ? (index + items.length) % items.length : -1;
    items.forEach((item, position) => item.setAttribute('aria-selected', String(position === activeResult)));
    if (activeResult >= 0) {
      searchInput.setAttribute('aria-activedescendant', items[activeResult].id);
      items[activeResult].scrollIntoView({ block: 'nearest' });
    } else searchInput.removeAttribute('aria-activedescendant');
  }

  function renderResults() {
    const raw = searchInput.value.trim();
    searchList.replaceChildren();
    if (!raw) { searchHint.textContent = searchHelp; setActive(-1); return; }
    const results = runSearch(raw).slice(0, 30);
    searchList.innerHTML = results.map((result, position) => `<li id="search-result-${position}" role="option" aria-selected="false" data-target="${escapeHtml(result.target)}"><span class="search-result-meta">${escapeHtml(result.label)} · ${escapeHtml(result.title)}${result.original ? '<span class="search-badge">Anotações originais</span>' : ''}</span>${result.heading ? `<span class="search-result-heading">${highlight(result.heading, result.queryTerms)}</span>` : ''}<span class="search-result-snippet">${snippet(result)}</span></li>`).join('');
    searchHint.textContent = results.length ? `${results.length} ${results.length === 1 ? 'resultado' : 'resultados'}. ${searchHelp}` : 'Nenhum resultado. Tente menos termos ou outro filtro.';
    setActive(results.length ? 0 : -1);
  }

  function openResult(item) {
    if (!item) return;
    const target = item.dataset.target;
    searchDialog.close();
    if (location.hash === '#' + target) showPage();
    else location.hash = target;
  }

  function openSearch() {
    if (searchDialog.open) return;
    setMenu(false);
    searchDialog.showModal();
    searchInput.select();
    renderResults();
  }

  searchButton.addEventListener('click', openSearch);
  document.getElementById('search-close').addEventListener('click', () => searchDialog.close());
  searchDialog.addEventListener('click', event => { if (event.target === searchDialog) searchDialog.close(); });
  searchDialog.addEventListener('close', () => searchButton.focus({ preventScroll: true }));
  searchInput.addEventListener('input', () => { clearTimeout(searchTimer); searchTimer = setTimeout(renderResults, 80); });
  searchList.addEventListener('click', event => openResult(event.target.closest('li')));
  chips.forEach(chip => chip.addEventListener('click', () => {
    searchScope = chip.dataset.scope;
    chips.forEach(item => item.setAttribute('aria-pressed', String(item === chip)));
    renderResults();
    searchInput.focus();
  }));
  searchInput.addEventListener('keydown', event => {
    if (event.key === 'ArrowDown') { event.preventDefault(); setActive(activeResult + 1); }
    else if (event.key === 'ArrowUp') { event.preventDefault(); setActive(activeResult - 1); }
    else if (event.key === 'Enter') { event.preventDefault(); openResult(searchList.children[activeResult]); }
  });
  document.addEventListener('keydown', event => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement?.tagName) || document.activeElement?.isContentEditable;
    if ((event.key === 'k' && (event.ctrlKey || event.metaKey)) || (event.key === '/' && !typing && !event.ctrlKey && !event.metaKey && !event.altKey)) {
      event.preventDefault();
      openSearch();
    }
  });
  showPage(true);
  searchButton.hidden = false;
  fullscreenButton.hidden = false;
  copyButton.hidden = false;
})();
