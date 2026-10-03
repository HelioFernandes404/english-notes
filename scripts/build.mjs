import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { Marked } from 'marked';
import { lessons, groups, sourceDirectories } from '../src/lessons.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const escape = text => String(text).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const slug = text => text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const iconPaths = {
  book: '<path d="M12 6c-3-2-6-2-9-1v14c3-1 6-1 9 1m0-14c3-2 6-2 9-1v14c-3-1-6-1-9 1V6Z"/>',
  print: '<path d="M6 9V3h12v6M6 18H3V9h18v9h-3M6 14h12v7H6z"/><path d="M17 12h1"/>',
  copy: '<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3"/>',
  menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
  close: '<path d="m6 6 12 12M6 18 18 6"/>',
  expand: '<path d="M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5"/>',
  collapse: '<path d="M3 8h5V3m8 0v5h5M8 21v-5H3m18 0h-5v5"/>',
  arrow: '<path d="M4 12h16m-6-6 6 6-6 6"/>',
  back: '<path d="M20 12H4m6-6-6 6 6 6"/>',
  chevron: '<path d="m9 5 7 7-7 7"/>',
  bulb: '<path d="M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 .8-1 1.8-1 2H9c0-.2 0-1.2-1-2Z"/>',
  pencil: '<path d="m15 4 5 5M4 20l5-1L21 7a2 2 0 0 0 0-3l-1-1a2 2 0 0 0-3 0L5 15l-1 5Z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v5m0-9v.1"/>',
};
const icon = name => `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name]}</svg>`;

function renderMarkdown(markdown, prefix, toc = []) {
  const used = new Map();
  const parser = new Marked({ gfm: true, breaks: false, renderer: {
    heading({ tokens, depth }) {
      const title = this.parser.parseInline(tokens);
      const plain = title.replace(/<[^>]*>/g, '');
      const base = `${prefix}-${slug(plain)}`;
      const count = used.get(base) || 0;
      used.set(base, count + 1);
      const id = count ? `${base}-${count + 1}` : base;
      if (depth === 2) toc.push({ id, title: plain });
      return `<h${depth} id="${id}">${title}</h${depth}>\n`;
    },
    html({ text }) {
      // Only the line breaks and text of the source notes are needed in the notebook.
      return escape(text).replace(/&lt;br\s*\/?&gt;/gi, '<br>').replace(/&lt;\/?aside&gt;/gi, '');
    },
    link({ href, tokens }) {
      const label = this.parser.parseInline(tokens);
      return /^(https?:\/\/|#)/i.test(href) ? `<a href="${escape(href)}" rel="noreferrer">${label}</a>` : label;
    },
    image({ text }) { return escape(text); }
  }});
  return parser.parse(markdown).replace(/<table>/g, '<div class="table-scroll" role="region" aria-label="Tabela de estudo" tabindex="0"><table>').replace(/<\/table>/g, '</table></div>');
}

const decode = text => text.replace(/&(amp|lt|gt|quot|#39);/g, (_, name) => ({ amp: '&', lt: '<', gt: '>', quot: '"', '#39': "'" }[name]));
const plainText = html => decode(html.replace(/<(br|\/p|\/li|\/tr|\/h\d)\s*>/gi, ' ').replace(/<[^>]*>/g, '')).replace(/\s+/g, ' ').trim();

// One search document per heading section, so each result links to a real anchor.
function searchSections(html, fallbackTarget) {
  const parts = html.split(/<h[1-6] id="([^"]+)">(.*?)<\/h[1-6]>/gs);
  const sections = [{ target: fallbackTarget, heading: '', text: plainText(parts[0]) }];
  for (let i = 1; i < parts.length; i += 3) sections.push({ target: parts[i], heading: plainText(parts[i + 1]), text: plainText(parts[i + 2]) });
  return sections.filter(section => section.heading || section.text);
}

function normalizeNotes(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  // Meeting exports use unindented plain text as headings and indented text as lists.
  if (lines[0].startsWith("Hélio's")) {
    return lines.map((line, index) => {
      if (index === 0) return `## ${line}`;
      if (/^VIEW RECORDING:\s*$/.test(line)) return '';
      if (line && !/^\s/.test(line) && !line.startsWith('#')) return `### ${line}`;
      return line;
    }).join('\n');
  }
  return text;
}

const sourceFiles = (await Promise.all(sourceDirectories.map(async dir => (await readdir(join(root, dir))).filter(name => name.endsWith('.md')).map(name => `${dir}/${name}`)))).flat();
for (const file of sourceFiles) {
  if (!lessons.some(lesson => lesson.source === file)) throw new Error(`Material não incluído: ${file}`);
}
if (!lessons.length || new Set(lessons.map(lesson => lesson.id)).size !== lessons.length) throw new Error('Índice vazio ou com identificadores duplicados.');
if (new Set(lessons.map(lesson => lesson.source)).size !== lessons.length) throw new Error('Um material foi incluído mais de uma vez.');
if (new Set(groups.map(group => group.id)).size !== groups.length) throw new Error('Grupos com identificadores duplicados.');
for (const lesson of lessons) {
  if (!sourceFiles.includes(lesson.source)) throw new Error(`Fonte fora das pastas cadastradas ou inexistente: ${lesson.source}`);
  if (!groups.some(group => group.id === lesson.group)) throw new Error(`Grupo inexistente: ${lesson.group}`);
  for (const relatedId of lesson.related || []) {
    if (!lessons.some(item => item.id === relatedId)) throw new Error(`Referência de estudo inexistente: ${relatedId}`);
  }
}

const classes = lessons.filter(lesson => lesson.group !== 'apoio');
const lessonCount = classes.length;
const supportCount = lessons.length - lessonCount;
const lessonSummary = `${lessonCount} ${lessonCount === 1 ? 'aula' : 'aulas'}`;
const supportSummary = `${supportCount} ${supportCount === 1 ? 'material' : 'materiais'} de apoio`;
const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const dates = classes.map(lesson => {
  const match = /^(\d{2}) ([A-Z]{3}) (\d{4})$/.exec(lesson.date);
  const month = match ? months.indexOf(match[2]) : -1;
  if (month < 0) throw new Error(`Data da aula inválida (use DD MMM AAAA): ${lesson.id}`);
  const day = Number(match[1]), year = Number(match[3]);
  const timestamp = Date.UTC(year, month, day);
  const date = new Date(timestamp);
  if (date.getUTCDate() !== day || date.getUTCFullYear() !== year) throw new Error(`Data da aula inexistente: ${lesson.id}`);
  return { timestamp, month, year };
}).sort((a, b) => a.timestamp - b.timestamp);
const first = dates[0], last = dates.at(-1);
const monthLabel = date => months[date.month][0] + months[date.month].slice(1).toLowerCase();
const period = !first ? 'Materiais de apoio'
  : first.year !== last.year ? `${monthLabel(first)} ${first.year} — ${monthLabel(last)} ${last.year}`
  : first.month !== last.month ? `${monthLabel(first)} — ${monthLabel(last)} ${first.year}`
  : `${monthLabel(first)} ${first.year}`;
const years = !first ? '' : first.year === last.year ? String(first.year) : `${first.year} — ${last.year}`;

const reviewNavigation = `<section class="nav-group review-nav-group"><h2 class="nav-group-label"><span>Estudo</span></h2><a href="#revisoes" class="lesson-link review-nav-link"><span class="nav-num" aria-hidden="true">↻</span><span class="nav-title">Revisões</span><span class="review-nav-count" id="review-nav-count" hidden></span><span class="nav-arrow" aria-hidden="true">↗</span></a></section>`;
const navigation = reviewNavigation + groups.map(group => {
  const items = lessons.filter(lesson => lesson.group === group.id);
  return `<section class="nav-group"><h2 class="nav-group-label"><span>${group.title}</span><span>${String(items.length).padStart(2, '0')}</span></h2>${items.map(lesson => `<a href="#${lesson.id}" class="lesson-link"${lesson === lessons[0] ? ' aria-current="page"' : ''}><span class="nav-num">${lesson.number}</span><span class="nav-title">${escape(lesson.nav)}</span><span class="nav-arrow" aria-hidden="true">↗</span></a>`).join('')}</section>`;
}).join('');

const firstReviewable = lessons.find(lesson => lesson.group !== 'apoio') || lessons[0];
const reviewDashboard = `<section class="lesson-pane review-dashboard" id="revisoes" data-title="Revisões" data-label="Estudo" data-group="Revisões" data-reviewable="false" hidden aria-labelledby="revisoes-title">
  <div class="lesson-layout review-dashboard-layout">
    <article class="paper">
      <header class="paper-header"><div class="lesson-kicker">ESTUDO <span class="mx-1 text-slate-300">/</span> ESPAÇAMENTO</div><h1 id="revisoes-title" class="lesson-title" tabindex="-1">Revisões</h1><p class="description">Retome as aulas no momento certo. As marcações ficam salvas neste navegador.</p>
        <div class="review-summary" aria-label="Resumo das revisões">
          <div class="review-summary-item"><strong id="review-due-count">0</strong><span>para hoje</span></div>
          <div class="review-summary-item"><strong id="review-upcoming-count">0</strong><span>programadas</span></div>
          <div class="review-summary-item"><strong id="review-unstarted-count">0</strong><span>sem início</span></div>
        </div>
      </header>
      <div class="paper-body">
        <div class="review-intervals" aria-label="Sequência de intervalos"><span class="review-intervals-label">Intervalos</span><ol><li>1 dia</li><li>3 dias</li><li>7 dias</li><li>14 dias</li><li>30 dias</li></ol></div>
        <p class="review-rules">Esqueci: volta a 1 dia · Com esforço: repete o intervalo · Lembrei bem: avança na sequência. Depois de 30 dias, a revisão se repete mensalmente.</p>
        <section class="review-dashboard-section" aria-labelledby="review-due-title"><div class="review-section-heading"><h2 id="review-due-title">Para revisar hoje</h2><span id="review-due-label" class="review-section-count">0 aulas</span></div><div id="review-due-list" class="review-task-list"></div><div id="review-due-empty" class="review-empty" hidden></div></section>
        <section class="review-dashboard-section" aria-labelledby="review-upcoming-title"><div class="review-section-heading"><h2 id="review-upcoming-title">Próximas revisões</h2><span id="review-upcoming-label" class="review-section-count">0 aulas</span></div><div id="review-upcoming-list" class="review-task-list"></div><div id="review-upcoming-empty" class="review-empty" hidden>Nenhuma próxima revisão programada.</div></section>
        <p id="review-unstarted-note" class="review-unstarted-note"></p>
        <a id="review-start-link" class="review-start-link" href="#${firstReviewable.id}">Abrir uma aula</a>
        <p id="review-storage-warning" class="review-storage-warning" role="status" hidden>Não foi possível salvar neste navegador. As marcações podem se perder ao fechar esta página.</p>
      </div>
    </article>
  </div>
</section>`;

const searchDocs = [];
const rendered = await Promise.all(lessons.map(async (lesson, index) => {
  const group = groups.find(group => group.id === lesson.group);
  const toc = [];
  const body = renderMarkdown(lesson.content, lesson.id, toc);
  const sourceMarkdown = await readFile(join(root, lesson.source), 'utf8');
  const original = renderMarkdown(normalizeNotes(sourceMarkdown), `${lesson.id}-original`);
  const label = lesson.group === 'apoio' ? `Material ${lesson.number}` : `Aula ${lesson.number}`;
  const searchBase = { lesson: lesson.id, order: index, label, title: lesson.title, group: group.id, tags: lesson.tags.join(' ') };
  searchDocs.push({ ...searchBase, id: `${lesson.id}:intro`, target: `${lesson.id}-title`, heading: '', text: [lesson.description, lesson.takeaway, lesson.review, lesson.correction].filter(Boolean).join(' '), original: false });
  searchSections(body, `${lesson.id}-title`).forEach((section, n) => searchDocs.push({ ...searchBase, ...section, id: `${lesson.id}:body:${n}`, original: false }));
  searchSections(original, `${lesson.id}-anotacoes`).forEach((section, n) => searchDocs.push({ ...searchBase, ...section, id: `${lesson.id}:notes:${n}`, original: true }));
  const related = lesson.related?.map(id => lessons.find(lesson => lesson.id === id)) || [];
  let reference;
  if (lesson.id === 'aula-11') reference = { title: 'British Council · Past simple', url: 'https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/past-simple' };
  if (['aula-03', 'aula-04', 'material-preposicoes'].includes(lesson.id)) reference = { title: 'British Council · Prepositions of time', url: 'https://learnenglish.britishcouncil.org/grammar/a1-a2-grammar/prepositions-of-time-at-in-on' };
  const references = reference ? `<p class="references">Consulta: <a href="${reference.url}" target="_blank" rel="noreferrer">${reference.title}</a>.</p>` : '';
  const spacedReview = lesson.group === 'apoio' ? '' : `<section class="spaced-review" data-review-panel data-review-lesson="${lesson.id}" aria-labelledby="${lesson.id}-spaced-review-title">
          <p class="spaced-review-kicker">Revisão espaçada</p>
          <h2 id="${lesson.id}-spaced-review-title">Como foi sua lembrança?</h2>
          <p class="spaced-review-help" data-review-state>Depois de revisar, escolha a opção que melhor descreve sua lembrança.</p>
          <div class="spaced-review-choices" role="group" aria-label="Avalie como lembrou o conteúdo">
            <button type="button" data-review-rating="forgot"><span>Esqueci</span><small>volta a 1 dia</small></button>
            <button type="button" data-review-rating="hard"><span>Com esforço</span><small>repete o intervalo</small></button>
            <button type="button" data-review-rating="good"><span>Lembrei bem</span><small>avança uma etapa</small></button>
          </div>
          <p class="spaced-review-next" data-review-next></p>
        </section>`;
  // Keep the Markdown in the standalone HTML so copying also works offline.
  const markdown = [
    `# ${lesson.title}`,
    `${label} · ${lesson.date} · ${group.title}`,
    lesson.description,
    `Tags: ${lesson.tags.join(', ')}`,
    `## Para guardar\n\n${lesson.takeaway}`,
    lesson.content.trim(),
    lesson.review ? `## Agora, com as suas palavras\n\n${lesson.review}` : '',
    lesson.correction ? `## Atenção na revisão\n\n${lesson.correction}` : '',
    '## Anotações originais',
    'Registro da aula, com rascunhos e respostas da época. Consulte os ajustes da revisão acima.',
    `Fonte: ${lesson.source}`,
    sourceMarkdown.trim(),
    reference ? `Consulta: [${reference.title}](${reference.url}).` : '',
  ].filter(Boolean).join('\n\n') + '\n';
  const adjacentLink = (item, next) => `<a class="page-nav-link${next ? ' next' : ''}" href="#${item.id}">${!next ? icon('back') : ''}<div><small>${next ? 'Próxima página' : 'Página anterior'}</small><p>${item.number} · ${escape(item.nav)}</p></div>${next ? icon('arrow') : ''}</a>`;
  return `<section class="lesson-pane" id="${lesson.id}" data-title="${escape(lesson.title)}" data-label="${label}" data-group="${escape(group.title)}" data-reviewable="${lesson.group !== 'apoio'}" data-date="${escape(lesson.date)}"${index ? ' hidden' : ''} aria-labelledby="${lesson.id}-title">
  <script type="application/json" class="lesson-markdown">${JSON.stringify(markdown).replace(/</g, '\\u003c')}</script>
  <div class="lesson-layout">
    <article class="paper">
      <header class="paper-header"><div class="lesson-kicker">${label.toUpperCase()} <span class="mx-1 text-slate-300">/</span> ${lesson.date}</div><h1 id="${lesson.id}-title" class="lesson-title" tabindex="-1">${escape(lesson.title)}</h1><p class="description">${escape(lesson.description)}</p><div class="mt-5 flex flex-wrap items-center gap-2">${lesson.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}<span class="ml-auto flex items-center gap-1.5 text-xs text-muted">${icon('book')} ${lesson.group === 'apoio' ? 'Atividades da aula' : 'Revisão da aula'}</span></div></header>
      <div class="paper-body">
        <div class="takeaway"><div class="takeaway-label">${icon('bulb')} Para guardar</div><p>${escape(lesson.takeaway)}</p></div>
        <div class="prose">${body}</div>
        ${lesson.review ? `<section class="review-callout" aria-label="Prática de revisão"><h2>${icon('pencil')} Agora, com as suas palavras</h2><p>${escape(lesson.review)}</p></section>` : ''}
        ${lesson.correction ? `<aside class="correction" aria-label="Ajuste das anotações"><strong>${icon('info')} Atenção na revisão</strong><p>${escape(lesson.correction)}</p></aside>` : ''}
        <details class="original-notes" id="${lesson.id}-anotacoes"${lesson.showOriginal ? ' open' : ''}><summary>${icon('book')} Anotações originais <span class="source-label">${lesson.group === 'apoio' ? 'Atividades e respostas' : lesson.shortDate}</span><span class="chevron">${icon('chevron')}</span></summary><p class="source-caption">Registro da aula, com rascunhos e respostas da época. Consulte os ajustes da revisão acima.<br>Fonte: ${escape(lesson.source)}</p><div class="prose source-content">${original}</div></details>
${references}${spacedReview}
      </div>
    </article>
    <aside class="reading-toc" aria-label="Nesta página"><p class="toc-heading">Nesta página</p><nav class="toc-list" aria-label="Seções de ${escape(label)}">${toc.map(entry => `<a href="#${entry.id}">${entry.title}</a>`).join('')}<a href="#${lesson.id}-anotacoes">Anotações originais</a></nav>${related.length ? `<div class="related"><p class="toc-heading">Continue o estudo</p>${related.map(item => `<a href="#${item.id}">${icon('arrow')}<span>${escape(item.nav)}</span></a>`).join('')}</div>` : ''}<p class="toc-folio" aria-hidden="true">${lesson.number}</p><p class="text-xs leading-relaxed text-muted">${group.description}</p></aside>
    <nav class="page-navigation" aria-label="Navegação entre páginas">${index > 0 ? adjacentLink(lessons[index - 1], false) : ''}${index < lessons.length - 1 ? adjacentLink(lessons[index + 1], true) : ''}</nav>
  </div></section>`;
}));

let html = await readFile(join(root, 'src/template.html'), 'utf8');
const templateValues = { 'lesson-summary': lessonSummary, 'support-summary': supportSummary, period, years };
html = html.replace(/\{\{(lesson-summary|support-summary|period|years)\}\}/g, (_, key) => escape(templateValues[key]));
html = html.replace('{{navigation}}', navigation).replace('{{lessons}}', [reviewDashboard, ...rendered].join('\n')).replace(/\{\{icon-([a-z]+)\}\}/g, (_, name) => icon(name));
await mkdir(join(root, '.build'), { recursive: true });
await writeFile(join(root, '.build/content.html'), html);
const cli = resolve(root, 'node_modules/@tailwindcss/cli/dist/index.mjs');
const result = spawnSync(process.execPath, [cli, '-i', 'src/notebook.css', '-o', '.build/notebook.css', '--minify'], { cwd: root, encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr || result.stdout || 'Falha ao compilar o Tailwind CSS.');
const css = await readFile(join(root, '.build/notebook.css'), 'utf8');
const script = await readFile(join(root, 'src/app.js'), 'utf8');
const searchLib = await readFile(join(root, 'node_modules/minisearch/dist/umd/index.js'), 'utf8');
searchDocs.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id, 'en', { numeric: true }));
const searchData = JSON.stringify(searchDocs.map(({ order, ...doc }) => doc)).replace(/</g, '\\u003c');
html = html.replace('/* NOTEBOOK_STYLES */', () => css).replace('/* SEARCH_DATA */', () => searchData).replace('/* SEARCH_LIB */', () => searchLib.replace(/<\/script/gi, '<\\/script').replace(/\/\/# sourceMappingURL=.*/, '')).replace('/* NOTEBOOK_SCRIPT */', () => script);
if (/\{\{[a-z-]+\}\}/.test(html)) throw new Error('Marcador de template não preenchido.');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
if (new Set(ids).size !== ids.length) throw new Error('IDs de navegação duplicados.');
for (const [, target] of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.includes(target)) throw new Error(`Link interno sem destino: ${target}`);
}
if (!css.includes('.flex{') || !css.includes('.bg-canvas{')) throw new Error('Classes Tailwind não foram compiladas.');
await writeFile(join(root, 'index.html'), html);
await mkdir(join(root, 'dist'), { recursive: true });
await writeFile(join(root, 'dist/index.html'), html);
console.log(`Caderno criado: ${lessons.length} páginas, ${sourceFiles.length} fontes Markdown, ${Math.round(Buffer.byteLength(html) / 1024)} KB. HTML completo, CSS Tailwind e JavaScript incorporados.`);
