/** @format */
//https://plainenglish.io/blog/the-basic-vanilla-js-project-setup-9290dce6403f

// Selectors
const divPrincipal = document.getElementById("divPrincipal");
const btnComparar = document.getElementById("btnComparar");

// Event Listeners
btnComparar.addEventListener("click", apresentarMensagem);
window.addEventListener("load", carregarPlanos);

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

  xhttp.open("GET", "http://127.0.0.1:8080/planos");
  xhttp.send();
}

function mostrarPlanos() {
  const planos = JSON.parse(this.responseText);
  let planosHtml = "";

  planos.planos.forEach((plano) => {
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
