# English Notes — Caderno do Hélio

Abra **index.html** no navegador. O arquivo contém todo o conteúdo, o CSS compilado com Tailwind e o JavaScript: funciona sem internet e pode ser copiado sozinho para outro computador.

O caderno reúne as aulas de `presente/` e `passado/` e os materiais de apoio de `conteudo-das-aulas/`. Os totais e o período são calculados a partir das páginas cadastradas. Cada aula tem uma revisão em português, exemplos em inglês, pontos de atenção e as anotações originais em uma seção expansível. Os arquivos Markdown de origem não foram alterados.

Use o índice para mudar de página, os links “Nesta página” para navegar nas telas maiores e “Imprimir aula” para imprimir ou salvar a página atual em PDF. A impressão inclui as anotações originais quando essa seção estiver aberta. Sem JavaScript, o conteúdo inteiro fica disponível em sequência.

Use **Tela cheia**, no topo, para ampliar a leitura da aula. O índice fica disponível pelo botão de menu; a navegação entre páginas e a impressão continuam acessíveis. Para voltar, clique em **Sair da tela cheia** ou pressione **Esc**. Se o navegador não permitir tela cheia, a aula usa a visualização ampliada dentro da própria janela. No celular, os botões aparecem como ícones.

## Atualizar o caderno

Requer Node.js e npm apenas para gerar novamente o HTML:

```sh
npm ci
npm run build
```

- `src/lessons.mjs`: capítulos, revisões e referências aos Markdown originais.
- `src/template.html`: estrutura HTML.
- `src/notebook.css`: Tailwind CSS e estilos de leitura, celular e impressão.
- `src/app.js`: navegação acessível por hash e índice móvel.
- `scripts/build.mjs`: conversão dos Markdown, compilação do Tailwind e geração do HTML independente.

O processo gera `index.html` e uma cópia em `dist/index.html`. Para adicionar uma aula, acrescente o Markdown na pasta adequada e um registro em `src/lessons.mjs`. Use datas no formato `DD MMM AAAA`, por exemplo `08 SET 2026`, com abreviações dos meses em português. Uma nova pasta temática deve ser cadastrada em `sourceDirectories`, no mesmo arquivo; os capítulos visuais são definidos em `groups`.

O build calcula os totais e o período automaticamente e acusa materiais não incluídos, fontes duplicadas ou inexistentes, grupos inválidos, datas inválidas, referências de estudo inexistentes, destinos de links inexistentes e IDs duplicados.

Para pedir essa atualização a um agente, use `$atualizar-caderno-ingles` ou diga “adicione as novas aulas ao caderno”. A skill está instalada nas skills pessoais e é referenciada pelo `AGENTS.md` deste projeto. Ela orienta o agente durante a tarefa; não é um monitor de pastas em segundo plano.

Para uma prévia local opcional, execute `npm run dev` e abra o endereço informado. Não é necessário manter um servidor para usar o arquivo HTML.

`prompt/prompt.md` contém orientações de tutoria, não uma aula; por isso não aparece no índice. A página do Notion **“It Wasn’t My Day”**, incluindo “Emma's story” e o exercício de Past Simple, foi convertida para o material de apoio D. Os rascunhos originais podem conter imprecisões; consulte a revisão antes de memorizá-los.

Tailwind CSS é compilado localmente conforme a [documentação oficial](https://tailwindcss.com/docs/installation/tailwind-cli). Não há CDN, chamadas de API ou armazenamento remoto.
