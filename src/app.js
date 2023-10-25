/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f
"use strict";

const backendDefaultUrl =
  "https://hse1s4vpq3.execute-api.us-east-1.amazonaws.com/Prod";

// Selectors
const h2Resultado = document.getElementById("h2Resultado");
const secResultado = document.getElementById("secResultado");
const btnComparar = document.getElementById("btnComparar");
const rodape = document.getElementsByTagName("footer")[0];
const ulJogos = document.getElementById("ulJogos");

let podeCarregarMaisJogo,
  adicionouBotaoCarregarMaisJogos = false,
  jogoLastEvaluatedKey;

// Event Listeners
btnComparar.addEventListener("click", comparar);
window.addEventListener("load", carregarPlanos);
window.addEventListener("load", carregarJogos);
window.addEventListener("load", carregarRodape);

// Functions
function carregarPlanos() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = mostrarPlanos;

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
        <h4>${formatarDinheiro(plano.valor)}</h4>
        <p>${plano.centralOesteDesconto}% - CENTRAL OESTE</p>
        <p>${plano.centralLesteDesconto}% - CENTRAL LESTE</p>        
        <p>${plano.superiorDesconto}% - SUPERIOR</p>
        <p>${plano.golSulDesconto}% - GOL SUL</p>
        <p>${plano.golNorteDesconto}% - GOL NORTE</p>
      </article>
    </li>`;
  });
  document.getElementById("ulPlanos").innerHTML = planosHtml;
}

function carregarJogos() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = mostrarJogos;

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
  li.innerHTML = `<article>
      <h3>Palmeiras x ${jogo.adversario}</h3>
      <h4>${new Date(jogo.dataJogo).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      })}</h4>
      <label for="setor">Setor:</>
      <select id="jogo_${jogo.id}" name="${jogo.id}"
        onchange="salvarSetor(this)">
        <option value="">Não fui</option>        
        <option value="sn" ${preSelecionado(jogo.id, "sn")}>
          Superior Norte: ${formatarDinheiro(jogo.superiorNorteValor)}
        </option>
        <option value="ss" ${preSelecionado(jogo.id, "ss")}>
          Superior Sul: ${formatarDinheiro(jogo.superiorSulValor)}
        </option>
        <option value="so" ${preSelecionado(jogo.id, "so")}>
          Superior Oeste: ${formatarDinheiro(jogo.superiorOesteValor)}
        </option>
        <option value="sl" ${preSelecionado(jogo.id, "sl")}>
          Superior Leste: ${formatarDinheiro(jogo.superiorLesteValor)}
        </option>          
        <option value="gn" ${preSelecionado(jogo.id, "gn")}>
          Gol Norte: ${formatarDinheiro(jogo.golNorteValor)}
        </option>
        <option value="gs" ${preSelecionado(jogo.id, "gs")}>
          Gol Sul: ${formatarDinheiro(jogo.golSulValor)}
        </option>
        <option value="cl" ${preSelecionado(jogo.id, "cl")}>
          Central Leste: ${formatarDinheiro(jogo.centralLesteValor)}
        </option>
        <option value="co" ${preSelecionado(jogo.id, "co")}>
          Central Oeste: ${formatarDinheiro(jogo.centralOesteValor)}
        </option>          
      </select>        
    </article>`;

  if (adicionouBotaoCarregarMaisJogos)
    ulJogos.insertBefore(li, ulJogos.lastChild);
  else ulJogos.appendChild(li);
}
function exibirBotaoCarregarMaisJogos() {
  podeCarregarMaisJogo = jogoLastEvaluatedKey !== undefined;
  if (podeCarregarMaisJogo) {
    if (!adicionouBotaoCarregarMaisJogos) {
      adicionouBotaoCarregarMaisJogos = true;
      const li = document.createElement("li");
      li.setAttribute("class", "maisJogos");
      const article = document.createElement("article");
      const h3 = document.createElement("h3");
      const aMaisJogos = document.createElement("a");
      aMaisJogos.innerText = "Carregar mais";
      aMaisJogos.addEventListener("click", carregarJogos);
      h3.appendChild(aMaisJogos);
      article.appendChild(h3);
      li.appendChild(article);
      ulJogos.appendChild(li);
    }
  } else {
    const li = document.getElementsByClassName("maisJogos")[0];
    li.remove();
  }
}

function carregarRodape() {
  rodape.innerHTML = rodape.innerHTML.replace("ano", new Date().getFullYear());
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
  h2Resultado.classList.remove("naoAparecer");
  h2Resultado.classList.add("aparecer");
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
function salvarSetor(select) {
  localStorage.setItem(select.name, select.value);
}
