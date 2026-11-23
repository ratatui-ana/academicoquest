'use strict';
// Protótipo pedagógico: normas de formatação são parâmetros da oficina,
// não uma implementação completa de todas as normas ABNT.
const missions = [
  {title:'O documento desorganizado',short:'Formatação básica',xp:100,desc:'Organize o título e o corpo do texto usando as ferramentas do editor.',hint:'Clique no título para centralizá-lo. Depois clique no parágrafo do texto e use Justificar e Entrelinhas 1,5.',blocks:[
    {id:'title',text:'A IMPORTÂNCIA DA PESQUISA CIENTÍFICA',align:'left',size:12},
    {id:'body',text:'A pesquisa científica contribui para a construção do conhecimento. Ao investigar fenômenos e comparar evidências, pesquisadores produzem explicações que podem ser revisadas e aprimoradas.',align:'left',line:'1'}
  ],checks:[
    {label:'Centralizar o título',test:()=>alignment('title')==='center'},
    {label:'Justificar o parágrafo',test:()=>alignment('body')==='justify'},
    {label:'Aplicar entrelinhas 1,5 ao parágrafo',test:()=>line('body')==='1.5'}
  ]},
  {title:'Citações com atenção',short:'Citações',xp:150,desc:'Corrija um exemplo de citação indireta. Use os dados fictícios indicados na atividade.',hint:'Uma citação indireta deve indicar a autoria e o ano. Substitua [AUTOR] e [ANO] pelos dados do cartão: Silva, 2020.',blocks:[
    {id:'guide',text:'CARTÃO DA FONTE (FICTÍCIA): autora Maria Silva · ano 2020 · assunto: ciência e sociedade',locked:true},
    {id:'quote',text:'A pesquisa científica contribui para o desenvolvimento da sociedade ([AUTOR], [ANO]).'},
    {id:'note',text:'Edite apenas o segundo parágrafo. Neste exercício, avaliaremos os dados da autoria e do ano.',locked:true}
  ],checks:[
    {label:'Informar a autoria correta: Silva',test:()=>/\bsilva\b/i.test(txt('quote')) && !/\[AUTOR\]/i.test(txt('quote'))},
    {label:'Informar o ano correto: 2020',test:()=>/\b2020\b/.test(txt('quote')) && !/\[ANO\]/i.test(txt('quote'))},
    {label:'Manter o sentido da afirmação original',test:()=>/pesquisa científica/i.test(txt('quote')) && /desenvolvimento da sociedade/i.test(txt('quote'))}
  ]},
  {title:'Dossiê: a fonte sob investigação',short:'Verificação de fontes',xp:200,desc:'Três publicações parecem confiáveis, mas servem para objetivos diferentes. Analise suas evidências, selecione a melhor para uma afirmação e planeje a checagem.',hint:'Procure uma fonte que tenha dados observáveis, método descrito e seja pertinente à afirmação. Ser recente ou ter um nome conhecido não basta. Pense também no que os dados não demonstram.',blocks:[
    {id:'case',text:'CASO: Você está escrevendo um trabalho sobre o uso de telas antes de dormir. Precisa sustentar a afirmação: “Em uma pesquisa com estudantes, maior uso de telas à noite esteve associado a menor duração do sono”.',locked:true},
    {id:'sourceA',text:'FONTE A · Blog Vida Digital (2026) | Autora identificada; texto com referências a especialistas. Afirma que “celulares acabam com o sono de todos”, mas não apresenta amostra, método de coleta ou dados próprios.',locked:true},
    {id:'sourceB',text:'FONTE B · Relatório fictício do Observatório Escolar (2025) | Autoria e instituição identificadas; questionário com 420 estudantes de três escolas; descreve perguntas, coleta e resultados. Encontrou associação entre tempo de tela noturno e horas de sono, mas não testou causalidade e não representa todos os estudantes do país.',locked:true},
    {id:'sourceC',text:'FONTE C · Pesquisa comercial fictícia ConectaBem (2026) | Empresa identificada; entrevistou 1.000 clientes sobre preferências de aplicativos. Apresenta gráficos e patrocínio declarado, mas não mediu horas de sono ou uso noturno de telas.',locked:true}
  ],checks:[
    {label:'Selecionar a fonte mais pertinente à afirmação',test:()=>sourceAnswer('choice')==='B'},
    {label:'Identificar as evidências de verificabilidade',test:()=>sourceAnswer('methods')===true&&sourceAnswer('sample')===true&&sourceAnswer('recent')!==true&&sourceAnswer('emphatic')!==true},
    {label:'Reconhecer o limite da conclusão',test:()=>sourceAnswer('limitation')==='association'},
    {label:'Planejar uma checagem antes de citar',test:()=>sourceAnswer('next')==='original'}
  ]},
  {title:'Referências em perigo',short:'Referências',xp:250,desc:'Reconstrua uma referência de livro fictício usando os dados fornecidos.',hint:'Organize os dados no padrão solicitado na oficina: SOBRENOME, Prenome. Título. Cidade: Editora, ano. Exemplo: COSTA, Marina. Escrita científica. Campinas: Horizonte, 2021.',blocks:[
    {id:'data',text:'FICHA BIBLIOGRÁFICA FICTÍCIA: Marina Costa | Escrita científica | Campinas | Horizonte | 2021',locked:true},
    {id:'reference',text:'Marina Costa, 2021, Escrita científica, Horizonte, Campinas.'}
  ],checks:[
    {label:'Começar com COSTA, Marina.',test:()=>/^COSTA,\s*Marina\./i.test(txt('reference').trim())},
    {label:'Informar título e local antes da editora',test:()=>/Escrita científica\.\s*Campinas\s*:\s*Horizonte/i.test(txt('reference'))},
    {label:'Terminar com o ano 2021',test:()=>/Horizonte,\s*2021\.$/i.test(txt('reference').trim())}
  ]},
  {title:'Revisão editorial',short:'Revisão',xp:300,desc:'Corrija os problemas gramaticais e aplique o estilo editorial solicitado.',hint:'Conserte “Os pesquisador analisa” e “importante para sociedade”. Depois selecione o parágrafo e aplique alinhamento justificado.',blocks:[
    {id:'body',text:'Os pesquisador analisa os resultados de diferentes estudos. A leitura crítica é importante para sociedade.',align:'left'}
  ],checks:[
    {label:'Corrigir concordância de “Os pesquisador analisa”',test:()=>/Os pesquisadores analisam/i.test(txt('body'))},
    {label:'Corrigir “importante para sociedade”',test:()=>/importante para a sociedade/i.test(txt('body'))},
    {label:'Justificar o parágrafo revisado',test:()=>alignment('body')==='justify'}
  ]},
  {title:'Configurar o layout ABNT',short:'Papel e margens',xp:200,desc:'Prepare um documento A4, em retrato, com as margens indicadas para o anverso.',hint:'Abra Layout. Selecione papel A4, orientação Retrato e margens ABNT: superior/esquerda 3 cm e inferior/direita 2 cm.',pages:[{type:'body',blocks:[{id:'layoutTitle',text:'INTRODUÇÃO',align:'left'},{id:'layoutBody',text:'Um documento acadêmico começa com uma configuração adequada de papel, orientação e margens.'}]}],checks:[
    {label:'Definir papel A4',test:()=>settings().size==='a4'},
    {label:'Selecionar orientação retrato',test:()=>settings().orientation==='portrait'},
    {label:'Aplicar margens superior/esquerda 3 cm e inferior/direita 2 cm',test:()=>isABNTMargins()}
  ]},
  {title:'Montagem da capa acadêmica',short:'Capa ABNT',xp:250,desc:'Organize e formate a capa. Edite os campos fictícios e centralize instituição, autor, título, cidade e ano.',hint:'Configure Layout > margens ABNT. Clique em cada campo da capa e escolha Centralizar. Complete a cidade e o ano com Porto Feliz e 2026. A NBR 14724 exige os elementos, mas não padroniza todas as distâncias verticais.',pages:[{type:'cover',blocks:[
    {id:'institution',text:'ETEC DE PORTO FELIZ',align:'left'},
    {id:'author',text:'ESTUDANTE PESQUISADOR',align:'left'},
    {id:'coverTitle',text:'A IMPORTÂNCIA DA PESQUISA CIENTÍFICA',align:'left'},
    {id:'coverCity',text:'[CIDADE]',align:'left'},
    {id:'coverYear',text:'[ANO]',align:'left'}
  ]}],checks:[
    {label:'Aplicar as margens ABNT na capa',test:()=>isABNTMargins()},
    {label:'Centralizar instituição e autoria',test:()=>alignment('institution')==='center'&&alignment('author')==='center'},
    {label:'Centralizar o título do trabalho',test:()=>alignment('coverTitle')==='center'},
    {label:'Inserir cidade Porto Feliz e ano 2026',test:()=>/porto feliz/i.test(txt('coverCity'))&&/\b2026\b/.test(txt('coverYear'))&&alignment('coverCity')==='center'&&alignment('coverYear')==='center'}
  ]},
  {title:'Paginação sem mistério',short:'Numeração de páginas',xp:300,desc:'Insira a numeração automática e observe que capa e pré-textuais não exibem números. A contagem começa na folha de rosto.',hint:'Abra Inserir > Inserir numeração. A capa não é contada; a folha de rosto e o sumário são contados, mas sem número visível. No exemplo, a introdução deve mostrar 3.',pages:[
    {type:'cover',blocks:[{id:'pgCover',text:'CAPA DO TRABALHO',locked:true}]},
    {type:'titlepage',blocks:[{id:'pgTitle',text:'FOLHA DE ROSTO',locked:true}]},
    {type:'toc',blocks:[{id:'pgTOC',text:'SUMÁRIO',locked:true}]},
    {type:'body',blocks:[{id:'pgIntro',text:'1 INTRODUÇÃO',locked:true}]},
    {type:'body',blocks:[{id:'pgMethods',text:'2 METODOLOGIA',locked:true}]}
  ],checks:[
    {label:'Inserir números automáticos nas páginas textuais',test:()=>settings().numbering===true},
    {label:'Manter capa e páginas pré-textuais sem número visível',test:()=>!document.querySelector('.doc-page[data-type="cover"] .page-number')&&!document.querySelector('.doc-page[data-type="titlepage"] .page-number')&&!document.querySelector('.doc-page[data-type="toc"] .page-number')},
    {label:'Mostrar 3 na introdução e 4 na metodologia',test:()=>document.querySelectorAll('.doc-page[data-type="body"] .page-number')[0]?.textContent==='3'&&document.querySelectorAll('.doc-page[data-type="body"] .page-number')[1]?.textContent==='4'}
  ]},
  {title:'Sumário automático',short:'Sumário dinâmico',xp:350,desc:'Na Página Inicial → Estilos, aplique Título 1 às seções e Subtítulo à subseção. Depois numere e gere o sumário automático.',hint:'Na aba Página Inicial, selecione cada seção e clique em Título 1. Para “2.1 Procedimentos”, escolha Subtítulo. Depois, na aba Inserir, adicione os números e gere o sumário (3, 4, 4, 5).',pages:[
    {type:'cover',blocks:[{id:'tocCover',text:'TRABALHO DE PESQUISA',locked:true}]},
    {type:'titlepage',blocks:[{id:'tocFront',text:'FOLHA DE ROSTO',locked:true}]},
    {type:'toc',blocks:[]},
    {type:'body',blocks:[{id:'headingIntro',text:'1 INTRODUÇÃO',heading:0},{id:'introText',text:'Esta seção apresenta o assunto investigado.',locked:true}]},
    {type:'body',blocks:[{id:'headingMethod',text:'2 METODOLOGIA',heading:0},{id:'headingSubmethod',text:'2.1 Procedimentos de coleta',heading:0},{id:'methodText',text:'Esta seção descreve o método utilizado.',locked:true}]},
    {type:'body',blocks:[{id:'headingResults',text:'3 RESULTADOS',heading:0},{id:'resultsText',text:'Esta seção discute os resultados.',locked:true}]}
  ],checks:[
    {label:'Aplicar Título 1 às três seções principais',test:()=>['headingIntro','headingMethod','headingResults'].every(id=>headingOf(id)===1)},
    {label:'Aplicar Subtítulo (Título 2) à subseção 2.1',test:()=>headingOf('headingSubmethod')===2},
    {label:'Inserir numeração automática',test:()=>settings().numbering===true},
    {label:'Gerar sumário a partir dos títulos formatados',test:()=>tocFresh()&&document.querySelectorAll('.toc-entry').length===4&&document.querySelectorAll('.toc-entry.sublevel').length===1},
    {label:'Conferir as páginas 3, 4, 4 e 5 no sumário',test:()=>Array.from(document.querySelectorAll('.toc-entry .toc-page')).map(e=>e.textContent).join(',')==='3,4,4,5'}
  ]},
  {title:'Desafio final: revisão completa',short:'Desafio final',xp:500,desc:'Agora sem passo a passo: revise título, formatação, citação, referência e texto.',hint:'Relembre os desafios anteriores: título centralizado, corpo justificado, autoria e ano na citação, concordância e referência estruturada.',blocks:[
    {id:'title',text:'A ESCRITA ACADEMICA',align:'left'},
    {id:'body',text:'Os estudante produz conhecimento por meio de leituras e pesquisas. A revisão é importante para qualidade dos trabalhos.',align:'left',line:'1'},
    {id:'citation',text:'A escrita acadêmica exige clareza ([AUTOR], [ANO]).'},
    {id:'data',text:'FONTE FICTÍCIA PARA CITAÇÃO E REFERÊNCIA: Maria Silva | Práticas de pesquisa | São Paulo | Editora Escola | 2020',locked:true},
    {id:'reference',text:'Silva, Maria, Práticas de pesquisa, 2020, São Paulo, Editora Escola.'}
  ],checks:[
    {label:'Corrigir e centralizar o título',test:()=>alignment('title')==='center' && /ACADÊMICA/i.test(txt('title'))},
    {label:'Corrigir concordância e justificar o texto',test:()=>/Os estudantes produzem/i.test(txt('body')) && /para a qualidade/i.test(txt('body')) && alignment('body')==='justify'},
    {label:'Aplicar entrelinhas 1,5 ao texto',test:()=>line('body')==='1.5'},
    {label:'Completar citação com SILVA e 2020',test:()=>/silva/i.test(txt('citation')) && /2020/.test(txt('citation')) && !/\[AUTOR\]|\[ANO\]/i.test(txt('citation'))},
    {label:'Estruturar a referência da fonte',test:()=>/^SILVA,\s*Maria\.\s*Práticas de pesquisa\.\s*São Paulo:\s*Editora Escola,\s*2020\.$/i.test(txt('reference').trim())}
  ]}
 ];
// Desafio final integrado: revisão + capa + estilos + sumário + paginação.
missions[missions.length-1].title='Desafio final: trabalho acadêmico completo';
missions[missions.length-1].desc='Corrija o documento completo: capa, formatação, citação, referências, títulos, numeração e sumário automático.';
missions[missions.length-1].hint='Comece por Layout (A4, retrato, margens ABNT); depois formate a capa e o texto. Na Página Inicial, use Estilos → Título 1 e Subtítulo. Depois, em Inserir, numere e gere o sumário.';
missions[missions.length-1].xp=650;
missions[missions.length-1].pages=[
 {type:'cover',blocks:[{id:'institution',text:'ETEC DE PORTO FELIZ',align:'left'},{id:'author',text:'ESTUDANTE PESQUISADOR',align:'left'},{id:'coverTitle',text:'A ESCRITA ACADEMICA',align:'left'},{id:'coverCity',text:'[CIDADE]',align:'left'},{id:'coverYear',text:'[ANO]',align:'left'}]},
 {type:'titlepage',blocks:[{id:'titlePage',text:'FOLHA DE ROSTO: apresentação do trabalho e identificação dos autores',locked:true}]},
 {type:'toc',blocks:[]},
 {type:'body',blocks:[{id:'title',text:'1 INTRODUÇÃO',align:'left'},{id:'body',text:'Os estudante produz conhecimento por meio de leituras e pesquisas. A revisão é importante para qualidade dos trabalhos.',align:'left',line:'1'}]},
 {type:'body',blocks:[{id:'methodTitle',text:'2 METODOLOGIA'},{id:'methodSubtitle',text:'2.1 Procedimentos de pesquisa'},{id:'citation',text:'A escrita acadêmica exige clareza ([AUTOR], [ANO]).'}]},
 {type:'body',blocks:[{id:'referencesTitle',text:'REFERÊNCIAS'},{id:'data',text:'FONTE FICTÍCIA PARA CITAÇÃO E REFERÊNCIA: Maria Silva | Práticas de pesquisa | São Paulo | Editora Escola | 2020',locked:true},{id:'reference',text:'Silva, Maria, Práticas de pesquisa, 2020, São Paulo, Editora Escola.'}]}
];
missions[missions.length-1].checks=[
 {label:'Configurar A4, retrato e margens ABNT',test:()=>settings().size==='a4'&&settings().orientation==='portrait'&&isABNTMargins()},
 {label:'Centralizar elementos da capa e completar Porto Feliz, 2026',test:()=>['institution','author','coverTitle','coverCity','coverYear'].every(id=>alignment(id)==='center')&&/acadêmica/i.test(txt('coverTitle'))&&/porto feliz/i.test(txt('coverCity'))&&/2026/.test(txt('coverYear'))},
 {label:'Corrigir concordância e justificar introdução',test:()=>/Os estudantes produzem/i.test(txt('body'))&&/para a qualidade/i.test(txt('body'))&&alignment('body')==='justify'},
 {label:'Aplicar entrelinhas 1,5 no corpo do texto',test:()=>line('body')==='1.5'},
 {label:'Corrigir citação: Silva, 2020',test:()=>/silva/i.test(txt('citation'))&&/2020/.test(txt('citation'))&&!/\[AUTOR\]|\[ANO\]/i.test(txt('citation'))},
 {label:'Corrigir referência bibliográfica',test:()=>/^SILVA,\s*Maria\.\s*Práticas de pesquisa\.\s*São Paulo:\s*Editora Escola,\s*2020\.$/i.test(txt('reference').trim())},
 {label:'Definir as três seções principais como Título 1',test:()=>['title','methodTitle','referencesTitle'].every(id=>headingOf(id)===1)},
 {label:'Marcar 2.1 Procedimentos como Subtítulo (Título 2)',test:()=>headingOf('methodSubtitle')===2},
 {label:'Inserir numeração automática a partir do texto',test:()=>settings().numbering&&document.querySelector('.doc-page[data-type="body"] .page-number')?.textContent==='3'},
 {label:'Gerar sumário com três seções e um subtítulo, páginas corretas',test:()=>tocFresh()&&document.querySelectorAll('.toc-entry.sublevel').length===1&&Array.from(document.querySelectorAll('.toc-entry .toc-page')).map(e=>e.textContent).join(',')==='3,4,4,5'}
];
const $=id=>document.getElementById(id);
const STORE='academico-quest-v2-users';
const SESSION='academico-quest-v2-session';
const blankPlayer=name=>({name,current:0,completed:{},drafts:{},started:{},margin:'normal',docSettings:{},docMeta:{},schemaVersion:3});
let users={};let playerId=null;let state=null;let lastBlockId=null;let needsRecheck=false;let tickHandle=null;
try{const raw=JSON.parse(localStorage.getItem(STORE)||'{}');if(raw&&typeof raw==='object'&&!Array.isArray(raw))users=raw;}catch{}
function persist(){try{localStorage.setItem(STORE,JSON.stringify(users));}catch{setFeedback('O navegador não conseguiu salvar. Verifique o espaço disponível.');}}
function normalizeName(name){return name.trim().replace(/\s+/g,' ').slice(0,20);}
function userKey(name){return name.toLocaleLowerCase('pt-BR');}
function xpFor(missionIndex,seconds){const base=missions[missionIndex].xp;const bonus=seconds<=120?Math.round(base*.5):seconds<=300?Math.round(base*.25):0;return {base,bonus,total:base+bonus};}
function scoreOf(u){return Object.values(u.completed||{}).reduce((sum,v)=>sum+(Number(v.total)||0),0);}
function totalSeconds(index){return Math.max(0,Math.floor((Date.now()-(Number(state.started[index])||Date.now()))/1000));}
function timeText(seconds){const m=Math.floor(seconds/60),s=seconds%60;return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}
function showTimer(){if(!state)return;const index=state.current;const elapsed=state.completed[index]?state.completed[index].seconds:totalSeconds(index);$('missionTimer').textContent='⏱ '+timeText(elapsed);const potential=state.completed[index]?state.completed[index].bonus:xpFor(index,elapsed).bonus;$('bonusReward').textContent='+'+potential;}
// Missão 3: as respostas estruturadas são guardadas separadamente do texto do editor.
function sourceAnswer(field){return state?.sourceLab?.[field];}
function renderSourceLab(){
  const host=document.createElement('section');host.className='source-lab';host.setAttribute('aria-label','Investigação de fontes');
  host.innerHTML=`<div class="lab-kicker">🔎 DOSSIÊ DE INVESTIGAÇÃO · MISSÃO 03</div>
  <h3>Analise antes de decidir</h3><p class="lab-help">Use os três cartões de fonte acima. O desafio é escolher a fonte mais adequada <strong>para a afirmação do caso</strong>, não descobrir qual publicação é perfeita.</p>
  <fieldset><legend>1 · Qual fonte sustenta melhor a afirmação apresentada?</legend>
    <label><input type="radio" name="source-choice" value="A"> Fonte A · Artigo de divulgação</label>
    <label><input type="radio" name="source-choice" value="B"> Fonte B · Relatório de pesquisa</label>
    <label><input type="radio" name="source-choice" value="C"> Fonte C · Pesquisa comercial</label>
  </fieldset>
  <fieldset><legend>2 · Quais evidências ajudam a verificar sua escolha? <small>(marque duas)</small></legend>
    <label><input type="checkbox" data-source-field="methods"> Descreve como as informações foram coletadas</label>
    <label><input type="checkbox" data-source-field="sample"> Informa quem participou e o tamanho da amostra</label>
    <label><input type="checkbox" data-source-field="recent"> É a mais recente das três publicações</label>
    <label><input type="checkbox" data-source-field="emphatic"> Usa frases convincentes e conclusões definitivas</label>
  </fieldset>
  <fieldset><legend>3 · Qual conclusão seria cuidadosa e fiel aos dados?</legend>
    <label><input type="radio" name="source-limitation" value="causes"> O estudo comprova que telas causam menos sono em todos os adolescentes</label>
    <label><input type="radio" name="source-limitation" value="association"> Os resultados mostram associação na amostra estudada, mas não provam causa e efeito</label>
    <label><input type="radio" name="source-limitation" value="none"> Como a instituição é identificada, não existem limitações</label>
  </fieldset>
  <fieldset><legend>4 · Antes de citar o relatório, o que você faria?</legend>
    <label><input type="radio" name="source-next" value="original"> Procuraria o relatório original, conferiria o método e os resultados citados</label>
    <label><input type="radio" name="source-next" value="shares"> Conferiria quantas vezes a publicação foi compartilhada</label>
    <label><input type="radio" name="source-next" value="headline"> Usaria apenas o título e a data, sem ler os dados</label>
  </fieldset>
  <p class="lab-footnote">Todas as fontes deste exercício são fictícias. Os números foram criados para treinamento de leitura crítica.</p>`;
  const old=state.sourceLab||{};
  host.querySelectorAll('input').forEach(input=>{
    const key=input.dataset.sourceField;
    if(key){input.checked=old[key]===true;}else if(input.name==='source-choice'){input.checked=old.choice===input.value;}else if(input.name==='source-limitation'){input.checked=old.limitation===input.value;}else if(input.name==='source-next'){input.checked=old.next===input.value;}
    input.addEventListener('change',()=>{
      state.sourceLab=state.sourceLab||{};
      if(key){state.sourceLab[key]=input.checked;}else if(input.name==='source-choice'){state.sourceLab.choice=input.value;}else if(input.name==='source-limitation'){state.sourceLab.limitation=input.value;}else if(input.name==='source-next'){state.sourceLab.next=input.value;}
      persist();
      setFeedback('Resposta registrada. Ao terminar a análise, clique em Verificar missão.');
    });
  });
  $('editor').append(host);
}
function showLogin(){if(tickHandle)clearInterval(tickHandle);tickHandle=null;playerId=null;state=null;sessionStorage.removeItem(SESSION);$('app').hidden=true;$('loginScreen').hidden=false;$('nickname').focus();}
function enter(name){name=normalizeName(name);const id=userKey(name);if(!users[id])users[id]=blankPlayer(name);state=users[id];state.name=name;state.current=Math.max(0,Math.min(missions.length-1,Number(state.current)||0));state.completed=state.completed||{};state.drafts=state.drafts||{};state.started=state.started||{};state.docSettings=state.docSettings||{};state.docMeta=state.docMeta||{};state.sourceLab=state.sourceLab||{};
if(state.schemaVersion!==3){ // v2: o antigo desafio final (índice 5) agora é o último.
  if(state.completed[5]){delete state.completed[5];} // A versão integrada exige nova avaliação.
  if(state.drafts[5]){delete state.drafts[5];}
  if(state.started[5]){delete state.started[5];}
  state.schemaVersion=3;
}
playerId=id;sessionStorage.setItem(SESSION,id);persist();$('loginScreen').hidden=true;$('app').hidden=false;$('currentUser').textContent=name;$('avatar').textContent=name.charAt(0).toUpperCase();$('editor').replaceChildren();loadMission(state.current);if(tickHandle)clearInterval(tickHandle);tickHandle=setInterval(showTimer,1000);}
$('loginForm').addEventListener('submit',event=>{event.preventDefault();const name=normalizeName($('nickname').value);if(name.length<2)return;enter(name);});
$('logoutBtn').addEventListener('click',()=>{saveDraft();showLogin();});
const savedSession=sessionStorage.getItem(SESSION);if(savedSession&&users[savedSession])enter(users[savedSession].name);
function makeBlock(entry){const p=document.createElement('p');p.dataset.block=entry.id;p.textContent=entry.text;p.style.textAlign=entry.align||'left';p.style.lineHeight=entry.line||'1.5';p.style.fontSize=(entry.size||12)+'pt';p.style.fontFamily='Arial';p.contentEditable=entry.locked?'false':'true';p.dataset.heading=entry.heading||0;if(entry.locked)p.className='locked-block';return p;}
function block(id){return Array.from($('editor').querySelectorAll('[data-block]')).find(p=>p.dataset.block===id);}
function txt(id){return block(id)?.textContent||'';}
function alignment(id){return block(id)?.style.textAlign||'left';}
function line(id){return block(id)?.style.lineHeight||'1.5';}
// Serialize only expected paragraphs and supported formatting. Never restore unsanitized HTML from localStorage.
function serializeDraft(){return Array.from($('editor').querySelectorAll('[data-block]')).map(p=>({id:p.dataset.block,text:p.textContent||'',align:p.style.textAlign||'left',line:p.style.lineHeight||'1.5',size:p.style.fontSize||'12pt',family:p.style.fontFamily||'Arial',indent:p.style.textIndent||'',fontWeight:p.style.fontWeight||'',fontStyle:p.style.fontStyle||'',decoration:p.style.textDecoration||'',heading:Number(p.dataset.heading)||0}));}
function restoreDraft(draft){if(!Array.isArray(draft))return;draft.forEach(d=>{const p=block(String(d.id));if(!p||p.contentEditable==='false')return;p.textContent=String(d.text||'').slice(0,10000);if(['left','center','right','justify'].includes(d.align))p.style.textAlign=d.align;if(['1','1.15','1.5','2'].includes(d.line))p.style.lineHeight=d.line;if(/^\d{1,2}pt$/.test(d.size))p.style.fontSize=d.size;if(['Arial','Times New Roman','Calibri','Georgia'].includes(d.family))p.style.fontFamily=d.family;if(d.indent==='1.25cm')p.style.textIndent=d.indent;if(d.fontWeight==='bold')p.style.fontWeight='bold';if(d.fontStyle==='italic')p.style.fontStyle='italic';if(d.decoration==='underline')p.style.textDecoration='underline';if([0,1,2].includes(Number(d.heading)))setHeading(p,Number(d.heading),false);});}
function saveDraft(){if(!state)return;state.drafts[state.current]=serializeDraft();persist();}
function renderNav(){const nav=$('missionNav');nav.replaceChildren();missions.forEach((m,i)=>{const available=i===0||Boolean(state.completed[i-1]);const done=Boolean(state.completed[i]);const btn=document.createElement('button');btn.type='button';btn.className='mission-link'+(i===state.current?' active':'')+(done?' done':'');btn.disabled=!available;const num=document.createElement('span');num.className='number';num.textContent=done?'✓':String(i+1).padStart(2,'0');const info=document.createElement('span');const title=document.createElement('strong');title.textContent=m.short;const meta=document.createElement('small');meta.textContent=(done?state.completed[i].total:m.xp)+' XP'+(i===missions.length-1?' · Final':'');info.append(title,meta);btn.append(num,info);btn.addEventListener('click',()=>loadMission(i));nav.append(btn);});const total=scoreOf(state);$('totalXp').textContent=total.toLocaleString('pt-BR');$('levelBadge').textContent='Nível '+(1+Math.floor(total/450));const amount=Object.keys(state.completed).length;$('progressText').textContent=amount+'/'+missions.length;$('progressFill').style.width=(amount/missions.length*100)+'%';}
function setFeedback(text,type=''){$('feedback').className='feedback '+type;$('feedback').textContent=text;}
function refreshObjectives(results){const m=missions[state.current];$('objectives').replaceChildren();(results||m.checks.map(()=>false)).forEach((passed,i)=>{const item=document.createElement('div');item.className='objective'+(passed?' met':'');const circle=document.createElement('span');circle.className='mark';circle.textContent=passed?'✓':'';const label=document.createElement('span');label.textContent=m.checks[i].label;item.append(circle,label);$('objectives').append(item);});const passed=(results||[]).filter(Boolean).length;$('objectiveProgress').textContent=passed+' de '+m.checks.length+' concluídos';$('objectiveFill').style.width=(passed/m.checks.length*100)+'%';}

// Páginas didáticas: cada seção .doc-page é uma folha lógica A4; não há paginação automática por transbordamento de texto.
const PRESET_MARGINS={normal:{top:2.5,bottom:2.5,left:2.5,right:2.5},abnt:{top:3,bottom:2,left:3,right:2},narrow:{top:1.5,bottom:1.5,left:1.5,right:1.5}};
function settings(){const idx=state.current;return state.docSettings[idx]||(state.docSettings[idx]={margin:'normal',orientation:'portrait',size:'letter',numbering:false});}
function currentMargins(){const s=settings();return s.margin==='custom'?{...(s.customMargins||PRESET_MARGINS.normal)}:{...(PRESET_MARGINS[s.margin]||PRESET_MARGINS.normal)};}
function isABNTMargins(){const m=currentMargins();return Math.abs(m.top-3)<.01&&Math.abs(m.bottom-2)<.01&&Math.abs(m.left-3)<.01&&Math.abs(m.right-2)<.01;}
function applyMarginsCSS(){const m=currentMargins(),ed=$('editor');for(const side of ['top','right','bottom','left'])ed.style.setProperty('--page-margin-'+side,m[side]+'cm');}
function showMarginsDialog(){const m=currentMargins();for(const side of ['top','bottom','left','right'])$('margin'+side[0].toUpperCase()+side.slice(1)).value=m[side].toFixed(1);$('marginError').textContent='';updateMarginPreview();$('marginDialog').showModal();}
function updateMarginPreview(){const vals=Object.fromEntries(['top','bottom','left','right'].map(side=>[side,Number($('margin'+side[0].toUpperCase()+side.slice(1)).value)||0]));const el=$('marginPreview');el.style.padding=[vals.top,vals.right,vals.bottom,vals.left].map(n=>Math.max(5,Math.min(n*9,65))+'px').join(' ');}
function applyCustomMargins(event){event.preventDefault();const m={};for(const side of ['top','bottom','left','right']){const input=$('margin'+side[0].toUpperCase()+side.slice(1));if(!input.checkValidity()){input.reportValidity();return;}const v=Number(input.value);if(!Number.isFinite(v)||v<.5||v>8){$('marginError').textContent='Insira valores de 0,5 a 8 cm.';return;}m[side]=Math.round(v*10)/10;}changeSettings({margin:'custom',customMargins:m});$('marginDialog').close();setFeedback('Margens personalizadas aplicadas: superior '+m.top+' cm, inferior '+m.bottom+' cm, esquerda '+m.left+' cm, direita '+m.right+' cm.','success');}

function metadata(){return state.docMeta[state.current]||(state.docMeta[state.current]={tocSignature:null,tocRows:[]});}
function docPages(){return Array.from($('editor').querySelectorAll('.doc-page'));}
function renderPages(m){const ed=$('editor');ed.replaceChildren();ed.classList.toggle('multipage',Boolean(m.pages));if(!m.pages){ed.append(...m.blocks.map(makeBlock));return;}
  m.pages.forEach((page,i)=>{const sheet=document.createElement('section');sheet.className='doc-page';sheet.dataset.type=page.type;sheet.dataset.pageIndex=i;sheet.setAttribute('aria-label','Folha '+(i+1)+': '+page.type);
    const tag=document.createElement('div');tag.className='page-type-tag';tag.textContent=({cover:'Capa',titlepage:'Folha de rosto',toc:'Sumário',body:'Texto'})[page.type]||'Página';
    sheet.append(tag,...(page.blocks||[]).map(makeBlock));if(page.type==='toc'&&!page.blocks?.length){const heading=document.createElement('h2');heading.className='toc-title';heading.textContent='SUMÁRIO';sheet.append(heading);const entries=document.createElement('div');entries.className='toc-entries';sheet.append(entries);}ed.append(sheet);});
}
function logicalPageNumber(sheet){const all=docPages();const pos=all.indexOf(sheet);return all.slice(0,pos+1).filter(p=>p.dataset.type!=='cover').length;}
function applyDocumentSettings(){const s=settings();applyMarginsCSS();$('marginSelect').value=s.margin;$('paperSize').value=s.size;$('editor').dataset.margins=s.margin;$('editor').dataset.paper=s.size;$('editor').classList.toggle('landscape',s.orientation==='landscape');$('orientationBtn').textContent=s.orientation==='landscape'?'▱ Paisagem':'▯ Retrato';renderPageNumbers();renderTOC();}
function renderPageNumbers(){docPages().forEach(page=>{page.querySelectorAll('.page-number').forEach(x=>x.remove());if(!settings().numbering||page.dataset.type!=='body')return;const badge=document.createElement('span');badge.className='page-number';badge.textContent=String(logicalPageNumber(page));badge.setAttribute('aria-label','Página '+badge.textContent);page.append(badge);});}
function setHeading(p,level,save=true){p.dataset.heading=level;p.classList.toggle('heading-one',level===1);p.classList.toggle('heading-two',level===2);if(save){saveDraft();renderTOC();updateSelection();setFeedback(level===0?'Estilo Normal aplicado.':(level===1?'Estilo Título 1 aplicado.':'Estilo Subtítulo (Título 2) aplicado.')+' Atualize o sumário se já tiver sido criado.');}}
function headingOf(id){return Number(block(id)?.dataset.heading)||0;}
function headings(){return docPages().filter(p=>p.dataset.type==='body').flatMap(p=>Array.from(p.querySelectorAll('[data-heading="1"],[data-heading="2"]')).map(h=>({id:h.dataset.block,title:(h.textContent||'').trim().replace(/\s+/g,' '),level:Number(h.dataset.heading),page:logicalPageNumber(p)}))).filter(h=>h.title);}
function signature(){return JSON.stringify({headings:headings(),pageTypes:docPages().map(p=>p.dataset.type)});}
function tocFresh(){const meta=metadata();return Boolean(meta.tocSignature&&meta.tocSignature===signature()&&meta.tocRows?.length);}
function updateTocStatus(){const meta=metadata(),status=$('tocRibbonStatus'),exists=Boolean(meta.tocSignature),fresh=tocFresh();const live=docPages().some(p=>p.dataset.type==='toc'&&p.querySelector('.toc-entries'));status.textContent=!live?'Sem folha de sumário':!exists?'Aguardando geração':fresh?'✓ Sumário atualizado':'⚠ Atualização necessária';status.className='toc-ribbon-status '+(fresh?'is-fresh':exists?'is-stale':'');$('updateToc').disabled=!live||!exists;}
function renderTOC(){const page=docPages().find(p=>p.dataset.type==='toc'&&p.querySelector('.toc-entries'));if(!page){updateTocStatus();return;}const el=page.querySelector('.toc-entries'),meta=metadata();el.replaceChildren();if(!meta.tocRows?.length){const msg=document.createElement('div');msg.className='toc-empty';msg.textContent='Seu sumário aparecerá aqui. Em Página Inicial → Estilos, aplique Título 1 às seções e Subtítulo (Título 2) às subseções. Depois use Inserir → Inserir sumário automático.';el.append(msg);}else{meta.tocRows.forEach(row=>{const div=document.createElement('div');div.className='toc-entry'+(row.level===2?' sublevel':'');const title=document.createElement('span');title.className='toc-name';title.textContent=row.title;const dots=document.createElement('span');dots.className='toc-dots';const number=document.createElement('span');number.className='toc-page';number.textContent=row.page;div.append(title,dots,number);if(row.id&&block(row.id)){div.classList.add('toc-link');div.tabIndex=0;div.role='link';div.title='Ir para '+row.title;const go=()=>block(row.id)?.scrollIntoView({behavior:'smooth',block:'center'});div.addEventListener('click',go);div.addEventListener('keydown',e=>{if(e.key==='Enter')go();});}el.append(div);});}page.classList.toggle('toc-stale',Boolean(meta.tocSignature&&!tocFresh()));updateTocStatus();}
function generateTOC(){if(!$('editor').classList.contains('multipage')||!docPages().some(p=>p.dataset.type==='toc'&&p.querySelector('.toc-entries'))){setFeedback('Este documento não tem uma página de sumário automático.');return;}const list=headings();if(!list.length){setFeedback('Primeiro selecione os títulos e aplique Página Inicial → Estilos → Título 1 ou Subtítulo.');return;}const meta=metadata();meta.tocRows=list.map(h=>({...h}));meta.tocSignature=signature();renderTOC();persist();setFeedback('Sumário '+(list.length===1?'criado com 1 seção':'atualizado com '+list.length+' seções')+'. Clique em uma entrada para ir ao título. Se alterar títulos, use Atualizar sumário.','success');}
function changeSettings(patch){Object.assign(settings(),patch);applyDocumentSettings();persist();}

function loadMission(index){if(!state||(index>0&&!state.completed[index-1]))return;if($('editor').children.length)saveDraft();state.current=index;const m=missions[index];if(!state.started[index]&&!state.completed[index])state.started[index]=Date.now();lastBlockId=null;$('missionKicker').textContent=index===missions.length-1?'DESAFIO FINAL':'MISSÃO '+String(index+1).padStart(2,'0');$('missionTitle').textContent=m.title;$('missionDesc').textContent=m.desc;$('missionXp').textContent=m.xp;$('baseReward').textContent=m.xp;$('docName').textContent=index===missions.length-1?'Trabalho_final.docx':`Missao_0${index+1}.docx`;renderPages(m);restoreDraft(state.drafts[index]);if(index===2)renderSourceLab();applyDocumentSettings();$('hintBox').hidden=true;$('hintBox').textContent=m.hint;$('nextBtn').hidden=!state.completed[index]||index===missions.length-1;refreshObjectives();if(state.completed[index]){const r=state.completed[index];setFeedback(`Missão concluída! +${r.base} XP base e +${r.bonus} XP bônus.`, 'success');}else{setFeedback('O documento contém problemas de propósito. Edite os trechos e clique em Verificar missão.');}showTimer();countWords();renderNav();persist();}
function countWords(){const t=$('editor').textContent.trim();$('wordCount').textContent=(t?t.split(/\s+/).length:0)+' palavras';}
function verifyMission(){const m=missions[state.current];const checks=m.checks.map(c=>{try{return Boolean(c.test());}catch{return false;}});refreshObjectives(checks);const hits=checks.filter(Boolean).length;if(state.current===2){const detail=checks.every(Boolean)?'Você fundamentou a escolha com método e amostra, respeitou a diferença entre associação e causalidade e indicou uma checagem do original.':'Revise o objetivo pendente: pertinência da fonte, descrição do método e amostra, limite da conclusão ou verificação do relatório original.';setFeedback(detail,checks.every(Boolean)?'success':'error');}if(hits===checks.length){if(!state.completed[state.current]){const seconds=totalSeconds(state.current);state.completed[state.current]={...xpFor(state.current,seconds),seconds,finishedAt:new Date().toISOString()};}const r=state.completed[state.current];setFeedback(`🎉 Missão concluída! +${r.base} XP e +${r.bonus} XP de rapidez. ${state.current===missions.length-1?'Você terminou a jornada! 🏆':''}`,'success');$('nextBtn').hidden=state.current===missions.length-1;renderNav();showTimer();saveDraft();}else{setFeedback(`Você concluiu ${hits} de ${checks.length} objetivos. Confira os itens pendentes e tente de novo.`, 'error');saveDraft();}}
function selectionParagraph(){let n=window.getSelection()?.anchorNode;if(n?.nodeType===Node.TEXT_NODE)n=n.parentElement;const p=n?.closest?.('[data-block]');if(p&&$('editor').contains(p)&&p.contentEditable==='true'){lastBlockId=p.dataset.block;return p;}const last=lastBlockId&&block(lastBlockId);return last?.contentEditable==='true'?last:null;}
function selectedParagraph(){const p=selectionParagraph();if(!p)setFeedback('Clique dentro de um parágrafo editável para aplicar a formatação.');return p;}
function updateSelection(){const p=selectionParagraph();$('selectionStatus').textContent=p?'Editando: '+p.dataset.block:'Clique no parágrafo para formatar';if(p){$('fontFamily').value=['Arial','Times New Roman','Calibri','Georgia'].includes(p.style.fontFamily)?p.style.fontFamily:'Arial';$('fontSize').value=parseInt(p.style.fontSize,10)||12;$('lineHeight').value=p.style.lineHeight||'1.5';document.querySelectorAll('[data-align]').forEach(b=>b.classList.toggle('active',b.dataset.align===(p.style.textAlign||'left')));$('heading1Btn').classList.toggle('active',p.dataset.heading==='1');$('heading2Btn').classList.toggle('active',p.dataset.heading==='2');}}
function applyParagraph(property,value){const p=selectedParagraph();if(!p)return;p.style[property]=value;saveDraft();updateSelection();}
function applyInline(cmd,value){const p=selectedParagraph();if(!p)return;const sel=window.getSelection();if(!sel||sel.isCollapsed||!p.contains(sel.anchorNode)){setFeedback('Selecione um trecho de texto antes de usar esta ferramenta.');return;}document.execCommand(cmd,false,value||null);saveDraft();}
function preventBlur(e){e.preventDefault();}
document.querySelectorAll('.ribbon button').forEach(b=>b.addEventListener('mousedown',preventBlur));
for(const [id,cmd] of [['boldBtn','bold'],['italicBtn','italic'],['underlineBtn','underline']])$(id).addEventListener('click',()=>applyInline(cmd));
$('clearFormatBtn').addEventListener('click',()=>applyInline('removeFormat'));
$('highlightBtn').addEventListener('click',()=>applyInline('hiliteColor','#fff2a8'));
$('fontFamily').addEventListener('change',e=>applyParagraph('fontFamily',e.target.value));$('fontSize').addEventListener('change',e=>applyParagraph('fontSize',e.target.value+'pt'));$('lineHeight').addEventListener('change',e=>applyParagraph('lineHeight',e.target.value));document.querySelectorAll('[data-align]').forEach(b=>b.addEventListener('click',()=>applyParagraph('textAlign',b.dataset.align)));
$('indentBtn').addEventListener('click',()=>applyParagraph('textIndent','1.25cm'));$('indentLayout').addEventListener('click',()=>applyParagraph('textIndent','1.25cm'));$('removeIndent').addEventListener('click',()=>applyParagraph('textIndent','0'));$('spacingReset').addEventListener('click',()=>applyParagraph('textIndent','0'));
$('styleNormal').addEventListener('click',()=>{const p=selectedParagraph();if(!p)return;p.style.fontSize='12pt';p.style.fontWeight='normal';setHeading(p,0);});$('styleTitle').addEventListener('click',()=>{const p=selectedParagraph();if(!p)return;p.style.fontSize='16pt';p.style.fontWeight='bold';setHeading(p,0);});$('heading1Btn').addEventListener('click',()=>{const p=selectedParagraph();if(p)setHeading(p,1);});$('heading2Btn').addEventListener('click',()=>{const p=selectedParagraph();if(p)setHeading(p,2);});$('insertPageNumber').addEventListener('click',()=>{if(!docPages().length){setFeedback('Abra uma missão com múltiplas folhas para praticar paginação.');return;}changeSettings({numbering:true});setFeedback('Numeração inserida: os números aparecem somente nas páginas textuais.','success');});$('removePageNumber').addEventListener('click',()=>changeSettings({numbering:false}));$('generateToc').addEventListener('click',generateTOC);$('updateToc').addEventListener('click',generateTOC);
$('selectAllBtn').addEventListener('click',()=>{const p=selectedParagraph();if(!p)return;const selection=window.getSelection();const range=document.createRange();range.selectNodeContents(p);selection.removeAllRanges();selection.addRange(range);p.focus();});
$('pastePlainBtn').addEventListener('click',()=>setFeedback('Para colar sem formatação, use Ctrl+Shift+V no documento.'));
$('undoBtn').addEventListener('click',()=>{selectionParagraph()?.focus();document.execCommand('undo');saveDraft();});$('redoBtn').addEventListener('click',()=>{selectionParagraph()?.focus();document.execCommand('redo');saveDraft();});
$('marginSelect').addEventListener('change',e=>{if(e.target.value==='custom'){showMarginsDialog();e.target.value=settings().margin;return;}changeSettings({margin:e.target.value});});
$('customMarginsBtn').addEventListener('click',showMarginsDialog);
$('marginForm').addEventListener('submit',applyCustomMargins);
$('marginClose').addEventListener('click',()=>$('marginDialog').close());
$('marginCancel').addEventListener('click',()=>$('marginDialog').close());
$('marginReset').addEventListener('click',()=>{for(const side of ['top','bottom','left','right'])$('margin'+side[0].toUpperCase()+side.slice(1)).value=PRESET_MARGINS.abnt[side].toFixed(1);updateMarginPreview();});
for(const side of ['top','bottom','left','right'])$('margin'+side[0].toUpperCase()+side.slice(1)).addEventListener('input',updateMarginPreview);
$('paperSize').addEventListener('change',e=>changeSettings({size:e.target.value}));$('orientationBtn').addEventListener('click',()=>changeSettings({orientation:settings().orientation==='portrait'?'landscape':'portrait'}));
$('editor').addEventListener('click',updateSelection);$('editor').addEventListener('keyup',updateSelection);$('editor').addEventListener('input',()=>{saveDraft();countWords();needsRecheck=true;renderTOC();});
$('editor').addEventListener('paste',e=>{e.preventDefault();const plain=e.clipboardData.getData('text/plain');document.execCommand('insertText',false,plain);});
$('checkBtn').addEventListener('click',verifyMission);$('checkSpellingBtn').addEventListener('click',verifyMission);$('hintBtn').addEventListener('click',()=>{$('hintBox').hidden=!$('hintBox').hidden;});$('nextBtn').addEventListener('click',()=>loadMission(state.current+1));$('countBtn').addEventListener('click',()=>{countWords();setFeedback('Contagem de palavras atualizada na barra inferior.');});
function tab(tabName){document.querySelectorAll('.ribbon-tabs [data-tab]').forEach(b=>{const active=b.dataset.tab===tabName;b.classList.toggle('active',active);b.setAttribute('aria-selected',String(active));});for(const [name,id] of [['home','homeRibbon'],['layout','layoutRibbon'],['insert','insertRibbon'],['review','reviewRibbon'],['references','referencesRibbon']])$(id).hidden=name!==tabName;}
document.querySelectorAll('.ribbon-tabs [data-tab]').forEach(b=>b.addEventListener('click',()=>tab(b.dataset.tab)));
function info(title,html){$('dialogTitle').textContent=title;$('dialogBody').innerHTML=html;$('infoDialog').showModal();}
$('helpTab').addEventListener('click',()=>info('Como usar o editor','<p><b>1.</b> Clique no parágrafo que quer corrigir. Use Página Inicial para fonte, tamanho, alinhamento e espaçamento.</p><p><b>2.</b> Para negrito, itálico ou destaque, selecione um trecho antes de clicar no botão.</p><p><b>3.</b> Veja seus objetivos à direita e clique em Verificar missão. Você pode verificar quantas vezes quiser.</p><p><b>4.</b> O tempo começa quando você abre uma missão pela primeira vez. A pontuação base não diminui; a rapidez rende bônus nas primeiras cinco minutos.</p><p><b>5.</b> Cada apelido tem progresso próprio, salvo apenas neste navegador. Para a turma inteira compartilhar um ranking, será necessária uma versão online com servidor. Nas novas missões, cada folha é uma página lógica: o protótipo não redistribui texto longo automaticamente entre páginas.</p>'));
$('referenceGuideBtn').addEventListener('click',()=>info('Referências bibliográficas','<p>O modelo didático usado nesta oficina simplifica a montagem de referências de livros: <b>SOBRENOME, Prenome. Título. Cidade: Editora, ano.</b></p><p>Todos os livros e fontes usados nas missões são fictícios. Para um trabalho real, consulte as normas ABNT vigentes e as exigências da instituição.</p>'));
$('citationGuideBtn').addEventListener('click',()=>info('Citações acadêmicas','<p>Uma citação indireta apresenta uma ideia de outra fonte com suas palavras e deve atribuir a autoria corretamente. Os dados exemplificados no jogo são fictícios.</p><p>Uma fonte não é confiável só porque possui autor e data: examine também as evidências e a possibilidade de verificação independente.</p>'));
$('dialogClose').addEventListener('click',()=>$('infoDialog').close());
function renderRanking(){const place=$('leaderboard');place.replaceChildren();const ordered=Object.entries(users).sort((a,b)=>scoreOf(b[1])-scoreOf(a[1])||a[1].name.localeCompare(b[1].name,'pt-BR'));if(!ordered.length){const empty=document.createElement('p');empty.className='empty-ranking';empty.textContent='Ainda não há participantes.';place.append(empty);return;}ordered.forEach(([id,u],i)=>{const row=document.createElement('div');row.className='leader-item'+(id===playerId?' current':'');const position=document.createElement('span');position.className='leader-place';position.textContent=i===0?'🥇':i===1?'🥈':i===2?'🥉':'#'+(i+1);const label=document.createElement('div');label.className='leader-info';const name=document.createElement('b');name.textContent=u.name;const meta=document.createElement('small');meta.textContent=Object.keys(u.completed||{}).length+' / '+missions.length+' missões concluídas';label.append(name,meta);const points=document.createElement('span');points.className='leader-points';points.textContent=scoreOf(u).toLocaleString('pt-BR')+' XP';row.append(position,label,points);place.append(row);});}
$('rankingOpen').addEventListener('click',()=>{renderRanking();$('rankingDialog').showModal();});$('rankingClose').addEventListener('click',()=>$('rankingDialog').close());
$('clearRanking').addEventListener('click',()=>{if(!confirm('Apagar todos os apelidos, pontuações e rascunhos salvos neste navegador?'))return;users={};localStorage.removeItem(STORE);$('rankingDialog').close();showLogin();});
$('exportRanking').addEventListener('click',()=>{const ordered=Object.values(users).sort((a,b)=>scoreOf(b)-scoreOf(a));const rows=[['Posição','Apelido','XP','Missões concluídas'],...ordered.map((u,i)=>[i+1,u.name,scoreOf(u),Object.keys(u.completed||{}).length])];const csv='\ufeff'+rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(';')).join('\r\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='ranking_academico_quest.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});
