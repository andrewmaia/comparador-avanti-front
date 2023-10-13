/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f

// Selectors
const divPrincipal = document.getElementById("divPrincipal");
const btnComparar = document.getElementById("btnComparar");

// Event Listeners
btnComparar.addEventListener("click", apresentarMensagem);
window.addEventListener("load", carregarPlanos);
window.addEventListener("load", carregarJogos);

// Functions
function apresentarMensagem(event) {
  //Nao faz subimit
  event.preventDefault();
  divPrincipal.classList.remove("naoAparecer");
  divPrincipal.classList.add("aparecer");
}

function carregarPlanos() {
  const xhttp = new XMLHttpRequest();
  xhttp.onload = mostrarPlanos;

  //xhttp.open("GET", "http://127.0.0.1:8080/planos");
  xhttp.open(
    "GET",
    "https://eoulrgzgv2.execute-api.us-east-1.amazonaws.com/Prod/planos"
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
    "https://eoulrgzgv2.execute-api.us-east-1.amazonaws.com/Prod/jogos"
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
        <select id="setor" name="setor">
          <option value="0">Não fui</option>        
          <option value="1">Superior: ${jogo.superiorValor}</option>
          <option value="2">Gol Norte: ${jogo.golNorteValor}</option>
          <option value="3">Gol Sul: ${jogo.golSulValor}</option>
          <option value="4">Central Oeste: ${jogo.centralOesteValor}</option>
          <option value="5">Central Leste: ${jogo.centralLesteValor}</option>                    
        </select>        
      </article>
    </li>`;
  });
  document.getElementById("ulJogos").innerHTML = jogosHtml;
}
