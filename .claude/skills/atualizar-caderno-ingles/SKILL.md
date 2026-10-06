---
name: atualizar-caderno-ingles
description: Adiciona ou revisa aulas e materiais de apoio no caderno de inglês (English Notes) e gera o index.html. Use ao receber notas de uma call de aula, o conteúdo/atividade usado na aula, ou ao pedir "adicione as novas aulas ao caderno".
---

# Atualizar o caderno de inglês

O caderno é gerado de `src/lessons.mjs` + Markdown originais por `node scripts/build.mjs`. A entrega é o `index.html` local (Tailwind e JS embutidos).

## O que chega

Uma aula costuma vir em dois arquivos:

| Arquivo | O que é | Pasta | Nome |
| --- | --- | --- | --- |
| Nota da call | Resumo da reunião ("Hélio's Class - …") | `presente/` ou `passado/` (pelo tema) | `NN-aula-DD-MM.md` (NN = próximo número de aula) |
| Conteúdo da aula | Página/atividade usada na call (Notion etc.) | `conteudo-das-aulas/` | slug do título em kebab-case, ex.: `it-wasnt-my-day.md` |

Se não estiver claro qual arquivo é qual, ou a qual aula o conteúdo pertence, pergunte. Um conteúdo pode servir a várias aulas; uma aula pode ter mais de um conteúdo. Pode chegar só um dos dois.

Copie os originais sem editar. Não altere Markdown já existente.

## Passos

1. Leia `src/lessons.mjs` inteiro e uma ou duas aulas recentes, para seguir o tom e a estrutura.
2. Salve os originais nas pastas acima. Nova pasta temática → cadastre em `sourceDirectories`; novo capítulo → `groups`.
3. Cadastre o **conteúdo** como material de apoio (se for novo):
   - `group: 'apoio'`, `id: 'material-<slug>'`, `number`: próxima letra (A, B, C, D… veja a última).
   - `date` / `shortDate` = data da aula em que foi usado.
   - Fica no fim da lista, junto dos outros materiais.
4. Cadastre a **aula** (antes dos materiais, em ordem cronológica):
   - `id: 'aula-NN'`, `number: 'NN'`, `date: 'DD MMM AAAA'` (meses em PT: JAN FEV MAR ABR MAI JUN JUL AGO SET OUT NOV DEZ), `shortDate: 'DD/MM'`.
   - `title`, `nav` (curto, para o índice), `description`, `tags`, `source`, `takeaway`, `content`, `review`, `correction`.
   - **`materials: ['material-<slug>']`** ligando a aula ao conteúdo usado nela. Se a aula usou um material antigo, ligue a ele também.
   - `related` é só para "continue o estudo" (outra aula). Não use `related` para materiais.
5. Revise o conteúdo: explique em português, exemplos em inglês, corrija erros das notas em `correction` sem apagar o original. Prefira contextos de trabalho (DevOps, Slack, code review).
6. Rode `node scripts/build.mjs` e `npm test`. Corrija qualquer erro do build.
7. Confira no `index.html`: cartão **Material da aula** na aula, **Usado nas aulas** no material, e que **Copiar Markdown** da aula inclui o material após `---`.

## Vínculo aula ↔ material

- O vínculo é declarado só na aula (`materials`). O material mostra o caminho de volta sozinho.
- O build falha se o ID não existir, não for do grupo `apoio`, estiver repetido, ou se um material declarar `materials`.
- Não crie `related` em materiais apontando para aulas: é redundante.

## Regras

- Preserve anotações originais, IDs e estilo existentes. Cada fonte é cadastrada uma única vez.
- `prompt/prompt.md` é guia de tutoria, não aula.
- Não inicie quiz na conversa nem publique o caderno on-line só por adicionar uma aula.
- Commit/push só quando pedido.
