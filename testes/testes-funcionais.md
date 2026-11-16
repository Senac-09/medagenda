# MedAgenda — Testes funcionais (Fase 3)

**Responsável:** Isaac Rodrigues Vieira  
**Período previsto:** 15/11/2026 a 18/11/2026  
**Projeto:** Senac EAD — Boas Práticas de Desenvolvimento de Software  
**Repositório:** https://github.com/Senac-09/medagenda

## Objetivo
Verificar os requisitos RF01 a RF05 do MedAgenda e registrar evidências de execução. Este plano foi elaborado a partir do `README.md`, `index.html` e `js/app.js` da branch `main` consultados em 15/11/2026.

## Ambiente e preparação
1. Baixar ou clonar o repositório e abrir `index.html` no navegador (preferencialmente com Live Server).
2. Abrir as ferramentas de desenvolvedor para verificar erros no Console e os registros do LocalStorage.
3. Usar **somente dados fictícios** de médicos e pacientes.
4. Para iniciar os testes do zero, apagar exclusivamente as chaves `medagenda.medicos` e `medagenda.consultas` no armazenamento local do site. Isso exclui os dados de teste anteriores.
5. Registrar data, navegador e versão utilizados no teste.

**Navegador:** Google Chrome (versão não informada)  
**Data informada da gravação:** 16/11/2026  
**Versão/commit testado:** Não identificado

## Matriz de testes

| ID | Requisito | Cenário | Procedimento | Resultado esperado | Resultado obtido | Status | Evidência |
|---|---|---|---|---|---|---|---|
| TF01 | RF01 | Cadastrar médico válido | Preencher nome, CRM 123456/SP, especialidade, telefone com DDD, dia, início 08:00, fim 12:00; salvar | Médico aparece na lista e mensagem de sucesso | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF02 | RF01 | Nome obrigatório | Deixar nome vazio e preencher os demais campos válidos; salvar | Exibir erro de nome; não cadastrar | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF03 | RF01 | CRM inválido | Informar CRM 123/SP e demais campos válidos; salvar | Exibir erro de formato do CRM | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF04 | RF01 | CRM duplicado | Cadastrar médico; tentar cadastrar outro com mesmo CRM | Impedir duplicidade e exibir erro | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF05 | RF01 | Telefone inválido | Informar telefone com menos de 10 dígitos; salvar | Exibir erro de telefone | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF06 | RF01 | E-mail inválido | Informar email sem @ e salvar | Exibir erro de e-mail | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF07 | RF01 | Dia obrigatório | Não marcar dia de atendimento; salvar | Exibir erro de dias | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF08 | RF01 | Faixa horária inválida | Início 12:00, fim 08:00; salvar | Exibir erro no horário final | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF09 | RF01 | Editar médico | Cadastrar médico; clicar Editar, alterar telefone e salvar | Atualizar registro sem duplicar | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF10 | RF01 | Excluir médico | Cadastrar médico; clicar Excluir e confirmar | Remover médico da listagem | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF11 | RF01 | Cancelar exclusão | Clicar Excluir e cancelar confirmação | Manter médico | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF12 | RF02 | Busca por nome | Cadastrar dois médicos; pesquisar nome de um | Mostrar apenas médico correspondente | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF13 | RF02 | Busca por CRM | Pesquisar CRM cadastrado | Mostrar médico correspondente | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF14 | RF02 | Filtro de especialidade | Cadastrar médicos de especialidades diferentes; filtrar | Mostrar somente especialidade escolhida | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF15 | RF02 | Filtro ativo/inativo | Cadastrar médico inativo; alternar filtro de situação | Mostrar registros conforme situação | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF16 | RF03 | Agenda por dia | Cadastrar médico para segundas 08:00–10:00, duração 30; selecionar segunda futura | Mostrar horários 08:00, 08:30, 09:00, 09:30 | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF17 | RF03 | Dia sem atendimento | Selecionar dia não marcado no cadastro do médico | Exibir mensagem de indisponibilidade | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF18 | RF03 | Médico inativo | Cadastrar médico inativo e abrir seleção de agendamento | Médico não aparece como opção | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF19 | RF04 | Agendar consulta válida | Selecionar médico ativo, data futura atendida, horário livre e paciente/telefone válidos; reservar | Consulta aparece na tabela | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF20 | RF04 | Horário ocupado | Agendar consulta; voltar à mesma data e médico | Horário reservado fica indisponível | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF21 | RF04 | Data passada | Selecionar data anterior à atual e tentar reservar | Exibir erro e impedir agendamento | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF22 | RF04 | Paciente obrigatório | Deixar paciente vazio; tentar reservar | Exibir erro de paciente | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF23 | RF04 | Telefone do paciente inválido | Informar telefone curto; tentar reservar | Exibir erro de telefone | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF24 | RF04 | Editar consulta | Agendar consulta; clicar Editar, alterar paciente e salvar | Atualizar consulta sem duplicar | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF25 | RF04 | Cancelar consulta | Agendar consulta; clicar Cancelar e confirmar | Consulta removida; horário liberado | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF26 | RF04 | Busca de consultas | Agendar duas consultas; pesquisar paciente ou médico | Filtrar corretamente | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF27 | RF04 | Filtro de data | Agendar consultas em datas diferentes; filtrar uma data | Mostrar apenas consultas da data | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |
| TF28 | RF05 | Persistência LocalStorage | Cadastrar médico e consulta; recarregar página | Dados permanecem disponíveis | Aguardando conferência da gravação | Não verificado | Vídeo: `evidencias/testes-funcionais-isaac.mp4` (a anexar) |

## Pontos de atenção identificados na revisão estática
- **Edição de consulta:** o código limpa `consulta-hora` ao renderizar a grade e tenta restaurar o horário original; confirmar em teste se é possível salvar uma edição sem selecionar novamente o horário.
- **Exclusão de médico:** o código remove também consultas vinculadas ao médico. Confirmar e documentar esse comportamento.
- **Dados armazenados:** são salvos no LocalStorage do navegador, sem servidor ou sincronização entre dispositivos.
- **Limites de validação:** conferir comportamento em datas futuras, horários ocupados e campos obrigatórios; não marcar como aprovado sem executar.

Esses pontos são hipóteses de verificação, **não falhas comprovadas**.

## Como registrar os resultados
Para cada caso, executar o procedimento, comparar com o resultado esperado e registrar o comportamento observado. Usar status **Aprovado**, **Reprovado**, **Bloqueado** ou **Não demonstrado**, conforme o vídeo. Registrar a captura correspondente em `evidencias/` e inserir o caminho relativo na tabela, por exemplo `![Cadastro válido](evidencias/TF01-cadastro.png)`.

## Sugestão de prints
- `TF01-cadastro.png`: médico cadastrado e mensagem de sucesso.
- `TF03-crm-invalido.png`: mensagem de validação do CRM.
- `TF09-edicao-medico.png`: alteração salva.
- `TF14-filtro-especialidade.png`: listagem filtrada.
- `TF16-grade-horarios.png`: horários do médico.
- `TF19-consulta-agendada.png`: consulta na listagem.
- `TF20-horario-ocupado.png`: horário indisponível.
- `TF28-localstorage.png`: registros preservados após recarregar.

## Resultado geral
**Total de casos planejados:** 28  
**Execução:** gravação informada pelo responsável em 16/11/2026; quantidade de casos efetivamente demonstrados ainda não verificada  
**Aprovados/reprovados:** não determinados; gravação ainda não analisada.

**Evidência em vídeo:** consulte [VIDEO.md](VIDEO.md).

## Conclusão
A matriz contempla cadastro, validação, pesquisa, agenda, agendamento e persistência de dados. A conclusão sobre a qualidade funcional do sistema depende da execução dos casos e da anexação de evidências reais.
