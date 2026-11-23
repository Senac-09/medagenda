# MedAgenda — Fase 3: Testes funcionais

**Responsável:** Isaac Rodrigues Vieira  
**Projeto:** Projeto Integrador — Senac EAD, Boas Práticas de Desenvolvimento de Software  
**Período previsto:** 15 a 18/11/2026

## Arquivos da etapa de testes

- [`testes-funcionais.md`](testes-funcionais.md): matriz de 28 casos, com resultados informados e detalhes das rotinas existentes no GitHub.
- [`relatorio-fase3.md`](relatorio-fase3.md): relatório ampliado, incluindo descrição por requisito funcional, resultados, análise técnica, pontos de atenção e conclusão.
- [`VIDEO.md`](VIDEO.md): acesso à gravação existente no repositório.
- [`evidencias/`](evidencias/): capturas disponibilizadas para documentar parcialmente os fluxos.

## Resultado da etapa

**28 casos executados e aprovados, sem falhas relatadas — conforme informação do responsável pela execução.**

As imagens recebidas demonstram partes dos cenários TF01, TF14, TF16 e TF19; existe também uma imagem de mensagem de validação relacionada a TF23. Os demais resultados não foram verificados de forma independente por prints.

## O que funciona segundo o código e a documentação do projeto

- Cadastro, edição, exclusão e validação de médicos.
- Pesquisa de médicos por nome/CRM e filtros de especialidade e situação.
- Montagem da agenda conforme dias, horários e duração de consultas.
- Agendamento de consultas com validações de data, disponibilidade e dados do paciente.
- Consulta, edição, cancelamento, pesquisa e filtros dos agendamentos.
- Persistência local dos registros de médicos e consultas com LocalStorage.

**Fonte:** [`Senac-09/medagenda`](https://github.com/Senac-09/medagenda), com revisão de `README.md`, `index.html` e `js/app.js` da branch `main` em 19/11/2026.

## Organização no repositório

A matriz, o relatório e a documentação do vídeo ficam na pasta `testes/`. As oito capturas de tela e a gravação `testes-funcionais-isaac.mp4` ficam em `testes/evidencias/`.

## Nota sobre os status

Os 28 casos têm status **Aprovado** com base no relato do responsável. As referências ao código descrevem a implementação e não devem ser confundidas com prova visual de execução de cada teste.
