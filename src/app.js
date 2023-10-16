/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f

// Selectors
//const divPrincipal = document.getElementById("divPrincipal");
const btnComparar = document.getElementById("btnComparar");

// Event Listeners
btnComparar.addEventListener("click", comparar);
window.addEventListener("load", carregarPlanos);
window.addEventListener("load", carregarJogos);

// Functions
function comparar(event) {
  event.preventDefault(); //Nao faz subimit
  let jogos = "";
  const selects = document.querySelectorAll("select");
  selects.forEach((select) => {
    if (select.value !== "") {
      jogos = jogos + select.name + "=" + select.value + "&";
    }
  });

  if (jogos === "") return;

  jogos = jogos.slice(0, jogos.length - 1);

  const xhttp = new XMLHttpRequest();
  xhttp.onload = mostrarComparacao;
  xhttp.open(
    "POST",
    "https://8x18suf4he.execute-api.us-east-1.amazonaws.com/Prod/comparar"
  );
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(jogos);
}

function mostrarComparacao() {
  console.info(this.responseText);
  document.write(this.responseText);
  //divPrincipal.classList.remove("naoAparecer");
  //divPrincipal.classList.add("aparecer");
}

function carregarPlanos() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = mostrarPlanos;

  //xhttp.open("GET", "http://127.0.0.1:8080/planos");
  xhttp.open(
    "GET",
    "https://8x18suf4he.execute-api.us-east-1.amazonaws.com/Prod/planos"
  );
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
        <h4>R$ ${plano.valor}</h4>
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

  //xhttp.open("GET", "http://127.0.0.1:8080/jogos");
  xhttp.open(
    "GET",
    "https://8x18suf4he.execute-api.us-east-1.amazonaws.com/Prod/jogos"
  );
  xhttp.send();
}

function mostrarJogos() {
  console.log(this.responseText);
  const jogos = JSON.parse(this.responseText);
  let jogosHtml = "";

  jogos.forEach((jogo) => {
    jogosHtml =
      jogosHtml +
      `<li>
      <article>
        <h3>Palmeiras x ${jogo.adversario}</h3>
        <h4>R$ ${jogo.dataJogo}</h4>
        <label for="setor">Setor:</>
        <select id="jogo_${jogo.id}" name="${jogo.id}">
          <option value="">Não fui</option>        
          <option value="s">Superior: ${jogo.superiorValor}</option>
          <option value="gn">Gol Norte: ${jogo.golNorteValor}</option>
          <option value="gs">Gol Sul: ${jogo.golSulValor}</option>
          <option value="co">Central Oeste: ${jogo.centralOesteValor}</option>
          <option value="cl">Central Leste: ${jogo.centralLesteValor}</option>                    
        </select>        
      </article>
    </li>`;
  });
  document.getElementById("ulJogos").innerHTML = jogosHtml;
}
