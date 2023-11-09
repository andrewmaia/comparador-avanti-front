/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f
"use strict";

// Selectors
const h2Resultado = document.getElementById("h2Resultado");
const txtObsResultado = document.getElementById("txtObsResultado");
const secResultado = document.getElementById("secResultado");
const btnComparar = document.getElementById("btnComparar");
const ulJogos = document.getElementById("ulJogos");
const btnCarregarMaisJogos = document.getElementById("btnCarregarMaisJogos");
let jogoLastEvaluatedKey;

// Event Listeners
btnCarregarMaisJogos.addEventListener("click", carregarJogos);
btnComparar.addEventListener("click", comparar);
window.addEventListener("load", carregarPlanos);
window.addEventListener("load", carregarJogos);

// Functions
function carregarPlanos() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = mostrarPlanos;

  // eslint-disable-next-line no-undef
  xhttp.open("GET", `${backendDefaultUrl}/planos`);
  xhttp.send();
}

function mostrarPlanos() {
  const planos = JSON.parse(this.responseText);
  let planosHtml = "";

  planos.forEach((plano) => {
    planosHtml =
      planosHtml +
      `<li class="plano">
      <article>
        <h3>${plano.nome}</h3>
        <h4>${formatarDinheiro(plano.valor)}</h4>` +
      montarSetoresDescontoPlano(plano) +
      `</article>
    </li>`;
  });
  document.getElementById("ulPlanos").innerHTML = planosHtml;
}

function montarSetoresDescontoPlano(plano) {
  let setoresDesconto = ``;

  plano.setoresDesconto.forEach((setorDesconto) => {
    setoresDesconto =
      setoresDesconto +
      `<p>${
        setorDesconto.percentualDesconto
      }% - ${setorDesconto.setorNome.toUpperCase()}</p>`;
  });

  return setoresDesconto;
}

function carregarJogos() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = mostrarJogos;
  // eslint-disable-next-line no-undef
  xhttp.open("POST", `${backendDefaultUrl}/jogos`);
  xhttp.send(JSON.stringify(jogoLastEvaluatedKey));
}

function mostrarJogos() {
  const retorno = JSON.parse(this.responseText);
  retorno.Items.forEach(montarSelectJogo);
  jogoLastEvaluatedKey = retorno.LastEvaluatedKey;
  exibirBotaoCarregarMaisJogos();
}

function montarSelectJogo(jogo) {
  const li = document.createElement("li");
  li.setAttribute("class", "jogo");
  li.innerHTML =
    `<article>
      <h3>Palmeiras x ${jogo.adversario}</h3>
      <h4>` +
    (jogo.allianzParque ? "Allianz Parque" : jogo.nomeEstadio) +
    `</h4>
      <h4>${new Date(jogo.dataJogo).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      })}</h4>
      <label for="jogo_${jogo.id}">Setor:</>
        <select id="jogo_${jogo.id}" name="${jogo.id}"
          onchange="localStorage.setItem(this.name, this.value)">` +
    montarOptionsSelect(jogo) +
    `</select>        
    </article>`;
  ulJogos.appendChild(li);
}

function montarOptionsSelect(jogo) {
  let setores = `<option value="">Não fui</option>`;
  jogo.setores.forEach((setor) => {
    setores =
      setores +
      `<option value="${setor.setorNome}"  ${preSelecionado(
        jogo.id,
        setor.setorNome
      )}>
        ${setor.setorNome}: ${formatarDinheiro(setor.valorIngresso)}
      </option>`;
  });

  return setores;
}

function exibirBotaoCarregarMaisJogos() {
  let podeCarregarMaisJogo = jogoLastEvaluatedKey !== undefined;
  btnCarregarMaisJogos.style.display = podeCarregarMaisJogo ? "inline" : "none";
  if (!podeCarregarMaisJogo) alert("Não há mais jogos para carregar!");
}

function comparar(event) {
  event.preventDefault(); //Nao faz subimit
  let jogos = "";
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    if (select.value !== "") {
      jogos = jogos + select.name + "=" + select.value + "&";
    }
  });

  if (jogos === "") {
    alert("É necessário selecionar ao menos um jogo para comparar!");
    return;
  }

  jogos = jogos.slice(0, jogos.length - 1);

  const xhttp = new XMLHttpRequest();
  xhttp.onload = mostrarComparacao;
  // eslint-disable-next-line no-undef
  xhttp.open("POST", `${backendDefaultUrl}/comparar`);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(jogos);
}

function mostrarComparacao() {
  const planosComparacao = JSON.parse(this.responseText);
  planosComparacao.sort((a, b) => a.valorTotal - b.valorTotal);
  let planosHtml = "";

  planosComparacao.forEach((plano, index) => {
    planosHtml =
      planosHtml +
      `<li >
        <article class="planoComparado">
          ${
            index == 0
              ? `<div class="ribbon"><span>MENOR CUSTO</span></div>`
              : ``
          }
          <h3>${plano.planoNome}</h3>
          <h4>Você gastaria: ${formatarDinheiro(plano.valorTotal)}</h4>
          <div>
            <h5>Quantidade Mensalidades: ${
              plano.quantidadeMesesPeriodo
            }</h5>          
            <h5>Total Mensalidades: ${formatarDinheiro(
              plano.valorMensalidadesPeriodo
            )}</h5>
            <h5>Total Ingressos: ${formatarDinheiro(
              plano.valorTotalIngressos
            )}</h5>            
          <div>
        </article>
      </li>`;
  });
  document.getElementById("ulPlanosComparacao").innerHTML = planosHtml;
  h2Resultado.style.display = "block";
  txtObsResultado.style.display = "block";
  secResultado.classList.remove("naoAparecer");
  secResultado.classList.add("aparecer");
}

//Auxiliares
function formatarDinheiro(valor) {
  return "R$ " + valor.toLocaleString(undefined, { minimumFractionDigits: 2 });
}

function preSelecionado(jogoId, setor) {
  let setorSelecionado = localStorage.getItem(jogoId);
  if (setorSelecionado !== undefined && setor === setorSelecionado) {
    return "selected";
  }
  return "";
}
