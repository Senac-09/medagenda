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

// Elementos HTML utilizados nesta etapa
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
    localStorage.setItem(
      CHAVE_MEDICOS,
      JSON.stringify(medicos)
    );

    return true;
  } catch (erro) {
    console.error("Erro ao salvar medicos:", erro);
    return false;
  }
}

// Lista de medicos em memoria
let medicos = carregarMedicos();

// Verifica se os elementos principais existem
console.log("MedAgenda - JavaScript carregado");

console.log("Formulario:", formMedico);
console.log("Lista:", listaMedicos);
console.log("Template:", templateMedico);
console.log("Medicos armazenados:", medicos);


//
// CADASTRO DE MEDICOS
//

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

    especialidade: String(
      dados.get("especialidade") || ""
    ),

    telefone: String(
      dados.get("telefone") || ""
    ).trim(),

    email: String(
      dados.get("email") || ""
    ).trim(),

    // Dias selecionados no formulario
    diasAtendimento: dados.getAll("dias"),

    // Horarios de atendimento
    horaInicio: String(dados.get("inicio") || ""),

    horaFim: String(dados.get("fim") || ""),

    duracaoConsulta: Number(
      dados.get("duracaoConsulta") || 30
    ),

    ativo: dados.has("ativo")
  };
}

// Cadastra o medico e salva no LocalStorage
function cadastrarMedico(evento) {
  evento.preventDefault();

  const novoMedico = obterDadosFormulario();

  // Validacao basica dos campos essenciais
  if (
    !novoMedico.nome ||
    !novoMedico.crm ||
    !novoMedico.especialidade
  ) {
    alert("Preencha nome, CRM e especialidade.");
    return;
  }

  // Impede CRM duplicado
  const crmExistente = medicos.some(
    (medico) =>
      medico.crm.toLowerCase() ===
      novoMedico.crm.toLowerCase()
  );

  if (crmExistente) {
    alert("Ja existe um medico cadastrado com este CRM.");
    return;
  }

  // Atualiza a lista em memoria
  const listaAtualizada = [...medicos, novoMedico];

  // Persiste antes de confirmar o cadastro
  if (!salvarMedicos(listaAtualizada)) {
    alert("Nao foi possivel salvar o medico.");
    return;
  }

medicos = listaAtualizada;

renderizarMedicos();

console.log("Medico cadastrado:", novoMedico);

  alert("Medico cadastrado com sucesso!");

  formMedico.reset();
}

// Conecta o formulario a funcao de cadastro
if (formMedico) {
  formMedico.addEventListener("submit", cadastrarMedico);
}


//
// LISTAGEM DINAMICA DE MEDICOS
//

// Converte os dias para exibicao na tabela
function formatarDiasAtendimento(dias) {
  const nomesDias = {
    seg: "Seg",
    ter: "Ter",
    qua: "Qua",
    qui: "Qui",
    sex: "Sex",
    sab: "Sab"
  };

  if (!Array.isArray(dias) || dias.length === 0) {
    return "Nao informado";
  }

  return dias
    .map((dia) => nomesDias[dia] || dia)
    .join(", ");
}

// Formata os dias e horarios de atendimento
function formatarAtendimento(medico) {
  const dias = formatarDiasAtendimento(
    medico.diasAtendimento
  );

  if (!medico.horaInicio || !medico.horaFim) {
    return dias;
  }

  return `${dias} - ${medico.horaInicio}–${medico.horaFim}`;
}

// Preenche uma celula do template
function preencherCampo(linha, campo, valor) {
  const elemento = linha.querySelector(
    `[data-campo="${campo}"]`
  );

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

  // Remove as linhas anteriores
  listaMedicos.replaceChildren();

  // Exibe o aviso quando nao houver medicos
  if (vazioMedicos) {
    vazioMedicos.hidden = medicos.length > 0;
  }

  // Cria uma linha para cada medico
  medicos.forEach((medico) => {
    const fragmento = templateMedico.content.cloneNode(true);
    const linha = fragmento.querySelector("tr");

    if (!linha) {
      return;
    }

    // Preenche as informacoes
    preencherCampo(linha, "nome", medico.nome);
    preencherCampo(linha, "crm", medico.crm);
    preencherCampo(
      linha,
      "especialidade",
      medico.especialidade
    );
    preencherCampo(
      linha,
      "atendimento",
      formatarAtendimento(medico)
    );

    // Define a situacao do medico
    const situacao = linha.querySelector(
      '[data-campo="situacao"]'
    );

    if (situacao) {
      situacao.textContent = medico.ativo
        ? "Ativo"
        : "Inativo";

      situacao.classList.toggle(
        "badge--ativo",
        Boolean(medico.ativo)
      );

      situacao.classList.toggle(
        "badge--inativo",
        !medico.ativo
      );
    }

    // Identifica a linha para integracao futura
    linha.dataset.id = medico.id;

    // Insere a linha na tabela
    listaMedicos.appendChild(fragmento);
  });

  console.log(
    `Listagem atualizada: ${medicos.length} medico(s).`
  );
}

// Renderiza os medicos ao carregar a pagina
renderizarMedicos();
