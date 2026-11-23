# MedAgenda — Testes funcionais (Fase 3)

**Responsável:** Isaac Rodrigues Vieira  
**Período previsto:** 15/11/2026 a 18/11/2026  
**Projeto:** Senac EAD — Boas Práticas de Desenvolvimento de Software  
**Repositório:** https://github.com/Senac-09/medagenda

## Objetivo
Verificar os requisitos RF01 a RF05 do MedAgenda e registrar evidências de execução.

## Ambiente e preparação
1. Abrir `index.html` no navegador.
2. Usar dados fictícios para médicos e pacientes.
3. Registrar os resultados observados nas capturas e na gravação.

**Navegador/versão:** Google Chrome  
**Data da execução:** 16/11/2026 (gravação) e capturas analisadas em 19/11/2026  
**Versão/commit testado:** Não informado  
**Resultado geral informado pelo responsável:** 28 casos executados e aprovados; nenhum erro reportado.  
**Limitação da conferência:** os prints enviados cobrem apenas partes de quatro cenários; os demais resultados se baseiam no relato do responsável, sem comprovação visual individual.

## Matriz de testes

| ID | Requisito | Cenário | Procedimento | Resultado esperado | Resultado obtido | Status | Evidência |
|---|---|---|---|---|---|---|---|
| TF01 | RF01 | Cadastrar médico válido | Preencher nome, CRM 123456/SP, especialidade, telefone com DDD, dia, início 08:00, fim 12:00; salvar | Médico aparece na lista e mensagem de sucesso | Prints mostram o formulário válido e o médico incluído na listagem, com CRM, especialidade, dias e faixa de atendimento. O responsável confirmou aprovação. | Aprovado | `evidencias/TF01-formulario-medico.png`, `evidencias/TF01-medico-cadastrado.png` |
| TF02 | RF01 | Nome obrigatório | Deixar nome vazio e preencher os demais campos válidos; salvar | Exibir erro de nome; não cadastrar | Aprovado conforme relato do responsável. A função `validarMedico` exige nome preenchido e pelo menos três caracteres, indicando o erro junto ao campo. | Aprovado | — |
| TF03 | RF01 | CRM inválido | Informar CRM 123/SP e demais campos válidos; salvar | Exibir erro de formato do CRM | Aprovado conforme relato do responsável. O código rejeita CRM fora do padrão de 4 a 6 dígitos seguido de /UF, com mensagem explicativa. | Aprovado | — |
| TF04 | RF01 | CRM duplicado | Cadastrar médico; tentar cadastrar outro com mesmo CRM | Impedir duplicidade e exibir erro | Aprovado conforme relato do responsável. Antes de salvar, o sistema compara os CRMs já cadastrados e bloqueia duplicidade, inclusive ignorando maiúsculas/minúsculas. | Aprovado | — |
| TF05 | RF01 | Telefone inválido | Informar telefone com menos de 10 dígitos; salvar | Exibir erro de telefone | Aprovado conforme relato do responsável. A validação extrai os dígitos e exige telefone médico com DDD e 10 ou 11 números. | Aprovado | — |
| TF06 | RF01 | E-mail inválido | Informar email sem @ e salvar | Exibir erro de e-mail | Aprovado conforme relato do responsável. Quando preenchido, o e-mail passa por validação de formato; o campo é opcional. | Aprovado | — |
| TF07 | RF01 | Dia obrigatório | Não marcar dia de atendimento; salvar | Exibir erro de dias | Aprovado conforme relato do responsável. O código exige pelo menos um dia de atendimento e exibe orientação quando nenhum foi marcado. | Aprovado | — |
| TF08 | RF01 | Faixa horária inválida | Início 12:00, fim 08:00; salvar | Exibir erro no horário final | Aprovado conforme relato do responsável. A rotina recusa horário final igual ou anterior ao horário inicial. | Aprovado | — |
| TF09 | RF01 | Editar médico | Cadastrar médico; clicar Editar, alterar telefone e salvar | Atualizar registro sem duplicar | Aprovado conforme relato do responsável. A edição carrega os dados no formulário e atualiza o registro pelo mesmo ID, sem criar um segundo médico. | Aprovado | — |
| TF10 | RF01 | Excluir médico | Cadastrar médico; clicar Excluir e confirmar | Remover médico da listagem | Aprovado conforme relato do responsável. O procedimento solicita confirmação e remove o médico da listagem; a implementação também remove consultas vinculadas. | Aprovado | — |
| TF11 | RF01 | Cancelar exclusão | Clicar Excluir e cancelar confirmação | Manter médico | Aprovado conforme relato do responsável. A exclusão só prossegue após confirmação; ao cancelar, o código retorna sem alterar a lista. | Aprovado | — |
| TF12 | RF02 | Busca por nome | Cadastrar dois médicos; pesquisar nome de um | Mostrar apenas médico correspondente | Aprovado conforme relato do responsável. A pesquisa consulta o nome do médico sem diferenciar maiúsculas/minúsculas e atualiza a listagem. | Aprovado | — |
| TF13 | RF02 | Busca por CRM | Pesquisar CRM cadastrado | Mostrar médico correspondente | Aprovado conforme relato do responsável. A busca também usa o CRM cadastrado e apresenta os registros correspondentes. | Aprovado | — |
| TF14 | RF02 | Filtro de especialidade | Cadastrar médicos de especialidades diferentes; filtrar | Mostrar somente especialidade escolhida | Os prints mostram que o filtro "Clínica Geral" não listou o médico de Cardiologia e o filtro "Cardiologia" exibiu o registro correspondente. | Aprovado | `evidencias/TF14-filtro-clinica-geral.png`, `evidencias/TF14-filtro-cardiologia.png` |
| TF15 | RF02 | Filtro ativo/inativo | Cadastrar médico inativo; alternar filtro de situação | Mostrar registros conforme situação | Aprovado conforme relato do responsável. O filtro de situação prevê ativos, inativos ou todos e combina esse critério com busca e especialidade. | Aprovado | — |
| TF16 | RF03 | Agenda por dia | Cadastrar médico para segundas 08:00–10:00, duração 30; selecionar segunda futura | Mostrar horários 08:00, 08:30, 09:00, 09:30 | Os prints mostram a grade de 09/12/2026 com opções de 08:00 a 11:30, a cada 30 minutos, coerentes com o atendimento 08:00–12:00 cadastrado. | Aprovado | `evidencias/TF16-selecao-medico.png`, `evidencias/TF16-grade-horarios.png` |
| TF17 | RF03 | Dia sem atendimento | Selecionar dia não marcado no cadastro do médico | Exibir mensagem de indisponibilidade | Aprovado conforme relato do responsável. Ao selecionar um dia não previsto no cadastro, o código informa que o médico não atende naquela data. | Aprovado | — |
| TF18 | RF03 | Médico inativo | Cadastrar médico inativo e abrir seleção de agendamento | Médico não aparece como opção | Aprovado conforme relato do responsável. O seletor de agendamento é preenchido apenas com médicos marcados como ativos. | Aprovado | — |
| TF19 | RF04 | Agendar consulta válida | Selecionar médico ativo, data futura atendida, horário livre e paciente/telefone válidos; reservar | Consulta aparece na tabela | O print mostra consulta registrada para Ana Paula, em 09/12/2026 às 10:00, com identificação do médico e especialidade; o responsável confirmou aprovação. | Aprovado | `evidencias/TF19-consulta-agendada.png` |
| TF20 | RF04 | Horário ocupado | Agendar consulta; voltar à mesma data e médico | Horário reservado fica indisponível | Aprovado conforme relato do responsável. A checagem de conflitos identifica consulta existente para mesmo médico, data e hora, desabilitando o horário. | Aprovado | — |
| TF21 | RF04 | Data passada | Selecionar data anterior à atual e tentar reservar | Exibir erro e impedir agendamento | Aprovado conforme relato do responsável. A validação compara a data selecionada com a data local atual e impede reservas anteriores a hoje. | Aprovado | — |
| TF22 | RF04 | Paciente obrigatório | Deixar paciente vazio; tentar reservar | Exibir erro de paciente | Aprovado conforme relato do responsável. O sistema exige nome do paciente preenchido e exibe mensagem quando o campo está vazio. | Aprovado | — |
| TF23 | RF04 | Telefone do paciente inválido | Informar telefone curto; tentar reservar | Exibir erro de telefone | Aprovado conforme relato do responsável. O print mostra mensagem de telefone inválido; o código exige 10 ou 11 dígitos com DDD. A imagem não reproduz exatamente o procedimento de telefone curto. | Aprovado | `evidencias/TF23-telefone-paciente.png` |
| TF24 | RF04 | Editar consulta | Agendar consulta; clicar Editar, alterar paciente e salvar | Atualizar consulta sem duplicar | Aprovado conforme relato do responsável. A consulta é carregada para edição, mantendo seu ID e tentando restaurar a escolha do horário previamente marcado. | Aprovado | — |
| TF25 | RF04 | Cancelar consulta | Agendar consulta; clicar Cancelar e confirmar | Consulta removida; horário liberado | Aprovado conforme relato do responsável. Ao confirmar o cancelamento, o código remove a consulta e atualiza a grade, permitindo reutilizar o horário. | Aprovado | — |
| TF26 | RF04 | Busca de consultas | Agendar duas consultas; pesquisar paciente ou médico | Filtrar corretamente | Aprovado conforme relato do responsável. A pesquisa de consultas considera nome do paciente ou do médico e atualiza a tabela de resultados. | Aprovado | — |
| TF27 | RF04 | Filtro de data | Agendar consultas em datas diferentes; filtrar uma data | Mostrar apenas consultas da data | Aprovado conforme relato do responsável. O filtro seleciona consultas pela data correspondente, podendo atuar junto com a busca textual. | Aprovado | — |
| TF28 | RF05 | Persistência LocalStorage | Cadastrar médico e consulta; recarregar página | Dados permanecem disponíveis | Aprovado conforme relato do responsável. O código grava médicos e consultas em duas chaves do LocalStorage e os recupera ao carregar a página; o recarregamento não aparece isoladamente nos prints. | Aprovado | — |

## Análise funcional complementar a partir do GitHub

A análise do repositório `Senac-09/medagenda`, branch `main`, complementa o relato da execução. Os comportamentos abaixo são **implementados no código**; isso não equivale a uma reprodução independente de todos os casos:

- **RF01 — Cadastro e manutenção de médicos:** `js/app.js` implementa cadastro, consulta, edição e exclusão. O cadastro mantém nome, CRM, especialidade, telefone, e-mail opcional, dias, faixa de horários, duração e situação. Existem verificações de nome, CRM, telefone, e-mail, dias e coerência dos horários, além de prevenção de CRM repetido.
- **RF02 — Pesquisa e filtros:** a listagem pode ser pesquisada por nome ou CRM, filtrada por especialidade e por situação de ativo/inativo. Os filtros podem ser aplicados simultaneamente.
- **RF03 — Disponibilidade:** a aplicação gera horários de acordo com os dias cadastrados, início e fim do expediente e duração de cada consulta. Médicos inativos não são ofertados para novos agendamentos; dias sem atendimento exibem uma mensagem de indisponibilidade.
- **RF04 — Consultas:** a reserva inclui médico, data, horário e dados do paciente. O sistema valida campos obrigatórios, telefone, data passada e ocupação do horário. Há edição, cancelamento e pesquisa de consultas por nome do paciente/médico ou data.
- **RF05 — LocalStorage:** os cadastros e as reservas são armazenados nas chaves `medagenda.medicos` e `medagenda.consultas` e recuperados na inicialização do aplicativo. O armazenamento é local ao navegador, sem banco de dados central.

### Pontos de atenção pedidos pelo grupo

1. **Editar consulta sem escolher o horário novamente:** o código em `renderizarHorarios()` limpa o campo de horário e depois o restaura quando a consulta em edição corresponde ao mesmo médico, dia e horário. O responsável informou aprovação desse teste; a captura do processo completo não está entre os prints disponíveis.
2. **Excluir médico e remover suas consultas:** a função `excluirMedico()` filtra tanto o cadastro de médicos quanto as consultas associadas ao `medicoId` excluído. É um comportamento intencional da implementação, importante para documentar porque a exclusão causa perda das reservas vinculadas.
3. **Impedir data passada e horário ocupado:** `validarConsulta()` recusa datas anteriores ao dia atual e `horarioOcupado()` verifica coincidência de médico, data e hora. Um horário reservado é desabilitado na grade. O responsável informou que esses testes passaram, sem prints separados para ambos.

### Evidências e rastreabilidade

- **Demonstrado parcialmente por prints:** TF01, TF14, TF16 e TF19; TF23 contém um print de mensagem de validação de telefone, embora não reproduza toda a sequência do cenário da matriz.
- **Demais casos:** status *Aprovado* informado pelo responsável, sem fotografia individual suficiente para validação independente.
- **Vídeo:** disponível no repositório em [`evidencias/testes-funcionais-isaac.mp4`](evidencias/testes-funcionais-isaac.mp4); a gravação não foi inspecionada quadro a quadro nesta revisão documental.

**Importante:** mensagens de validação de dados incorretos (CRM inválido, telefone inválido, data anterior etc.) são o **resultado esperado** de testes negativos; elas não representam falhas do sistema. “Nenhuma falha relatada” refere-se à execução dos requisitos, não à ausência dessas mensagens.

**Origem dos resultados:** os 28 status `Aprovado` refletem a informação dada pelo responsável, não uma comprovação independente de todas as execuções.

## Resultado geral

**Total de casos planejados:** 28  
**Casos executados, conforme informado pelo responsável:** 28  
**Aprovados, conforme informado pelo responsável:** 28  
**Reprovados, conforme informado pelo responsável:** 0  
**Bloqueados, conforme informado pelo responsável:** 0  
**Falhas relatadas:** 0  
**Cenários com capturas parcialmente compatíveis:** 4 (TF01, TF14, TF16 e TF19)  
**Casos sem evidência visual individual suficiente:** 24

**Evidência em vídeo:** consulte [VIDEO.md](VIDEO.md).

## Conclusão

O responsável informou que todos os 28 casos planejados foram executados e aprovados, sem erros identificados durante sua execução. Essa informação foi registrada na matriz como **resultado declarado**, e não como aprovação comprovada integralmente pela revisão das capturas. As imagens disponíveis apresentam evidência parcial de cadastro, filtro, grade de horários e agendamento; recomenda-se manter ou complementar registros específicos dos demais cenários para fins de auditoria e avaliação acadêmica.
