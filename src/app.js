(() => {
  const pages = [...document.querySelectorAll('.lesson-pane')];
  const links = [...document.querySelectorAll('.lesson-link')];
  const reviewPages = pages.filter(page => page.dataset.reviewable === 'true');
  const reviewPageById = new Map(reviewPages.map(page => [page.id, page]));
  const reviewIntervals = [1, 3, 7, 14, 30];
  const reviewStorageKey = 'english-notes-spaced-reviews-v1';
  let reviewRecords = Object.create(null);
  let reviewStorageAvailable = true;
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
    const markdownNode = page?.querySelector('.lesson-markdown');
    if (!markdownNode) return;
    const markdown = JSON.parse(markdownNode.textContent);
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
    const fallbackPage = pages.find(item => item.dataset.reviewable === 'true') || pages[0];
    const page = anchor?.closest('.lesson-pane') || fallbackPage;
    const changed = page.hidden;
    pages.forEach(item => { item.hidden = item !== page; });
    links.forEach(link => {
      if (link.hash === '#' + page.id) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    updateBreadcrumb();
    document.title = page.dataset.title + ' — English Notes';
    copyButton.hidden = page.id === 'revisoes';
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
  const reviewRatingLabels = { forgot: 'Esqueci', hard: 'Com esforço', good: 'Lembrei bem' };

  function localDayNumber(value) {
    const date = value instanceof Date ? value : new Date(value);
    return Math.floor(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) / 86400000);
  }

  function formatReviewDate(value) {
    return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(value)).replace(/\.$/, '');
  }

  function reviewDayDifference(value) {
    return localDayNumber(value) - localDayNumber(Date.now());
  }

  function formatReviewRelative(value) {
    const difference = reviewDayDifference(value);
    if (difference === 0) return 'hoje';
    if (difference === 1) return 'amanhã';
    if (difference === -1) return 'há 1 dia';
    if (difference < 0) return `há ${Math.abs(difference)} dias`;
    return `em ${difference} dias`;
  }

  function loadReviewRecords() {
    let stored;
    try {
      stored = window.localStorage.getItem(reviewStorageKey);
    } catch {
      reviewStorageAvailable = false;
      return;
    }
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return;
      for (const [id, record] of Object.entries(parsed)) {
        if (!reviewPageById.has(id) || !record || !Number.isInteger(record.step) || record.step < 0 || record.step >= reviewIntervals.length) continue;
        if (!Number.isFinite(record.lastReviewedAt) || !Number.isFinite(record.nextDueAt)) continue;
        if (!Object.hasOwn(reviewRatingLabels, record.lastRating)) continue;
        reviewRecords[id] = {
          step: record.step,
          lastReviewedAt: record.lastReviewedAt,
          nextDueAt: record.nextDueAt,
          lastRating: record.lastRating,
          totalReviews: Number.isInteger(record.totalReviews) && record.totalReviews > 0 ? record.totalReviews : 1,
          history: Array.isArray(record.history) ? record.history.filter(item => item && Number.isFinite(item.at) && Object.hasOwn(reviewRatingLabels, item.rating)).slice(-500) : [],
        };
      }
    } catch {
      // Ignore an invalid saved value and let the learner start a fresh review history.
    }
  }

  function saveReviewRecords() {
    try {
      window.localStorage.setItem(reviewStorageKey, JSON.stringify(reviewRecords));
      reviewStorageAvailable = true;
    } catch {
      reviewStorageAvailable = false;
    }
  }

  function reviewDateAfter(days) {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + days);
    return date.getTime();
  }

  function renderReviewPanels() {
    document.querySelectorAll('[data-review-panel]').forEach(panel => {
      const record = reviewRecords[panel.dataset.reviewLesson];
      const state = panel.querySelector('[data-review-state]');
      const next = panel.querySelector('[data-review-next]');
      const buttons = [...panel.querySelectorAll('[data-review-rating]')];
      if (!record) {
        state.textContent = 'Ainda sem revisões registradas.';
        next.textContent = 'A primeira marcação agenda a próxima revisão para amanhã.';
        buttons.forEach(button => { button.disabled = false; });
        return;
      }
      const difference = reviewDayDifference(record.nextDueAt);
      const markedToday = localDayNumber(record.lastReviewedAt) === localDayNumber(Date.now());
      state.textContent = markedToday ? 'A revisão de hoje já foi registrada.'
        : difference < 0 ? `Revisão atrasada ${formatReviewRelative(record.nextDueAt)}.`
          : difference === 0 ? 'Revisão prevista para hoje.' : `Próxima revisão ${formatReviewRelative(record.nextDueAt)}.`;
      next.textContent = `Etapa ${record.step + 1} de ${reviewIntervals.length} · ${reviewIntervals[record.step]} ${reviewIntervals[record.step] === 1 ? 'dia' : 'dias'} · última resposta: ${reviewRatingLabels[record.lastRating]}.`;
      buttons.forEach(button => { button.disabled = markedToday; });
    });
  }

  function reviewTaskMarkup(page, record, due) {
    const date = escapeHtml(formatReviewDate(record.nextDueAt));
    const relative = escapeHtml(formatReviewRelative(record.nextDueAt));
    const title = escapeHtml(page.dataset.title);
    const label = escapeHtml(page.dataset.label);
    const stage = `Etapa ${record.step + 1} de ${reviewIntervals.length} · ${reviewIntervals[record.step]} ${reviewIntervals[record.step] === 1 ? 'dia' : 'dias'}`;
    const dueLabel = relative === 'hoje' ? 'vence hoje' : `atrasada ${relative}`;
    const meta = due ? `${label} · ${dueLabel}` : `${label} · ${date} · ${relative}`;
    return `<article class="review-task"><div><h3 class="review-task-title">${title}</h3><p class="review-task-meta">${meta}</p></div><span class="review-task-stage">${stage}</span><a class="review-task-link" href="${'#' + encodeURIComponent(page.id)}">Abrir aula <span aria-hidden="true">→</span></a></article>`;
  }

  function renderReviewDashboard() {
    const today = localDayNumber(Date.now());
    const entries = reviewPages.map(page => ({ page, record: reviewRecords[page.id] })).filter(item => item.record);
    const due = entries.filter(item => localDayNumber(item.record.nextDueAt) <= today).sort((a, b) => a.record.nextDueAt - b.record.nextDueAt);
    const upcoming = entries.filter(item => localDayNumber(item.record.nextDueAt) > today).sort((a, b) => a.record.nextDueAt - b.record.nextDueAt);
    const unstarted = reviewPages.filter(page => !reviewRecords[page.id]);
    const dueCount = due.length;
    const dueBadge = document.getElementById('review-nav-count');
    dueBadge.textContent = String(dueCount);
    dueBadge.hidden = dueCount === 0;
    dueBadge.setAttribute('aria-label', `${dueCount} ${dueCount === 1 ? 'revisão para hoje' : 'revisões para hoje'}`);
    document.getElementById('review-due-count').textContent = String(dueCount);
    document.getElementById('review-upcoming-count').textContent = String(upcoming.length);
    document.getElementById('review-unstarted-count').textContent = String(unstarted.length);
    document.getElementById('review-due-label').textContent = `${dueCount} ${dueCount === 1 ? 'aula' : 'aulas'}`;
    document.getElementById('review-upcoming-label').textContent = `${upcoming.length} ${upcoming.length === 1 ? 'aula' : 'aulas'}`;
    document.getElementById('review-due-list').innerHTML = due.map(item => reviewTaskMarkup(item.page, item.record, true)).join('');
    document.getElementById('review-upcoming-list').innerHTML = upcoming.map(item => reviewTaskMarkup(item.page, item.record, false)).join('');
    const dueEmpty = document.getElementById('review-due-empty');
    dueEmpty.hidden = dueCount > 0;
    if (dueCount === 0) {
      if (upcoming.length) dueEmpty.textContent = `Você está em dia. A próxima revisão vence ${formatReviewRelative(upcoming[0].record.nextDueAt)} (${formatReviewDate(upcoming[0].record.nextDueAt)}).`;
      else dueEmpty.textContent = 'Nenhuma revisão venceu ainda.';
    }
    const unstartedNote = document.getElementById('review-unstarted-note');
    unstartedNote.textContent = unstarted.length ? `${unstarted.length} ${unstarted.length === 1 ? 'aula ainda não tem' : 'aulas ainda não têm'} revisões registradas.` : 'Todas as aulas já entraram no ciclo de revisão.';
    const startLink = document.getElementById('review-start-link');
    const nextPage = unstarted[0] || due[0]?.page || upcoming[0]?.page;
    startLink.hidden = !nextPage;
    if (nextPage) {
      startLink.href = `#${encodeURIComponent(nextPage.id)}`;
      startLink.textContent = unstarted.length ? 'Começar pela próxima aula sem revisão' : 'Abrir uma aula';
    }
    document.getElementById('review-storage-warning').hidden = reviewStorageAvailable;
  }

  function registerReview(pageId, rating) {
    const page = reviewPageById.get(pageId);
    if (!page || !Object.hasOwn(reviewRatingLabels, rating)) return;
    const previous = reviewRecords[pageId];
    const now = Date.now();
    if (previous && localDayNumber(previous.lastReviewedAt) === localDayNumber(now)) {
      document.getElementById('review-status').textContent = `${page.dataset.title}: a revisão de hoje já foi registrada.`;
      return;
    }
    let step = 0;
    if (previous && rating === 'hard') step = previous.step;
    else if (previous && rating === 'good') step = Math.min(previous.step + 1, reviewIntervals.length - 1);
    const interval = reviewIntervals[step];
    const history = [...(previous?.history || []), { at: now, rating, intervalDays: interval }].slice(-500);
    const record = {
      step,
      lastReviewedAt: now,
      nextDueAt: reviewDateAfter(interval),
      lastRating: rating,
      totalReviews: (previous?.totalReviews || 0) + 1,
      history,
    };
    reviewRecords[pageId] = record;
    saveReviewRecords();
    renderReviewPanels();
    renderReviewDashboard();
    document.getElementById('review-status').textContent = `${page.dataset.title}: revisão registrada. Próxima em ${interval} ${interval === 1 ? 'dia' : 'dias'}, ${formatReviewDate(record.nextDueAt)}.`;
  }

  document.addEventListener('click', event => {
    const button = event.target.closest('[data-review-rating]');
    if (!button || button.disabled) return;
    const panel = button.closest('[data-review-panel]');
    if (panel) registerReview(panel.dataset.reviewLesson, button.dataset.reviewRating);
  });

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
  loadReviewRecords();
  renderReviewPanels();
  renderReviewDashboard();
  showPage(true);
  searchButton.hidden = false;
  fullscreenButton.hidden = false;
})();
