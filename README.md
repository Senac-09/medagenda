# MedAgenda

Aplicação web para cadastrar médicos credenciados e agendar consultas em pequenas clínicas e cooperativas médicas.
Projeto Integrador – Boas Práticas de Desenvolvimento de Software · Senac EAD · 2026.

**Grupo:** Felipe Marchesini Balikian, Isaac Rodrigues Vieira, Nicolas Ambar, Rubia Massaud dos Santos e Vanderson Luiz Cardoso Martins.

## Como rodar

Não precisa instalar nada. Basta abrir o `index.html` no navegador.
No VS Code, a extensão **Live Server** recarrega a página sozinha a cada alteração.

Tecnologias: HTML5, CSS3, JavaScript e LocalStorage (os dados ficam salvos no próprio navegador).

## Estrutura

```
medagenda/
├── index.html      → estrutura das telas
├── css/style.css   → visual e responsividade
├── js/app.js       → lógica (Fase 2)
├── README.md
├── .editorconfig   → padroniza indentação e codificação no editor
└── .gitignore
```

## Requisitos funcionais e onde ficam na tela

| Requisito (1ª entrega) | Seção do `index.html` |
|---|---|
| RF01 – Gerenciar médicos credenciados (cadastrar, consultar, editar e remover) | `#secao-medicos`: formulário `#form-medico` e tabela `#tabela-medicos` |
| RF02 – Consultar médicos ativos e pesquisar por especialidade | Filtros `#busca-medico`, `#filtro-especialidade` e `#filtro-situacao` |
| RF03 – Visualizar a agenda (dias e horários disponíveis de cada médico) | `#secao-agenda`: grade `#grade-horarios` |
| RF04 – Realizar agendamentos (médico, horário disponível e reserva) | `#form-consulta` e lista `#tabela-consultas` |
| RF05 – Armazenar dados no navegador via LocalStorage | `js/app.js` (Fase 2) |

## Cronograma da 2ª etapa

| Fase | Prazo | Tarefa | Responsável |
|---|---|---|---|
| 1 | 04/11 a 07/11 | Estrutura inicial do front-end (`index.html` e `style.css`) | Felipe |
| 2 | 08/11 a 14/11 | Lógica principal JS (cadastro, lista, LocalStorage) | Vanderson |
| 2 | 08/11 a 14/11 | Lógica complementar JS (edição, exclusão, pesquisa e validação) | Nicolas |
| 3 | 15/11 a 18/11 | Tabela de testes funcionais, prints e/ou vídeo | Isaac |
| 4 | 19/11 a 21/11 | Documento PDF com as boas práticas aplicadas e a conclusão | Rubia |
| 5 | 22/11 a 23/11 | Apresentação final e consolidação do PDF | Felipe |
| 5 | 23/11 | Envio oficial no AVA (até 23h59) | Felipe e grupo |

## Mapa de IDs para o JavaScript (Fase 2)

Estes IDs são o "contrato" entre o HTML e o JS. **Não renomeie sem avisar o grupo.**

### Médicos

| ID | Elemento | Uso |
|---|---|---|
| `form-medico` | `<form>` | Ouvir o `submit` para salvar |
| `titulo-form-medico` | `<h3>` | Trocar para "Editar médico" durante a edição |
| `medico-id` | `<input hidden>` | Vazio = novo cadastro; com valor = edição |
| `medico-nome`, `medico-crm`, `medico-especialidade`, `medico-telefone`, `medico-email` | campos | Dados do médico |
| `medico-dia-seg` … `medico-dia-sab` | checkboxes (`name="dias"`) | Dias de atendimento (`seg`, `ter`, `qua`, `qui`, `sex`, `sab`) |
| `medico-inicio`, `medico-fim` | `<input type="time">` | Faixa de atendimento |
| `medico-duracao` | `<select>` | Minutos de cada consulta (15, 20, 30, 45, 60) |
| `medico-ativo` | checkbox | Médico ativo na rede |
| `erro-medico-*` | `<small>` | Mensagem de erro de cada campo (validação) |
| `btn-salvar-medico`, `btn-cancelar-medico` | botões | Salvar / limpar o formulário |
| `busca-medico`, `filtro-especialidade`, `filtro-situacao` | filtros | Pesquisa (situação: `ativos`, `inativos` ou vazio = todos) |
| `lista-medicos` | `<tbody>` | Onde as linhas são desenhadas |
| `vazio-medicos` | `<p>` | Mostrar quando a lista estiver vazia |
| `tpl-linha-medico` | `<template>` | Modelo de linha (campos `data-campo`: nome, crm, especialidade, atendimento, situacao) |

### Agendamento

| ID | Elemento | Uso |
|---|---|---|
| `form-consulta` | `<form>` | Ouvir o `submit` para reservar |
| `titulo-form-consulta` | `<h3>` | Pode mudar durante a edição |
| `consulta-id` | `<input hidden>` | Vazio = nova consulta; com valor = edição |
| `consulta-medico` | `<select>` | Preencher com os médicos **ativos** (`value` = id do médico) |
| `consulta-data` | `<input type="date">` | Dia da consulta |
| `grade-horarios` | `<div>` | Desenhar um botão por horário (modelo `tpl-horario`, atributo `data-hora`) |
| `grade-vazia` | `<p>` | Mensagem quando não há horários (sem médico/data ou médico não atende no dia) |
| `consulta-hora` | `<input hidden>` | Recebe o horário clicado na grade |
| `consulta-paciente`, `consulta-telefone`, `consulta-observacoes` | campos | Dados do paciente |
| `erro-consulta-*` | `<small>` | Mensagens de erro |
| `btn-salvar-consulta`, `btn-cancelar-consulta` | botões | Reservar / limpar |

### Consultas agendadas

| ID | Elemento | Uso |
|---|---|---|
| `busca-consulta`, `filtro-data` | filtros | Pesquisa por paciente/médico e por data |
| `lista-consultas` | `<tbody>` | Onde as linhas são desenhadas |
| `vazio-consultas` | `<p>` | Lista vazia |
| `tpl-linha-consulta` | `<template>` | Modelo de linha (campos `data-campo`: data, hora, paciente, telefone, medico, especialidade) |

### Geral

| ID | Uso |
|---|---|
| `mensagem` | Avisos ao usuário. Remover `is-hidden` e somar `mensagem--sucesso` ou `mensagem--erro` |

Os botões das linhas usam as classes `btn-editar` e `btn-excluir`. Sugestão: gravar o id do registro em `data-id` no botão e usar **delegação de eventos** (um único `addEventListener` no `<tbody>`).

## Classes de estado (o JS só liga e desliga)

| Classe | Efeito |
|---|---|
| `is-hidden` | Esconde o elemento |
| `is-invalido` (no `.form__campo`) | Campo com erro (borda vermelha) |
| `is-editando` (no `<tr>`) | Destaca a linha que está sendo editada |
| `horario--ocupado` | Horário já reservado (usar junto com `disabled`) |
| `horario--selecionado` | Horário escolhido (usar junto com `aria-pressed="true"`) |
| `badge--ativo` / `badge--inativo` | Etiqueta de situação do médico |
| `mensagem--sucesso` / `mensagem--erro` | Cor da mensagem |
| `linha-exemplo` | Linhas e horários de demonstração da Fase 1. **O JS deve removê-los** ao desenhar a lista |

## Modelo de dados sugerido (LocalStorage)

Duas chaves, cada uma com uma lista em JSON:

```js
// localStorage "medagenda.medicos"
{ id: "m1731000000000", nome: "Ana Paula Ribeiro", crm: "123456/SP",
  especialidade: "Cardiologia", telefone: "(11) 98888-1234", email: "",
  dias: ["seg", "qua", "sex"], inicio: "08:00", fim: "12:00",
  duracao: 30, ativo: true }

// localStorage "medagenda.consultas"
{ id: "c1731000000001", medicoId: "m1731000000000", data: "2026-11-12",
  hora: "08:30", paciente: "Marcos Antônio Souza",
  telefone: "(11) 96666-4321", observacoes: "" }
```

- **Horários livres:** do `inicio` ao `fim`, de `duracao` em `duracao` minutos; está ocupado se já existe consulta com o mesmo `medicoId`, `data` e `hora`.
- **Dia da semana:** `new Date("2026-11-12")` é lido como UTC e pode cair no dia anterior no Brasil. Use `new Date(ano, mes - 1, dia)` antes de chamar `getDay()` (0 = domingo, 1 = segunda…).

## Convenções do grupo

- **Nomes:** em português. IDs e classes em `kebab-case`; no CSS, classes no padrão BEM (`bloco__elemento--variacao`); no JS, variáveis e funções em `camelCase`.
- **Indentação:** 2 espaços, UTF-8 (o `.editorconfig` aplica sozinho no VS Code).
- **Separação de responsabilidades:** nada de `style=""` ou `onclick=""` no HTML. Visual no CSS, comportamento no JS.
- **Git:** uma branch por tarefa (ex.: `feature/cadastro-medicos`), commits pequenos com mensagem no imperativo (ex.: "Adiciona validação do CRM") e Pull Request revisado por outro integrante antes de entrar na `main`.

## Boas práticas aplicadas na Fase 1

- HTML semântico (`header`, `nav`, `main`, `section`, `footer`, `table` com `caption` e `scope`).
- Acessibilidade: todo campo tem `<label>`, link "Pular para o conteúdo", foco visível, mensagens com `aria-live` e respeito a `prefers-reduced-motion`.
- CSS com variáveis (cores e espaços num lugar só), organizado em seções e escrito *mobile-first*.
- Tabelas responsivas: no celular cada linha vira um cartão, usando o atributo `data-rotulo`.
- Contrato de IDs documentado, para que a Fase 2 avance sem depender da Fase 1.
