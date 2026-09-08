# Manutenção do caderno de inglês

Ao receber novas aulas, adicionar ou revisar Markdown de aula, ou atualizar este caderno, use a skill **atualizar-caderno-ingles**. Leia `C:/Users/helio-win11/.codex/skills/atualizar-caderno-ingles/SKILL.md` (ou a instalação correspondente em `$CODEX_HOME/skills/atualizar-caderno-ingles/SKILL.md` se o projeto estiver em outra máquina).

As fontes ficam nas pastas cadastradas em `sourceDirectories`, em `src/lessons.mjs`. Mantenha o caderno atualizado na mesma tarefa: revise o conteúdo, cadastre a página uma única vez e execute `node scripts/build.mjs`. O resultado a entregar é o `index.html` local, com Tailwind CSS e JavaScript incorporados.

Preserve as anotações originais, os IDs e o estilo existente. `prompt/prompt.md` orienta a tutoria; não é conteúdo de aula. Não inicie quiz em conversa nem publique o caderno on-line apenas por estar adicionando uma aula.
