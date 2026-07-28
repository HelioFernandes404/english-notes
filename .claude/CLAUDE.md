# Joao English Class

Projeto para notas de aulas particulares de inglês com João.

## Estrutura

- `lessons/` — resumos diretos de aulas (sem template)
- `vocabulary.md` — palavras aprendidas
- `grammar-tips.md` — regras/explicações
- `doubts.md` — dúvidas pendentes

## Instrções pra Claude

1. **Aulas:** criar arquivo `lessons/aula-[numero]-[data].md` com resumo direto. Sem template, sem estrutura forçada.
2. **Vocabulary:** adicionar palavras novas ao `vocabulary.md` conforme aprende.
3. **Grammar:** salvar regras/explicações em `grammar-tips.md`.
4. **Dúvidas:** registrar dúvidas em `doubts.md` e marcar como resolvido quando esclarecido.

## Nomenclatura

- Aulas: `aula-01-28-07.md`, `aula-02-04-08.md`
- Simples, sem filler, direto ao ponto.

## NotebookLM

Todas aulas sincronizam com notebook único no NotebookLM: **"All Might English"** (ID: `f20883a9-bb2e-4db0-aa7b-9ab1e8f3f2d0`).

- Local (`lessons/*.md`) é a fonte de verdade / cópia de trabalho.
- Após criar/editar arquivo de aula, adicionar como source no NotebookLM:
  ```
  notebooklm use f20883a9
  notebooklm source add lessons/aula-XX-DD-MM.md
  ```
- CLI instalada via `uv tool install "notebooklm-py[browser]"`. Skill em `~/.claude/skills/notebooklm`.
