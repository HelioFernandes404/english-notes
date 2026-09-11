export const sourceDirectories = ['presente', 'passado', 'conteudo-das-aulas'];

export const groups = [
  { id: 'fundamentos', title: 'Primeiros passos', number: '01', description: 'Preposições e fundamentos' },
  { id: 'presente', title: 'Present Simple', number: '02', description: 'Hábitos e rotina' },
  { id: 'passado', title: 'Past Simple', number: '03', description: 'Histórias e experiências' },
  { id: 'apoio', title: 'Materiais de apoio', number: '04', description: 'Textos e atividades' },
];

export const lessons = [
  {
    id: 'aula-01', number: '01', date: '28 JUL 2026', shortDate: '28/07', group: 'fundamentos',
    title: 'Os primeiros passos em inglês', nav: 'Fundamentos do inglês',
    description: 'Construir frases com mais clareza: preposições, adjetivos, pronomes e infinitivos.',
    tags: ['Grammar', 'Writing'], source: 'presente/01-aula-28-07.md',
    takeaway: 'Preposição não se escolhe pela tradução. Pense na relação entre as palavras.',
    content: `## To ou for?

Use **to** para indicar direção ou destinatário em uma transferência. Use **for** para indicar benefício, finalidade ou a pessoa a quem algo se destina.

| Ideia | Exemplo | Em português |
| --- | --- | --- |
| Direção | I go **to** the office. | Eu vou ao escritório. |
| Destinatário | Send the report **to** João. | Envie o relatório ao João. |
| Benefício | This guide is **for** the team. | Este guia é para a equipe. |
| Finalidade + verbo | I study **to improve** my English. | Estudo para melhorar meu inglês. |

> **Observe:** em “to improve”, **to** é um marcador de infinitivo. Em “to the office”, é uma preposição.

## In, on e at

- **In** — dentro de algo ou em uma área: “There is a problem **in the code**.”
- **On** — sobre uma superfície ou em uma plataforma: “The notes are **on the desk**.” / “We met **on Slack**.”
- **At** — um ponto ou local de atividade: “I am **at work**.”

## Adjetivos e pronomes

O adjetivo normalmente vem **antes do substantivo**: **a reliable system**, **a black car**, **an international interview**. Ele também pode vir depois de *be*: “The system is reliable.”

Use **he/she** para pessoas conforme seus pronomes, **they** quando apropriado (inclusive no singular), e **it** para objetos e sistemas. Animais de estimação também podem ser chamados de **he/she**.

## Infinitivos e vocabulário

**To + forma base** aparece em frases como “I want **to improve** my English” e “It is time **to leave**”.

| Expressão | Significado |
| --- | --- |
| hiring process | processo de contratação |
| job interview | entrevista de emprego |
| communication | comunicação |
| presentation | apresentação |

Terminações como **-ção → -tion** ajudam a reconhecer cognatos, mas não são uma regra de tradução. “International interview” e “international hiring process” têm sentidos diferentes: entrevista é uma etapa do processo.
`,
    review: 'Descreva seu trabalho em três frases. Use um adjetivo antes de um substantivo, uma preposição e um infinitivo.',
    correction: 'As comparações “seta” e “bandeja” são lembretes, não regras universais. “It” não substitui pessoas em geral; “they” também pode ser singular.'
  },
  {
    id: 'aula-02', number: '02', date: '04 AGO 2026', shortDate: '04/08', group: 'fundamentos',
    title: 'Preposições no contexto', nav: 'At & on no dia a dia',
    description: 'Escolher at e on para falar de lugares, horários, transporte e trabalho.',
    tags: ['Grammar', 'Writing'], source: 'presente/02-aula-04-08.md',
    takeaway: 'At 9 a.m. · On Thursday · At work · On the bus.',
    content: `## At: um ponto de referência

Use **at** para horários e locais vistos como pontos de encontro ou atividade.

- “Our English class is **at 9 a.m.**”
- “The daily stand-up is **at 11:45 a.m.**”
- “I am **at the office**.”

## On: superfície, plataforma e dia

- **Superfície:** “The book is **on the table**.”
- **Plataforma:** “We are meeting **on Google Meet**.”
- **Dia:** “The deployment is scheduled **for Thursday**.” / “We deploy **on Thursday**.”
- **Transporte:** “I am **on the bus**.” / “She is **on the plane**.”

## Duas correções importantes

| Para dizer… | Prefira… | Por quê? |
| --- | --- | --- |
| Estou dentro do banheiro. | I am **in the bathroom**. | É o interior de um cômodo. |
| O escritório fica em Alphaville. | The office is **in Alphaville**. | Alphaville é tratado como uma área. |

**At the bathroom** pode indicar um ponto próximo à entrada, dependendo do contexto. Não é a escolha habitual para dizer que você está dentro do banheiro.

## Escrita para o trabalho

Escreva sempre **I** em maiúscula. Revise palavras como **solutions** e **lightweight** com atenção à grafia.

> “I work on infrastructure projects, and I help the team find reliable solutions.”

As anotações originais registram observações feitas em aula sobre a escrita. Elas não devem ser tratadas como uma avaliação clínica.
`,
    review: 'Escreva onde você trabalha, a que horas começa sua daily e em qual dia costuma fazer deploy.',
    correction: '“In the bathroom” e “in Alphaville” corrigem exemplos das notas. O tipo de veículo ajuda a memorizar on/in, mas a distinção não é simplesmente público versus privado.'
  },
  {
    id: 'aula-03', number: '03', date: '06 AGO 2026', shortDate: '06/08', group: 'fundamentos',
    title: 'Lugar, tempo e movimento', nav: 'In, by & pronúncia',
    description: 'Completar o mapa das preposições e praticar os sons que conectam a fala.',
    tags: ['Grammar', 'Speaking'], source: 'presente/03-aula-06-08.md',
    takeaway: 'In six days é “daqui a seis dias”. By Friday é “até sexta-feira”.',
    content: `## O mapa das preposições

| Preposição | Lugar | Tempo | Transporte |
| --- | --- | --- | --- |
| **At** | at the office | at 9 a.m. | — |
| **On** | on the desk | on Monday | on the bus / on a bike |
| **In** | in the room | in August / in six days | in a car / in a taxi |
| **By** | by the window | by tomorrow | by car / by bike |

**By car** diz como você se desloca. **In the car** diz onde você está.

## In: dentro, período ou intervalo

- “Your phone is **in your pocket**.”
- “I work **in VS Code**.”
- “We will meet again **in six days**.”
- “I study **in the morning**.”

## By: perto ou até um prazo

- “The keys are **by the TV**.” — perto da TV.
- “We have to finish **by Friday**.” — sexta-feira é o prazo limite.
- “I go to the gym **by car**.” — meio de transporte.

## Os dois sons de th

O inglês usa **/θ/**, sem vibração das cordas vocais, em **think** e **birth**, e **/ð/**, com vibração, em **this**, **that** e **their**. A língua fica suavemente entre os dentes ou junto aos dentes superiores.

## Connected speech

Na fala natural, uma consoante final pode se ligar à vogal seguinte: **is‿in**. Sons também podem ser reduzidos ou se sobrepor; isso varia com o sotaque e a velocidade. Pratique devagar antes de aumentar o ritmo.

O projeto fictício **Compass**, mencionado na aula, serve de contexto para falar sobre trabalho remoto e oportunidades no exterior.
`,
    review: 'Leia em voz alta: “I think the team will finish the task by Thursday.” Depois crie uma frase com in e outra com by.',
    correction: 'TH representa dois sons, não um só. Em software, prefira “in VS Code”. On/in nos transportes são padrões de uso, não uma regra sobre poder caminhar no veículo.'
  },
  {
    id: 'aula-04', number: '04', date: '11 AGO 2026', shortDate: '11/08', group: 'presente',
    title: 'My day, my way', nav: 'Rotina e frequência',
    description: 'Falar sobre hábitos e reconhecer o Present Simple em uma rotina diária.',
    tags: ['Reading', 'Speaking', 'Grammar'], source: 'presente/04-aula-11-08.md',
    takeaway: 'I pack my lunch. She packs her lunch. O sujeito muda a forma do verbo.',
    content: `## Present Simple: hábitos e rotinas

Use o **Present Simple** para atividades habituais e fatos gerais.

- “I **pack** my lunch.”
- “Mom **makes** tea.”
- “Dad **gets** ready for work.”

Com **he, she, it**, o verbo normalmente ganha **-s**, **-es** ou **-ies**. Com **I, you, we, they**, use a forma base.

## Com que frequência?

| Advérbio | Ideia |
| --- | --- |
| always | sempre |
| usually / normally | geralmente / normalmente |
| often | frequentemente |
| sometimes | às vezes |
| rarely / seldom | raramente |
| never | nunca |

Esses advérbios indicam frequência aproximada. Os percentuais das atividades são apenas um recurso visual; **often** não significa exatamente 70%.

## Vocabulário da rotina

| Inglês | Português |
| --- | --- |
| get dressed | vestir-se |
| pack my lunch | preparar o almoço para levar |
| share | compartilhar |
| their | deles / delas |
| kitchen | cozinha |
| chicken | frango / galinha |
| breakfast | café da manhã |

## Horários e cumprimentos

**Good evening** é uma saudação. **Good night** costuma ser uma despedida ou algo dito antes de dormir. **Evening** não tem um intervalo fixo de horas.

Use **at the weekend** no inglês britânico e **on the weekend** no americano. Para horários: **7:30 = seven thirty / half past seven**.

## Pronúncia em pequenos passos

Pratique **dress → dressed**, sem acrescentar uma sílaba “éd”: **dressed** termina com /t/. Compare **kitchen** e **chicken**. A pronúncia de **our** varia com o sotaque e a ênfase.
`,
    review: 'Descreva três hábitos seus e três de alguém da sua família. Inclua always, sometimes e never.',
    correction: '“Seven and a half” não é a forma usual de dizer 7:30. Os horários em 24 horas também existem em inglês.', related: ['material-rotina']
  },
  {
    id: 'aula-05', number: '05', date: '13 AGO 2026', shortDate: '13/08', group: 'presente',
    title: 'Afirme, negue, pergunte', nav: 'Do, does & frases',
    description: 'Montar frases afirmativas, negativas e perguntas com segurança.',
    tags: ['Grammar', 'Writing'], source: 'presente/05-aula-13-08.md',
    takeaway: 'Does já marca a terceira pessoa. O verbo principal volta à forma base.',
    content: `## Três estruturas para a mesma ideia

| Forma | Estrutura | Exemplo |
| --- | --- | --- |
| Afirmativa | sujeito + verbo | She **reviews** the code. |
| Negativa | sujeito + do/does + not + verbo base | She **doesn't review** the code. |
| Pergunta | Do/Does + sujeito + verbo base? | **Does** she **review** the code? |

Com **I, you, we, they**, use **do / don't**. Com **he, she, it**, use **does / doesn't**.

## Evite a conjugação dupla

**Does she work?** e **She doesn't work.** O **-s** aparece no auxiliar **does**, não em **work**.

> A ideia de “um verbo conjugado” se aplica a essa construção com auxiliar. Uma frase pode ter várias orações e vários verbos conjugados: “She works and he studies.”

## Frases da aula, revisadas

- “Emily always drinks water **in the morning**.”
- “Jane often does yoga **on Mondays**.”
- “Mike doesn't eat lunch alone **at work**.”
- “They usually **work out** together.”
- “Mom doesn't order food; she cooks it.”
- “We watch movies **at night**.”

## As formas do verbo

| Nome | Exemplo com make |
| --- | --- |
| Forma base | make |
| Past Simple | made |
| Past Participle | made |
| Terceira pessoa do presente | makes |
| Forma em -ing | making |

As etiquetas V1–V5 são a convenção usada nas aulas. A forma **-ing** pode ter diferentes funções; sozinha, ela não forma um tempo contínuo.

## Pronúncia e vocabulário

**Lunch** termina com /tʃ/; **finish**, com /ʃ/. **Work out** é o verbo “treinar”; **workout** é o substantivo “treino”. **Five o'clock** indica cinco horas em ponto.
`,
    review: 'Transforme “She deploys the update” em uma negativa e em uma pergunta.',
    correction: '“Apenas um verbo pode ser conjugado em uma frase” é uma simplificação excessiva. A regra relevante é does + verbo base. O verbo be tem estruturas próprias.'
  },
  {
    id: 'aula-06', number: '06', date: '17 AGO 2026', shortDate: '17/08', group: 'presente',
    title: 'O detalhe está no -s', nav: 'S, es ou ies?',
    description: 'Conjugar verbos com he, she e it e descrever a rotina de outra pessoa.',
    tags: ['Grammar', 'Speaking'], source: 'presente/06-aula-17-08.md',
    takeaway: 'She studies. She plays. Consoante + y muda; vogal + y permanece.',
    content: `## Regras da terceira pessoa

| Terminação | O que fazer | Exemplos |
| --- | --- | --- |
| Maioria dos verbos | adicionar -s | work → works; play → plays |
| -o, -s, -sh, -ch, -x, -z | normalmente adicionar -es | go → goes; do → does; miss → misses; watch → watches |
| Consoante + y | trocar y por -ies | study → studies; try → tries |
| Vogal + y | adicionar apenas -s | play → plays; enjoy → enjoys |
| Exceções frequentes | memorizar | have → has; be → is |

Esses são padrões úteis. Alguns verbos têm particularidades: **quiz → quizzes**, por exemplo.

## A rotina da Harper

- “Harper **gets up** at 9 o'clock.”
- “She **works** at noon.”
- “She **rides** a bike at 3 p.m.”
- “She **meets** her friend for coffee at four thirty.”
- “She **does** the grocery shopping at six o'clock.”
- “She **watches** her favorite series at seven o'clock.”

## Perguntas sobre a rotina

“What time **do you wake up**?”

“What time **does your father wake up**?”

Observe que **wake** fica na forma base depois de **do/does**.

## Como dizer as horas

**9 a.m.** indica nove da manhã; **9 p.m.**, nove da noite. **Noon** é meio-dia; **midnight**, meia-noite. O formato de 24 horas também é usado, especialmente em horários oficiais e contextos técnicos.
`,
    review: 'Complete em voz alta: “She ___ (study), he ___ (play), our manager ___ (have) a meeting.” Depois transforme cada frase em pergunta.',
    correction: 'Não é todo sujeito singular que recebe -s: “I work” e “you work” também podem ser singulares. A regra é para a terceira pessoa.', related: ['material-rotina']
  },
  {
    id: 'aula-07', number: '07', date: '18 AGO 2026', shortDate: '18/08', group: 'presente',
    title: 'A developer’s daily routine', nav: 'A rotina de um dev',
    description: 'Aplicar o Present Simple a Slack, code reviews, reuniões e hábitos de trabalho.',
    tags: ['Grammar', 'Speaking', 'Writing'], source: 'presente/07-aula-18-08.md',
    takeaway: 'Does your team do code reviews? O primeiro verbo é auxiliar; o segundo é a ação.',
    content: `## Inglês para o seu dia de trabalho

- “Hélio always **checks** Slack before breakfast.”
- “The team often **has** a stand-up meeting at 11:45 a.m.”
- “Priya and Leo usually **pair program** together.”
- “Our manager **doesn't send** emails on weekends.”

## Onde colocar o advérbio?

Advérbios de frequência geralmente vêm **antes do verbo principal** e **depois de be**.

| Verbo principal | Verbo be |
| --- | --- |
| I **usually check** Slack. | I **am usually** online at nine. |
| She **never misses** a meeting. | She **is always** prepared. |

## Do tem dois papéis

Em **“Does your team do code reviews?”**, **does** é o auxiliar da pergunta; **do** é o verbo principal.

**Team** pode ser tratado como unidade: “The team **has** a meeting”. No inglês britânico, a concordância plural também é possível quando o foco está nos integrantes.

## Conectando a rotina

- **before breakfast** — antes do café da manhã.
- **after getting dressed** — depois de se vestir.
- **after eating dinner** — depois de jantar.
- **in the evening** — no fim do dia / à noite.

“I usually take a coffee break at around 11 a.m.”

“I catch up with my friends in the evening after work.”

## Pergunte e responda

“What time do you wake up?” → “I wake up at seven o'clock.”

“What do you usually eat for breakfast?” → “I usually eat eggs and bread.”
`,
    review: 'Descreva sua rotina antes da daily, durante um code review e depois do expediente.',
    correction: 'A posição do advérbio muda com be. A concordância de substantivos coletivos como team pode variar com o contexto e a variedade do inglês.', related: ['material-dev']
  },
  {
    id: 'aula-08', number: '08', date: '20 AGO 2026', shortDate: '20/08', group: 'presente',
    title: 'Fale sobre o seu trabalho', nav: 'Respostas & vocabulário',
    description: 'Responder perguntas e organizar o vocabulário de reuniões, depuração e entregas.',
    tags: ['Speaking', 'Vocabulary'], source: 'presente/08-aula-20-08.md',
    takeaway: 'Yes, I do. No, I don’t. Uma resposta curta também pode ter uma estrutura completa.',
    content: `## Respostas curtas com auxiliar

| Pergunta | Sim | Não |
| --- | --- | --- |
| Do you exercise before lunch? | Yes, I do. | No, I don't. |
| Does she review pull requests? | Yes, she does. | No, she doesn't. |
| Are you ready? | Yes, I am. | No, I'm not. |

**Yes** e **no** sozinhos também podem ser naturais; tom e contexto fazem diferença. Praticar o auxiliar ajuda a consolidar a estrutura.

## Name three things

Pense em três ações para cada situação trabalhada na aula:

- **Before turning your computer on:** make breakfast, make coffee, fill a water bottle.
- **While debugging code:** collect logs, gather evidence, summarize hypotheses.
- **During a work break:** make a salad, play with the dog, take a walk.
- **After logging off:** close the laptop, change clothes, go to the gym.
- **During a stand-up:** report progress, explain the plan, mention blockers.
- **Before a big deployment:** run tests, review the code, open a pull request.

## Frases para lembrar

“My colleague never **misses** a deadline.”

“My teammate usually **finishes** work at 6 p.m. and then **logs off**.”

“She never **goes** to bed without checking her calendar.”

“Dan **deploys** the update before he **logs off** for the day.”

## Vocabulário do expediente

| Expressão | Significado |
| --- | --- |
| log off | encerrar a sessão / desconectar-se |
| blocker | impedimento |
| summarize | resumir |
| spend the weekend | passar o fim de semana |
| the meeting runs late | a reunião se prolonga / atrasa |
| wear a T-shirt | vestir / usar uma camiseta |

O dever de casa registrado foi revisar os números de **1 a 100**, com foco na pronúncia.
`,
    review: 'Explique três coisas que você faz antes de um deploy. Depois responda: “Do you usually run tests before deploying?”',
    correction: 'Para roupas, use wear: “I wear a T-shirt and shorts”. “Use” significa usar algo como ferramenta ou recurso, não vestir.', related: ['material-dev']
  },
  {
    id: 'aula-09', number: '09', date: '27 AGO 2026', shortDate: '27/08', group: 'presente',
    title: 'Conecte os momentos do dia', nav: 'Rotina em um parágrafo',
    description: 'Transformar ações isoladas em uma descrição natural da sua rotina.',
    tags: ['Writing', 'Vocabulary'], source: 'presente/09-aula-27-08.md',
    takeaway: 'Before, after, while e then ajudam sua rotina a virar uma sequência clara.',
    content: `## Expressões que conectam ações

| Expressão | Exemplo |
| --- | --- |
| before | I run the tests **before a big deployment**. |
| right after | I catch up with the team **right after the stand-up**. |
| over lunch | We discuss the project **over lunch**. |
| while | I make coffee **while I watch videos in English**. |
| by + -ing | I get ready for bed **by reading for half an hour**. |

**Over lunch / over coffee** é natural para algo que acontece durante uma refeição ou conversa. **Over** não substitui **while** em qualquer contexto.

## Phrasal verbs da aula

- **Clean up:** limpar ou organizar. “I clean up my code before pushing it.”
- **Catch up with:** conversar para se atualizar. “I catch up with the team.”
- **Get out of bed:** sair da cama.
- **Wake someone up:** acordar alguém. “My morning coffee **wakes me up**.”
- **Skip:** pular / deixar de fazer. “I never skip breakfast.”

## Um modelo de rotina revisado

> I usually wake up at six o'clock. I often make coffee while I watch videos in English. Then I turn on my laptop and start work. I stop for lunch at noon and sometimes go back to work at two. In the evening, I go to the gym or ride my bike. When I get home, I make dinner. Later, I get ready for bed.

Este modelo usa o rascunho do material de apoio. Os horários diferem do resumo da aula; adapte-os à sua rotina real.

## Ajustes que fazem diferença

| Rascunho | Forma natural |
| --- | --- |
| At evening | **In the evening** |
| After always turn on my laptop | **Then I always turn on my laptop** |
| I make coffee over English videos | **I make coffee while I watch videos in English** |
| When I arrive, I make my food | **When I get home, I make dinner** |

Para objetos, **it** é a escolha neutra. Usar **he/she** para um carro, por exemplo, é personificação e não uma regra geral de “estima”.
`,
    review: 'Escreva cinco frases sobre sua rotina. Inclua um advérbio de frequência, before, after e in the evening.',
    correction: 'Percentuais de frequência são aproximações didáticas. “In the evening” e “while I watch videos” corrigem construções do rascunho.', related: ['material-dev']
  },
  {
    id: 'aula-10', number: '10', date: '01 SET 2026', shortDate: '01/09', group: 'passado',
    title: 'Conte o que aconteceu', nav: 'Experiências no passado',
    description: 'Relatar uma promoção, escolher artigos e falar sobre acontecimentos concluídos.',
    tags: ['Writing', 'Grammar', 'Vocabulary'], source: 'passado/10-aula-01-09.md',
    takeaway: 'I got a promotion. I relaxed over the weekend. A história já aconteceu.',
    content: `## Da rotina para uma experiência

| Presente | Passado |
| --- | --- |
| I get new responsibilities. | I **got** new responsibilities. |
| I relax after work. | I **relaxed** after work. |
| I see my friends. | I **saw** my friends. |

“Last month, I **got a promotion** at my company.”

“I **relaxed over the weekend** and **saw my friends**.”

## Escolhas de vocabulário

- **Look for** significa procurar: “I was looking for a new role.” **Search for** também é correto.
- **See my friends** significa ver / encontrar meus amigos. **Leave my friends** significa deixá-los.
- **Promotion** pode ser uma promoção de carreira ou uma ação promocional comercial.
- **Offer / special offer / sale** são escolhas frequentes para uma oferta ou promoção de produto.

## A, an ou the?

Use **a/an** para introduzir algo não identificado e **the** quando o ouvinte sabe a que você se refere.

“I drafted **a project proposal**.” → uma proposta ainda não identificada.

“I sent **the proposal** to my manager.” → a proposta já mencionada.

Escolha **a/an pelo som**, não pela letra: **a user**, **an engineer**, **an hour**.

## Birthday e anniversary

**Birthday:** aniversário de nascimento. “My birthday is on August 25th.”

**Anniversary:** aniversário de uma data ou acontecimento. “My third work anniversary is on December 8th.”

## Uma nota sobre a história do inglês

O inglês é uma língua **germânica**. O inglês antigo se desenvolveu a partir de variedades germânicas; o contato com o nórdico antigo, o francês e o latim influenciou sua evolução. Não é correto resumir o Old English a uma mistura de latim e celta. [Referência: Open University — From Old English to Modern English](https://www.open.edu/openlearn/history-the-arts/english-language/from-old-english-modern-english).

Percentuais de origem do vocabulário dependem do dicionário e do método de contagem.

A leitura **“Emma's story”** está no material de apoio **“It Wasn’t My Day”**, com o texto original e a atividade de Past Simple.
`,
    review: 'Escreva três frases sobre uma conquista no trabalho. Diga quando aconteceu e o que você fez depois.',
    correction: 'Prefira “at the weekend” (britânico), “on the weekend” (americano) ou “over the weekend”, em vez de “at my weekend”. Search for também pode significar procurar.'
  },
  {
    id: 'aula-11', number: '11', date: '03 SET 2026', shortDate: '03/09', group: 'passado',
    title: 'Past Simple, passo a passo', nav: 'Did, was & were',
    description: 'Revisar estruturas do passado e as formas regulares e irregulares dos verbos.',
    tags: ['Grammar', 'Writing'], source: 'passado/11-aula-03-09.md',
    takeaway: 'Did carrega o passado. Depois de did ou didn’t, use a forma base.',
    content: `## Afirmativa, negativa e pergunta

O **Past Simple** descreve ações ou situações concluídas no passado. O momento pode estar explícito ou ser entendido pelo contexto.

| Forma | Estrutura | Exemplo |
| --- | --- | --- |
| Afirmativa | sujeito + passado | I **fixed** the bug yesterday. |
| Negativa | sujeito + didn't + base | I **didn't fix** the bug. |
| Pergunta | Did + sujeito + base? | **Did** you **fix** the bug? |

**Did you go?**, não “Did you went?”. **I didn't have**, não “I didn't had”.

## Be tem sua própria estrutura

| Sujeito | Afirmativa | Negativa |
| --- | --- | --- |
| I / he / she / it | was | wasn't |
| you / we / they | were | weren't |

“The service **was** unavailable.”

“The servers **weren't** ready.”

“**Were you** on call yesterday?”

**You usa were, mesmo quando se refere a uma só pessoa.** Com be, inverta o verbo e o sujeito para perguntar; não use did.

## Verbos regulares

| Padrão | Regra | Exemplo |
| --- | --- | --- |
| Maioria dos verbos | + -ed | miss → missed |
| Final -e | + -d | love → loved |
| Consoante + y | y → -ied | try → tried |
| Vogal + y | + -ed | play → played |
| Vogal curta + consoante final, em padrões específicos | dobrar a consoante + -ed | plan → planned; stop → stopped |

A duplicação depende também da **tonicidade** e da terminação: **prefer → preferred**, mas **open → opened**. Não se duplicam normalmente **w, x, y**.

## Verbos irregulares da aula

| Forma base | Past Simple | Português |
| --- | --- | --- |
| find | found | encontrar |
| come | came | vir |
| write | wrote | escrever |
| lose | lost | perder |
| get | got | conseguir / obter |
| give | gave | dar |
| feel | felt | sentir |
| wake up | woke up | acordar |
| eat | ate | comer |
| go | went | ir |

## Past Simple não é Past Participle

**Eat → ate → eaten**. Para narrar uma ação no Past Simple, use **ate**: “I ate breakfast at seven.” **Eaten** é o particípio, usado em outras construções.

O exercício complementar de Past Simple está no material de apoio **“It Wasn’t My Day”**.
`,
    review: 'Conte como foi sua última entrega. Use um verbo regular, dois irregulares, uma negativa com didn’t e uma pergunta com did.',
    correction: 'A regra não é simplesmente was = singular / were = plural: “you were” vale também para uma pessoa. Nem todo verbo CVC dobra a consoante.'
  },
  {
    id: 'aula-12', number: '12', date: '10 SET 2026', shortDate: '10/09', group: 'passado',
    title: 'Irregulares, CVC e shadowing', nav: 'Irregulares & CVC',
    description: 'Revisar os verbos do dever de casa, ajustar a regra de duplicação e organizar a prática de pronúncia.',
    tags: ['Grammar', 'Writing', 'Speaking'], source: 'passado/12-aula-10-09.md',
    takeaway: 'Antes de acrescentar -ed, confira se o verbo é irregular. Know → knew; order → ordered.',
    content: `## Primeiro, confira o verbo

A revisão do dever de casa destacou o uso de terminações regulares em verbos irregulares. Para escrever uma afirmativa no **Past Simple**, identifique a forma base e confira se o verbo tem um passado irregular; só depois aplique as regras de **-ed** aos regulares.

Depois de **did/didn’t**, use a forma base, mesmo com verbos irregulares: “I **didn’t write** the report.”

## Verbos irregulares da aula

| Forma base | Past Simple | Português |
| --- | --- | --- |
| break | broke | quebrar |
| write | wrote | escrever |
| win | won | ganhar / vencer |
| keep | kept | manter / guardar |
| find | found | encontrar |
| feel | felt | sentir |
| catch | caught | pegar / capturar |
| teach | taught | ensinar |
| bring | brought | trazer |
| buy | bought | comprar |
| know | knew | saber / conhecer |
| fly | flew | voar |
| sit | sat | sentar-se |
| eat | ate | comer |
| speak | spoke | falar |

O passado de **know** é **knew**. **New** significa “novo”. O **k** de **knew** é mudo: /njuː/ no modelo britânico e /nuː/ no americano. [Cambridge Dictionary — knew](https://dictionary.cambridge.org/dictionary/english/knew).

Exemplos acrescentados para estudar no contexto de trabalho:

- “The update **broke** the deployment pipeline.”
- “I **wrote** the incident report and **kept** a copy.”
- “We **found** the problem and **spoke** to the team.”

## CVC e a sílaba tônica

**CVC** significa consoante + vogal + consoante. Nos padrões de duplicação, observe uma vogal escrita antes de uma única consoante final e a sílaba tônica. Em verbos com mais de uma sílaba, a tonicidade final normalmente determina a duplicação.

A tabela retoma **order** e acrescenta exemplos de contraste:

| Verbo | Past Simple | O que observar |
| --- | --- | --- |
| stop | stopped | Uma sílaba, vogal curta + consoante final. |
| prefer | preferred | A última sílaba é tônica: pre-FER. |
| open | opened | A primeira sílaba é tônica: O-pen. |
| order | ordered | A primeira sílaba é tônica: OR-der. |

Não duplique normalmente **w, x ou y**: **snow → snowed**, **fix → fixed**, **play → played**.

## Traveled ou travelled?

As duas grafias são corretas: **traveled** é a forma americana; **travelled**, a britânica. **Travel tem a primeira sílaba tônica nas duas variedades: TRA-vel.**

A diferença é uma convenção ortográfica: no inglês britânico, o **l** final de verbos como **travel** é duplicado mesmo sem tonicidade na última sílaba. Mantenha a variedade escolhida ao escrever. [Chicago Manual of Style — duplicação de consoantes e travel](https://www.chicagomanualofstyle.org/qanda/data/faq/topics/YouCouldLookItUp/faq0036.html).

## Hurt e put: a mesma forma no passado

**Hurt → hurt** e **put → put** não recebem **-ed**. Para identificar o tempo, observe a frase, os auxiliares e o contexto. Exemplos acrescentados:

| Presente | Passado |
| --- | --- |
| I **put** my laptop on the desk every morning. | I **put** my laptop on the desk yesterday. |
| My wrist **hurts** today. | My wrist **hurt** yesterday. |

“Invariável” aqui se refere à forma base e ao passado. No Present Simple com **he/she/it**, há **puts** e **hurts**. **Did you put…?** também sinaliza o passado pelo auxiliar.

## Shadowing e próximos passos

Na aula, o professor sugeriu ouvir o texto acompanhando em silêncio, fazer **shadowing** e depois ler para ele. No shadowing, você repete a fala logo após o modelo, enquanto o áudio continua, acompanhando o ritmo e a entonação.

A música foi sugerida como ponto de partida. Trate a prática como uma oportunidade de treinar e receber feedback, sem assumir um resultado garantido. Para praticar fala cotidiana, use também um trecho falado: o canto pode alterar o ritmo e a duração dos sons.

As tarefas registradas foram **corrigir o dever de casa explicando cada ajuste**, **atualizar a regra CVC** e **criar um plano de shadowing**. Como sugestão de estudo, escolha um trecho curto, ouça acompanhando o texto, repita junto e depois leia sem o áudio. As notas não incluem o texto completo do dever nem um áudio para essa prática.
`,
    review: 'Escreva três frases sobre seu último dia de trabalho usando verbos irregulares desta aula. Transforme uma delas em negativa. Depois explique por que prefer vira preferred e order vira ordered.',
    correction: 'Nas notas, “know → new” deve ser “know → knew”. Travel mantém a primeira sílaba tônica no inglês britânico e no americano; travelled é uma diferença de grafia. Hurt e put ainda recebem -s na terceira pessoa do presente.',
    related: ['aula-11', 'material-it-wasnt-my-day']
  },
  {
    id: 'material-preposicoes', number: 'A', date: 'MATERIAL DE APOIO', shortDate: '', group: 'apoio',
    title: 'Prepositions', nav: 'Prepositions', description: 'Tabela de consulta e exemplos de lugar, tempo e transporte.',
    tags: ['Grammar', 'Vocabulary'], source: 'conteudo-das-aulas/prepositions.md',
    takeaway: 'Escolha a preposição pela situação: lugar, tempo ou transporte.',
    content: `## Antes de consultar o material

Este material reúne a tabela e os exemplos usados nas aulas 02 e 03. O conteúdo original está logo abaixo, incluindo seu vocabulário.

## Ajustes para a revisão

- **In Alphaville:** para um bairro ou área; **at** funciona com um endereço ou ponto específico.
- **In the fitting room:** dentro do provador.
- **On Christmas Day / at Christmas:** o primeiro se refere ao dia; o segundo, ao período festivo.
- **“My third work anniversary is on December 8th”** é mais natural do que “I will complete 3 years anniversary”.
- **In** também aparece com meses, anos e períodos: **in August**, **in 2026**, **in the morning**.
- **By car** indica o meio; **in the car**, a posição. Transporte público versus privado não é uma regra geral.
`,
    correction: 'Leia os exemplos originais junto com os ajustes acima.', showOriginal: true,
    related: ['aula-02', 'aula-03']
  },
  {
    id: 'material-rotina', number: 'B', date: '11 AGO 2026', shortDate: '11/08', group: 'apoio',
    title: 'My Day, My Way', nav: 'My Day, My Way', description: 'Pronomes, formas verbais, a rotina da Harper e perguntas sobre o dia a dia.',
    tags: ['Reading', 'Writing', 'Speaking'], source: 'conteudo-das-aulas/my-day-my-way-daily-routine.md',
    takeaway: 'Primeiro identifique o sujeito. Depois escolha a forma do verbo.',
    content: `## Como revisar esta atividade

O material original contém exercícios e respostas anotadas em aula. Releia a regra antes de conferir as respostas. Os pares de formas separados por barras na tabela são alternativas do exercício, não formas intercambiáveis.

## Correções para ter por perto

| No rascunho | Na revisão |
| --- | --- |
| Seven and a half (7:30) | seven thirty / half past seven |
| Harper on works at 12 o'clock | Harper works at noon. |
| Harper watches favorite series | Harper watches her favorite series. |
| V2 – Been | **V3 – been** (Past Participle) |

**Be** na forma base é **be**. No presente, suas formas incluem **am, is, are**; no passado, **was, were**.

O quadro de conjugação deve ser lido assim: **I/you/we/they + base**, **he/she/it + -s/-es/-ies**. Depois de **do/does/don't/doesn't**, use a forma base.
`,
    correction: 'O material original preserva os rascunhos. Use a tabela acima para não memorizar as formas incorretas.', showOriginal: true,
    related: ['aula-04', 'aula-05', 'aula-06']
  },
  {
    id: 'material-dev', number: 'C', date: '18 AGO 2026', shortDate: '18/08', group: 'apoio',
    title: 'A Developer’s Daily Routine', nav: 'Developer’s Daily Routine', description: 'Atividades de Present Simple com Slack, stand-ups, pull requests e code reviews.',
    tags: ['Reading', 'Writing', 'Speaking'], source: 'conteudo-das-aulas/a-developers-daily-routine.md',
    takeaway: 'Use a sua rotina real para transformar vocabulário em frases que você lembra.',
    content: `## O que há neste material

- Verdadeiro ou falso sobre hábitos de trabalho.
- Construção de frases e perguntas sobre a rotina.
- “Name three things” em situações do expediente.
- Conjugação de verbos, correspondência de frases e escrita de um parágrafo.
- Vocabulário e advérbios de frequência.

## Ajustes nos rascunhos

- **“I wear a T-shirt and shorts.”** Use wear para roupas.
- **“On Friday afternoons.”** Revise a grafia de afternoons.
- **“Then I always turn on my laptop for work.”** Inclua o sujeito I.
- **“In the evening, I go to the gym.”** Use in the evening.
- **“When I get home, I make dinner.”** Uma forma natural de conectar as ações.

**Always, usually, often, sometimes, seldom, rarely, never** expressam frequência. Os percentuais registrados na atividade são aproximações para estudo.
`,
    correction: 'As respostas e rasuras originais estão preservadas abaixo. Para um modelo de parágrafo revisado, consulte a aula 09.', showOriginal: true,
    related: ['aula-07', 'aula-08', 'aula-09']
  },
  {
    id: 'material-it-wasnt-my-day', number: 'D', date: '01 SET 2026', shortDate: '01/09', group: 'apoio',
    title: 'It Wasn’t My Day', nav: 'It Wasn’t My Day', description: 'Ler uma história sobre um dia difícil e praticar afirmativas, negativas, perguntas e verbos no Past Simple.',
    tags: ['Grammar', 'Reading', 'Speaking', 'Writing'], source: 'conteudo-das-aulas/it-wasnt-my-day.md',
    takeaway: 'No passado, afirmativas usam V2; depois de did ou didn’t, use V1. Com be, use was ou were.',
    content: `## O foco da atividade

A aula combina uma narrativa curta com exercícios de **Past Simple**. O objetivo é reconhecer ações concluídas, organizar uma sequência de eventos e escolher entre formas regulares, irregulares, **did/didn’t** e **was/were**.

## Um dia para lembrar

A ideia do título é um dia que começou mal, mas terminou bem: **It wasn’t my day** pode transmitir “não era o meu dia” ou “as coisas não estavam dando certo para mim”.

Na história de Emma, observe os marcadores de sequência:

- **First** — primeiro.
- **Then** — depois / então.
- **At lunchtime** — na hora do almoço.
- **Suddenly** — de repente.
- **After work** — depois do trabalho.
- **Finally** — finalmente.
- **In the end** — no fim.

> Two days ago, I **had** a really crazy day. First, I **woke up** late and **missed** my bus. I felt stressed because I **was** late for work. Then, I **arrived** at work without my phone.
>
> At lunchtime, I **went** to a café and **tried** sushi with a colleague. Suddenly, I **saw** my favourite singer there! We **were** very surprised and **took** a photo. After work, I **met** two friends. We **talked** and **laughed** together. Finally, I **found** a £20 note in my jacket pocket and **forgot** about it.

## Past Simple: três estruturas

| Forma | Estrutura | Exemplo |
| --- | --- | --- |
| Afirmativa | sujeito + V2 | I **had** my phone. |
| Negativa | sujeito + **didn’t** + V1 | I **didn’t have** my phone. |
| Pergunta | **Did** + sujeito + V1? | **Did** I **have** my phone? |

Depois de **did** ou **didn’t**, o verbo volta à forma base: **Did you go?**, não “Did you went?”.

Com o verbo **be**, não use **did**. Use **was** com I/he/she/it e **were** com you/we/they: “I **was** late.” / “We **were** surprised.”

## Como formar os verbos regulares

| Padrão | Regra | Exemplo |
| --- | --- | --- |
| Maioria dos verbos | + -ed | miss → missed; play → played |
| Final -e | + -d | arrive → arrived |
| Consoante + y | y → -ied | try → tried; cry → cried |
| CVC, em padrões específicos | dobrar a consoante final + -ed | plan → planned; stop → stopped |

**CVC** significa **Consonant + Vowel + Consonant**: consoante + vogal + consoante. A duplicação também depende da tonicidade e da terminação; não aplique a regra automaticamente a todo verbo curto.

## Gabarito do exercício

1. **finished**, **sent**
2. **found**, **was**
3. **came**, **wrote**
4. **lost**, **got**
5. **gave**, **felt**
6. **woke up**, **forgot**, **realised**
7. **passed**, **ate out**
8. **carried**, **studied**, **played**
9. **got**, **called**
10. **went**, **visited**

## Vocabulário para revisar

| Inglês | Português |
| --- | --- |
| anniversary | aniversário de evento ou data comemorativa |
| birthday | aniversário de nascimento |
| airplane | avião |
| flight | voo |
| promotion | promoção no trabalho |
| raise | aumento salarial |
| reach | alcançar |
| where | onde |
| were | era/estava; éramos/estávamos; eram/estavam |
`,
    correction: 'No texto inicial, prefira “I was looking for a promotion”, “I got a promotion” e “over the weekend” (ou “at the weekend”/“on the weekend”). Em “did/didn’t”, use a forma base; com be, use was/were.', showOriginal: true,
    related: ['aula-10', 'aula-11']
  }
];
