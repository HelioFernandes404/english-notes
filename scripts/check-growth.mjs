import assert from 'node:assert/strict';
import { cp, mkdir, mkdtemp, readFile, writeFile, symlink, rm, realpath } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join, relative, isAbsolute } from 'node:path';
import { spawnSync } from 'node:child_process';
import { lessons, sourceDirectories } from '../src/lessons.mjs';

// Exercise adding a lesson in an isolated copy; no example lesson enters the notebook.
const root = fileURLToPath(new URL('../', import.meta.url));
await mkdir(join(root, '.build'), { recursive: true });
const buildRoot = await realpath(join(root, '.build'));
const fixture = await mkdtemp(join(buildRoot, 'growth-check-'));
try {
  for (const directory of ['src', 'scripts', ...sourceDirectories]) {
    await cp(join(root, directory), join(fixture, directory), { recursive: true });
  }
  await symlink(join(root, 'node_modules'), join(fixture, 'node_modules'), 'junction');
  const catalogPath = join(fixture, 'src/lessons.mjs');
  const catalog = await readFile(catalogPath, 'utf8');
  const sampleSource = 'passado/growth-check-fixture.md';
  await writeFile(join(fixture, sampleSource), '# Fixture de validação\n\nExemplo usado apenas na cópia temporária.\n');
  const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
  const lastTimestamp = Math.max(...lessons.filter(lesson => lesson.group !== 'apoio').map(lesson => {
    const [day, month, year] = lesson.date.split(' ');
    return Date.UTC(Number(year), months.indexOf(month), Number(day));
  }));
  const nextDate = new Date(lastTimestamp);
  nextDate.setUTCDate(1);
  nextDate.setUTCMonth(nextDate.getUTCMonth() + 1);
  const nextMonth = months[nextDate.getUTCMonth()];
  const expectedPeriodEnd = `${nextMonth[0]}${nextMonth.slice(1).toLowerCase()} ${nextDate.getUTCFullYear()}`;
  const sample = {
    ...lessons.find(lesson => lesson.group === 'passado'),
    id: 'aula-growth-check', number: '99', date: `01 ${nextMonth} ${nextDate.getUTCFullYear()}`, shortDate: `01/${String(nextDate.getUTCMonth() + 1).padStart(2, '0')}`,
    title: 'Fixture de crescimento', nav: 'Fixture de crescimento', source: sampleSource,
    content: '## Prática de teste\n\nConteúdo exclusivo da cópia temporária.', related: []
  };
  const grownCatalog = catalog + `\nlessons.splice(lessons.findIndex(lesson => lesson.group === 'apoio'), 0, ${JSON.stringify(sample)});\n`;
  await writeFile(catalogPath, grownCatalog);
  const build = () => spawnSync(process.execPath, ['scripts/build.mjs'], { cwd: fixture, encoding: 'utf8' });
  const first = build();
  assert.equal(first.status, 0, first.stderr);
  const html = await readFile(join(fixture, 'index.html'), 'utf8');
  const totalClasses = lessons.filter(lesson => lesson.group !== 'apoio').length + 1;
  assert.ok(html.includes(`${totalClasses} aulas`), 'Total de aulas não acompanhou a nova página.');
  assert.ok(html.includes(expectedPeriodEnd), 'Período não acompanhou a data da nova aula.');
  assert.equal([...html.matchAll(/class="lesson-pane"/g)].length, lessons.length + 1);
  for (const lesson of [...lessons, sample]) assert.ok(html.includes(`id="${lesson.id}"`));
  assert.ok(html.includes('Exemplo usado apenas na cópia temporária.'), 'Anotação original ausente.');
  assert.equal(await readFile(join(fixture, 'dist/index.html'), 'utf8'), html);

  const second = build();
  assert.equal(second.status, 0, second.stderr);
  assert.equal(await readFile(join(fixture, 'index.html'), 'utf8'), html, 'Repetir o build alterou ou duplicou o conteúdo.');

  await writeFile(catalogPath, grownCatalog + `\nlessons.push(${JSON.stringify({ ...sample, id: 'duplicada' })});\n`);
  const duplicate = build();
  assert.notEqual(duplicate.status, 0, 'Uma fonte duplicada foi aceita.');
  assert.match(duplicate.stderr, /incluído mais de uma vez/);
  await writeFile(catalogPath, grownCatalog + '\nlessons.find(lesson => lesson.id === "aula-growth-check").date = "31 FEV 2026";\n');
  const invalidDate = build();
  assert.notEqual(invalidDate.status, 0, 'Uma data inexistente foi aceita.');
  assert.match(invalidDate.stderr, /Data da aula inexistente/);
  console.log('OK: nova aula incluída; páginas antigas preservadas; totais e período atualizados; rebuild idempotente; fonte duplicada e data inválida rejeitadas.');
} finally {
  const resolvedFixture = await realpath(fixture);
  const withinBuild = relative(buildRoot, resolvedFixture);
  if (!withinBuild || withinBuild.startsWith('..') || isAbsolute(withinBuild) || !withinBuild.startsWith('growth-check-')) {
    throw new Error('Caminho de limpeza fora da pasta de verificação.');
  }
  await rm(resolvedFixture, { recursive: true, force: true });
}
