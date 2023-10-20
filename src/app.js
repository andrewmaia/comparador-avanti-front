/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f
"use strict";

const backendDefaultUrl =
  "https://t3y0n3lih3.execute-api.us-east-1.amazonaws.com/Prod";

// Selectors
const divPlanosComparacao = document.getElementById("divPlanosComparacao");
const btnComparar = document.getElementById("btnComparar");
const rodape = document.getElementsByTagName("footer")[0];

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
      `<li>
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

  xhttp.open("GET", `${backendDefaultUrl}/jogos`);
  xhttp.send();
}

function mostrarJogos() {
  const jogos = JSON.parse(this.responseText);
  let jogosHtml = "";

  jogos.forEach((jogo) => {
    jogosHtml =
      jogosHtml +
      `<li class="jogo">
      <article>
        <h3>Palmeiras x ${jogo.adversario}</h3>
        <h4>${new Date(jogo.dataJogo).toLocaleDateString()}</h4>
        <label for="setor">Setor:</>
        <select id="jogo_${jogo.id}" name="${jogo.id}">
          <option value="">Não fui</option>        
          <option value="sn">Superior Norte: ${formatarDinheiro(
            jogo.superiorNorteValor
          )}</option>
          <option value="ss">Superior Sul: ${formatarDinheiro(
            jogo.superiorSulValor
          )}</option>
          <option value="so">Superior Oeste: ${formatarDinheiro(
            jogo.superiorOesteValor
          )}</option>
          <option value="sl">Superior Leste: ${formatarDinheiro(
            jogo.superiorLesteValor
          )}</option>          
          <option value="gn">Gol Norte: ${formatarDinheiro(
            jogo.golNorteValor
          )}</option>
          <option value="gs">Gol Sul: ${formatarDinheiro(
            jogo.golSulValor
          )}</option>
          <option value="cl">Central Leste: ${formatarDinheiro(
            jogo.centralLesteValor
          )}</option>
          <option value="co">Central Oeste: ${formatarDinheiro(
            jogo.centralOesteValor
          )}</option>          
        </select>        
      </article>
    </li>`;
  });
  document.getElementById("ulJogos").innerHTML = jogosHtml;
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
      `<li ${index == 0 ? "class=planoDestacado" : ""}>
        <article>
          <h3>${plano.planoNome}</h3>
          <h4>Você gastaria: ${formatarDinheiro(plano.valorTotal)}</h4>
        </article>
      </li>`;
  });
  document.getElementById("ulPlanosComparacao").innerHTML = planosHtml;
  divPlanosComparacao.classList.remove("naoAparecer");
  divPlanosComparacao.classList.add("aparecer");
}

//Auxiliares
function formatarDinheiro(valor) {
  return "R$ " + valor.toLocaleString(undefined, { minimumFractionDigits: 2 });
}
