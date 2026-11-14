/*
 * MedAgenda – lógica da aplicação (Fase 2)
 *
 * Responsáveis:
 *   Vanderson – cadastro, listagem e LocalStorage
 *   Nicolas   – edição, exclusão, pesquisa e validação
 *
 * Antes de começar, leia no README.md:
 *   - "Mapa de IDs para o JavaScript": quais elementos existem no index.html
 *   - "Classes de estado": o que o JS deve ligar e desligar
 *   - "Modelo de dados sugerido": formato dos objetos no LocalStorage
 */

"use strict";

// ==========================================
// MEDAGENDA - LOGICA PRINCIPAL
// Responsavel: Vanderson Luiz C. Martins
// Cadastro, listagem e LocalStorage
// ==========================================

// Chave utilizada para armazenar os medicos
const CHAVE_MEDICOS = "medagenda.medicos";

// Elementos HTML utilizados na aplicacao
const formMedico = document.getElementById("form-medico");
const listaMedicos = document.getElementById("lista-medicos");
const vazioMedicos = document.getElementById("vazio-medicos");
const templateMedico = document.getElementById("tpl-linha-medico");

// Recupera os medicos armazenados no navegador
function carregarMedicos() {
  try {
    const dados = localStorage.getItem(CHAVE_MEDICOS);

    if (!dados) {
      return [];
    }

    const medicos = JSON.parse(dados);

    return Array.isArray(medicos) ? medicos : [];
  } catch (erro) {
    console.error("Erro ao carregar medicos:", erro);
    return [];
  }
}

// Salva a lista de medicos no navegador
function salvarMedicos(medicos) {
  try {
    localStorage.setItem(CHAVE_MEDICOS, JSON.stringify(medicos));

    return true;
  } catch (erro) {
    console.error("Erro ao salvar medicos:", erro);
    return false;
  }
}

// Lista de medicos em memoria
let medicos = carregarMedicos();

// Elementos utilizados no formulario e na pesquisa
const campoIdMedico = document.getElementById("medico-id");
const tituloFormMedico = document.getElementById("titulo-form-medico");
const botaoSalvarMedico = document.getElementById("btn-salvar-medico");
const botaoCancelarMedico = document.getElementById("btn-cancelar-medico");
const campoBuscaMedico = document.getElementById("busca-medico");
const filtroEspecialidade = document.getElementById("filtro-especialidade");
const filtroSituacao = document.getElementById("filtro-situacao");
const mensagem = document.getElementById("mensagem");

console.log("MedAgenda - JavaScript carregado");
console.log("Medicos armazenados:", medicos);

// ==========================================
// CADASTRO DE MEDICOS
// Responsavel: Vanderson Luiz C. Martins
// ==========================================

// Gera um identificador unico para cada medico
function gerarIdMedico() {
  return crypto.randomUUID();
}

// Captura os dados preenchidos no formulario
function obterDadosFormulario() {
  const dados = new FormData(formMedico);

  return {
    id: gerarIdMedico(),
    nome: String(dados.get("nome") || "").trim(),
    crm: String(dados.get("crm") || "").trim(),
    especialidade: String(dados.get("especialidade") || ""),
    telefone: String(dados.get("telefone") || "").trim(),
    email: String(dados.get("email") || "").trim(),
    diasAtendimento: dados.getAll("dias"),
    horaInicio: String(dados.get("inicio") || ""),
    horaFim: String(dados.get("fim") || ""),
    duracaoConsulta: Number(dados.get("duracao") || 30),
    ativo: dados.has("ativo"),
  };
}

// Cadastra um novo medico ou atualiza um existente
function cadastrarMedico(evento) {
  evento.preventDefault();

  limparErrosValidacao();

  const novoMedico = obterDadosFormulario();
  const idEmEdicao = campoIdMedico.value;

  if (!validarMedico(novoMedico, idEmEdicao)) {
    return;
  }

  const crmExistente = medicos.some(
    (medico) =>
      medico.crm.toLowerCase() === novoMedico.crm.toLowerCase() &&
      medico.id !== idEmEdicao,
  );

  if (crmExistente) {
    mostrarErro("crm", "Ja existe um medico cadastrado com este CRM.");
    return;
  }

  let listaAtualizada;

  if (idEmEdicao) {
    listaAtualizada = medicos.map((medico) => {
      if (medico.id === idEmEdicao) {
        return {
          ...novoMedico,
          id: idEmEdicao,
        };
      }

      return medico;
    });
  } else {
    listaAtualizada = [...medicos, novoMedico];
  }

  if (!salvarMedicos(listaAtualizada)) {
    exibirMensagem("Nao foi possivel salvar os dados do medico.", "erro");
    return;
  }

  medicos = listaAtualizada;

  formMedico.reset();
  limparEstadoFormulario();
  renderizarMedicos();
  atualizarAgendaMedicos();

  if (idEmEdicao) {
    exibirMensagem("Medico atualizado com sucesso!", "sucesso");
  } else {
    exibirMensagem("Medico cadastrado com sucesso!", "sucesso");
  }

  console.log("Lista de medicos atualizada:", medicos);
}

// Conecta o formulario ao cadastro
if (formMedico) {
  formMedico.addEventListener("submit", cadastrarMedico);
}

// ==========================================
// LISTAGEM DINAMICA DE MEDICOS
// Responsavel: Vanderson Luiz C. Martins
// ==========================================

// Converte os dias para exibicao na tabela
function formatarDiasAtendimento(dias) {
  const nomesDias = {
    seg: "Seg",
    ter: "Ter",
    qua: "Qua",
    qui: "Qui",
    sex: "Sex",
    sab: "Sab",
  };

  if (!Array.isArray(dias) || dias.length === 0) {
    return "Nao informado";
  }

  return dias.map((dia) => nomesDias[dia] || dia).join(", ");
}

// Formata os dias e horarios de atendimento
function formatarAtendimento(medico) {
  const dias = formatarDiasAtendimento(medico.diasAtendimento);

  if (!medico.horaInicio || !medico.horaFim) {
    return dias;
  }

  return `${dias} - ${medico.horaInicio}–${medico.horaFim}`;
}

// Preenche uma celula do template
function preencherCampo(linha, campo, valor) {
  const elemento = linha.querySelector(`[data-campo="${campo}"]`);

  if (elemento) {
    elemento.textContent = valor;
  }
}

// Renderiza os medicos na tabela
function renderizarMedicos() {
  if (!listaMedicos || !templateMedico) {
    console.error("Elementos da tabela nao encontrados.");
    return;
  }

  listaMedicos.replaceChildren();

  const medicosFiltrados = filtrarMedicos();

  if (vazioMedicos) {
    vazioMedicos.classList.toggle("is-hidden", medicosFiltrados.length > 0);
  }

  medicosFiltrados.forEach((medico) => {
    const fragmento = templateMedico.content.cloneNode(true);
    const linha = fragmento.querySelector("tr");

    if (!linha) {
      return;
    }

    preencherCampo(linha, "nome", medico.nome);
    preencherCampo(linha, "crm", medico.crm);
    preencherCampo(linha, "especialidade", medico.especialidade);
    preencherCampo(linha, "atendimento", formatarAtendimento(medico));

    const situacao = linha.querySelector('[data-campo="situacao"]');

    if (situacao) {
      situacao.textContent = medico.ativo ? "Ativo" : "Inativo";

      situacao.classList.toggle("badge--ativo", Boolean(medico.ativo));

      situacao.classList.toggle("badge--inativo", !medico.ativo);
    }

    linha.dataset.id = medico.id;

    if (medico.id === campoIdMedico.value) {
      linha.classList.add("is-editando");
    }

    listaMedicos.appendChild(fragmento);
  });

  console.log(`Listagem atualizada: ${medicosFiltrados.length} medico(s).`);
}

// ==========================================
// VALIDACAO DOS DADOS DOS MEDICOS
// Responsavel: Nicolas Ambar
// ==========================================

// Exibe uma mensagem de erro em um campo
function mostrarErro(campo, texto) {
  const elementoErro = document.getElementById(`erro-medico-${campo}`);

  const campoFormulario = document.getElementById(`medico-${campo}`);

  if (elementoErro) {
    elementoErro.textContent = texto;
  }

  if (campoFormulario) {
    campoFormulario.classList.add("is-invalido");
    campoFormulario.setAttribute("aria-invalid", "true");
  }
}

// Remove as mensagens de erro dos campos
function limparErrosValidacao() {
  const erros = formMedico.querySelectorAll(".form__erro");
  const campos = formMedico.querySelectorAll(".form__campo");

  erros.forEach((erro) => {
    erro.textContent = "";
  });

  campos.forEach((campo) => {
    campo.classList.remove("is-invalido");
    campo.removeAttribute("aria-invalid");
  });

  const erroDias = document.getElementById("erro-medico-dias");

  if (erroDias) {
    erroDias.textContent = "";
  }
}

// Verifica se os dados preenchidos sao validos
function validarMedico(medico) {
  let valido = true;

  if (!medico.nome) {
    mostrarErro("nome", "Informe o nome do medico.");
    valido = false;
  } else if (medico.nome.length < 3) {
    mostrarErro("nome", "Informe um nome com pelo menos 3 caracteres.");
    valido = false;
  }

  if (!medico.crm) {
    mostrarErro("crm", "Informe o CRM do medico.");
    valido = false;
  } else if (!/^\d{4,6}\/[A-Za-z]{2}$/.test(medico.crm)) {
    mostrarErro("crm", "Informe o CRM no formato 123456/SP.");
    valido = false;
  }

  if (!medico.especialidade) {
    mostrarErro("especialidade", "Selecione uma especialidade.");
    valido = false;
  }

  const telefoneNumeros = medico.telefone.replace(/\D/g, "");

  if (!medico.telefone) {
    mostrarErro("telefone", "Informe o telefone do medico.");
    valido = false;
  } else if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
    mostrarErro("telefone", "Informe um telefone valido com DDD.");
    valido = false;
  }

  if (medico.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(medico.email)) {
    mostrarErro("email", "Informe um e-mail valido.");
    valido = false;
  }

  if (!medico.diasAtendimento.length) {
    const erroDias = document.getElementById("erro-medico-dias");

    if (erroDias) {
      erroDias.textContent = "Selecione pelo menos um dia de atendimento.";
    }

    valido = false;
  }

  if (!medico.horaInicio) {
    mostrarErro("inicio", "Informe o inicio do atendimento.");
    valido = false;
  }

  if (!medico.horaFim) {
    mostrarErro("fim", "Informe o fim do atendimento.");
    valido = false;
  }

  if (
    medico.horaInicio &&
    medico.horaFim &&
    medico.horaFim <= medico.horaInicio
  ) {
    mostrarErro("fim", "O fim do atendimento deve ser depois do inicio.");
    valido = false;
  }

  return valido;
}

// Limpa o erro de um campo assim que ele for alterado
if (formMedico) {
  formMedico.addEventListener("input", (evento) => {
    const campo = evento.target;

    if (campo.classList.contains("form__campo")) {
      campo.classList.remove("is-invalido");
      campo.removeAttribute("aria-invalid");

      const erro = document.getElementById(`erro-medico-${campo.name}`);

      if (erro) {
        erro.textContent = "";
      }
    }

    if (campo.name === "dias") {
      const erroDias = document.getElementById("erro-medico-dias");

      if (erroDias) {
        erroDias.textContent = "";
      }
    }
  });
}

// ==========================================
// EDICAO DE MEDICOS
// Responsavel: Nicolas Ambar
// ==========================================

// Carrega os dados do medico selecionado no formulario
function editarMedico(id) {
  const medico = medicos.find((item) => item.id === id);

  if (!medico) {
    exibirMensagem("Medico nao encontrado.", "erro");
    return;
  }

  campoIdMedico.value = medico.id;

  document.getElementById("medico-nome").value = medico.nome;
  document.getElementById("medico-crm").value = medico.crm;
  document.getElementById("medico-especialidade").value = medico.especialidade;
  document.getElementById("medico-telefone").value = medico.telefone;
  document.getElementById("medico-email").value = medico.email;
  document.getElementById("medico-inicio").value = medico.horaInicio;
  document.getElementById("medico-fim").value = medico.horaFim;
  document.getElementById("medico-duracao").value = String(
    medico.duracaoConsulta || 30,
  );
  document.getElementById("medico-ativo").checked = medico.ativo;

  const dias = medico.diasAtendimento || [];

  formMedico.querySelectorAll('input[name="dias"]').forEach((checkbox) => {
    checkbox.checked = dias.includes(checkbox.value);
  });

  tituloFormMedico.textContent = "Editar médico";
  botaoSalvarMedico.textContent = "Salvar alterações";
  botaoCancelarMedico.textContent = "Cancelar edição";

  limparErrosValidacao();
  renderizarMedicos();

  formMedico.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Retorna o formulario ao modo de cadastro
function limparEstadoFormulario() {
  campoIdMedico.value = "";
  tituloFormMedico.textContent = "Cadastrar médico";
  botaoSalvarMedico.textContent = "Salvar médico";
  botaoCancelarMedico.textContent = "Limpar";

  limparErrosValidacao();
  renderizarMedicos();
}

// Trata o cancelamento ou limpeza do formulario
if (formMedico) {
  formMedico.addEventListener("reset", () => {
    setTimeout(() => {
      limparEstadoFormulario();
    }, 0);
  });
}

// ==========================================
// EXCLUSAO DE MEDICOS
// Responsavel: Nicolas Ambar
// ==========================================

// Remove um medico da lista
function excluirMedico(id) {
  const medico = medicos.find((item) => item.id === id);

  if (!medico) {
    exibirMensagem("Medico nao encontrado.", "erro");
    return;
  }

  const confirmar = confirm(
    `Deseja realmente excluir o medico ${medico.nome}?`,
  );

  if (!confirmar) {
    return;
  }

  const listaAtualizada = medicos.filter((item) => item.id !== id);

  if (!salvarMedicos(listaAtualizada)) {
    exibirMensagem("Nao foi possivel excluir o medico.", "erro");
    return;
  }

  medicos = listaAtualizada;

  if (campoIdMedico.value === id) {
    formMedico.reset();
  }

  // Remove as consultas vinculadas ao médico excluído
  consultas = consultas.filter((consulta) => consulta.medicoId !== id);

  salvarConsultas(consultas);

  renderizarMedicos();
  renderizarConsultas();
  atualizarAgendaMedicos();
  exibirMensagem("Medico excluido com sucesso!", "sucesso");
}

// ==========================================
// PESQUISA E FILTROS DE MEDICOS
// Responsavel: Nicolas Ambar
// ==========================================

// Aplica os filtros selecionados na lista de medicos
function filtrarMedicos() {
  const termoBusca = campoBuscaMedico
    ? campoBuscaMedico.value.trim().toLowerCase()
    : "";

  const especialidadeSelecionada = filtroEspecialidade
    ? filtroEspecialidade.value
    : "";

  const situacaoSelecionada = filtroSituacao ? filtroSituacao.value : "";

  return medicos.filter((medico) => {
    const correspondeBusca =
      medico.nome.toLowerCase().includes(termoBusca) ||
      medico.crm.toLowerCase().includes(termoBusca);

    const correspondeEspecialidade =
      !especialidadeSelecionada ||
      medico.especialidade === especialidadeSelecionada;

    const correspondeSituacao =
      !situacaoSelecionada ||
      (situacaoSelecionada === "ativos" && medico.ativo) ||
      (situacaoSelecionada === "inativos" && !medico.ativo);

    return correspondeBusca && correspondeEspecialidade && correspondeSituacao;
  });
}

// Atualiza a tabela quando os filtros forem alterados
if (campoBuscaMedico) {
  campoBuscaMedico.addEventListener("input", renderizarMedicos);
}

if (filtroEspecialidade) {
  filtroEspecialidade.addEventListener("change", renderizarMedicos);
}

if (filtroSituacao) {
  filtroSituacao.addEventListener("change", renderizarMedicos);
}

// ==========================================
// ACOES DA LISTA DE MEDICOS
// Responsavel: Nicolas Ambar
// ==========================================

// Identifica os botoes de editar e excluir clicados na tabela
if (listaMedicos) {
  listaMedicos.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");

    if (!botao) {
      return;
    }

    const linha = botao.closest("tr");

    if (!linha) {
      return;
    }

    const id = linha.dataset.id;

    if (botao.classList.contains("btn-editar")) {
      editarMedico(id);
    }

    if (botao.classList.contains("btn-excluir")) {
      excluirMedico(id);
    }
  });
}

// ==========================================
// MENSAGENS DO SISTEMA
// Responsavel: Nicolas Ambar
// ==========================================

// Exibe mensagens de retorno para o usuario
function exibirMensagem(texto, tipo) {
  if (!mensagem) {
    return;
  }

  mensagem.textContent = texto;
  mensagem.classList.remove("is-hidden", "mensagem--sucesso", "mensagem--erro");

  mensagem.classList.add(
    tipo === "sucesso" ? "mensagem--sucesso" : "mensagem--erro",
  );
}

// ==========================================
// AGENDAMENTO DE CONSULTAS
// Responsavel: Nicolas Ambar
// ==========================================

const CHAVE_CONSULTAS = "medagenda.consultas";

const formConsulta = document.getElementById("form-consulta");
const campoIdConsulta = document.getElementById("consulta-id");
const campoMedicoConsulta = document.getElementById("consulta-medico");
const campoDataConsulta = document.getElementById("consulta-data");
const campoHoraConsulta = document.getElementById("consulta-hora");
const campoPacienteConsulta = document.getElementById("consulta-paciente");
const campoTelefoneConsulta = document.getElementById("consulta-telefone");
const campoObservacoesConsulta = document.getElementById(
  "consulta-observacoes",
);

const gradeHorarios = document.getElementById("grade-horarios");
const gradeVazia = document.getElementById("grade-vazia");
const templateHorario = document.getElementById("tpl-horario");

const listaConsultas = document.getElementById("lista-consultas");
const vazioConsultas = document.getElementById("vazio-consultas");
const templateConsulta = document.getElementById("tpl-linha-consulta");

const campoBuscaConsulta = document.getElementById("busca-consulta");
const filtroDataConsulta = document.getElementById("filtro-data");

const tituloFormConsulta = document.getElementById("titulo-form-consulta");
const botaoSalvarConsulta = document.getElementById("btn-salvar-consulta");

let consultas = carregarConsultas();

// Recupera as consultas salvas no navegador
function carregarConsultas() {
  try {
    const dados = localStorage.getItem(CHAVE_CONSULTAS);

    if (!dados) {
      return [];
    }

    const resultado = JSON.parse(dados);

    return Array.isArray(resultado) ? resultado : [];
  } catch (erro) {
    console.error("Erro ao carregar consultas:", erro);
    return [];
  }
}

// Salva as consultas no navegador
function salvarConsultas(lista) {
  try {
    localStorage.setItem(CHAVE_CONSULTAS, JSON.stringify(lista));
    return true;
  } catch (erro) {
    console.error("Erro ao salvar consultas:", erro);
    return false;
  }
}

// Preenche o campo de médicos com os profissionais ativos
function carregarMedicosDisponiveis() {
  if (!campoMedicoConsulta) {
    return;
  }

  const medicoSelecionado = campoMedicoConsulta.value;

  campoMedicoConsulta.replaceChildren();

  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Selecione um médico";

  campoMedicoConsulta.appendChild(opcaoInicial);

  medicos
    .filter((medico) => medico.ativo)
    .forEach((medico) => {
      const opcao = document.createElement("option");

      opcao.value = medico.id;
      opcao.textContent = `${medico.nome} – ${medico.especialidade}`;

      campoMedicoConsulta.appendChild(opcao);
    });

  if (
    medicos.some((medico) => medico.id === medicoSelecionado && medico.ativo)
  ) {
    campoMedicoConsulta.value = medicoSelecionado;
  }
}

// Converte o dia da semana para o padrão utilizado no cadastro
function obterDiaSemana(data) {
  const dias = ["dom", "seg", "ter", "qua", "qui", "sex", "sab"];

  const dataLocal = new Date(`${data}T00:00:00`);

  return dias[dataLocal.getDay()];
}

// Converte um horário em minutos
function horarioParaMinutos(horario) {
  const [horas, minutos] = horario.split(":").map(Number);

  return horas * 60 + minutos;
}

// Converte minutos para o formato HH:MM
function minutosParaHorario(minutos) {
  const horas = Math.floor(minutos / 60);
  const restante = minutos % 60;

  return `${String(horas).padStart(2, "0")}:${String(restante).padStart(2, "0")}`;
}

// Verifica se um horário já está reservado
function horarioOcupado(medicoId, data, hora, idIgnorado = "") {
  return consultas.some((consulta) => {
    return (
      consulta.medicoId === medicoId &&
      consulta.data === data &&
      consulta.hora === hora &&
      consulta.id !== idIgnorado
    );
  });
}

// Desenha os horários disponíveis do médico
function renderizarHorarios() {
  if (!gradeHorarios || !templateHorario) {
    return;
  }

  gradeHorarios.replaceChildren();

  const medicoId = campoMedicoConsulta.value;
  const data = campoDataConsulta.value;
  const idEmEdicao = campoIdConsulta.value;

  campoHoraConsulta.value = "";

  if (!medicoId || !data) {
    exibirGradeVazia("Selecione um médico e uma data para ver os horários.");
    return;
  }

  const medico = medicos.find((item) => item.id === medicoId);

  if (!medico || !medico.ativo) {
    exibirGradeVazia("Este médico não está disponível para agendamentos.");
    return;
  }

  const diaSemana = obterDiaSemana(data);

  if (!medico.diasAtendimento.includes(diaSemana)) {
    exibirGradeVazia("Este médico não atende no dia selecionado.");
    return;
  }

  const inicio = horarioParaMinutos(medico.horaInicio);
  const fim = horarioParaMinutos(medico.horaFim);
  const duracao = Number(medico.duracaoConsulta) || 30;

  let horariosDisponiveis = 0;

  for (let minuto = inicio; minuto + duracao <= fim; minuto += duracao) {
    const horario = minutosParaHorario(minuto);
    const ocupado = horarioOcupado(medicoId, data, horario, idEmEdicao);

    const fragmento = templateHorario.content.cloneNode(true);
    const botao = fragmento.querySelector("button");

    botao.textContent = horario;
    botao.dataset.hora = horario;

    if (ocupado) {
      botao.disabled = true;
      botao.classList.add("horario--ocupado");
    }

    if (idEmEdicao) {
      const consultaAtual = consultas.find(
        (consulta) => consulta.id === idEmEdicao,
      );

      if (
        consultaAtual &&
        consultaAtual.medicoId === medicoId &&
        consultaAtual.data === data &&
        consultaAtual.hora === horario
      ) {
        botao.classList.add("horario--selecionado");
        botao.setAttribute("aria-pressed", "true");
        campoHoraConsulta.value = horario;
      }
    }

    gradeHorarios.appendChild(fragmento);
    horariosDisponiveis++;
  }

  if (horariosDisponiveis === 0) {
    exibirGradeVazia("Não existem horários disponíveis para este dia.");
  } else {
    gradeVazia.classList.add("is-hidden");
  }
}

// Exibe mensagens na área da grade
function exibirGradeVazia(texto) {
  gradeVazia.textContent = texto;
  gradeVazia.classList.remove("is-hidden");
}

// Seleciona um horário da grade
if (gradeHorarios) {
  gradeHorarios.addEventListener("click", (evento) => {
    const botao = evento.target.closest(".horario");

    if (!botao || botao.disabled || !botao.dataset.hora) {
      return;
    }

    gradeHorarios.querySelectorAll(".horario").forEach((horario) => {
      horario.classList.remove("horario--selecionado");
      horario.setAttribute("aria-pressed", "false");
    });

    botao.classList.add("horario--selecionado");
    botao.setAttribute("aria-pressed", "true");

    campoHoraConsulta.value = botao.dataset.hora;
  });
}

// Valida os dados do agendamento
function validarConsulta() {
  let valido = true;

  const campos = ["medico", "data", "hora", "paciente", "telefone"];

  campos.forEach((campo) => {
    const erro = document.getElementById(`erro-consulta-${campo}`);

    if (erro) {
      erro.textContent = "";
    }
  });

  formConsulta.querySelectorAll(".form__campo").forEach((campo) => {
    campo.classList.remove("is-invalido");
    campo.removeAttribute("aria-invalid");
  });

  function erroConsulta(campo, texto) {
    const elementoErro = document.getElementById(`erro-consulta-${campo}`);

    const elementoCampo = document.getElementById(`consulta-${campo}`);

    if (elementoErro) {
      elementoErro.textContent = texto;
    }

    if (elementoCampo) {
      elementoCampo.classList.add("is-invalido");
      elementoCampo.setAttribute("aria-invalid", "true");
    }

    valido = false;
  }

  const medico = medicos.find((item) => item.id === campoMedicoConsulta.value);

  if (!medico || !medico.ativo) {
    erroConsulta("medico", "Selecione um médico ativo.");
  }

  if (!campoDataConsulta.value) {
    erroConsulta("data", "Selecione a data da consulta.");
  } else {
    const hoje = new Date();
    const hojeLocal = [
      hoje.getFullYear(),
      String(hoje.getMonth() + 1).padStart(2, "0"),
      String(hoje.getDate()).padStart(2, "0"),
    ].join("-");

    if (campoDataConsulta.value < hojeLocal) {
      erroConsulta("data", "A data não pode estar no passado.");
    }
  }

  if (!campoHoraConsulta.value) {
    erroConsulta("hora", "Selecione um horário disponível.");
  }

  if (!campoPacienteConsulta.value.trim()) {
    erroConsulta("paciente", "Informe o nome do paciente.");
  }

  const telefone = campoTelefoneConsulta.value.replace(/\D/g, "");

  if (telefone.length < 10 || telefone.length > 11) {
    erroConsulta("telefone", "Informe um telefone válido com DDD.");
  }

  if (medico && campoDataConsulta.value && campoHoraConsulta.value) {
    const dia = obterDiaSemana(campoDataConsulta.value);

    if (!medico.diasAtendimento.includes(dia)) {
      erroConsulta("data", "O médico não atende neste dia.");
    }

    if (
      horarioOcupado(
        medico.id,
        campoDataConsulta.value,
        campoHoraConsulta.value,
        campoIdConsulta.value,
      )
    ) {
      erroConsulta("hora", "Este horário já foi reservado.");
    }
  }

  return valido;
}

// Cadastra ou atualiza uma consulta
function salvarConsulta(evento) {
  evento.preventDefault();

  if (!validarConsulta()) {
    return;
  }

  const idEmEdicao = campoIdConsulta.value;

  const medico = medicos.find((item) => item.id === campoMedicoConsulta.value);

  const consulta = {
    id: idEmEdicao || crypto.randomUUID(),
    medicoId: medico.id,
    medico: medico.nome,
    especialidade: medico.especialidade,
    data: campoDataConsulta.value,
    hora: campoHoraConsulta.value,
    paciente: campoPacienteConsulta.value.trim(),
    telefone: campoTelefoneConsulta.value.trim(),
    observacoes: campoObservacoesConsulta.value.trim(),
  };

  let listaAtualizada;

  if (idEmEdicao) {
    listaAtualizada = consultas.map((item) =>
      item.id === idEmEdicao ? consulta : item,
    );
  } else {
    listaAtualizada = [...consultas, consulta];
  }

  if (!salvarConsultas(listaAtualizada)) {
    exibirMensagem("Não foi possível salvar a consulta.", "erro");
    return;
  }

  consultas = listaAtualizada;

  formConsulta.reset();
  limparEstadoConsulta();

  renderizarConsultas();
  renderizarHorarios();

  exibirMensagem(
    idEmEdicao
      ? "Consulta atualizada com sucesso!"
      : "Consulta agendada com sucesso!",
    "sucesso",
  );
}

// Retorna o formulário de consulta ao estado inicial
function limparEstadoConsulta() {
  campoIdConsulta.value = "";

  tituloFormConsulta.textContent = "1. Escolha o médico e o dia";
  botaoSalvarConsulta.textContent = "Reservar consulta";

  formConsulta.querySelectorAll(".form__erro").forEach((erro) => {
    erro.textContent = "";
  });

  formConsulta.querySelectorAll(".form__campo").forEach((campo) => {
    campo.classList.remove("is-invalido");
    campo.removeAttribute("aria-invalid");
  });

  if (campoHoraConsulta) {
    campoHoraConsulta.value = "";
  }

  carregarMedicosDisponiveis();
  renderizarHorarios();
}

// Carrega uma consulta para edição
function editarConsulta(id) {
  const consulta = consultas.find((item) => item.id === id);

  if (!consulta) {
    exibirMensagem("Consulta não encontrada.", "erro");
    return;
  }

  campoIdConsulta.value = consulta.id;

  campoMedicoConsulta.value = consulta.medicoId;
  campoDataConsulta.value = consulta.data;
  campoPacienteConsulta.value = consulta.paciente;
  campoTelefoneConsulta.value = consulta.telefone;
  campoObservacoesConsulta.value = consulta.observacoes || "";

  tituloFormConsulta.textContent = "Editar consulta";
  botaoSalvarConsulta.textContent = "Salvar alterações";

  renderizarHorarios();

  formConsulta.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

// Cancela uma consulta
function cancelarConsulta(id) {
  const consulta = consultas.find((item) => item.id === id);

  if (!consulta) {
    exibirMensagem("Consulta não encontrada.", "erro");
    return;
  }

  const confirmar = confirm(
    `Deseja cancelar a consulta de ${consulta.paciente}?`,
  );

  if (!confirmar) {
    return;
  }

  const listaAtualizada = consultas.filter((item) => item.id !== id);

  if (!salvarConsultas(listaAtualizada)) {
    exibirMensagem("Não foi possível cancelar a consulta.", "erro");
    return;
  }

  consultas = listaAtualizada;

  if (campoIdConsulta.value === id) {
    formConsulta.reset();
    limparEstadoConsulta();
  }

  renderizarConsultas();
  renderizarHorarios();

  exibirMensagem("Consulta cancelada com sucesso!", "sucesso");
}

// Formata a data para exibição
function formatarDataConsulta(data) {
  if (!data) {
    return "";
  }

  const [ano, mes, dia] = data.split("-");

  return `${dia}/${mes}/${ano}`;
}

// Filtra as consultas por paciente, médico e data
function filtrarConsultas() {
  const termo = campoBuscaConsulta.value.trim().toLowerCase();
  const dataSelecionada = filtroDataConsulta.value;

  return consultas.filter((consulta) => {
    const correspondeBusca =
      consulta.paciente.toLowerCase().includes(termo) ||
      consulta.medico.toLowerCase().includes(termo);

    const correspondeData =
      !dataSelecionada || consulta.data === dataSelecionada;

    return correspondeBusca && correspondeData;
  });
}

// Renderiza as consultas na tabela
function renderizarConsultas() {
  if (!listaConsultas || !templateConsulta) {
    return;
  }

  listaConsultas.replaceChildren();

  const consultasFiltradas = filtrarConsultas();

  vazioConsultas.classList.toggle("is-hidden", consultasFiltradas.length > 0);

  consultasFiltradas
    .sort((a, b) => {
      return a.data.localeCompare(b.data) || a.hora.localeCompare(b.hora);
    })
    .forEach((consulta) => {
      const fragmento = templateConsulta.content.cloneNode(true);
      const linha = fragmento.querySelector("tr");

      linha.dataset.id = consulta.id;

      const preencher = (campo, valor) => {
        const elemento = linha.querySelector(`[data-campo="${campo}"]`);

        if (elemento) {
          elemento.textContent = valor || "";
        }
      };

      preencher("data", formatarDataConsulta(consulta.data));
      preencher("hora", consulta.hora);
      preencher("paciente", consulta.paciente);
      preencher("telefone", consulta.telefone);
      preencher("medico", consulta.medico);
      preencher("especialidade", consulta.especialidade);

      listaConsultas.appendChild(fragmento);
    });
}

// Eventos do formulário e dos filtros
if (formConsulta) {
  formConsulta.addEventListener("submit", salvarConsulta);

  formConsulta.addEventListener("reset", () => {
    setTimeout(limparEstadoConsulta, 0);
  });
}

if (campoMedicoConsulta) {
  campoMedicoConsulta.addEventListener("change", renderizarHorarios);
}

if (campoDataConsulta) {
  campoDataConsulta.addEventListener("change", renderizarHorarios);
}

if (campoBuscaConsulta) {
  campoBuscaConsulta.addEventListener("input", renderizarConsultas);
}

if (filtroDataConsulta) {
  filtroDataConsulta.addEventListener("change", renderizarConsultas);
}

// Ações de editar e cancelar na tabela
if (listaConsultas) {
  listaConsultas.addEventListener("click", (evento) => {
    const botao = evento.target.closest("button");

    if (!botao) {
      return;
    }

    const linha = botao.closest("tr");

    if (!linha) {
      return;
    }

    const id = linha.dataset.id;

    if (botao.classList.contains("btn-editar")) {
      editarConsulta(id);
    }

    if (botao.classList.contains("btn-excluir")) {
      cancelarConsulta(id);
    }
  });
}

// Atualiza a lista de médicos quando o cadastro de médicos muda
function atualizarAgendaMedicos() {
  carregarMedicosDisponiveis();
  renderizarHorarios();
}

// Inicialização do módulo de consultas
carregarMedicosDisponiveis();
renderizarHorarios();
renderizarConsultas();

// ==========================================
// INICIALIZACAO DA APLICACAO
// Responsavel: Vanderson Luiz C. Martins
// ==========================================

renderizarMedicos();
