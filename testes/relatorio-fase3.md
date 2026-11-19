# Relatório da Fase 3 — Testes funcionais do MedAgenda

**Projeto:** MedAgenda — Boas Práticas de Desenvolvimento de Software, Senac EAD  
**Responsável pelos testes:** Isaac Rodrigues Vieira  
**Período previsto:** 15/11/2026 a 18/11/2026  
**Gravação informada:** 16/11/2026, Google Chrome  
**Documentação analisada:** [repositório MedAgenda](https://github.com/Senac-09/medagenda), branch `main`, consultado em 19/11/2026  
**Arquivos de referência:** `README.md`, `index.html` e `js/app.js`.

## 1. Objetivo

Avaliar as principais funcionalidades da aplicação MedAgenda, verificando o cadastro e gerenciamento de médicos, pesquisa e filtros, geração de horários, agendamento de consultas e conservação dos registros no navegador. O documento reúne o relato da execução de testes, as evidências visuais recebidas e uma análise complementar do código existente no GitHub.

## 2. Visão geral da aplicação

O MedAgenda é uma aplicação web voltada ao gerenciamento de médicos credenciados e reservas de consultas para pequenas clínicas e cooperativas médicas. O projeto utiliza **HTML5** na estrutura, **CSS3** na apresentação, **JavaScript** no comportamento e **LocalStorage** para armazenar dados localmente.

Não depende de instalação de servidor ou banco de dados para o funcionamento descrito no repositório; o acesso pode ser feito pelo arquivo `index.html` em um navegador compatível. A ausência de backend, porém, significa que o sistema não sincroniza informações entre dispositivos ou usuários.

## 3. Escopo dos testes

| Requisito | Funcionalidade analisada | Casos planejados |
|---|---|---:|
| RF01 | Cadastro, edição, exclusão e validações de médicos | 11 |
| RF02 | Busca e filtros de médicos | 4 |
| RF03 | Geração e exibição da disponibilidade | 3 |
| RF04 | Agendamento, validações, edição e cancelamento de consultas | 9 |
| RF05 | Persistência das informações em LocalStorage | 1 |
| **Total** | | **28** |

Os casos detalhados com procedimento, resultado esperado, resultado informado, status e referências encontram-se em [testes-funcionais.md](testes-funcionais.md).

## 4. Metodologia e origem dos resultados

A matriz foi elaborada com base na documentação e na implementação do sistema. Para sua atualização, foram considerados:

1. **Declaração do responsável pela execução:** os 28 testes foram executados e aprovados, sem falhas identificadas no funcionamento avaliado.
2. **Capturas de tela recebidas:** documentam partes do cadastro de médico, filtro por especialidade, disponibilidade de horários e registro de uma consulta, além de uma mensagem de validação do telefone do paciente.
3. **Revisão estática do GitHub:** comprova a presença de rotinas de validação e gerenciamento implementadas, mas **não substitui a observação de cada teste em execução**.

Assim, a classificação de 28 casos como *Aprovado* representa o **resultado informado pelo responsável**, e não uma auditoria independente de todos os cenários. O vídeo `testes-funcionais-isaac.mp4` foi localizado no repositório, mas não foi examinado integralmente nesta revisão.

## 5. Funcionalidades verificadas e comportamentos implementados

### 5.1. RF01 — Gerenciamento de médicos

O formulário de cadastro reúne dados de identificação e agenda do profissional: nome, CRM, especialidade, telefone, e-mail opcional, dias de atendimento, horário inicial e final, duração da consulta e indicação de médico ativo. As informações aparecem na tabela com CRM, especialidade, dias/horários, situação e opções **Editar** e **Excluir**.

No código, foram identificados os seguintes controles:

- Exigência de nome com pelo menos três caracteres, CRM no padrão de 4 a 6 dígitos seguido de `/UF`, telefone com DDD e 10 ou 11 dígitos e ao menos um dia selecionado.
- Validação do e-mail quando preenchido e rejeição de faixa de atendimento em que o horário final não seja posterior ao inicial.
- Bloqueio de CRM duplicado, desconsiderando diferenças entre letras maiúsculas e minúsculas.
- Edição que preserva o identificador do médico, evitando criar outro registro quando o usuário salva alterações.
- Exclusão condicionada à confirmação do usuário; ao excluir o médico, a implementação remove também consultas associadas a ele.

**Evidência visual recebida:** um médico de Cardiologia aparece cadastrado com CRM `123456/SP`, atendimento às segundas, quartas e quintas, das 08:00 às 12:00, e situação ativa. O cadastro e sua listagem são mostrados nas imagens `TF01-formulario-medico.png` e `TF01-medico-cadastrado.png`.

### 5.2. RF02 — Pesquisa e filtros

A listagem de médicos oferece pesquisa textual por **nome ou CRM**, filtro por **especialidade** e filtro de **situação** (ativos/inativos). O código aplica os critérios simultaneamente, exibindo apenas os registros correspondentes. As alterações no texto de busca ou nos filtros acionam a atualização da tabela.

**Evidência visual recebida:** a opção “Clínica Geral” apresentou tabela vazia e, ao selecionar “Cardiologia”, o médico cadastrado foi exibido. Isso demonstra o comportamento do filtro de especialidade no conjunto registrado.

### 5.3. RF03 — Agenda e horários disponíveis

Para cada médico, a agenda calcula as opções de horário a partir dos dias de atendimento, da faixa de início/fim e da duração de consulta configurada. O sistema também verifica se o médico está ativo, se atende no dia escolhido e se o horário já está reservado. A grade diferencia opções **livres**, **ocupadas** e **selecionadas**; horários ocupados são desabilitados.

**Evidência visual recebida:** para o médico com atendimento das 08:00 às 12:00 e duração de 30 minutos, a tela mostrou os horários de 08:00, 08:30, 09:00, 09:30, 10:00, 10:30, 11:00 e 11:30 no dia 09/12/2026. O horário 10:00 apareceu selecionado em uma das imagens.

A lógica também contém mensagens para situações em que nenhum médico/data foi escolhido, o médico está indisponível ou o dia selecionado não faz parte de seu atendimento.

### 5.4. RF04 — Agendamento e gerenciamento de consultas

O fluxo permite escolher médico ativo, data e horário livre, informar o nome e telefone do paciente e registrar observações opcionais. Ao salvar, a consulta é incluída na tabela com data, hora, paciente, telefone, médico, especialidade e ações **Editar** e **Cancelar**.

O código inclui verificações para impedir agendamentos com médico inativo, campos obrigatórios ausentes, telefone inválido, data anterior ao dia corrente, dia fora do expediente do médico ou horário já reservado. Uma consulta existente pode ser editada preservando seu identificador, e o cancelamento solicita confirmação antes da remoção. A tabela pode ser filtrada por paciente, médico e data.

**Evidência visual recebida:** uma consulta de Ana Paula aparece cadastrada para **09/12/2026 às 10:00**, com o profissional de Cardiologia identificado. Há ainda captura de uma mensagem de telefone do paciente inválido, sinalizando a presença de validação na interface; essa imagem, isoladamente, não reproduz o cenário completo de telefone curto previsto na matriz.

### 5.5. RF05 — Persistência dos dados

A implementação salva os registros de médicos na chave `medagenda.medicos` e as consultas na chave `medagenda.consultas`, utilizando JSON no LocalStorage. Na inicialização, as informações são lidas novamente, o que permite preservá-las após recarregar a página **no mesmo navegador e na mesma origem**, enquanto os dados do armazenamento não forem apagados.

O responsável informou que o caso de persistência foi aprovado. Os prints recebidos não documentam separadamente o estado anterior e posterior à atualização da página.

## 6. Resultado consolidado

| Indicador | Resultado informado / observado |
|---|---:|
| Casos planejados | 28 |
| Casos executados, conforme responsável | 28 |
| Casos aprovados, conforme responsável | 28 |
| Casos reprovados, conforme responsável | 0 |
| Casos bloqueados, conforme responsável | 0 |
| Falhas identificadas, conforme responsável | 0 |
| Casos com capturas que mostram parte do fluxo | 4 (TF01, TF14, TF16 e TF19) |
| Casos sem comprovação visual individual suficiente | 24 |

**Interpretação:** um teste de validação negativa é aprovado quando o programa **rejeita corretamente o dado inválido** e apresenta a orientação adequada. Portanto, as mensagens esperadas de CRM ou telefone inválidos, por exemplo, não significam erro de funcionamento.

## 7. Três pontos de atenção solicitados

| Ponto | Verificação na implementação | Situação documental |
|---|---|---|
| Edição de consulta sem escolher novamente o horário | `renderizarHorarios()` tenta restaurar o horário da consulta em edição quando médico, data e hora coincidem | Funcionamento aprovado segundo o responsável; sem sequência de prints da edição completa |
| Exclusão de médico e suas consultas | `excluirMedico()` remove o profissional e filtra as consultas associadas ao mesmo `medicoId` | Comportamento implementado no código e informado como aprovado; sem captura do antes/depois |
| Data passada e horário ocupado | `validarConsulta()` rejeita data anterior ao dia atual e horário já reservado; a grade desabilita horários ocupados | Aprovação informada; sem prints separados dos dois bloqueios |

A exclusão em cascata merece atenção na documentação final porque afeta consultas que já estavam agendadas; é importante que o grupo esteja ciente dessa regra.

## 8. Boas práticas reconhecidas no projeto

O repositório descreve e utiliza a separação entre HTML, CSS e JavaScript, IDs documentados para integração das telas com a lógica, nomenclatura padronizada, mensagens de validação próximas aos campos e estados visuais de erro ou sucesso. A interface inclui elementos de acessibilidade e tabelas responsivas documentados no `README.md`.

A lógica de agendamento evita conflitos simples de horário e procura preservar registros durante a edição por meio de identificadores únicos. Para o escopo acadêmico, o LocalStorage é uma solução simples de persistência, mas não fornece sincronização, autenticação ou controle centralizado. Esses limites devem ser considerados em um eventual uso real com dados de pacientes.

## 9. Evidências anexas e limites da revisão

As imagens usadas nesta atualização estão na pasta [`evidencias/`](evidencias/), com nomes associados aos cenários. O vídeo completo está referenciado em [VIDEO.md](VIDEO.md) e disponível no repositório do projeto, mas não foi redistribuído neste pacote.

O relatório diferencia **resultado relatado da execução**, **comportamento observado nas imagens** e **funcionalidade identificada no código**. A documentação permite descrever o sistema e registrar as aprovações informadas, sem apresentar inferências como se fossem filmagens analisadas.

## 10. Conclusão

Conforme o responsável pela etapa, **os 28 casos funcionais foram executados e aprovados, sem falhas identificadas**. O sistema possui implementação de cadastro e manutenção de médicos, pesquisas e filtros, disponibilidade de horários, reservas de consultas e conservação de registros no navegador. Os prints recebidos documentam parcialmente os principais fluxos de cadastro, filtragem, seleção de horário e agendamento.

A análise do GitHub reforça que as funcionalidades e validações previstas estão implementadas. Para uma comprovação independente completa, permanecem recomendáveis evidências específicas dos testes não capturados ou revisão integral da gravação. O conjunto de arquivos pode subsidiar a redação do PDF de boas práticas da segunda etapa, mantendo transparente a origem de cada conclusão.
